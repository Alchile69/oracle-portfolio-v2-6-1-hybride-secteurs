import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimisations pour réduire la taille des bundles
    rollupOptions: {
      output: {
        // Code splitting automatique
        manualChunks: {
          // Séparer React et React DOM
          'react-vendor': ['react', 'react-dom'],
          // Séparer les librairies UI
          'ui-vendor': ['lucide-react'],
          // Séparer les utilitaires
          'utils-vendor': ['clsx', 'tailwind-merge'],
          // Séparer les composants par module
          'widgets': [
            './src/components/widgets/CountrySelector.jsx',
            './src/components/widgets/RegimeCard.jsx',
            './src/components/widgets/MarketStressCard.jsx',
            './src/components/widgets/AllocationsCard.jsx',
            './src/components/widgets/ETFPricesModule.jsx',
            './src/components/widgets/BacktestingCard.jsx',
            './src/components/widgets/PhysicalIndicatorsCard.jsx'
          ]
        },
        // Optimiser les noms de fichiers
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Compression et optimisation
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger']
    },
    // Limiter la taille des chunks
    chunkSizeWarningLimit: 500,
    // Source maps pour le debug
    sourcemap: false
  },
  // Optimisations de développement
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  },
  // Configuration du serveur
  server: {
    port: 3000,
    host: true
  }
})
