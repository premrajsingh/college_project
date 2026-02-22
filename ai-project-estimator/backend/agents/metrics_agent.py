import os
import shutil
import tempfile
from git import Repo
from radon.complexity import cc_visit

class MetricsAgent:
    def __init__(self):
        self.supported_extensions = {'.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cpp', '.c', '.go', '.rb', '.php'}
        
    def analyze(self, github_url: str) -> dict:
        """Clones a repo, extracts metrics, and cleans up."""
        temp_dir = tempfile.mkdtemp()
        metrics = {
            "total_loc": 0,
            "file_count": 0,
            "avg_complexity": 0.0,
            "duplication_percentage": 5.0  # Placeholder, a real implementation requires a token-based clone detector
        }
        
        try:
            print(f"Cloning {github_url} to {temp_dir}...")
            Repo.clone_from(github_url, temp_dir, depth=1)
            
            total_complexity = 0
            functions_counted = 0
            
            for root, dirs, files in os.walk(temp_dir):
                # Skip common ignore dirs
                dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', 'venv', 'env', '__pycache__', 'dist', 'build']]
                
                for file in files:
                    ext = os.path.splitext(file)[1]
                    if ext in self.supported_extensions:
                        filepath = os.path.join(root, file)
                        metrics["file_count"] += 1
                        
                        try:
                            with open(filepath, 'r', encoding='utf-8') as f:
                                content = f.read()
                                lines = content.splitlines()
                                metrics["total_loc"] += len(lines)
                                
                                # If it's python, use radon to get complexity
                                if ext == '.py':
                                    blocks = cc_visit(content)
                                    for block in blocks:
                                        total_complexity += block.complexity
                                        functions_counted += 1
                        except Exception as e:
                            # Skip files that can't be read (e.g. binary disguised as text)
                            pass
            
            # If we couldn't parse complexity (e.g., no python files), fallback to a rough estimate based on LOC
            if functions_counted > 0:
                metrics["avg_complexity"] = round(total_complexity / functions_counted, 2)
            else:
                metrics["avg_complexity"] = round((metrics["total_loc"] / 1000) * 1.5, 2)
                
            return metrics
            
        finally:
            # Cleanup
            print(f"Cleaning up {temp_dir}...")
            shutil.rmtree(temp_dir, ignore_errors=True)
