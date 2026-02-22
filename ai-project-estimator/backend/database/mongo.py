import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.ai_estimator
project_collection = database.get_collection("projects")

async def create_project(github_url: str) -> str:
    """Create a new project document and return its ID."""
    project = {
        "github_url": github_url,
        "status": "processing",
        "created_at": datetime.utcnow(),
        "metrics": {},
        "estimations": {},
        "risks": [],
        "optimizations": [],
        "final_report": ""
    }
    result = await project_collection.insert_one(project)
    return str(result.inserted_id)

async def update_project(project_id: str, update_data: dict) -> bool:
    """Update an existing project document."""
    try:
        result = await project_collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Failed to update project {project_id}: {e}")
        return False

async def get_project(project_id: str) -> dict:
    """Retrieve a project by ID."""
    try:
        project = await project_collection.find_one({"_id": ObjectId(project_id)})
        return project
    except Exception:
        return None
