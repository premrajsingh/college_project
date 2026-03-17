import os
import json
import base64
from openai import AsyncOpenAI
from pypdf import PdfReader
from database.mongo import update_planning
from dotenv import load_dotenv

load_dotenv()

class PlanningAgent:
    def __init__(self, planning_id: str):
        self.planning_id = planning_id
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            self.client = AsyncOpenAI(api_key=api_key)
        else:
            self.client = None

    async def analyze(self, data: dict, file_path: str = None, file_type: str = None):
        try:
            print(f"[{self.planning_id}] Starting Planning Analysis...")
            
            # Extract basic data
            team_size = data.get("team_size", 1)
            experience = data.get("experience", "Intermediate")
            description = data.get("description", "Not provided")
            expected_days = data.get("expected_days", 30)

            # Extract Document Content
            extracted_text = ""
            base64_image = None

            if file_path:
                if file_type == 'application/pdf':
                    extracted_text = self._extract_text_from_pdf(file_path)
                elif file_type and file_type.startswith('image/'):
                    base64_image = self._encode_image(file_path)

            if not self.client:
                print("No API Key. Running Dummy Planner.")
                dummy_result = self._local_fallback(description, expected_days)
                await update_planning(self.planning_id, {"estimation": dummy_result, "status": "completed"})
                return

            print(f"[{self.planning_id}] Calling AI model...")
            messages = [
                {
                    "role": "system",
                    "content": "You are an expert Software Architect and Project Manager. Your job is to estimate the time, risks, and challenges of a proposed software project."
                }
            ]

            prompt_content = f"""
I need an estimation for a new software project.

### Project Details
- Description/Idea: {description}
- Expected Completion: {expected_days} days
- Team Size: {team_size} members
- Average Team Experience: {experience}

### Extracted Requirements/Notes
{extracted_text if extracted_text else "None"}

Please provide:
1. "estimated_days": Realistically, how long will this take in days?
2. "risks": A list of potential highest risks.
3. "challenges": A list of technical challenges we might face.
4. "summary": A brief paragraph summarizing the viability.

Output ONLY in valid JSON format matching the keys exactly.
"""
            
            user_content = [{"type": "text", "text": prompt_content}]

            if base64_image:
                user_content.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{file_type};base64,{base64_image}"
                    }
                })

            messages.append({"role": "user", "content": user_content})

            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                response_format={ "type": "json_object" }
            )

            result_json = response.choices[0].message.content
            parsed_result = json.loads(result_json)

            await update_planning(self.planning_id, {
                "estimation": parsed_result,
                "status": "completed"
            })
            print(f"[{self.planning_id}] Planning Analysis Completed.")

        except Exception as e:
            print(f"[{self.planning_id}] Planning Failed: {e}")
            await update_planning(self.planning_id, {"status": "failed", "error_message": str(e)})

    def _extract_text_from_pdf(self, file_path: str) -> str:
        try:
            reader = PdfReader(file_path)
            text = ""
            # Extract first 5 pages max to save tokens
            for i, page in enumerate(reader.pages):
                if i >= 5: break
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            print(f"PDF extraction error: {e}")
            return ""

    def _encode_image(self, file_path: str) -> str:
        try:
            with open(file_path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode('utf-8')
        except Exception as e:
            print(f"Image encode error: {e}")
            return None

    def _local_fallback(self, desc, days):
        return {
            "estimated_days": days * 1.5,
            "summary": "This is a fallback estimation since no OpenAI key is present. Multiply expectations by 1.5x.",
            "risks": ["Underestimation of complexity", "Lack of AI API Key"],
            "challenges": ["Manual deployment", "Building without AI"]
        }
