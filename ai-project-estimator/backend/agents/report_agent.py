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
        top_complex_files_info = ""
        if "top_complex_files" in metrics and metrics["top_complex_files"]:
            top_complex_files_info = "\n### 5. Critical Files Content (For Line-level Analysis)\n"
            for file_data in metrics["top_complex_files"]:
                top_complex_files_info += f"\n#### File: {file_data['filename']} (Complexity Score: {file_data['complexity']})\n"
                # To prevent excessive token usage, we only send the first ~250 lines of the file if it's very large
                lines = file_data['content'].splitlines()[:250]
                top_complex_files_info += "```\n" + "\n".join(lines) + "\n```\n"

        return f"""
Please analyze the following project data and generate a comprehensive health report.

### 1. Code Metrics
- Lines of Code: {metrics.get('total_loc')}
- Cyclomatic Complexity: {metrics.get('avg_complexity')}
- Code Duplication: {metrics.get('duplication_percentage')}%

### 2. General Estimations
- Estimated Future Development Time: {estimations.get('predicted_time_days')} days
- Estimated Effort: {estimations.get('predicted_effort_hours')} hours
- Estimated Cost: ${estimations.get('predicted_cost_dollars')}
- Assumed Team Size: {estimations.get('assumed_team_size')}

### 3. Identified Risks
{json.dumps(risks, indent=2)}

### 4. Optimization Suggestions
{json.dumps(optimizations, indent=2)}
{top_complex_files_info}

Format the report with the following sections: 
1. **Executive Summary**: High-level overview.
2. **Retrospective Estimation**: Based on the project size and complexity, estimate approximately how many weeks or months it took the developers to build this project to its current state.
3. **Metric Analysis**: Breakdown of code metrics.
4. **Deep Code Analysis (Line-level)**: If Critical Files Content is provided, explicitly mention *which lines of code* need improvement, why, and provide specific refactoring suggestions for this existing code.
5. **Risk Assessment**: Any identified risks.
6. **Recommended Next Steps**: Next actions for the team.
"""

    def _local_fallback_generation(self, metrics, estimations, risks, optimizations) -> str:
        loc = metrics.get('total_loc')
        time = estimations.get('predicted_time_days')
        cost = estimations.get('predicted_cost_dollars')
        
        report = f"# AI Project Manager Health Report\n\n"
        report += f"## Executive Summary\n"
        report += f"The analyzed repository contains {loc} lines of code. Based on our models, future development time is {time} days and cost is ${cost}.\n\n"
        
        report += f"## Retrospective Estimation\n"
        report += f"Based on {loc} lines of code, this project likely took approximately {max(1, int(loc / 1000))} to {max(2, int(loc / 500))} weeks to build to its current state by a single developer.\n\n"
        
        if "top_complex_files" in metrics and metrics["top_complex_files"]:
             report += "## Deep Code Analysis\n"
             report += "Critical files identified that need refactoring:\n"
             for f in metrics["top_complex_files"]:
                 report += f"- **{f['filename']}** (Complexity: {f['complexity']})\n"
             report += "\n"
        
        report += f"## Identified Risks\n"
        for r in risks:
            report += f"- **{r.get('type')}** (Score {r.get('score')}/10): {r.get('reason')}\n"
            
        report += "\n## Optimization Suggestions\n"
        for o in optimizations:
            report += f"- **{o.get('type')}**: {o.get('action')}\n"
            
        report += "\n*(Note: This is a locally generated summary because no OpenAI API key was provided in the .env file).* \n"
        return report
