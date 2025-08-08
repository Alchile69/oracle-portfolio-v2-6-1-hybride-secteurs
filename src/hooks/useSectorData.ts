import { useState, useEffect, useCallback, useMemo } from 'react';
import { SectorData, SectorType, SECTOR_DEFINITIONS, SectorUtils } from '../types/sector.types';

// Configuration du hook
interface UseSectorDataConfig {
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableCache?: boolean;
  fallbackData?: SectorData[];
  useRealData?: boolean;
}

// Type de retour du hook
interface UseSectorDataReturn {
  sectors: SectorData[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  stats?: {
    averagePerformance: number;
    averageRisk: number;
    diversificationScore: number;
  };
  refresh: () => Promise<void>;
  clearCache: () => void;
}

/**
 * Hook pour récupérer les données sectorielles par pays
 * Utilise maintenant les Serverless Functions Vercel pour les vraies données
 */
export const useSectorData = (
  countryCode: string = 'USA',
  config: UseSectorDataConfig = {}
): UseSectorDataReturn => {
  const {
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
    enableCache = true,
    fallbackData = [],
    useRealData = true // Réactivé avec serverless functions
  } = config;

  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fonction principale de récupération des données
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Chargement des données sectorielles via API pour ${countryCode}...`);

      if (useRealData) {
        // Appel à la serverless function Vercel
        const response = await fetch(`/api/sectors/${countryCode}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.sectors) {
            console.log(`✅ Données sectorielles chargées: ${data.sectors.length} secteurs`);
            console.log(`📊 Source: ${data.source}`);
            
            setSectors(data.sectors);
            setLastUpdate(new Date());
            
            // Cache les données si activé
            if (enableCache) {
              const cacheKey = `sectors_${countryCode}`;
              const cacheData = {
                sectors: data.sectors,
                timestamp: Date.now()
              };
              localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            }
            
            return;
          }
        }
        
        throw new Error('Erreur lors de la récupération des données API');
      }

      // Fallback sur données simulées si useRealData = false
      console.log(`🔄 Utilisation des données de fallback pour ${countryCode}...`);
      const fallbackSectors = generateFallbackSectors(countryCode);
      setSectors(fallbackSectors);
      setLastUpdate(new Date());

    } catch (error) {
      console.error('Erreur lors du chargement des secteurs:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      
      // En cas d'erreur, utiliser les données de fallback
      console.log(`🔄 Fallback après erreur pour ${countryCode}...`);
      const fallbackSectors = generateFallbackSectors(countryCode);
      setSectors(fallbackSectors);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  }, [countryCode, useRealData, enableCache]);

  // Fonction de génération de données de fallback
  const generateFallbackSectors = useCallback((countryCode: string): SectorData[] => {
    const countryMultipliers = {
      'FRA': { tech: 1.0, finance: 1.2, healthcare: 1.1, industrials: 1.1, energy: 0.9 },
      'USA': { tech: 1.5, finance: 1.3, healthcare: 1.2, industrials: 1.0, energy: 1.1 },
      'CHN': { tech: 1.2, finance: 1.0, healthcare: 0.9, industrials: 1.4, energy: 1.2 },
      'DEU': { tech: 1.1, finance: 1.1, healthcare: 1.2, industrials: 1.3, energy: 1.0 },
      'GBR': { tech: 1.2, finance: 1.4, healthcare: 1.1, industrials: 0.9, energy: 1.0 },
      'JPN': { tech: 1.3, finance: 1.0, healthcare: 1.1, industrials: 1.2, energy: 0.8 },
      'CAN': { tech: 1.0, finance: 1.2, healthcare: 1.0, industrials: 1.1, energy: 1.3 },
      'AUS': { tech: 0.9, finance: 1.1, healthcare: 1.0, industrials: 1.2, energy: 1.4 }
    };

    const multipliers = countryMultipliers[countryCode] || countryMultipliers['USA'];
    const sectors: SectorData[] = [];

    // Secteurs de base avec leurs allocations
    const baseSectors = [
      { type: SectorType.TECHNOLOGY, allocation: 18, performance: 12.5, risk: 78 },
      { type: SectorType.FINANCE, allocation: 16, performance: 8.2, risk: 69 },
      { type: SectorType.HEALTHCARE, allocation: 14, performance: 9.8, risk: 47 },
      { type: SectorType.INDUSTRY, allocation: 12, performance: 7.1, risk: 63 },
      { type: SectorType.ENERGY, allocation: 10, performance: 15.3, risk: 82 },
      { type: SectorType.CONSUMER, allocation: 8, performance: 6.9, risk: 58 },
      { type: SectorType.COMMUNICATION, allocation: 7, performance: 11.2, risk: 71 },
      { type: SectorType.MATERIALS, allocation: 6, performance: 4.8, risk: 76 },
      { type: SectorType.UTILITIES, allocation: 4, performance: 3.2, risk: 32 },
      { type: SectorType.REAL_ESTATE, allocation: 3, performance: 5.7, risk: 54 },
      { type: SectorType.SERVICES, allocation: 2, performance: 8.9, risk: 61 }
    ];

    for (const baseSector of baseSectors) {
      const metadata = SECTOR_DEFINITIONS[baseSector.type];
      if (!metadata) continue;

      const sectorMultiplier = getSectorMultiplier(baseSector.type, multipliers);
      const adjustedPerformance = baseSector.performance * sectorMultiplier + (Math.random() - 0.5) * 4;
      const adjustedAllocation = baseSector.allocation * sectorMultiplier;

      sectors.push({
        metadata,
        metrics: {
          allocation: adjustedAllocation,
          performance: adjustedPerformance,
          risk: baseSector.risk + (Math.random() - 0.5) * 10,
          volatility: baseSector.risk / 2.5,
          confidence: 80 + Math.random() * 15,
          trend: adjustedPerformance > 0 ? 'up' : adjustedPerformance < -2 ? 'down' : 'stable'
        },
        grade: SectorUtils.calculateGrade(adjustedPerformance),
        recommendations: SectorUtils.generateRecommendations(metadata, {
          allocation: adjustedAllocation,
          performance: adjustedPerformance,
          risk: baseSector.risk,
          volatility: baseSector.risk / 2.5,
          confidence: 80,
          trend: adjustedPerformance > 0 ? 'up' : 'stable'
        }),
        historicalData: []
      });
    }

    // Normaliser les allocations pour totaliser 100%
    const totalAllocation = sectors.reduce((sum, sector) => sum + sector.metrics.allocation, 0);
    if (totalAllocation > 0) {
      sectors.forEach(sector => {
        sector.metrics.allocation = (sector.metrics.allocation / totalAllocation) * 100;
      });
    }

    return sectors;
  }, []);

  // Fonction utilitaire pour les multiplicateurs sectoriels
  const getSectorMultiplier = (sectorType: SectorType, multipliers: any): number => {
    const sectorMap = {
      [SectorType.TECHNOLOGY]: multipliers.tech,
      [SectorType.FINANCE]: multipliers.finance,
      [SectorType.HEALTHCARE]: multipliers.healthcare,
      [SectorType.INDUSTRY]: multipliers.industrials,
      [SectorType.ENERGY]: multipliers.energy,
      [SectorType.CONSUMER]: multipliers.tech * 0.8,
      [SectorType.COMMUNICATION]: multipliers.tech * 0.9,
      [SectorType.MATERIALS]: multipliers.industrials * 0.8,
      [SectorType.UTILITIES]: multipliers.energy * 0.7,
      [SectorType.REAL_ESTATE]: multipliers.finance * 0.8,
      [SectorType.SERVICES]: multipliers.industrials * 0.9
    };
    return sectorMap[sectorType] || 1.0;
  };

  // Fonction de rafraîchissement manuel
  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Fonction de nettoyage du cache
  const clearCache = useCallback(() => {
    const cacheKey = `sectors_${countryCode}`;
    localStorage.removeItem(cacheKey);
    console.log(`🗑️ Cache supprimé pour ${countryCode}`);
  }, [countryCode]);

  // Vérification du cache au montage
  useEffect(() => {
    if (enableCache && useRealData) {
      const cacheKey = `sectors_${countryCode}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        try {
          const { sectors: cachedSectors, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > refreshInterval;
          
          if (!isExpired && cachedSectors && cachedSectors.length > 0) {
            console.log(`📦 Utilisation du cache pour ${countryCode}`);
            setSectors(cachedSectors);
            setLastUpdate(new Date(timestamp));
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn('Erreur lors de la lecture du cache:', error);
        }
      }
    }
    
    fetchData();
  }, [countryCode, enableCache, useRealData, refreshInterval, fetchData]);

  // Auto-refresh si activé
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log(`🔄 Auto-refresh des données sectorielles pour ${countryCode}`);
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, countryCode, fetchData]);

  // Calcul des statistiques
  const stats = useMemo(() => {
    if (!sectors || sectors.length === 0) {
      return {
        averagePerformance: 0,
        averageRisk: 0,
        diversificationScore: 0
      };
    }

    // Performance moyenne pondérée
    const totalAllocation = sectors.reduce((sum, sector) => sum + (sector.metrics?.allocation || 0), 0);
    const averagePerformance = totalAllocation > 0 
      ? sectors.reduce((sum, sector) => {
          const allocation = sector.metrics?.allocation || 0;
          const performance = sector.metrics?.performance || 0;
          return sum + (performance * allocation / totalAllocation);
        }, 0)
      : 0;

    // Risque moyen pondéré
    const averageRisk = totalAllocation > 0
      ? sectors.reduce((sum, sector) => {
          const allocation = sector.metrics?.allocation || 0;
          const risk = sector.metrics?.risk || 0;
          return sum + (risk * allocation / totalAllocation);
        }, 0)
      : 0;

    // Score de diversification (Herfindahl-Hirschman inversé)
    const herfindahl = sectors.reduce((sum, sector) => {
      const allocation = (sector.metrics?.allocation || 0) / 100;
      return sum + (allocation * allocation);
    }, 0);
    const diversificationScore = Math.max(0, (1 - herfindahl) * 100);

    return {
      averagePerformance,
      averageRisk,
      diversificationScore
    };
  }, [sectors]);

  return {
    sectors,
    loading,
    error,
    lastUpdate,
    stats,
    refresh,
    clearCache
  };
};

