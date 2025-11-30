from fastapi import APIRouter
import httpx
from datetime import datetime, timedelta
from random import uniform, randint

router = APIRouter()

@router.get("/kpis")
async def get_kpis():
    # Generate mock data for 30 days
    today = datetime.today()
    data = []
    for i in range(30):
        day = today - timedelta(days=i)
        data.append({
            "date": day.strftime("%Y-%m-%d"),
            "mrr": round(uniform(8000, 14000), 2),
            "dau": randint(300, 700),
            "churn": round(uniform(0.01, 0.05), 3),
            "ltv": round(uniform(350, 550), 2),
        })
    return list(reversed(data))  # so it's oldest → newest
