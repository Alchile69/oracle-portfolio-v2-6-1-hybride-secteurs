import fs from 'fs-extra';
import path from 'path';

async function copyAPIs() {
  try {
    const apiSourceDir = './api';
    const apiDestDir = './dist/api';
    
    // Vérifier si le dossier api existe
    if (await fs.pathExists(apiSourceDir)) {
      // Copier le dossier api vers dist
      await fs.copy(apiSourceDir, apiDestDir);
      console.log('✅ APIs copiées avec succès vers dist/api/');
    } else {
      console.log('⚠️  Dossier api non trouvé, création d\'un dossier vide');
      await fs.ensureDir(apiDestDir);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la copie des APIs:', error);
    process.exit(1);
  }
}

copyAPIs();
