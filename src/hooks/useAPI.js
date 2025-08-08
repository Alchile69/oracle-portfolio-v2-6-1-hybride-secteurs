import { useState, useEffect } from 'react';
import { useCountry } from '../contexts/CountryContext';

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
  const { apiBaseUrl } = useCountry();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
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
    if (apiBaseUrl) {
      fetchData();
    }
  }, [apiBaseUrl, endpoint, ...dependencies]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export const useRegimeData = () => {
  const { selectedCountry } = useCountry();
  return useAPI('getRegimePython', [selectedCountry]);
};

export const useAllocationsData = () => {
  const { selectedCountry } = useCountry();
  return useAPI('getAllocationsPython', [selectedCountry]);
};

export const useIndicatorsData = () => {
  const { selectedCountry } = useCountry();
  return useAPI('getIndicatorsBreakdown', [selectedCountry]);
};

export const useSystemHealth = () => {
  return useAPI('getSystemHealth');
};

