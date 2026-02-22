from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import api
import uvicorn

app = FastAPI(title="AI Project Estimator API", version="1.0.0")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "Backend is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
