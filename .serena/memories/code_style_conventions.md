# Style et conventions de code

## Conventions de nommage

### Fichiers et dossiers
- **Composants React** : PascalCase (ex: `ExtensibleConfigurationPanel.jsx`)
- **Hooks** : camelCase avec prefix `use` (ex: `useAPI.js`)
- **Utilitaires** : camelCase (ex: `utils.js`)
- **Constants** : kebab-case (ex: `data/countries.json`)
- **Dossiers** : kebab-case (ex: `src/components/`)

### Variables et fonctions
- **Variables** : camelCase (ex: `configData`, `newItemData`)
- **Fonctions** : camelCase (ex: `editItem`, `handleConfigurationClick`)
- **Constantes** : UPPER_SNAKE_CASE si globales
- **Props React** : camelCase (ex: `isVisible`, `onSubmit`)

## Structure des composants React

### Format standard
```jsx
import { useState, useEffect } from 'react'
import { ComponentName } from './components/ComponentName'

const MyComponent = ({ prop1, prop2 = defaultValue }) => {
  const [state, setState] = useState(initialValue)
  
  const handleAction = () => {
    // logique
  }
  
  return (
    <div className="container">
      {/* contenu */}
    </div>
  )
}

export default MyComponent
```

### Hooks et état
- Utiliser **useState** pour l'état local
- Utiliser **useEffect** pour les effets de bord
- Hooks personnalisés dans `src/hooks/`

## Styling avec Tailwind

### Classes utilitaires
- Préfixer les classes : `className="flex items-center justify-between"`
- Responsive : `className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"`
- États : `className="hover:bg-gray-100 focus:ring-2"`

### Composants UI
- Utiliser **Radix UI** comme base
- Étendre avec Tailwind pour le style
- Classe utilitaire `cn()` pour merger les classes

## Conventions ESLint

### Règles actives
```javascript
rules: {
  'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
}
```

### Bonnes pratiques
- **Variables non utilisées** : Préfixer avec `_` si nécessaire
- **Exports** : Un export default par fichier
- **JSX** : Toujours fermer les tags auto-fermants

## Structure des imports

### Ordre recommandé
1. Imports React et hooks
2. Imports de bibliothèques externes
3. Imports de composants locaux
4. Imports de données et utilitaires

```jsx
import { useState, useEffect } from 'react'
import { Button } from '@radix-ui/react-button'
import { MyComponent } from './MyComponent'
import { API_ENDPOINTS } from '../data/constants'
```

## Alias de chemins
- **@** : Alias vers `src/` (défini dans vite.config.js)
- Utilisation : `import { Component } from '@/components/Component'`