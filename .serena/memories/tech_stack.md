# Tech Stack et Dépendances

## Frameworks principaux
- **React** : 18.3.1
- **Vite** : 6.3.5 (build tool principal)
- **Next.js** : 15.4.6 (architecture hybride)

## UI et Styling
- **Radix UI** : 40+ composants (@radix-ui/react-*)
- **Tailwind CSS** : 4.1.7 avec plugin Vite (@tailwindcss/vite)
- **Lucide React** : 0.510.0 (icônes)
- **Framer Motion** : 12.15.0 (animations)

## Gestion des données
- **React Hook Form** : 7.56.3 avec @hookform/resolvers
- **date-fns** : 3.6.0 ⚠️ CRITIQUE - Ne pas upgrader vers 4.x
- **react-day-picker** : 8.10.1 (compatible avec date-fns 3.6.0)
- **Zod** : 3.24.4 (validation)

## Charts et visualisation
- **Recharts** : 2.15.3

## Routing et navigation
- **React Router DOM** : 7.6.1

## Utilitaires
- **clsx** : 2.1.1
- **tailwind-merge** : 3.3.0
- **class-variance-authority** : 0.7.1

## Outils de développement
- **ESLint** : 9.25.0 avec plugins React
- **Vercel** : 45.0.9 (déploiement)
- **fs-extra** : 11.3.1

## Package Manager
- **pnpm** : 10.4.1+sha512... (défini dans packageManager)

## Versions critiques à respecter
- **date-fns** : Exactement 3.6.0 (pas 4.x) pour éviter les conflits
- **react-day-picker** : 8.10.1 (compatible avec date-fns 3.6.0)
- Installation obligatoire avec **--legacy-peer-deps**