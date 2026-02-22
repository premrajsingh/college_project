import joblib
import os
import random

class EstimationAgent:
    def __init__(self):
        # We assume the model is placed in backend/models/effort_model.pkl
        model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'effort_model.pkl')
        self.model = None
        try:
            self.model = joblib.load(model_path)
        except Exception as e:
            print(f"Warning: Could not load ML model from {model_path}. Using fallback estimation rules. Error: {e}")

    def predict(self, metrics: dict) -> dict:
        """Predicts time, effort, and cost based on metrics."""
        
        team_size = metrics.get('suggested_team_size', random.randint(2, 5)) 
        
        if self.model:
            # Match the feature order from training: ['total_loc', 'file_count', 'avg_complexity', 'duplication_percentage', 'team_size']
            features = [[
                metrics.get('total_loc', 1000),
                metrics.get('file_count', 10),
                metrics.get('avg_complexity', 5.0),
                metrics.get('duplication_percentage', 5.0),
                team_size
            ]]
            
            predictions = self.model.predict(features)[0]
            
            return {
                "predicted_effort_hours": max(8, int(predictions[0])),
                "predicted_time_days": max(1, int(predictions[1])),
                "predicted_cost_dollars": max(100, int(predictions[2])),
                "assumed_team_size": team_size
            }
        else:
            # Fallback dumb estimation if model fails to load
            loc = metrics.get('total_loc', 1000)
            effort = max(8, int(loc / 10))
            return {
                "predicted_effort_hours": effort,
                "predicted_time_days": max(1, int(effort / (team_size * 8))),
                "predicted_cost_dollars": effort * 50, # assuming $50/hr
                "assumed_team_size": team_size
            }
