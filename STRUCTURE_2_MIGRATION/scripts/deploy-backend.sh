#!/bin/bash
# Oracle Portfolio - Script de déploiement backend Python
# Architecture: Firebase + Vite + Cloud Run

set -e

echo "🚀 DÉPLOIEMENT BACKEND PYTHON - CLOUD RUN"
echo "=========================================="

# Configuration
PROJECT_ID="${PROJECT_ID:-oracle-portfolio-prod}"
REGION="${REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-oracle-backend}"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    if ! command -v gcloud &> /dev/null; then
        log_error "gcloud CLI non installé"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker non installé"
        exit 1
    fi
    
    # Vérification de l'authentification
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        log_error "Authentification Google Cloud requise"
        echo "Exécutez: gcloud auth login"
        exit 1
    fi
    
    log_info "✅ Prérequis validés"
}

# Configuration du projet
configure_project() {
    log_info "Configuration du projet Google Cloud..."
    
    gcloud config set project $PROJECT_ID
    
    # Activation des APIs nécessaires
    log_info "Activation des APIs..."
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable containerregistry.googleapis.com
    
    log_info "✅ Projet configuré"
}

# Build de l'image Docker
build_image() {
    log_info "Construction de l'image Docker..."
    
    cd ../backend-python
    
    # Build avec Cloud Build pour optimisation
    gcloud builds submit --tag $IMAGE_NAME .
    
    log_info "✅ Image construite: $IMAGE_NAME"
}

# Déploiement sur Cloud Run
deploy_service() {
    log_info "Déploiement sur Cloud Run..."
    
    gcloud run deploy $SERVICE_NAME \
        --image $IMAGE_NAME \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --memory 1Gi \
        --cpu 1 \
        --concurrency 80 \
        --max-instances 10 \
        --min-instances 0 \
        --timeout 300s \
        --port 8080 \
        --set-env-vars "ENVIRONMENT=production" \
        --set-env-vars "LOG_LEVEL=info"
    
    # Récupération de l'URL du service
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')
    
    log_info "✅ Service déployé: $SERVICE_URL"
    echo "SERVICE_URL=$SERVICE_URL" > ../deployment.env
}

# Tests post-déploiement
test_deployment() {
    log_info "Tests post-déploiement..."
    
    if [ -z "$SERVICE_URL" ]; then
        SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')
    fi
    
    # Test health check
    log_info "Test health check..."
    if curl -f "$SERVICE_URL/health" > /dev/null 2>&1; then
        log_info "✅ Health check OK"
    else
        log_error "❌ Health check failed"
        exit 1
    fi
    
    # Test endpoint principal
    log_info "Test endpoint principal..."
    if curl -f "$SERVICE_URL/" > /dev/null 2>&1; then
        log_info "✅ Endpoint principal OK"
    else
        log_error "❌ Endpoint principal failed"
        exit 1
    fi
    
    # Test endpoint métier
    log_info "Test endpoint régimes économiques..."
    RESPONSE=$(curl -s -X POST "$SERVICE_URL/api/regimes/analyze" \
        -H "Content-Type: application/json" \
        -d '{"country": "FR"}')
    
    if echo "$RESPONSE" | grep -q "success"; then
        log_info "✅ Endpoint métier OK"
    else
        log_warn "⚠️ Endpoint métier - réponse inattendue"
    fi
}

# Configuration du monitoring
setup_monitoring() {
    log_info "Configuration du monitoring..."
    
    # Alertes Cloud Monitoring (optionnel)
    log_info "Monitoring configuré via Cloud Run par défaut"
    log_info "Métriques disponibles dans Google Cloud Console"
}

# Nettoyage
cleanup() {
    log_info "Nettoyage des ressources temporaires..."
    
    # Suppression des images locales anciennes
    docker image prune -f > /dev/null 2>&1 || true
    
    log_info "✅ Nettoyage terminé"
}

# Affichage des informations de déploiement
show_deployment_info() {
    echo ""
    echo "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS"
    echo "=================================="
    echo "Service: $SERVICE_NAME"
    echo "Région: $REGION"
    echo "URL: $SERVICE_URL"
    echo ""
    echo "📊 Endpoints disponibles:"
    echo "  - Health: $SERVICE_URL/health"
    echo "  - Docs: $SERVICE_URL/docs"
    echo "  - Régimes: $SERVICE_URL/api/regimes/analyze"
    echo "  - Backtesting: $SERVICE_URL/api/backtest/run"
    echo "  - Performance: $SERVICE_URL/api/performance/analyze"
    echo ""
    echo "🔧 Commandes utiles:"
    echo "  - Logs: gcloud run services logs tail $SERVICE_NAME --region=$REGION"
    echo "  - Métriques: gcloud run services describe $SERVICE_NAME --region=$REGION"
    echo "  - Mise à jour: ./deploy-backend.sh"
}

# Fonction principale
main() {
    log_info "Début du déploiement backend Python..."
    
    check_prerequisites
    configure_project
    build_image
    deploy_service
    test_deployment
    setup_monitoring
    cleanup
    show_deployment_info
    
    log_info "🚀 Déploiement backend terminé avec succès!"
}

# Gestion des erreurs
trap 'log_error "Erreur lors du déploiement. Vérifiez les logs ci-dessus."; exit 1' ERR

# Exécution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

