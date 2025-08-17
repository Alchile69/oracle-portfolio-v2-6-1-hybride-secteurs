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
    <Card className="w-full bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="h-5 w-5 text-[#00d4ff]" />
          Sélection du Pays
        </CardTitle>
        <p className="text-sm text-[#cccccc]">
          Mis à jour: {new Date().toLocaleString('fr-FR')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full p-4 bg-[#0f0f23] border border-[#2a2a3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-[#00d4ff] transition-all duration-300 appearance-none cursor-pointer"
            
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2300d4ff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem',
              boxShadow: '0 0 0 2px rgba(0, 212, 255, 0.2)'
            }}

          >
            {countries.map((country) => (
              <option key={country.code} value={country.code} className="bg-[#0f0f23] text-white">
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Indicateur de pays sélectionné */}
        <div className="mt-4 p-3 bg-[#0f0f23] rounded-lg border border-[#2a2a3e]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {countries.find(c => c.code === selectedCountry)?.flag || '🇫🇷'}
            </span>
            <div>
              <p className="text-white font-medium">
                {countries.find(c => c.code === selectedCountry)?.name || 'France'}
              </p>
              <p className="text-[#cccccc] text-sm">
                Pays sélectionné pour l'analyse
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountrySelector;

