"""
Moteur de backtesting Oracle Portfolio
Module existant préservé sans modification
"""

import random
import math
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

def run_backtest(config: Dict[str, Any]) -> Dict[str, Any]:
    """
    Exécute un backtesting complet basé sur la configuration fournie
    
    Args:
        config: Configuration du backtest
            - strategy: Nom de la stratégie
            - start_date: Date de début (YYYY-MM-DD)
            - end_date: Date de fin (YYYY-MM-DD)
            - initial_capital: Capital initial
            - assets: Liste des actifs
            - rebalancing_frequency: Fréquence de rééquilibrage
    
    Returns:
        Résultats complets du backtesting
    """
    strategy = config.get('strategy', 'balanced_portfolio')
    start_date = config.get('start_date', '2020-01-01')
    end_date = config.get('end_date', '2024-01-01')
    initial_capital = config.get('initial_capital', 100000)
    assets = config.get('assets', ['SPY', 'BND', 'GLD'])
    rebalancing_freq = config.get('rebalancing_frequency', 'monthly')
    
    # Calcul de la période
    start_dt = datetime.strptime(start_date, '%Y-%m-%d')
    end_dt = datetime.strptime(end_date, '%Y-%m-%d')
    total_days = (end_dt - start_dt).days
    
    # Génération des données de marché simulées
    market_data = generate_market_data(assets, start_dt, end_dt)
    
    # Exécution du backtesting
    backtest_results = execute_backtest_strategy(
        strategy, market_data, initial_capital, rebalancing_freq
    )
    
    # Calcul des métriques de performance
    performance_metrics = calculate_performance_metrics(
        backtest_results, initial_capital, total_days
    )
    
    # Analyse des drawdowns
    drawdown_analysis = analyze_drawdowns(backtest_results)
    
    # Comparaison avec benchmark
    benchmark_comparison = compare_with_benchmark(backtest_results, market_data)
    
    return {
        'strategy': strategy,
        'period': {
            'start_date': start_date,
            'end_date': end_date,
            'total_days': total_days,
            'trading_days': len(backtest_results['daily_returns'])
        },
        'initial_capital': initial_capital,
        'final_capital': backtest_results['final_capital'],
        'assets': assets,
        'rebalancing_frequency': rebalancing_freq,
        'performance_metrics': performance_metrics,
        'drawdown_analysis': drawdown_analysis,
        'benchmark_comparison': benchmark_comparison,
        'monthly_returns': backtest_results['monthly_returns'],
        'risk_metrics': calculate_risk_metrics(backtest_results),
        'trade_statistics': backtest_results['trade_stats'],
        'timestamp': datetime.now().isoformat(),
        'module': 'backtesting_engine',
        'version': '2.7.0',
        'status': 'preserved_without_modification'
    }

def generate_market_data(assets: List[str], start_date: datetime, end_date: datetime) -> Dict[str, List[float]]:
    """
    Génère des données de marché simulées pour les actifs
    """
    market_data = {}
    current_date = start_date
    
    # Paramètres de simulation par type d'actif
    asset_params = {
        'SPY': {'annual_return': 0.10, 'volatility': 0.16, 'initial_price': 300},
        'QQQ': {'annual_return': 0.12, 'volatility': 0.20, 'initial_price': 250},
        'BND': {'annual_return': 0.03, 'volatility': 0.04, 'initial_price': 85},
        'GLD': {'annual_return': 0.05, 'volatility': 0.18, 'initial_price': 150},
        'VTI': {'annual_return': 0.09, 'volatility': 0.15, 'initial_price': 180},
        'VXUS': {'annual_return': 0.07, 'volatility': 0.17, 'initial_price': 55}
    }
    
    for asset in assets:
        params = asset_params.get(asset, asset_params['SPY'])
        prices = []
        current_price = params['initial_price']
        
        while current_date <= end_date:
            # Simulation prix avec mouvement brownien géométrique
            daily_return = random.gauss(
                params['annual_return'] / 252,  # Rendement quotidien moyen
                params['volatility'] / math.sqrt(252)  # Volatilité quotidienne
            )
            
            current_price *= (1 + daily_return)
            prices.append(round(current_price, 2))
            current_date += timedelta(days=1)
        
        market_data[asset] = prices
        current_date = start_date  # Reset pour l'actif suivant
    
    return market_data

def execute_backtest_strategy(strategy: str, market_data: Dict[str, List[float]], 
                            initial_capital: float, rebalancing_freq: str) -> Dict[str, Any]:
    """
    Exécute la stratégie de backtesting
    """
    # Définition des allocations par stratégie
    strategy_allocations = {
        'balanced_portfolio': {'SPY': 0.6, 'BND': 0.3, 'GLD': 0.1},
        'aggressive_growth': {'SPY': 0.7, 'QQQ': 0.2, 'VTI': 0.1},
        'conservative': {'BND': 0.6, 'SPY': 0.3, 'GLD': 0.1},
        'momentum': {'QQQ': 0.5, 'SPY': 0.3, 'GLD': 0.2},
        'value_oriented': {'VTI': 0.5, 'VXUS': 0.3, 'BND': 0.2}
    }
    
    allocation = strategy_allocations.get(strategy, strategy_allocations['balanced_portfolio'])
    
    # Simulation du portefeuille
    portfolio_values = []
    daily_returns = []
    monthly_returns = []
    trade_stats = {'total_trades': 0, 'rebalancing_dates': []}
    
    current_capital = initial_capital
    days_count = len(list(market_data.values())[0])
    
    for day in range(days_count):
        # Calcul de la valeur du portefeuille
        portfolio_value = 0
        daily_return = 0
        
        for asset, weight in allocation.items():
            if asset in market_data:
                asset_value = current_capital * weight
                if day > 0:
                    price_change = (market_data[asset][day] - market_data[asset][day-1]) / market_data[asset][day-1]
                    daily_return += weight * price_change
                portfolio_value += asset_value * (1 + (market_data[asset][day] / market_data[asset][0] - 1))
        
        if day == 0:
            portfolio_value = initial_capital
            daily_return = 0
        
        portfolio_values.append(round(portfolio_value, 2))
        daily_returns.append(round(daily_return * 100, 4))
        
        # Rééquilibrage mensuel (approximatif)
        if day > 0 and day % 21 == 0:  # ~21 jours ouvrables par mois
            trade_stats['total_trades'] += len(allocation)
            trade_stats['rebalancing_dates'].append(day)
        
        # Calcul des rendements mensuels
        if day > 0 and day % 21 == 0:
            monthly_return = (portfolio_values[day] - portfolio_values[max(0, day-21)]) / portfolio_values[max(0, day-21)]
            monthly_returns.append(round(monthly_return * 100, 2))
    
    return {
        'portfolio_values': portfolio_values,
        'daily_returns': daily_returns,
        'monthly_returns': monthly_returns,
        'final_capital': portfolio_values[-1] if portfolio_values else initial_capital,
        'trade_stats': trade_stats
    }

def calculate_performance_metrics(backtest_results: Dict[str, Any], 
                                initial_capital: float, total_days: int) -> Dict[str, float]:
    """
    Calcule les métriques de performance du backtesting
    """
    final_capital = backtest_results['final_capital']
    daily_returns = backtest_results['daily_returns']
    
    # Rendement total
    total_return = (final_capital - initial_capital) / initial_capital
    
    # Rendement annualisé
    years = total_days / 365.25
    annualized_return = (final_capital / initial_capital) ** (1/years) - 1
    
    # Volatilité
    if len(daily_returns) > 1:
        mean_return = sum(daily_returns) / len(daily_returns)
        variance = sum([(r - mean_return)**2 for r in daily_returns]) / (len(daily_returns) - 1)
        volatility = math.sqrt(variance * 252)  # Annualisée
    else:
        volatility = 0
    
    # Ratio de Sharpe (approximatif avec taux sans risque = 2%)
    risk_free_rate = 0.02
    sharpe_ratio = (annualized_return - risk_free_rate) / volatility if volatility > 0 else 0
    
    # Rendements positifs vs négatifs
    positive_days = len([r for r in daily_returns if r > 0])
    win_rate = positive_days / len(daily_returns) if daily_returns else 0
    
    return {
        'total_return_pct': round(total_return * 100, 2),
        'annualized_return_pct': round(annualized_return * 100, 2),
        'volatility_pct': round(volatility * 100, 2),
        'sharpe_ratio': round(sharpe_ratio, 3),
        'win_rate_pct': round(win_rate * 100, 1),
        'best_day_pct': round(max(daily_returns) if daily_returns else 0, 2),
        'worst_day_pct': round(min(daily_returns) if daily_returns else 0, 2),
        'total_trading_days': len(daily_returns)
    }

def analyze_drawdowns(backtest_results: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyse les drawdowns du portefeuille
    """
    portfolio_values = backtest_results['portfolio_values']
    
    if not portfolio_values:
        return {'max_drawdown_pct': 0, 'drawdown_duration_days': 0}
    
    # Calcul des drawdowns
    peak = portfolio_values[0]
    max_drawdown = 0
    drawdown_start = 0
    max_drawdown_duration = 0
    current_drawdown_duration = 0
    
    for i, value in enumerate(portfolio_values):
        if value > peak:
            peak = value
            if current_drawdown_duration > max_drawdown_duration:
                max_drawdown_duration = current_drawdown_duration
            current_drawdown_duration = 0
        else:
            drawdown = (peak - value) / peak
            if drawdown > max_drawdown:
                max_drawdown = drawdown
                drawdown_start = i
            current_drawdown_duration += 1
    
    return {
        'max_drawdown_pct': round(max_drawdown * 100, 2),
        'drawdown_duration_days': max_drawdown_duration,
        'recovery_factor': round(1 / (max_drawdown + 0.001), 2)  # Éviter division par 0
    }

def compare_with_benchmark(backtest_results: Dict[str, Any], 
                          market_data: Dict[str, List[float]]) -> Dict[str, Any]:
    """
    Compare les résultats avec un benchmark (SPY par défaut)
    """
    benchmark_asset = 'SPY'
    
    if benchmark_asset not in market_data:
        return {'benchmark': 'N/A', 'outperformance_pct': 0}
    
    benchmark_prices = market_data[benchmark_asset]
    benchmark_return = (benchmark_prices[-1] - benchmark_prices[0]) / benchmark_prices[0]
    
    portfolio_values = backtest_results['portfolio_values']
    portfolio_return = (portfolio_values[-1] - portfolio_values[0]) / portfolio_values[0]
    
    outperformance = portfolio_return - benchmark_return
    
    return {
        'benchmark': benchmark_asset,
        'benchmark_return_pct': round(benchmark_return * 100, 2),
        'portfolio_return_pct': round(portfolio_return * 100, 2),
        'outperformance_pct': round(outperformance * 100, 2),
        'beta': round(random.uniform(0.7, 1.3), 2)  # Simulation beta
    }

def calculate_risk_metrics(backtest_results: Dict[str, Any]) -> Dict[str, float]:
    """
    Calcule les métriques de risque avancées
    """
    daily_returns = backtest_results['daily_returns']
    
    if not daily_returns:
        return {}
    
    # Conversion en décimales
    returns_decimal = [r/100 for r in daily_returns]
    
    # VaR 95% (Value at Risk)
    sorted_returns = sorted(returns_decimal)
    var_95_index = int(len(sorted_returns) * 0.05)
    var_95 = sorted_returns[var_95_index] if var_95_index < len(sorted_returns) else 0
    
    # CVaR (Conditional VaR)
    cvar_95 = sum(sorted_returns[:var_95_index]) / var_95_index if var_95_index > 0 else 0
    
    # Skewness et Kurtosis (approximations)
    mean_return = sum(returns_decimal) / len(returns_decimal)
    variance = sum([(r - mean_return)**2 for r in returns_decimal]) / len(returns_decimal)
    std_dev = math.sqrt(variance)
    
    skewness = sum([(r - mean_return)**3 for r in returns_decimal]) / (len(returns_decimal) * std_dev**3) if std_dev > 0 else 0
    kurtosis = sum([(r - mean_return)**4 for r in returns_decimal]) / (len(returns_decimal) * std_dev**4) if std_dev > 0 else 0
    
    return {
        'var_95_pct': round(var_95 * 100, 3),
        'cvar_95_pct': round(cvar_95 * 100, 3),
        'skewness': round(skewness, 3),
        'kurtosis': round(kurtosis, 3),
        'downside_deviation_pct': round(math.sqrt(sum([min(0, r)**2 for r in returns_decimal]) / len(returns_decimal)) * 100, 2)
    }

if __name__ == "__main__":
    # Test du module
    test_config = {
        'strategy': 'balanced_portfolio',
        'start_date': '2020-01-01',
        'end_date': '2023-01-01',
        'initial_capital': 100000,
        'assets': ['SPY', 'BND', 'GLD'],
        'rebalancing_frequency': 'monthly'
    }
    
    result = run_backtest(test_config)
    print("Test module backtesting_engine:")
    print(f"Stratégie: {result['strategy']}")
    print(f"Rendement total: {result['performance_metrics']['total_return_pct']}%")
    print(f"Ratio de Sharpe: {result['performance_metrics']['sharpe_ratio']}")
    print(f"Max Drawdown: {result['drawdown_analysis']['max_drawdown_pct']}%")

