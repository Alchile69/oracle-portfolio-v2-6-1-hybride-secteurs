/**
 * Hook useSectorData - Gestion des données sectorielles Oracle Portfolio V3.0
 * @author Manus AI
 * @version 3.0.0
 * @date 2025-08-07
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  SectorData, 
  SectorType, 
  SectorMetrics,
  SECTOR_DEFINITIONS,
  SectorUtils,
  TrendDirection,
  SectorGrade,
  UseSectorDataReturn,
  DEFAULT_SECTOR_CONFIG
} from '../types/sector.types';

// Interface pour la configuration du hook
interface UseSectorDataConfig {
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableCache?: boolean;
  fallbackData?: SectorData[];
}

// Générateur de données sectorielles par pays
const generateSectorDataByCountry = (countryCode: string): SectorData[] => {
  const countryMultipliers = {
    'FRA': { tech: 0.8, finance: 1.2, healthcare: 1.0, energy: 0.9, industrials: 1.1 },
    'USA': { tech: 1.5, finance: 1.3, healthcare: 1.2, energy: 1.0, industrials: 1.0 },
    'CHN': { tech: 1.2, finance: 0.9, healthcare: 0.8, energy: 1.1, industrials: 1.4 },
    'JPN': { tech: 1.3, finance: 1.0, healthcare: 1.1, energy: 0.7, industrials: 1.2 },
    'DEU': { tech: 1.0, finance: 1.1, healthcare: 1.0, energy: 0.8, industrials: 1.3 },
    'IND': { tech: 1.1, finance: 0.8, healthcare: 0.9, energy: 1.0, industrials: 1.2 },
    'GBR': { tech: 1.2, finance: 1.4, healthcare: 1.0, energy: 0.9, industrials: 0.9 },
    'ITA': { tech: 0.9, finance: 1.0, healthcare: 1.0, energy: 0.8, industrials: 1.1 },
    'BRA': { tech: 0.7, finance: 0.9, healthcare: 0.8, energy: 1.2, industrials: 1.0 },
    'CAN': { tech: 0.9, finance: 1.1, healthcare: 1.0, energy: 1.3, industrials: 1.0 }
  };

  const multipliers = countryMultipliers[countryCode] || countryMultipliers['USA'];
  
  const baseSectors = [
    {
      id: SectorType.TECHNOLOGY,
      allocation: 25.5 * multipliers.tech,
      performance: 12.3 + (Math.random() - 0.5) * 10,
      riskScore: 75 + (Math.random() - 0.5) * 20
    },
    {
      id: SectorType.FINANCE,
      allocation: 18.7 * multipliers.finance,
      performance: 8.1 + (Math.random() - 0.5) * 8,
      riskScore: 65 + (Math.random() - 0.5) * 15
    },
    {
      id: SectorType.HEALTHCARE,
      allocation: 15.2 * multipliers.healthcare,
      performance: 9.7 + (Math.random() - 0.5) * 6,
      riskScore: 45 + (Math.random() - 0.5) * 10
    },
    {
      id: SectorType.ENERGY,
      allocation: 12.8 * multipliers.energy,
      performance: 15.2 + (Math.random() - 0.5) * 15,
      riskScore: 85 + (Math.random() - 0.5) * 20
    },
    {
      id: SectorType.INDUSTRIALS,
      allocation: 11.3 * multipliers.industrials,
      performance: 7.8 + (Math.random() - 0.5) * 8,
      riskScore: 60 + (Math.random() - 0.5) * 15
    },
    {
      id: SectorType.CONSUMER,
      allocation: 8.9,
      performance: 6.4 + (Math.random() - 0.5) * 6,
      riskScore: 55 + (Math.random() - 0.5) * 12
    },
    {
      id: SectorType.COMMUNICATION,
      allocation: 4.2,
      performance: 5.1 + (Math.random() - 0.5) * 8,
      riskScore: 70 + (Math.random() - 0.5) * 15
    },
    {
      id: SectorType.MATERIALS,
      allocation: 2.1,
      performance: 4.3 + (Math.random() - 0.5) * 10,
      riskScore: 80 + (Math.random() - 0.5) * 15
    },
    {
      id: SectorType.UTILITIES,
      allocation: 1.3,
      performance: 3.2 + (Math.random() - 0.5) * 4,
      riskScore: 35 + (Math.random() - 0.5) * 10
    }
  ];

  // Normaliser les allocations pour qu'elles totalisent 100%
  const totalAllocation = baseSectors.reduce((sum, sector) => sum + sector.allocation, 0);
  
  return baseSectors.map(sector => {
    const normalizedAllocation = (sector.allocation / totalAllocation) * 100;
    const metadata = SECTOR_DEFINITIONS[sector.id];
    
    const metrics: SectorMetrics = {
      allocation: normalizedAllocation,
      performance: sector.performance,
      confidence: 75 + Math.random() * 20,
      trend: sector.performance > 5 ? TrendDirection.UP : 
             sector.performance < -2 ? TrendDirection.DOWN : TrendDirection.STABLE,
      riskScore: Math.max(0, Math.min(100, sector.riskScore)),
      volatility: 15 + Math.random() * 25,
      sharpeRatio: 0.8 + Math.random() * 1.2,
      beta: 0.7 + Math.random() * 0.8,
      lastUpdated: new Date()
    };

    const grade = SectorUtils.calculateGrade(metrics);

    return {
      metadata,
      metrics,
      grade,
      recommendations: SectorUtils.generateRecommendations(metadata, metrics),
      historicalData: []
    };
  });
};

/**
 * Hook principal pour la gestion des données sectorielles
 */
export const useSectorData = (
  countryCode: string = 'USA',
  config: UseSectorDataConfig = {}
): UseSectorDataReturn => {
  const {
    autoRefresh = false,
    refreshInterval = 30000,
    enableCache = true,
    fallbackData = []
  } = config;

  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Cache des données par pays
  const [cache, setCache] = useState<Map<string, { data: SectorData[], timestamp: number }>>(new Map());

  // Fonction pour charger les données sectorielles
  const loadSectorData = useCallback(async (country: string) => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier le cache
      if (enableCache) {
        const cached = cache.get(country);
        if (cached && Date.now() - cached.timestamp < 300000) { // Cache 5 minutes
          setSectors(cached.data);
          setLastUpdate(new Date(cached.timestamp));
          setLoading(false);
          return;
        }
      }

      // Simuler un appel API avec délai
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Générer les données sectorielles pour le pays
      const sectorData = generateSectorDataByCountry(country);
      
      setSectors(sectorData);
      setLastUpdate(new Date());

      // Mettre en cache
      if (enableCache) {
        setCache(prev => new Map(prev).set(country, {
          data: sectorData,
          timestamp: Date.now()
        }));
      }

    } catch (err) {
      console.error('Erreur lors de la récupération des données sectorielles:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      
      // Utiliser les données de fallback
      if (fallbackData.length > 0) {
        setSectors(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  }, [enableCache, cache, fallbackData]);

  // Charger les données au montage et quand le pays change
  useEffect(() => {
    loadSectorData(countryCode);
  }, [countryCode, loadSectorData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadSectorData(countryCode);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, countryCode, loadSectorData]);

  // Fonction de rafraîchissement manuel
  const refresh = useCallback(() => {
    loadSectorData(countryCode);
  }, [countryCode, loadSectorData]);

  // Calcul des statistiques agrégées
  const stats = useMemo(() => {
    if (!sectors.length) return null;

    const totalAllocation = sectors.reduce((sum, sector) => sum + sector.metrics.allocation, 0);
    const averagePerformance = sectors.reduce((sum, sector) => 
      sum + (sector.metrics.performance * sector.metrics.allocation / 100), 0
    );
    const averageRisk = sectors.reduce((sum, sector) => 
      sum + (sector.metrics.riskScore * sector.metrics.allocation / 100), 0
    );
    
    // Calcul de l'indice de diversification Herfindahl-Hirschman
    const hhi = sectors.reduce((sum, sector) => {
      const weight = sector.metrics.allocation / 100;
      return sum + (weight * weight);
    }, 0);
    const diversificationScore = Math.max(0, (1 - hhi) * 100);

    return {
      totalAllocation,
      averagePerformance,
      averageRisk,
      diversificationScore,
      sectorsCount: sectors.length,
      lastUpdate
    };
  }, [sectors, lastUpdate]);

  return {
    sectors,
    loading,
    error,
    stats,
    refresh,
    lastUpdate
  };
};

