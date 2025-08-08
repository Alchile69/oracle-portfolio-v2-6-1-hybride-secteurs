/**
 * Composant AllocationChart - Graphique circulaire interactif pour les allocations sectorielles
 * @author Manus AI
 * @version 3.0.0
 * @date 2025-08-07
 */

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SectorData, 
  SectorType, 
  SECTOR_DEFINITIONS, 
  SectorUtils 
} from '../../types/sector.types';

interface AllocationChartProps {
  sectors: SectorData[];
  width?: number;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  animationDuration?: number;
  onSectorClick?: (sector: SectorData) => void;
  className?: string;
}

interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
  icon: string;
  grade: string;
  performance: number;
  risk: number;
  trend: string;
  sector: SectorData;
}

const AllocationChart: React.FC<AllocationChartProps> = ({
  sectors,
  width,
  height = 400,
  showLegend = true,
  showTooltip = true,
  animationDuration = 1000,
  onSectorClick,
  className = ''
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedSector, setSelectedSector] = useState<SectorData | null>(null);

  // Transformation des données pour le graphique
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!sectors || sectors.length === 0) {
      return [];
    }

    return sectors
      .filter(sector => sector && sector.metrics && sector.metrics.allocation > 0)
      .map(sector => ({
        name: sector.metadata?.name || 'Secteur inconnu',
        value: sector.metrics.allocation,
        color: sector.metadata?.color || '#666666',
        icon: sector.metadata?.icon || '📊',
        grade: sector.grade || 'C',
        performance: sector.metrics.performance || 0,
        risk: sector.metrics.riskScore || 0,
        trend: sector.metrics?.trend ? SectorUtils.getTrendIcon(sector.metrics.trend) : '➡️',
        sector
      }))
      .sort((a, b) => b.value - a.value); // Tri par allocation décroissante
  }, [sectors]);

  // Calcul des statistiques globales
  const stats = useMemo(() => {
    if (!chartData.length) {
      return {
        totalAllocation: '0.0',
        averagePerformance: '0.0',
        averageRisk: '0.0',
        topPerformer: 'N/A',
        sectorsCount: 0
      };
    }

    const totalAllocation = chartData.reduce((sum, item) => sum + item.value, 0);
    const averagePerformance = chartData.reduce((sum, item) => sum + item.performance, 0) / chartData.length;
    const averageRisk = chartData.reduce((sum, item) => sum + item.risk, 0) / chartData.length;
    const topPerformer = chartData.reduce((best, current) => 
      current.performance > best.performance ? current : best, chartData[0]);
    
    return {
      totalAllocation: (typeof totalAllocation === 'number') ? totalAllocation.toFixed(1) : '0.0',
      averagePerformance: (typeof averagePerformance === 'number') ? averagePerformance.toFixed(1) : '0.0',
      averageRisk: (typeof averageRisk === 'number') ? averageRisk.toFixed(1) : '0.0',
      topPerformer: topPerformer?.name || 'N/A',
      sectorsCount: chartData.length
    };
  }, [chartData]);

  // Gestionnaire de survol
  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Gestionnaire de clic
  const handleClick = (data: ChartDataPoint) => {
    setSelectedSector(data.sector);
    onSectorClick?.(data.sector);
  };

  // Composant Tooltip personnalisé
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload as ChartDataPoint;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 rounded-lg shadow-lg border min-w-[250px]"
        style={{ 
          backgroundColor: '#1a1a2e', 
          borderColor: '#00d4ff',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{data.icon}</span>
          <div>
            <h3 className="font-semibold" style={{ color: '#ffffff' }}>
              {data.name}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              data.grade === 'A' ? 'bg-green-100 text-green-800' :
              data.grade === 'B' ? 'bg-blue-100 text-blue-800' :
              data.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
              data.grade === 'D' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              Grade {data.grade}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span style={{ color: '#e5e7eb' }}>Allocation:</span>
            <span className="font-medium" style={{ color: '#e5e7eb' }}>
              {SectorUtils.formatPercentage(data.value)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span style={{ color: '#e5e7eb' }}>Performance:</span>
            <span className={`font-medium ${
              data.performance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.performance >= 0 ? '+' : ''}{SectorUtils.formatPercentage(data.performance)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span style={{ color: '#e5e7eb' }}>Risque:</span>
            <span className="font-medium" style={{ color: '#e5e7eb' }}>
              {(typeof data.risk === 'number') ? data.risk.toFixed(0) : '0'}/100
            </span>
          </div>
          
          <div className="flex justify-between">
            <span style={{ color: '#e5e7eb' }}>Tendance:</span>
            <span className="font-medium" style={{ color: '#e5e7eb' }}>
              {data.trend}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Composant Légende personnalisée
  const CustomLegend = () => (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {chartData.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
            activeIndex === index 
              ? 'scale-105' 
              : 'hover:bg-gray-800'
          }`}
          onClick={() => handleClick(item)}
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs font-medium" style={{ color: '#e5e7eb' }}>
            {item.icon} {item.name}
          </span>
          <span className="text-xs ml-auto" style={{ color: '#e5e7eb' }}>
            {SectorUtils.formatPercentage(item.value, 0)}
          </span>
        </motion.div>
      ))}
    </div>
  );

  // Rendu conditionnel si pas de données
  if (!chartData.length) {
    return (
      <div className={`flex items-center justify-center h-${height} ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium mb-2" style={{ color: '#ffffff' }}>
            Aucune allocation sectorielle
          </h3>
          <p style={{ color: '#e5e7eb' }}>
            Les données sectorielles seront affichées ici une fois disponibles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* En-tête avec statistiques */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: '#ffffff' }}>
            Répartition du portefeuille par secteur d'activité
          </h2>
          <div className="flex items-center gap-4 text-sm" style={{ color: '#e5e7eb' }}>
            <span>{stats.sectorsCount} secteurs</span>
            <span>Total: {stats.totalAllocation}%</span>
          </div>
        </div>
        
        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#1a1a2e', border: '1px solid #00d4ff' }}>
            <div className="text-xs mb-1" style={{ color: '#e5e7eb' }}>
              Performance Moyenne
            </div>
            <div className={`text-lg font-semibold ${
              parseFloat(stats.averagePerformance) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {parseFloat(stats.averagePerformance) >= 0 ? '+' : ''}{stats.averagePerformance}%
            </div>
          </div>
          
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#1a1a2e', border: '1px solid #00d4ff' }}>
            <div className="text-xs mb-1" style={{ color: '#e5e7eb' }}>
              Risque Moyen
            </div>
            <div className="text-lg font-semibold" style={{ color: '#e5e7eb' }}>
              {stats.averageRisk}/100
            </div>
          </div>
          
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#1a1a2e', border: '1px solid #00d4ff' }}>
            <div className="text-xs mb-1" style={{ color: '#e5e7eb' }}>
              Meilleur Secteur
            </div>
            <div className="text-lg font-semibold text-blue-600">
              {stats.topPerformer}
            </div>
          </div>
          
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#1a1a2e', border: '1px solid #00d4ff' }}>
            <div className="text-xs mb-1" style={{ color: '#e5e7eb' }}>
              Diversification
            </div>
            <div className="text-lg font-semibold text-purple-600">
              {chartData.length > 0 ? (() => {
                const score = SectorUtils.calculateDiversificationScore(
                  chartData.map(item => ({ 
                    sectorId: item.sector?.metadata?.id || item.name || 'unknown',
                    allocation: item.value || 0
                  }))
                );
                return (typeof score === 'number') ? score.toFixed(0) : '0';
              })() : '0'}/100
            </div>
          </div>
        </div>
      </div>

      {/* Graphique principal */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={Math.min(height * 0.35, 120)}
              innerRadius={Math.min(height * 0.2, 60)}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={animationDuration}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={activeIndex === index ? '#374151' : 'transparent'}
                  strokeWidth={activeIndex === index ? 2 : 0}
                  style={{
                    filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleClick(entry)}
                />
              ))}
            </Pie>
            
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
          </PieChart>
        </ResponsiveContainer>

        {/* Centre du graphique avec info principale */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>
              {stats.totalAllocation}%
            </div>
            <div className="text-xs" style={{ color: '#e5e7eb' }}>
              Alloué
            </div>
          </div>
        </div>
      </div>

      {/* Légende */}
      {showLegend && <CustomLegend />}

      {/* Modal de détails du secteur sélectionné */}
      <AnimatePresence>
        {selectedSector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedSector(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              style={{ 
                backgroundColor: '#1a1a2e', 
                border: '1px solid #00d4ff',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedSector.metadata.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: '#ffffff' }}>
                      {selectedSector.metadata.name}
                    </h3>
                    <p className="text-sm" style={{ color: '#9ca3af' }}>
                      {selectedSector.metadata.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSector(null)}
                  className="hover:text-gray-600 dark:hover:text-gray-300" style={{ color: '#e5e7eb' }}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#1a1a2e', border: '1px solid #00d4ff' }}>
                    <div className="text-xs mb-1" style={{ color: '#9ca3af' }}>
                      Allocation
                    </div>
                    <div className="text-xl font-semibold" style={{ color: '#e5e7eb' }}>
                      {SectorUtils.formatPercentage(selectedSector.metrics.allocation)}
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#1a1a2e', border: '1px solid #00d4ff' }}>
                    <div className="text-xs mb-1" style={{ color: '#e5e7eb' }}>
                      Grade
                    </div>
                    <div className={`text-xl font-semibold`} style={{ color: SectorUtils.getGradeColor(selectedSector.grade) }}>
                      {selectedSector.grade}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#e5e7eb' }}>Performance</span>
                    <span className={`font-medium ${
                      selectedSector.metrics.performance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedSector.metrics.performance >= 0 ? '+' : ''}
                      {SectorUtils.formatPercentage(selectedSector.metrics.performance)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#e5e7eb' }}>Score de Risque</span>
                    <span className="font-medium" style={{ color: '#e5e7eb' }}>
                      {(selectedSector.metrics?.riskScore && typeof selectedSector.metrics.riskScore === 'number') ? selectedSector.metrics.riskScore.toFixed(0) : '0'}/100
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#e5e7eb' }}>Confiance</span>
                    <span className="font-medium" style={{ color: '#e5e7eb' }}>
                      {(selectedSector.metrics?.confidence && typeof selectedSector.metrics.confidence === 'number') ? selectedSector.metrics.confidence.toFixed(0) : '0'}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#e5e7eb' }}>Tendance</span>
                    <span className="font-medium" style={{ color: '#e5e7eb' }}>
                      {SectorUtils.getTrendIcon(selectedSector.metrics.trend)}
                    </span>
                  </div>
                </div>

                {selectedSector.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: '#ffffff' }}>
                      Recommandations
                    </h4>
                    <ul className="space-y-1">
                      {selectedSector.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm" style={{ color: '#e5e7eb' }}>
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllocationChart;

