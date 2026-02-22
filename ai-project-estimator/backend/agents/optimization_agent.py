class OptimizationAgent:
    def __init__(self):
        pass

    def suggest(self, metrics: dict, risks: list) -> list:
        """Proposes optimizations based on identified risks and code metrics."""
        suggestions = []
        
        # Look at risks
        risk_types = [r['type'] for r in risks]
        
        if "Code Quality" in risk_types:
            suggestions.append({
                "type": "Refactoring",
                "action": "Implement strict linting and rewrite the top 5 most complex functions into smaller micro-functions."
            })
            
        if "Budget Overrun" in risk_types and metrics.get('duplication_percentage', 0) > 20:
            suggestions.append({
                "type": "Tech Debt Reduction",
                "action": "Create reusable shared modules to eliminate the high percentage of duplicated code."
            })
            
        if metrics.get('total_loc', 0) > 50000:
            suggestions.append({
                "type": "Architecture",
                "action": "Consider breaking down the monolith into a microservices architecture to improve team velocity."
            })
            
        if not suggestions:
            suggestions.append({
                "type": "General",
                "action": "Codebase looks healthy. Continue with standard code review practices."
            })
            
        return suggestions
