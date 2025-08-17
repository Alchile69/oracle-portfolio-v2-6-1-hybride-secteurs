// Oracle Portfolio - Charte Graphique v2.6.1
// Palette de couleurs officielle

export const ORACLE_COLORS = {
  // Couleurs principales
  primary: {
    black: '#0f0f23',        // Arrière-plan principal
    blue: '#1a1a2e',         // Arrière-plan secondaire, cartes
    electric: '#00d4ff',     // Accents, liens, boutons
    white: '#ffffff',        // Texte principal
  },
  
  // Couleurs secondaires
  secondary: {
    darkGray: '#2a2a3e',     // Bordures, séparateurs
    mediumGray: '#4a4a5e',   // Texte secondaire
    success: '#00ff88',      // Indicateurs positifs
    danger: '#ff4757',       // Indicateurs négatifs, erreurs
    warning: '#ffa502',      // Avertissements
    violet: '#667eea',       // Score composite
  },
  
  // Dégradés
  gradients: {
    primary: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
    background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)',
    composite: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }
};

// Classes Tailwind personnalisées
export const ORACLE_CLASSES = {
  // Arrière-plans
  bgPrimary: 'bg-[#0f0f23]',
  bgSecondary: 'bg-[#1a1a2e]',
  bgCard: 'bg-[#1a1a2e] border border-[#2a2a3e]',
  
  // Textes
  textPrimary: 'text-[#ffffff]',
  textSecondary: 'text-[#4a4a5e]',
  textAccent: 'text-[#00d4ff]',
  
  // Boutons
  btnPrimary: 'bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white',
  btnSecondary: 'bg-transparent border-2 border-[#00d4ff] text-[#00d4ff]',
  
  // États
  success: 'text-[#00ff88]',
  danger: 'text-[#ff4757]',
  warning: 'text-[#ffa502]',
};

