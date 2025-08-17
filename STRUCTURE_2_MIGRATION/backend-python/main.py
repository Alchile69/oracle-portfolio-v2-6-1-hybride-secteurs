"""
Oracle Portfolio - Backend Python FastAPI
Architecture: Firebase + Vite + Cloud Run
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn
import logging
from datetime import datetime
import os

# Import des modules Oracle Portfolio
from economic_regimes_module import analyze_regimes
from backtesting_engine import run_backtest
from performance_analyzer import analyze_performance, calculate_risk_metrics

# Configuration
app = FastAPI(
    title="Oracle Portfolio - Backend Python",
    description="Architecture hybridée optimale - Modules Python préservés",
    version="2.7.0",
    docs_url="/docs"
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://oracle-portfolio.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Middleware sécurité
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # À restreindre en production
)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request, call_next):
    start_time = datetime.utcnow()
    response = await call_next(request)
    process_time = (datetime.utcnow() - start_time).total_seconds()
    
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")
    return response

# Routes de base
@app.get("/")
async def root():
    """Point d'entrée API"""
    return {
        "message": "Oracle Portfolio - Backend Python",
        "version": "2.7.0",
        "architecture": "Firebase + Vite + Cloud Run",
        "status": "operational",
        "modules": ["economic_regimes", "backtesting", "performance_analyzer"]
    }

@app.get("/health")
async def health_check():
    """Health check pour monitoring"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.7.0",
        "modules_loaded": 3
    }

# Routes modules métier
@app.post("/api/regimes/analyze")
async def analyze_regimes_endpoint(data: dict):
    """
    Analyse des régimes économiques
    Module existant préservé intégralement
    """
    try:
        logger.info(f"Analyse régimes pour pays: {data.get('country', 'N/A')}")
        
        result = analyze_regimes(data)
        
        return {
            "success": True,
            "data": result,
            "module": "economic_regimes_module",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Erreur analyse régimes: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/backtest/run")
async def run_backtest_endpoint(config: dict):
    """
    Exécution backtesting
    Module existant préservé intégralement
    """
    try:
        logger.info(f"Backtesting stratégie: {config.get('strategy', 'N/A')}")
        
        result = run_backtest(config)
        
        return {
            "success": True,
            "data": result,
            "module": "backtesting_engine",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Erreur backtesting: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/performance/analyze")
async def analyze_performance_endpoint(data: dict):
    """
    Analyse de performance
    Module existant préservé intégralement
    """
    try:
        logger.info("Analyse de performance portefeuille")
        
        result = analyze_performance(data)
        
        return {
            "success": True,
            "data": result,
            "module": "performance_analyzer",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Erreur analyse performance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/risk/calculate")
async def calculate_risk_endpoint(data: dict):
    """
    Calcul des métriques de risque
    Module existant préservé intégralement
    """
    try:
        logger.info("Calcul métriques de risque")
        
        result = calculate_risk_metrics(data)
        
        return {
            "success": True,
            "data": result,
            "module": "performance_analyzer",
            "function": "calculate_risk_metrics",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Erreur calcul risque: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        workers=1,
        log_level="info"
    )

