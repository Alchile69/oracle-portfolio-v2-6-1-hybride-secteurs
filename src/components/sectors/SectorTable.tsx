/**
 * Composant SectorTable - Table complète avec tri automatique pour les secteurs d'activité
 * @author Manus AI
 * @version 3.0.0
 * @date 2025-08-07
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { 
  SectorData, 
  SectorType, 
  TrendDirection,
  SectorGrade,
  SectorUtils 
} from '../../types/sector.types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface SectorTableProps {
  sectors: SectorData[];
  onSectorClick?: (sector: SectorData) => void;
  className?: string;
  showPagination?: boolean;
  itemsPerPage?: number;
}

type SortField = 'name' | 'allocation' | 'performance' | 'risk' | 'grade' | 'trend';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

const SectorTable: React.FC<SectorTableProps> = ({
  sectors,
  onSectorClick,
  className = '',
  showPagination = false,
  itemsPerPage = 10
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'allocation', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Tri des données
  const sortedSectors = useMemo(() => {
    const sorted = [...sectors].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.field) {
        case 'name':
          aValue = a.metadata.name;
          bValue = b.metadata.name;
          break;
        case 'allocation':
          aValue = a.metrics.allocation;
          bValue = b.metrics.allocation;
          break;
        case 'performance':
          aValue = a.metrics.performance;
          bValue = b.metrics.performance;
          break;
        case 'risk':
          aValue = a.metrics.riskScore;
          bValue = b.metrics.riskScore;
          break;
        case 'grade':
          // Conversion des grades en valeurs numériques pour le tri
          const gradeValues = { A: 5, B: 4, C: 3, D: 2, F: 1 };
          aValue = gradeValues[a.grade as keyof typeof gradeValues];
          bValue = gradeValues[b.grade as keyof typeof gradeValues];
          break;
        case 'trend':
          // Conversion des tendances en valeurs numériques
          const trendValues = { up: 3, stable: 2, down: 1 };
          aValue = trendValues[a.metrics.trend as keyof typeof trendValues];
          bValue = trendValues[b.metrics.trend as keyof typeof trendValues];
          break;
        default:
          aValue = a.metrics.allocation;
          bValue = b.metrics.allocation;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [sectors, sortConfig]);

  // Pagination
  const paginatedSectors = useMemo(() => {
    if (!showPagination) return sortedSectors;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedSectors.slice(startIndex, endIndex);
  }, [sortedSectors, currentPage, itemsPerPage, showPagination]);

  const totalPages = Math.ceil(sortedSectors.length / itemsPerPage);

  // Gestionnaire de tri
  const handleSort = (field: SortField) => {
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Calcul des statistiques de résumé
  const summaryStats = useMemo(() => {
    const totalAllocation = sortedSectors.reduce((sum, sector) => sum + sector.metrics.allocation, 0);
    const averagePerformance = sortedSectors.reduce((sum, sector) => sum + sector.metrics.performance, 0) / sortedSectors.length;
    const averageRisk = sortedSectors.reduce((sum, sector) => sum + sector.metrics.riskScore, 0) / sortedSectors.length;
    
    return {
      totalAllocation: (typeof totalAllocation === 'number') ? totalAllocation.toFixed(1) : '0.0',
      averagePerformance: (typeof averagePerformance === 'number') ? averagePerformance.toFixed(1) : '0.0',
      averageRisk: (typeof averageRisk === 'number') ? averageRisk.toFixed(1) : '0.0',
      sectorsCount: sortedSectors.length
    };
  }, [sortedSectors]);

  if (!sectors.length) {
    return (
      <div className="sector-table-empty">
        <div className="empty-icon">📊</div>
        <h3 className="empty-title">Aucune donnée sectorielle</h3>
        <p className="empty-description">
          Les données sectorielles seront affichées ici une fois disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className={`sector-table-container ${className}`}>
      {/* En-tête avec statistiques de résumé */}
      <div className="table-header">
        <div className="header-content">
          <h2 className="table-title">Analyse Sectorielle Détaillée</h2>
          <div className="sectors-count">{summaryStats.sectorsCount} secteurs</div>
        </div>
        
        <div className="summary-stats">
          <div className="summary-stat">
            <div className="stat-value primary">{summaryStats.totalAllocation}%</div>
            <div className="stat-label">Allocation Totale</div>
          </div>
          
          <div className="summary-stat">
            <div className={`stat-value ${parseFloat(summaryStats.averagePerformance) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(summaryStats.averagePerformance) >= 0 ? '+' : ''}{summaryStats.averagePerformance}%
            </div>
            <div className="stat-label">Performance Moyenne</div>
          </div>
          
          <div className="summary-stat">
            <div className="stat-value warning">{summaryStats.averageRisk}/100</div>
            <div className="stat-label">Risque Moyen</div>
          </div>
        </div>
      </div>

      {/* Tableau avec design Oracle Portfolio */}
      <div className="table-wrapper">
        <table className="sector-table">
          <thead className="table-head">
            <tr>
              <th className="table-header-cell" onClick={() => handleSort('name')}>
                <div className="header-content">
                  <span>Secteur</span>
                  <HelpTooltip content="Secteur d'activité économique avec icône et description" />
                  {sortConfig.field === 'name' && (
                    sortConfig.direction === 'desc' ? <ChevronDown size={16} /> : <ChevronUp size={16} />
                  )}
                </div>
              </th>
              <th className="table-header-cell" onClick={() => handleSort('allocation')}>
                <div className="header-content">
                  <span>Allocation</span>
                  <HelpTooltip content="Pourcentage d'allocation du portefeuille dans ce secteur" />
                  {sortConfig.field === 'allocation' && (
                    sortConfig.direction === 'desc' ? <ChevronDown size={16} /> : <ChevronUp size={16} />
                  )}
                </div>
              </th>
              <th className="table-header-cell" onClick={() => handleSort('performance')}>
                <div className="header-content">
                  <span>Performance</span>
                  <HelpTooltip content="Performance du secteur sur les 12 derniers mois en pourcentage" />
                  {sortConfig.field === 'performance' && (
                    sortConfig.direction === 'desc' ? <ChevronDown size={16} /> : <ChevronUp size={16} />
                  )}
                </div>
              </th>
              <th className="table-header-cell" onClick={() => handleSort('risk')}>
                <div className="header-content">
                  <span>Risque</span>
                  <HelpTooltip content="Score de risque de 0 à 100 basé sur la volatilité et les corrélations" />
                  {sortConfig.field === 'risk' && (
                    sortConfig.direction === 'desc' ? <ChevronDown size={16} /> : <ChevronUp size={16} />
                  )}
                </div>
              </th>
              <th className="table-header-cell" onClick={() => handleSort('grade')}>
                <div className="header-content">
                  <span>Grade</span>
                  <HelpTooltip content="Note de A (excellent) à F (très faible) basée sur la performance globale" />
                  {sortConfig.field === 'grade' && (
                    sortConfig.direction === 'desc' ? <ChevronDown size={16} /> : <ChevronUp size={16} />
                  )}
                </div>
              </th>
              <th className="table-header-cell" onClick={() => handleSort('trend')}>
                <div className="header-content">
                  <span>Tendance</span>
                  <HelpTooltip content="Tendance récente : haussière (📈), baissière (📉) ou stable (➡️)" />
                  {sortConfig.field === 'trend' && (
                    sortConfig.direction === 'desc' ? <ChevronDown size={16} /> : <ChevronUp size={16} />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="table-body">
            {paginatedSectors.map((sector, index) => (
              <motion.tr
                key={sector.metadata.id}
                className="table-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSectorClick?.(sector)}
              >
                <td className="table-cell">
                  <div className="sector-info">
                    <span className="sector-icon">{sector.metadata.icon}</span>
                    <div className="sector-details">
                      <div className="sector-name">{sector.metadata.name}</div>
                      <div className="sector-description">{sector.metadata.description}</div>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="allocation-cell">
                    <div className="allocation-value">{(sector.metrics?.allocation && typeof sector.metrics.allocation === 'number') ? sector.metrics.allocation.toFixed(1) : '0.0'}%</div>
                    <div className="allocation-bar">
                      <div 
                        className="allocation-fill"
                        style={{ 
                          width: `${sector.metrics.allocation}%`,
                          backgroundColor: sector.metadata.color 
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <div className={`performance-value ${sector.metrics.performance >= 0 ? 'positive' : 'negative'}`}>
                    {sector.metrics.performance >= 0 ? '+' : ''}{(sector.metrics?.performance && typeof sector.metrics.performance === 'number') ? sector.metrics.performance.toFixed(1) : '0.0'}%
                  </div>
                </td>
                <td className="table-cell">
                  <div className="risk-cell">
                    <div className="risk-value">{(sector.metrics?.riskScore && typeof sector.metrics.riskScore === 'number') ? sector.metrics.riskScore.toFixed(0) : '0'}</div>
                    <div className="risk-bar">
                      <div 
                        className="risk-fill"
                        style={{ width: `${sector.metrics.riskScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <GradeTooltip grade={sector.grade} />
                </td>
                <td className="table-cell">
                  <div className="trend-cell">
                    {sector.metrics.trend === TrendDirection.UP && <TrendingUp className="trend-icon trend-up" />}
                    {sector.metrics.trend === TrendDirection.DOWN && <TrendingDown className="trend-icon trend-down" />}
                    {sector.metrics.trend === TrendDirection.STABLE && <Minus className="trend-icon trend-stable" />}
                    <span className="trend-label">
                      {sector.metrics.trend === TrendDirection.UP ? 'Up' :
                       sector.metrics.trend === TrendDirection.DOWN ? 'Down' : 'Stable'}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination si activée */}
      {showPagination && totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span className="pagination-info">
            Page {currentPage} sur {totalPages}
          </span>
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}

      <style>{`
        .sector-table-container {
          background: #1a1a2e;
          border: 1px solid #2a2a3e;
          border-radius: 12px;
          overflow: hidden;
        }

        .sector-table-empty {
          background: #1a1a2e;
          border: 1px solid #2a2a3e;
          border-radius: 12px;
          padding: 48px;
          text-align: center;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 8px 0;
        }

        .empty-description {
          color: #4a4a5e;
          margin: 0;
        }

        .table-header {
          padding: 24px;
          border-bottom: 1px solid #2a2a3e;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .table-title {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .sectors-count {
          font-size: 14px;
          color: #e5e7eb;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .summary-stat {
          text-align: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-value.primary { color: #00d4ff; }
        .stat-value.positive { color: #00ff88; }
        .stat-value.negative { color: #ff4757; }
        .stat-value.warning { color: #ffa502; }

        .stat-label {
          font-size: 12px;
          color: #e5e7eb;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .sector-table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-head {
          background: #0f0f23;
        }

        .table-header-cell {
          padding: 16px 20px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          color: #e5e7eb;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 1px solid #2a2a3e;
        }

        .table-header-cell:hover {
          background: rgba(0, 212, 255, 0.1);
          color: #00d4ff;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .table-body {
          background: #1a1a2e;
        }

        .table-row {
          border-bottom: 1px solid #2a2a3e;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .table-row:hover {
          background: rgba(0, 212, 255, 0.05);
        }

        .table-cell {
          padding: 16px 20px;
          vertical-align: middle;
        }

        .sector-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sector-icon {
          font-size: 24px;
        }

        .sector-details {
          flex: 1;
        }

        .sector-name {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 2px;
        }

        .sector-description {
          font-size: 12px;
          color: #e5e7eb;
        }

        .allocation-cell {
          min-width: 120px;
        }

        .allocation-value {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .allocation-bar {
          width: 100%;
          height: 4px;
          background: #2a2a3e;
          border-radius: 2px;
          overflow: hidden;
        }

        .allocation-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.8s ease;
        }

        .performance-value {
          font-weight: 600;
          font-size: 16px;
        }

        .performance-value.positive { color: #00ff88; }
        .performance-value.negative { color: #ff4757; }

        .risk-cell {
          min-width: 80px;
        }

        .risk-value {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .risk-bar {
          width: 60px;
          height: 4px;
          background: #2a2a3e;
          border-radius: 2px;
          overflow: hidden;
        }

        .risk-fill {
          height: 100%;
          background: linear-gradient(90deg, #00ff88 0%, #ffa502 50%, #ff4757 100%);
          border-radius: 2px;
          transition: width 0.8s ease;
        }

        .trend-cell {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .trend-icon {
          width: 16px;
          height: 16px;
        }

        .trend-icon.trend-up { color: #00ff88; }
        .trend-icon.trend-down { color: #ff4757; }
        .trend-icon.trend-stable { color: #4a4a5e; }

        .trend-label {
          font-size: 12px;
          color: #4a4a5e;
          text-transform: capitalize;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border-top: 1px solid #2a2a3e;
        }

        .pagination-btn {
          background: #00d4ff;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #0099cc;
          transform: translateY(-1px);
        }

        .pagination-btn:disabled {
          background: #2a2a3e;
          color: #4a4a5e;
          cursor: not-allowed;
        }

        .pagination-info {
          color: #4a4a5e;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .summary-stats {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .table-header-cell,
          .table-cell {
            padding: 12px 16px;
          }
          
          .sector-description {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SectorTable;

