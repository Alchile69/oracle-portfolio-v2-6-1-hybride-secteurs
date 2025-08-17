import { useState, useEffect } from 'react';
import { useCountry } from '../contexts/CountryContext';

// STRUCTURE 2 - Backend Python Cloud Run URLs
const BACKEND_BASE_URL = 'https://oracle-backend-yrvjzoj3aa-uc.a.run.app';

// Données de fallback pour les régimes économiques
const FALLBACK_REGIME_DATA = {
  FRA: { regime: 'EXPANSION', confidence: 0.85, indicators: { growth: 0.025, inflation: 0.028, unemployment: 0.075 } },
  USA: { regime: 'EXPANSION', confidence: 0.90, indicators: { growth: 0.032, inflation: 0.031, unemployment: 0.065 } },
  CHN: { regime: 'RECOVERY', confidence: 0.75, indicators: { growth: 0.055, inflation: 0.022, unemployment: 0.055 } },
  JPN: { regime: 'STAGFLATION', confidence: 0.70, indicators: { growth: 0.012, inflation: 0.035, unemployment: 0.028 } },
  DEU: { regime: 'EXPANSION', confidence: 0.82, indicators: { growth: 0.028, inflation: 0.029, unemployment: 0.058 } },
  IND: { regime: 'EXPANSION', confidence: 0.88, indicators: { growth: 0.068, inflation: 0.045, unemployment: 0.078 } },
  GBR: { regime: 'RECOVERY', confidence: 0.77, indicators: { growth: 0.022, inflation: 0.033, unemployment: 0.042 } },
  ITA: { regime: 'STAGFLATION', confidence: 0.65, indicators: { growth: 0.015, inflation: 0.038, unemployment: 0.085 } },
  BRA: { regime: 'RECOVERY', confidence: 0.72, indicators: { growth: 0.035, inflation: 0.055, unemployment: 0.095 } },
  CAN: { regime: 'EXPANSION', confidence: 0.83, indicators: { growth: 0.029, inflation: 0.027, unemployment: 0.052 } },
  RUS: { regime: 'RECESSION', confidence: 0.80, indicators: { growth: -0.015, inflation: 0.088, unemployment: 0.048 } },
  KOR: { regime: 'EXPANSION', confidence: 0.86, indicators: { growth: 0.031, inflation: 0.025, unemployment: 0.035 } },
  ESP: { regime: 'RECOVERY', confidence: 0.74, indicators: { growth: 0.024, inflation: 0.032, unemployment: 0.125 } },
  AUS: { regime: 'EXPANSION', confidence: 0.81, indicators: { growth: 0.026, inflation: 0.030, unemployment: 0.038 } },
  MEX: { regime: 'RECOVERY', confidence: 0.73, indicators: { growth: 0.033, inflation: 0.042, unemployment: 0.035 } }
};

export const useAPI = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BACKEND_BASE_URL}/${endpoint}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Protection contre les données malformées
      if (result && typeof result === 'object') {
        // S'assurer que les arrays sont bien des arrays (sauf indicators qui est un objet)
        if (result.services && !Array.isArray(result.services)) {
          result.services = [];
        }
        if (result.chartData && !Array.isArray(result.chartData)) {
          result.chartData = [];
        }
      }
      
      setData(result);
    } catch (err) {
      console.warn(`API call failed for ${endpoint}, using fallback data:`, err);
      setError(err.message);
      
      // Utiliser les données de fallback pour certains endpoints
      if (endpoint === 'getRegimePython') {
        const { selectedCountry } = dependencies.length > 0 ? { selectedCountry: dependencies[0] } : { selectedCountry: 'FRA' };
        const fallbackData = FALLBACK_REGIME_DATA[selectedCountry] || FALLBACK_REGIME_DATA.FRA;
        setData({
          ...fallbackData,
          success: true,
          timestamp: new Date().toISOString(),
          source: 'fallback'
        });
        setError(null); // Clear error since we have fallback data
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, ...dependencies]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

// STRUCTURE 2 - Hooks spécifiques pour Cloud Run
export const useRegimeData = () => {
  const { selectedCountry } = useCountry();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegimeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${BACKEND_BASE_URL}/api/regimes/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ country: selectedCountry })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.success ? result.data : result);
      } catch (err) {
        console.warn(`Regime API call failed, using fallback data:`, err);
        setError(err.message);
        
        // Fallback data
        const fallbackData = FALLBACK_REGIME_DATA[selectedCountry] || FALLBACK_REGIME_DATA.FRA;
        setData({
          ...fallbackData,
          success: true,
          timestamp: new Date().toISOString(),
          source: 'fallback'
        });
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCountry) {
      fetchRegimeData();
    }
  }, [selectedCountry]);

  return { data, loading, error, refetch: () => {} };
};

export const useAllocationsData = () => {
  const { selectedCountry } = useCountry();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllocationsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${BACKEND_BASE_URL}/api/allocations/get?country=${selectedCountry}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.success ? result.data : result);
      } catch (err) {
        console.warn(`Allocations API call failed, using fallback data:`, err);
        setError(err.message);
        
        // Fallback data
        setData({
          actions: 60,
          obligations: 30,
          alternatives: 10,
          data_status: 'SIMULÉ',
          country: selectedCountry,
          success: true,
          timestamp: new Date().toISOString(),
          source: 'fallback'
        });
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCountry) {
      fetchAllocationsData();
    }
  }, [selectedCountry]);

  return { data, loading, error, refetch: () => {} };
};

export const useIndicatorsData = () => {
  const { selectedCountry } = useCountry();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndicatorsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${BACKEND_BASE_URL}/api/indicators/breakdown?country=${selectedCountry}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.success ? result.data : result);
      } catch (err) {
        console.warn(`Indicators API call failed, using fallback data:`, err);
        setError(err.message);
        
        // Fallback data
        setData({
          indicators_breakdown: {
            copper: { current_value: 8400, trend: 'up', impact: 0.7 },
            oil: { current_value: 75, trend: 'down', impact: 0.6 },
            steel: { current_value: 4200, trend: 'stable', impact: 0.5 }
          },
          score_composite: 0.65,
          data_status: 'SIMULÉ',
          country: selectedCountry,
          success: true,
          timestamp: new Date().toISOString(),
          source: 'fallback'
        });
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCountry) {
      fetchIndicatorsData();
    }
  }, [selectedCountry]);

  return { data, loading, error, refetch: () => {} };
};

// Hooks pour les autres données (Firebase Functions ou données simulées)
export const useMarketStressData = () => {
  const { selectedCountry } = useCountry();
  return useAPI('market-stress', [selectedCountry]);
};

export const useMarketData = () => {
  const { selectedCountry } = useCountry();
  return useAPI('market-data', [selectedCountry]);
};

export const useBacktestingData = () => {
  const { selectedCountry } = useCountry();
  return useAPI('backtesting', [selectedCountry]);
};

export const useSystemHealth = () => {
  return useAPI('getSystemHealth');
};

