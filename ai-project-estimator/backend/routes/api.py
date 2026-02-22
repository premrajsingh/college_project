from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, Dict, Any
from agents.orchestrator import OrchestratorAgent
from database.mongo import get_project, create_project, update_project

router = APIRouter()

class AnalyzeRequest(BaseModel):
    github_url: str

class ProjectStatusResponse(BaseModel):
    project_id: str
    status: str
    message: str

@router.post("/projects/analyze", response_model=ProjectStatusResponse)
async def analyze_project(request: AnalyzeRequest, background_tasks: BackgroundTasks):
    try:
        # Create a skeleton project document in MongoDB
        project_id = await create_project(request.github_url)
        
        # We start the orchestration in the background because AI agents take time
        # This prevents the initial API call from timing out.
        orchestrator = OrchestratorAgent(project_id)
        background_tasks.add_task(orchestrator.run_pipeline, request.github_url)
        
        return ProjectStatusResponse(
            project_id=str(project_id),
            status="processing",
            message="Analysis has started. Poll the status using GET /projects/{project_id}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/projects/{project_id}")
async def get_project_details(project_id: str):
    project = await get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Convert ObjectId to string for JSON serialization
    project["_id"] = str(project["_id"])
    return project
