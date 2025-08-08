import React, { createContext, useContext, useState, useEffect } from 'react';
import countriesData from '../data/countries.json';

const CountryContext = createContext();

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};

export const CountryProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState('FRA');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les données des pays
    if (countriesData && countriesData.countries) {
      setCountries(countriesData.countries);
      setLoading(false);
    }
  }, []);

  const getCountryByCode = (code) => {
    return countries.find(country => country.code === code);
  };

  const getCurrentCountry = () => {
    return getCountryByCode(selectedCountry);
  };

  const value = {
    selectedCountry,
    setSelectedCountry,
    countries,
    loading,
    getCountryByCode,
    getCurrentCountry,
    apiBaseUrl: countriesData.api_base_url || 'https://vgh0i1cowmwm.manus.space'
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
};

