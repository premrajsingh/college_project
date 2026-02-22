import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

class ReportAgent:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            self.client = AsyncOpenAI(api_key=api_key)
        else:
            self.client = None

    async def generate_report(self, metrics: dict, estimations: dict, risks: list, optimizations: list) -> str:
        """Generates a natural language report using OpenAI or a local fallback."""
        
        prompt = self._build_prompt(metrics, estimations, risks, optimizations)
        
        if self.client:
            try:
                response = await self.client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are an expert AI Project Manager Assistant. Generate a comprehensive project health report in clean Markdown. Be specific to the provided metrics."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=1500,
                    temperature=0.7
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"OpenAI Generation failed: {e}. Falling back to local generation.")
                return self._local_fallback_generation(metrics, estimations, risks, optimizations)
        else:
            print("No OPENAI_API_KEY found. Falling back to local template generation.")
            return self._local_fallback_generation(metrics, estimations, risks, optimizations)

    def _build_prompt(self, metrics: dict, estimations: dict, risks: list, optimizations: list) -> str:
        return f"""
Please analyze the following project data and generate a comprehensive health report.

### 1. Code Metrics
- Lines of Code: {metrics.get('total_loc')}
- Cyclomatic Complexity: {metrics.get('avg_complexity')}
- Code Duplication: {metrics.get('duplication_percentage')}%

### 2. Estimations
- Estimated Development Time: {estimations.get('predicted_time_days')} days
- Estimated Effort: {estimations.get('predicted_effort_hours')} hours
- Estimated Cost: ${estimations.get('predicted_cost_dollars')}
- Assumed Team Size: {estimations.get('assumed_team_size')}

### 3. Identified Risks
{json.dumps(risks, indent=2)}

### 4. Optimization Suggestions
{json.dumps(optimizations, indent=2)}

Format the report with the following sections: Executive Summary, Metric Analysis, Risk Assessment, and Recommended Next Steps.
"""

    def _local_fallback_generation(self, metrics, estimations, risks, optimizations) -> str:
        loc = metrics.get('total_loc')
        time = estimations.get('predicted_time_days')
        cost = estimations.get('predicted_cost_dollars')
        
        report = f"# AI Project Manager Health Report\n\n"
        report += f"## Executive Summary\n"
        report += f"The analyzed repository contains {loc} lines of code. Based on our AI models, we estimate a development time of {time} days and a total cost of ${cost}.\n\n"
        
        report += f"## Identified Risks\n"
        for r in risks:
            report += f"- **{r.get('type')}** (Score {r.get('score')}/10): {r.get('reason')}\n"
            
        report += "\n## Optimization Suggestions\n"
        for o in optimizations:
            report += f"- **{o.get('type')}**: {o.get('action')}\n"
            
        report += "\n*(Note: This is a locally generated summary because no OpenAI API key was provided in the .env file).* \n"
        return report
