import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  showIcon = false,
  iconSize = 16,
  className = '',
  delay = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800';
    }
  };

  return (
    <div 
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      
      {showIcon && (
        <HelpCircle 
          size={iconSize} 
          className="ml-1 text-slate-400 hover:text-slate-300 cursor-help" 
        />
      )}

      {isVisible && (
        <div className={`absolute z-50 ${getPositionClasses()}`}>
          <div className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 max-w-xs shadow-lg border border-gray-700">
            {content}
          </div>
          <div className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}></div>
        </div>
      )}
    </div>
  );
};

// Composant spécialisé pour les infobulles d'aide
export const HelpTooltip = ({ content, position = 'top', className = '' }) => {
  return (
    <Tooltip 
      content={content} 
      position={position} 
      showIcon={true}
      className={className}
    >
      <span></span>
    </Tooltip>
  );
};

// Composant pour les grades avec infobulle
export const GradeTooltip = ({ grade, className = '' }) => {
  const getGradeDescription = (grade) => {
    switch (grade) {
      case 'A':
        return 'Excellent - Performance supérieure à 90%. Secteur très performant avec faible risque.';
      case 'B':
        return 'Bon - Performance entre 80-90%. Secteur performant avec risque modéré.';
      case 'C':
        return 'Moyen - Performance entre 70-80%. Secteur stable avec risque équilibré.';
      case 'D':
        return 'Faible - Performance entre 60-70%. Secteur sous-performant avec risque élevé.';
      case 'F':
        return 'Très faible - Performance inférieure à 60%. Secteur en difficulté avec risque très élevé.';
      default:
        return 'Grade non défini';
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'F': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Tooltip content={getGradeDescription(grade)} position="top">
      <div className={`grade-badge inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border cursor-help ${getGradeColor(grade)} ${className}`}>
        {grade}
      </div>
    </Tooltip>
  );
};

export default Tooltip;

