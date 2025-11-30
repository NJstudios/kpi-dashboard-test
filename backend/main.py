from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from kpi_router import router as kpi_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update to restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(kpi_router)
