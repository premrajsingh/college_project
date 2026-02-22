class RiskAgent:
    def __init__(self):
        pass

    def analyze(self, metrics: dict, estimations: dict) -> list:
        """Evaluates risks based on metrics and rules. Returns a list of risk objects."""
        risks = []
        scores = []
        
        loc = metrics.get('total_loc', 0)
        complexity = metrics.get('avg_complexity', 0)
        duplication = metrics.get('duplication_percentage', 0)
        
        # Schedule Risk
        if loc > 50000:
            risks.append({"type": "Schedule Delay", "score": 8, "reason": "Large codebase increases risk of integration issues."})
            scores.append(8)
        elif loc > 10000:
            risks.append({"type": "Schedule Delay", "score": 5, "reason": "Medium codebase requires careful planning."})
            scores.append(5)
            
        # Code Quality Risk
        if complexity > 15:
            risks.append({"type": "Code Quality", "score": 9, "reason": f"High cyclomatic complexity ({complexity}) indicates difficult-to-maintain code."})
            scores.append(9)
        elif complexity > 8:
            risks.append({"type": "Code Quality", "score": 6, "reason": "Moderate complexity. Refactoring suggested."})
            scores.append(6)
            
        # Tech Debt / Budget Risk
        if duplication > 20:
            risks.append({"type": "Budget Overrun", "score": 7, "reason": f"High duplication ({duplication}%) increases maintenance costs over time."})
            scores.append(7)
            
        return risks
