/**
 * Composants Tooltip améliorés pour Oracle Portfolio
 * @author Manus AI
 * @version 2.0.0
 * @date 2025-08-08
 */

import React, { useState } from 'react';

export const HelpTooltip = ({ content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="tooltip-container">
      <div 
        className="tooltip-trigger"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <svg 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="help-icon"
        >
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      
      {isVisible && (
        <div className={`tooltip-content tooltip-${position}`}>
          <div className="tooltip-text">{content}</div>
          <div className="tooltip-arrow"></div>
        </div>
      )}

      <style jsx>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
        }

        .tooltip-trigger {
          cursor: help;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .help-icon {
          color: #4a4a5e;
          transition: color 0.2s ease;
        }

        .help-icon:hover {
          color: #00d4ff;
        }

        .tooltip-content {
          position: absolute;
          z-index: 9999;
          background: #1a1a2e;
          border: 1px solid #00d4ff;
          border-radius: 8px;
          padding: 12px 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          min-width: 280px;
          max-width: 400px;
          white-space: normal;
          word-wrap: break-word;
          animation: tooltipFadeIn 0.2s ease-out;
        }

        .tooltip-text {
          font-size: 13px;
          line-height: 1.4;
          color: #ffffff;
          text-align: left;
        }

        .tooltip-top {
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        }

        .tooltip-bottom {
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        }

        .tooltip-left {
          right: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        }

        .tooltip-right {
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        }

        .tooltip-arrow {
          position: absolute;
          width: 0;
          height: 0;
        }

        .tooltip-top .tooltip-arrow {
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #00d4ff;
        }

        .tooltip-bottom .tooltip-arrow {
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid #00d4ff;
        }

        .tooltip-left .tooltip-arrow {
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 6px solid #00d4ff;
        }

        .tooltip-right .tooltip-arrow {
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-right: 6px solid #00d4ff;
        }

        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .tooltip-content {
            min-width: 240px;
            max-width: 300px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export const GradeTooltip = ({ grade }) => {
  const [isVisible, setIsVisible] = useState(false);

  const getGradeInfo = (grade) => {
    const gradeMap = {
      'A': {
        title: 'Grade A - Excellent',
        description: 'Performance exceptionnelle (90%+). Secteur très performant avec faible risque et forte croissance.',
        color: '#00ff88'
      },
      'B': {
        title: 'Grade B - Très Bon',
        description: 'Bonne performance (75-89%). Secteur solide avec risque modéré et croissance stable.',
        color: '#00d4ff'
      },
      'C': {
        title: 'Grade C - Moyen',
        description: 'Performance moyenne (60-74%). Secteur équilibré avec risque et rendement modérés.',
        color: '#ffa502'
      },
      'D': {
        title: 'Grade D - Faible',
        description: 'Performance décevante (45-59%). Secteur sous-performant nécessitant surveillance.',
        color: '#ff6b35'
      },
      'F': {
        title: 'Grade F - Très Faible',
        description: 'Performance très faible (<45%). Secteur à risque élevé, recommandation de réduction.',
        color: '#ff4757'
      }
    };

    return gradeMap[grade] || gradeMap['C'];
  };

  const gradeInfo = getGradeInfo(grade);

  return (
    <div className="grade-tooltip-container">
      <div 
        className={`grade-badge grade-${grade.toLowerCase()}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {grade}
      </div>
      
      {isVisible && (
        <div className="grade-tooltip-content">
          <div className="grade-tooltip-header" style={{ color: gradeInfo.color }}>
            {gradeInfo.title}
          </div>
          <div className="grade-tooltip-description">
            {gradeInfo.description}
          </div>
          <div className="tooltip-arrow"></div>
        </div>
      )}

      <style jsx>{`
        .grade-tooltip-container {
          position: relative;
          display: inline-block;
        }

        .grade-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 14px;
          cursor: help;
          transition: all 0.3s ease;
        }

        .grade-a { background: rgba(0, 255, 136, 0.2); color: #00ff88; border: 1px solid #00ff88; }
        .grade-b { background: rgba(0, 212, 255, 0.2); color: #00d4ff; border: 1px solid #00d4ff; }
        .grade-c { background: rgba(255, 165, 2, 0.2); color: #ffa502; border: 1px solid #ffa502; }
        .grade-d { background: rgba(255, 107, 53, 0.2); color: #ff6b35; border: 1px solid #ff6b35; }
        .grade-f { background: rgba(255, 71, 87, 0.2); color: #ff4757; border: 1px solid #ff4757; }

        .grade-badge:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .grade-tooltip-content {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          background: #1a1a2e;
          border: 1px solid #00d4ff;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          min-width: 320px;
          max-width: 400px;
          white-space: normal;
          word-wrap: break-word;
          animation: tooltipFadeIn 0.2s ease-out;
        }

        .grade-tooltip-header {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .grade-tooltip-description {
          font-size: 13px;
          line-height: 1.4;
          color: #ffffff;
        }

        .tooltip-arrow {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #00d4ff;
        }

        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .grade-tooltip-content {
            min-width: 280px;
            max-width: 320px;
          }
        }
      `}</style>
    </div>
  );
};

export default { HelpTooltip, GradeTooltip };

