import { useState, useEffect } from 'react';

// Configuration Backend Python (Cloud Run)
const BACKEND_BASE_URL = 'https://oracle-backend-yrvjzoj3aa-uc.a.run.app';

// Hook pour les données de régime économique
export const useRegimeData = (selectedCountry) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegimeData = async () => {
      try {
        setLoading(true);
        
        // Appel vers le backend Python
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
        // Le backend Python retourne { success: true, data: {...} }
        setData(result.success ? result.data : result);
      } catch (err) {
        console.error('Erreur lors de la récupération des données de régime:', err);
        setError(err.message);
        
        // Fallback vers données simulées
        setData({
          current: "EXPANSION",
          confidence: 85,
          trend: "stable",
          indicators: {
            croissance: 2.5,
            inflation: 2.8,
            chomage: 7.5
          },
          data_status: "SIMULÉ"
        });
      } finally {
        setLoading(false);
      }
    };

    if (selectedCountry) {
      fetchRegimeData();
    }
  }, [selectedCountry]);

  return { data, loading, error };
};

// Hook pour les allocations
export const useAllocationsData = (selectedCountry) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllocationsData = async () => {
      try {
        setLoading(true);
        
        // Appel vers le backend Python
        const response = await fetch(`${BACKEND_BASE_URL}/api/allocations/get?country=${selectedCountry}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        // Le backend Python retourne { success: true, data: {...} }
        setData(result.success ? result.data : result);
      } catch (err) {
        console.error('Erreur lors de la récupération des allocations:', err);
        setError(err.message);
        
        // Fallback vers données simulées
        setData({
          actions: 60,
          obligations: 30,
          alternatifs: 10,
          data_status: "SIMULÉ"
        });
      } finally {
        setLoading(false);
      }
    };

    if (selectedCountry) {
      fetchAllocationsData();
    }
  }, [selectedCountry]);

  return { data, loading, error };
};

// Hook pour les indicateurs physiques
export const useIndicatorsData = (selectedCountry) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndicatorsData = async () => {
      try {
        setLoading(true);
        
        // Appel vers le backend Python
        const response = await fetch(`${BACKEND_BASE_URL}/api/indicators/breakdown?country=${selectedCountry}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        // Le backend Python retourne { success: true, data: {...} }
        setData(result.success ? result.data : result);
      } catch (err) {
        console.error('Erreur lors de la récupération des indicateurs:', err);
        setError(err.message);
        
        // Fallback vers données simulées
        setData({
          indicators_breakdown: {
            copper: { current_value: 8400, trend: 'up', impact: 'positive' },
            oil: { current_value: 75, trend: 'stable', impact: 'neutral' },
            gold: { current_value: 1940, trend: 'up', impact: 'positive' }
          },
          overall_score: 0.65,
          data_status: "SIMULÉ"
        });
      } finally {
        setLoading(false);
      }
    };

    if (selectedCountry) {
      fetchIndicatorsData();
    }
  }, [selectedCountry]);

  return { data, loading, error };
};

