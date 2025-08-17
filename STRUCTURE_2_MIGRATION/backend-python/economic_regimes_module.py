"""
Module d'analyse des régimes économiques
Oracle Portfolio - Préservé sans modification
"""

import random
from datetime import datetime, timedelta
from typing import Dict, List, Any

def analyze_regimes(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyse les régimes économiques basée sur les indicateurs macroéconomiques
    
    Args:
        data: Dictionnaire contenant les données d'entrée
            - country: Code pays (FR, US, DE, etc.)
            - indicators: Dictionnaire des indicateurs économiques
            - period: Période d'analyse
    
    Returns:
        Dictionnaire avec l'analyse du régime économique
    """
    country = data.get('country', 'FR')
    indicators = data.get('indicators', {})
    period = data.get('period', 'current')
    
    # Simulation analyse régime basée sur le pays
    regime_mapping = {
        'US': {'regime': 'EXPANSION', 'confidence': 85.2, 'trend': 'positive'},
        'FR': {'regime': 'TRANSITION', 'confidence': 72.8, 'trend': 'neutral'},
        'DE': {'regime': 'EXPANSION', 'confidence': 78.5, 'trend': 'positive'},
        'UK': {'regime': 'RECESSION', 'confidence': 91.3, 'trend': 'negative'},
        'JP': {'regime': 'STAGNATION', 'confidence': 68.7, 'trend': 'neutral'},
        'CN': {'regime': 'TRANSITION', 'confidence': 74.2, 'trend': 'mixed'}
    }
    
    regime_data = regime_mapping.get(country, {
        'regime': 'UNKNOWN',
        'confidence': 50.0,
        'trend': 'neutral'
    })
    
    # Génération d'indicateurs simulés
    base_indicators = {
        'pmi_manufacturing': round(random.uniform(45.0, 65.0), 1),
        'unemployment_rate': round(random.uniform(3.5, 12.0), 1),
        'gdp_growth': round(random.uniform(-2.0, 4.0), 1),
        'inflation_rate': round(random.uniform(0.5, 8.0), 1),
        'interest_rate': round(random.uniform(0.0, 5.5), 1),
        'consumer_confidence': round(random.uniform(60.0, 120.0), 1),
        'business_confidence': round(random.uniform(70.0, 130.0), 1)
    }
    
    # Mise à jour avec les indicateurs fournis
    base_indicators.update(indicators)
    
    # Calcul de scores composites
    economic_score = (
        (base_indicators['pmi_manufacturing'] - 50) * 2 +
        (100 - base_indicators['unemployment_rate']) * 0.5 +
        base_indicators['gdp_growth'] * 10 +
        (5 - abs(base_indicators['inflation_rate'] - 2)) * 5
    ) / 4
    
    # Détermination du régime final
    if economic_score > 75:
        final_regime = 'EXPANSION'
        confidence_adjustment = 5
    elif economic_score > 50:
        final_regime = 'TRANSITION'
        confidence_adjustment = 0
    elif economic_score > 25:
        final_regime = 'STAGNATION'
        confidence_adjustment = -3
    else:
        final_regime = 'RECESSION'
        confidence_adjustment = 8
    
    final_confidence = min(95.0, max(50.0, 
        regime_data['confidence'] + confidence_adjustment + random.uniform(-5, 5)
    ))
    
    # Recommandations d'allocation
    allocation_recommendations = get_allocation_recommendations(final_regime, final_confidence)
    
    return {
        'country': country,
        'period': period,
        'regime': final_regime,
        'confidence': round(final_confidence, 1),
        'economic_score': round(economic_score, 1),
        'trend': regime_data['trend'],
        'indicators': base_indicators,
        'allocation_recommendations': allocation_recommendations,
        'risk_level': get_risk_level(final_regime, final_confidence),
        'next_review_date': (datetime.now() + timedelta(days=30)).isoformat(),
        'timestamp': datetime.now().isoformat(),
        'module': 'economic_regimes_module',
        'version': '2.7.0',
        'status': 'preserved_without_modification'
    }

def get_allocation_recommendations(regime: str, confidence: float) -> Dict[str, float]:
    """
    Génère les recommandations d'allocation basées sur le régime
    """
    allocations = {
        'EXPANSION': {
            'equities': 70.0,
            'bonds': 20.0,
            'commodities': 5.0,
            'cash': 5.0
        },
        'TRANSITION': {
            'equities': 50.0,
            'bonds': 35.0,
            'commodities': 10.0,
            'cash': 5.0
        },
        'STAGNATION': {
            'equities': 40.0,
            'bonds': 45.0,
            'commodities': 5.0,
            'cash': 10.0
        },
        'RECESSION': {
            'equities': 25.0,
            'bonds': 60.0,
            'commodities': 0.0,
            'cash': 15.0
        }
    }
    
    base_allocation = allocations.get(regime, allocations['TRANSITION'])
    
    # Ajustement basé sur la confiance
    confidence_factor = confidence / 100.0
    adjusted_allocation = {}
    
    for asset, weight in base_allocation.items():
        if asset == 'cash':
            # Plus de cash si moins de confiance
            adjusted_allocation[asset] = weight * (2 - confidence_factor)
        else:
            # Moins d'exposition aux actifs risqués si moins de confiance
            adjusted_allocation[asset] = weight * confidence_factor
    
    # Normalisation pour que la somme = 100%
    total = sum(adjusted_allocation.values())
    normalized_allocation = {
        asset: round((weight / total) * 100, 1)
        for asset, weight in adjusted_allocation.items()
    }
    
    return normalized_allocation

def get_risk_level(regime: str, confidence: float) -> str:
    """
    Détermine le niveau de risque basé sur le régime et la confiance
    """
    risk_mapping = {
        'EXPANSION': 'MODERATE',
        'TRANSITION': 'MODERATE_HIGH',
        'STAGNATION': 'HIGH',
        'RECESSION': 'VERY_HIGH'
    }
    
    base_risk = risk_mapping.get(regime, 'HIGH')
    
    # Ajustement basé sur la confiance
    if confidence > 85:
        if base_risk == 'VERY_HIGH':
            return 'HIGH'
        elif base_risk == 'HIGH':
            return 'MODERATE_HIGH'
    elif confidence < 65:
        if base_risk == 'MODERATE':
            return 'MODERATE_HIGH'
        elif base_risk == 'MODERATE_HIGH':
            return 'HIGH'
    
    return base_risk

def get_historical_regimes(country: str, years: int = 5) -> List[Dict[str, Any]]:
    """
    Génère un historique simulé des régimes économiques
    """
    regimes = ['EXPANSION', 'TRANSITION', 'STAGNATION', 'RECESSION']
    historical_data = []
    
    for i in range(years * 4):  # Données trimestrielles
        date = datetime.now() - timedelta(days=90 * i)
        regime = random.choice(regimes)
        confidence = round(random.uniform(60.0, 90.0), 1)
        
        historical_data.append({
            'date': date.isoformat(),
            'regime': regime,
            'confidence': confidence,
            'country': country
        })
    
    return sorted(historical_data, key=lambda x: x['date'])

if __name__ == "__main__":
    # Test du module
    test_data = {
        'country': 'FR',
        'indicators': {
            'pmi_manufacturing': 52.3,
            'unemployment_rate': 7.2,
            'gdp_growth': 1.8,
            'inflation_rate': 2.1
        }
    }
    
    result = analyze_regimes(test_data)
    print("Test module economic_regimes_module:")
    print(f"Pays: {result['country']}")
    print(f"Régime: {result['regime']}")
    print(f"Confiance: {result['confidence']}%")
    print(f"Score économique: {result['economic_score']}")

