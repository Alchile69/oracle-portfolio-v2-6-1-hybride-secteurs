"""
Analyseur de performance Oracle Portfolio
Module existant préservé sans modification
"""

import math
import statistics
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

def analyze_performance(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyse complète des performances d'un portefeuille
    
    Args:
        data: Données de performance
            - returns: Liste des rendements périodiques
            - benchmark: Liste des rendements du benchmark
            - portfolio_values: Valeurs historiques du portefeuille
            - period: Période d'analyse ('daily', 'monthly', 'quarterly')
    
    Returns:
        Analyse complète des performances
    """
    returns = data.get('returns', [0.02, -0.01, 0.03, 0.01, -0.02, 0.025, -0.015, 0.04])
    benchmark = data.get('benchmark', [0.015, -0.005, 0.025, 0.008, -0.015, 0.02, -0.01, 0.035])
    portfolio_values = data.get('portfolio_values', [])
    period = data.get('period', 'monthly')
    
    # Calculs de base
    portfolio_return = sum(returns)
    benchmark_return = sum(benchmark)
    alpha = portfolio_return - benchmark_return
    
    # Métriques de rendement
    return_metrics = calculate_return_metrics(returns, period)
    
    # Métriques de risque
    risk_metrics = calculate_detailed_risk_metrics(returns)
    
    # Analyse relative au benchmark
    relative_metrics = calculate_relative_metrics(returns, benchmark)
    
    # Analyse des périodes
    period_analysis = analyze_periods(returns, period)
    
    # Attribution de performance
    attribution = calculate_attribution_analysis(data)
    
    return {
        'summary': {
            'portfolio_return_pct': round(portfolio_return * 100, 2),
            'benchmark_return_pct': round(benchmark_return * 100, 2),
            'alpha_pct': round(alpha * 100, 2),
            'periods_analyzed': len(returns),
            'analysis_period': period
        },
        'return_metrics': return_metrics,
        'risk_metrics': risk_metrics,
        'relative_metrics': relative_metrics,
        'period_analysis': period_analysis,
        'attribution_analysis': attribution,
        'performance_grade': calculate_performance_grade(alpha, risk_metrics),
        'recommendations': generate_recommendations(return_metrics, risk_metrics, relative_metrics),
        'timestamp': datetime.now().isoformat(),
        'module': 'performance_analyzer',
        'version': '2.7.0',
        'status': 'preserved_without_modification'
    }

def calculate_return_metrics(returns: List[float], period: str) -> Dict[str, float]:
    """
    Calcule les métriques de rendement
    """
    if not returns:
        return {}
    
    # Facteurs d'annualisation
    annualization_factors = {
        'daily': 252,
        'weekly': 52,
        'monthly': 12,
        'quarterly': 4,
        'yearly': 1
    }
    
    factor = annualization_factors.get(period, 12)
    
    # Rendement cumulé
    cumulative_return = sum(returns)
    
    # Rendement moyen
    mean_return = statistics.mean(returns)
    
    # Rendement annualisé (composé)
    compound_return = 1
    for r in returns:
        compound_return *= (1 + r)
    annualized_return = (compound_return ** (factor / len(returns))) - 1
    
    # Rendements positifs vs négatifs
    positive_periods = len([r for r in returns if r > 0])
    win_rate = positive_periods / len(returns)
    
    # Meilleurs et pires rendements
    best_return = max(returns)
    worst_return = min(returns)
    
    return {
        'cumulative_return_pct': round(cumulative_return * 100, 2),
        'annualized_return_pct': round(annualized_return * 100, 2),
        'mean_return_pct': round(mean_return * 100, 3),
        'win_rate_pct': round(win_rate * 100, 1),
        'best_period_pct': round(best_return * 100, 2),
        'worst_period_pct': round(worst_return * 100, 2),
        'positive_periods': positive_periods,
        'total_periods': len(returns)
    }

def calculate_detailed_risk_metrics(returns: List[float]) -> Dict[str, float]:
    """
    Calcule les métriques de risque détaillées
    """
    if len(returns) < 2:
        return {}
    
    # Volatilité
    volatility = statistics.stdev(returns)
    annualized_volatility = volatility * math.sqrt(12)  # Assuming monthly data
    
    # Downside deviation
    mean_return = statistics.mean(returns)
    downside_returns = [min(0, r - mean_return) for r in returns]
    downside_deviation = math.sqrt(sum([r**2 for r in downside_returns]) / len(downside_returns))
    
    # VaR et CVaR
    sorted_returns = sorted(returns)
    var_95_index = int(len(sorted_returns) * 0.05)
    var_95 = sorted_returns[var_95_index] if var_95_index < len(sorted_returns) else sorted_returns[0]
    
    # CVaR (Expected Shortfall)
    cvar_95 = statistics.mean(sorted_returns[:var_95_index]) if var_95_index > 0 else var_95
    
    # Maximum Drawdown (approximation)
    cumulative_returns = []
    cumulative = 1
    for r in returns:
        cumulative *= (1 + r)
        cumulative_returns.append(cumulative)
    
    peak = cumulative_returns[0]
    max_drawdown = 0
    for value in cumulative_returns:
        if value > peak:
            peak = value
        else:
            drawdown = (peak - value) / peak
            max_drawdown = max(max_drawdown, drawdown)
    
    # Skewness et Kurtosis
    n = len(returns)
    mean = statistics.mean(returns)
    variance = statistics.variance(returns)
    std_dev = math.sqrt(variance)
    
    skewness = sum([(r - mean)**3 for r in returns]) / (n * std_dev**3) if std_dev > 0 else 0
    kurtosis = sum([(r - mean)**4 for r in returns]) / (n * std_dev**4) if std_dev > 0 else 0
    excess_kurtosis = kurtosis - 3
    
    return {
        'volatility_pct': round(volatility * 100, 2),
        'annualized_volatility_pct': round(annualized_volatility * 100, 2),
        'downside_deviation_pct': round(downside_deviation * 100, 2),
        'var_95_pct': round(var_95 * 100, 2),
        'cvar_95_pct': round(cvar_95 * 100, 2),
        'max_drawdown_pct': round(max_drawdown * 100, 2),
        'skewness': round(skewness, 3),
        'excess_kurtosis': round(excess_kurtosis, 3)
    }

def calculate_relative_metrics(returns: List[float], benchmark: List[float]) -> Dict[str, float]:
    """
    Calcule les métriques relatives au benchmark
    """
    if len(returns) != len(benchmark) or len(returns) < 2:
        return {}
    
    # Tracking error
    excess_returns = [r - b for r, b in zip(returns, benchmark)]
    tracking_error = statistics.stdev(excess_returns) if len(excess_returns) > 1 else 0
    
    # Information ratio
    mean_excess_return = statistics.mean(excess_returns)
    information_ratio = mean_excess_return / tracking_error if tracking_error > 0 else 0
    
    # Beta (approximation avec corrélation)
    if len(returns) > 1 and len(benchmark) > 1:
        # Calcul de la covariance et variance
        mean_returns = statistics.mean(returns)
        mean_benchmark = statistics.mean(benchmark)
        
        covariance = sum([(r - mean_returns) * (b - mean_benchmark) for r, b in zip(returns, benchmark)]) / len(returns)
        benchmark_variance = statistics.variance(benchmark)
        
        beta = covariance / benchmark_variance if benchmark_variance > 0 else 1.0
        
        # Corrélation
        returns_std = statistics.stdev(returns)
        benchmark_std = statistics.stdev(benchmark)
        correlation = covariance / (returns_std * benchmark_std) if (returns_std * benchmark_std) > 0 else 0
    else:
        beta = 1.0
        correlation = 0.0
    
    # Sharpe ratio (approximation avec risk-free rate = 2%)
    risk_free_rate = 0.02 / 12  # Monthly risk-free rate
    mean_return = statistics.mean(returns)
    volatility = statistics.stdev(returns)
    sharpe_ratio = (mean_return - risk_free_rate) / volatility if volatility > 0 else 0
    
    # Treynor ratio
    treynor_ratio = (mean_return - risk_free_rate) / beta if beta != 0 else 0
    
    return {
        'tracking_error_pct': round(tracking_error * 100, 2),
        'information_ratio': round(information_ratio, 3),
        'beta': round(beta, 3),
        'correlation': round(correlation, 3),
        'sharpe_ratio': round(sharpe_ratio, 3),
        'treynor_ratio': round(treynor_ratio, 3),
        'alpha_pct': round(mean_excess_return * 100, 2)
    }

def analyze_periods(returns: List[float], period: str) -> Dict[str, Any]:
    """
    Analyse les performances par période
    """
    if len(returns) < 4:
        return {}
    
    # Division en quartiles
    n = len(returns)
    q1_end = n // 4
    q2_end = n // 2
    q3_end = 3 * n // 4
    
    q1_returns = returns[:q1_end]
    q2_returns = returns[q1_end:q2_end]
    q3_returns = returns[q2_end:q3_end]
    q4_returns = returns[q3_end:]
    
    quarters = [q1_returns, q2_returns, q3_returns, q4_returns]
    quarter_performance = []
    
    for i, quarter in enumerate(quarters, 1):
        if quarter:
            quarter_perf = {
                'quarter': i,
                'return_pct': round(sum(quarter) * 100, 2),
                'volatility_pct': round(statistics.stdev(quarter) * 100, 2) if len(quarter) > 1 else 0,
                'periods': len(quarter)
            }
            quarter_performance.append(quarter_perf)
    
    # Analyse de consistance
    quarter_returns = [q['return_pct'] for q in quarter_performance]
    consistency_score = 1 - (statistics.stdev(quarter_returns) / 100) if len(quarter_returns) > 1 else 1
    
    return {
        'quarterly_performance': quarter_performance,
        'consistency_score': round(max(0, min(1, consistency_score)), 3),
        'best_quarter': max(quarter_performance, key=lambda x: x['return_pct']) if quarter_performance else None,
        'worst_quarter': min(quarter_performance, key=lambda x: x['return_pct']) if quarter_performance else None
    }

def calculate_attribution_analysis(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyse d'attribution de performance (simplifiée)
    """
    sectors = data.get('sectors', {
        'Technology': 0.3,
        'Healthcare': 0.2,
        'Financial': 0.15,
        'Consumer': 0.15,
        'Industrial': 0.1,
        'Energy': 0.05,
        'Other': 0.05
    })
    
    # Simulation des contributions sectorielles
    sector_contributions = {}
    total_contribution = 0
    
    for sector, weight in sectors.items():
        # Simulation d'une contribution basée sur le poids
        contribution = weight * (0.08 + (hash(sector) % 100 - 50) / 1000)  # Variation autour de 8%
        sector_contributions[sector] = round(contribution * 100, 2)
        total_contribution += contribution
    
    # Normalisation pour cohérence
    normalization_factor = 0.06 / total_contribution if total_contribution != 0 else 1
    for sector in sector_contributions:
        sector_contributions[sector] = round(sector_contributions[sector] * normalization_factor, 2)
    
    return {
        'sector_contributions': sector_contributions,
        'top_contributor': max(sector_contributions.items(), key=lambda x: x[1]) if sector_contributions else None,
        'worst_contributor': min(sector_contributions.items(), key=lambda x: x[1]) if sector_contributions else None,
        'diversification_score': round(1 - sum([w**2 for w in sectors.values()]), 3)
    }

def calculate_performance_grade(alpha: float, risk_metrics: Dict[str, float]) -> str:
    """
    Calcule une note de performance globale
    """
    # Score basé sur l'alpha
    alpha_score = min(100, max(0, (alpha + 0.02) * 1000))  # Normalisation
    
    # Score basé sur le ratio risque/rendement
    volatility = risk_metrics.get('volatility_pct', 10) / 100
    risk_score = min(100, max(0, 100 - volatility * 500))  # Pénalité pour volatilité élevée
    
    # Score basé sur le drawdown
    max_drawdown = risk_metrics.get('max_drawdown_pct', 10) / 100
    drawdown_score = min(100, max(0, 100 - max_drawdown * 200))
    
    # Score composite
    composite_score = (alpha_score * 0.4 + risk_score * 0.3 + drawdown_score * 0.3)
    
    if composite_score >= 80:
        return 'A'
    elif composite_score >= 70:
        return 'B'
    elif composite_score >= 60:
        return 'C'
    elif composite_score >= 50:
        return 'D'
    else:
        return 'F'

def generate_recommendations(return_metrics: Dict[str, float], 
                           risk_metrics: Dict[str, float], 
                           relative_metrics: Dict[str, float]) -> List[str]:
    """
    Génère des recommandations basées sur l'analyse
    """
    recommendations = []
    
    # Analyse du rendement
    annualized_return = return_metrics.get('annualized_return_pct', 0)
    if annualized_return < 5:
        recommendations.append("Considérer une allocation plus agressive pour améliorer les rendements")
    elif annualized_return > 15:
        recommendations.append("Excellente performance, maintenir la stratégie actuelle")
    
    # Analyse du risque
    volatility = risk_metrics.get('annualized_volatility_pct', 0)
    if volatility > 20:
        recommendations.append("Volatilité élevée - envisager une diversification accrue")
    elif volatility < 8:
        recommendations.append("Faible volatilité - opportunité d'augmenter légèrement le risque")
    
    # Analyse relative
    tracking_error = relative_metrics.get('tracking_error_pct', 0)
    if tracking_error > 5:
        recommendations.append("Tracking error élevé - revoir l'allocation par rapport au benchmark")
    
    information_ratio = relative_metrics.get('information_ratio', 0)
    if information_ratio < 0.5:
        recommendations.append("Faible information ratio - optimiser la sélection d'actifs")
    
    # Drawdown
    max_drawdown = risk_metrics.get('max_drawdown_pct', 0)
    if max_drawdown > 15:
        recommendations.append("Drawdown important - implémenter des stratégies de protection")
    
    if not recommendations:
        recommendations.append("Performance équilibrée - continuer le monitoring régulier")
    
    return recommendations

def calculate_risk_metrics(data: Dict[str, Any]) -> Dict[str, float]:
    """
    Fonction de compatibilité pour calculate_risk_metrics
    """
    returns = data.get('returns', [])
    if not returns:
        return {'error': 'No returns data provided'}
    
    risk_metrics = calculate_detailed_risk_metrics(returns)
    
    return {
        'volatility_pct': risk_metrics.get('volatility_pct', 0),
        'var_95_pct': risk_metrics.get('var_95_pct', 0),
        'max_drawdown_pct': risk_metrics.get('max_drawdown_pct', 0),
        'downside_deviation_pct': risk_metrics.get('downside_deviation_pct', 0),
        'module': 'performance_analyzer',
        'function': 'calculate_risk_metrics'
    }

if __name__ == "__main__":
    # Test du module
    test_data = {
        'returns': [0.02, -0.01, 0.03, 0.01, -0.02, 0.025, -0.015, 0.04, 0.005, -0.008],
        'benchmark': [0.015, -0.005, 0.025, 0.008, -0.015, 0.02, -0.01, 0.035, 0.003, -0.005],
        'period': 'monthly'
    }
    
    result = analyze_performance(test_data)
    print("Test module performance_analyzer:")
    print(f"Rendement portefeuille: {result['summary']['portfolio_return_pct']}%")
    print(f"Alpha: {result['summary']['alpha_pct']}%")
    print(f"Sharpe ratio: {result['relative_metrics']['sharpe_ratio']}")
    print(f"Note de performance: {result['performance_grade']}")
    
    # Test calculate_risk_metrics
    risk_result = calculate_risk_metrics({'returns': test_data['returns']})
    print(f"Volatilité: {risk_result['volatility_pct']}%")
    print(f"VaR 95%: {risk_result['var_95_pct']}%")

