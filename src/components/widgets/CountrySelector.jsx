import React from 'react';
import { useCountry } from '../../contexts/CountryContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Settings } from 'lucide-react';

const CountrySelector = () => {
  const { selectedCountry, setSelectedCountry, countries, loading } = useCountry();

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-pink-400" />
            Sélection du Pays
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-10 bg-slate-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-pink-400" />
          Sélection du Pays
        </CardTitle>
        <p className="text-sm text-slate-400">
          Mis à jour: {new Date().toLocaleString('fr-FR')}
        </p>
      </CardHeader>
      <CardContent>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
      </CardContent>
    </Card>
  );
};

export default CountrySelector;

