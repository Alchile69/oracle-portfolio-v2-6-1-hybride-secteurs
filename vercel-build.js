import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyAPIs() {
  const sourceDir = path.join(process.cwd(), 'api');
  const targetDir = path.join(process.cwd(), 'dist', 'api');
  
  try {
    // Créer le répertoire de destination s'il n'existe pas
    await fs.ensureDir(targetDir);
    
    // Copier tous les fichiers du dossier api vers dist/api
    await fs.copy(sourceDir, targetDir);
    
    console.log('✅ APIs copiées avec succès vers dist/api/');
  } catch (error) {
    console.error('❌ Erreur lors de la copie des APIs:', error);
    process.exit(1);
  }
}

// Exécuter la copie
copyAPIs();
