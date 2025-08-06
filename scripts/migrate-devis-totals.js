#!/usr/bin/env node

/**
 * Script de migration pour remplacer les utilisations de totalHt/totalTtc
 * par les nouvelles fonctions utilitaires
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SEARCH_DIRS = ['src'];
const FILE_EXTENSIONS = ['.ts', '.tsx'];
const DRY_RUN = process.argv.includes('--dry-run');

// Patterns à remplacer
const REPLACEMENTS = [
  {
    // devis.totalHt -> calculateDevisTotalHt(devis)
    pattern: /(\w+)\.totalHt/g,
    replacement: 'calculateDevisTotalHt($1)',
    importNeeded: "import { calculateDevisTotalHt } from '../utils/devisUtils';"
  },
  {
    // devis.totalTtc -> calculateDevisTotalTtc(devis)
    pattern: /(\w+)\.totalTtc/g,
    replacement: 'calculateDevisTotalTtc($1)',
    importNeeded: "import { calculateDevisTotalTtc } from '../utils/devisUtils';"
  }
];

/**
 * Récupère tous les fichiers TypeScript dans les répertoires spécifiés
 */
function getAllFiles(dir, allFiles = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, allFiles);
    } else if (FILE_EXTENSIONS.some(ext => file.endsWith(ext))) {
      allFiles.push(filePath);
    }
  });
  
  return allFiles;
}

/**
 * Traite un fichier pour remplacer les patterns
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  let hasChanges = false;
  const importsToAdd = new Set();
  
  REPLACEMENTS.forEach(({ pattern, replacement, importNeeded }) => {
    if (pattern.test(content)) {
      newContent = newContent.replace(pattern, replacement);
      hasChanges = true;
      importsToAdd.add(importNeeded);
    }
  });
  
  if (hasChanges) {
    // Ajouter les imports nécessaires
    const imports = Array.from(importsToAdd).join('\n');
    if (!newContent.includes(imports)) {
      // Trouver une position appropriée pour ajouter les imports
      const importMatch = newContent.match(/^import.*from.*['"];$/gm);
      if (importMatch && importMatch.length > 0) {
        // Ajouter après le dernier import existant
        const lastImportIndex = newContent.lastIndexOf(importMatch[importMatch.length - 1]);
        const endOfLastImport = lastImportIndex + importMatch[importMatch.length - 1].length;
        newContent = newContent.slice(0, endOfLastImport) + '\n' + imports + newContent.slice(endOfLastImport);
      } else {
        // Ajouter au début du fichier
        newContent = imports + '\n\n' + newContent;
      }
    }
    
    console.log(`✅ Modifications trouvées dans: ${filePath}`);
    
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`   ⏳ Fichier mis à jour`);
    } else {
      console.log(`   ⏳ [DRY-RUN] Fichier qui serait mis à jour`);
    }
  }
  
  return hasChanges;
}

/**
 * Fonction principale
 */
function main() {
  console.log('🚀 Démarrage de la migration des totaux devis/réservations...\n');
  
  if (DRY_RUN) {
    console.log('📋 Mode DRY-RUN activé - aucun fichier ne sera modifié\n');
  }
  
  let totalFilesProcessed = 0;
  let totalFilesChanged = 0;
  
  SEARCH_DIRS.forEach(dir => {
    console.log(`📂 Traitement du répertoire: ${dir}`);
    
    if (!fs.existsSync(dir)) {
      console.log(`   ⚠️  Répertoire non trouvé: ${dir}`);
      return;
    }
    
    const files = getAllFiles(dir);
    console.log(`   📄 ${files.length} fichiers trouvés`);
    
    files.forEach(file => {
      totalFilesProcessed++;
      const hasChanges = processFile(file);
      if (hasChanges) {
        totalFilesChanged++;
      }
    });
  });
  
  console.log(`\n📊 Résumé:`);
  console.log(`   • Fichiers traités: ${totalFilesProcessed}`);
  console.log(`   • Fichiers modifiés: ${totalFilesChanged}`);
  
  if (DRY_RUN) {
    console.log(`\n💡 Pour appliquer les changements, relancez sans --dry-run`);
  } else if (totalFilesChanged > 0) {
    console.log(`\n✅ Migration terminée avec succès!`);
    console.log(`📚 Consultez DEVIS_RESERVATION_FIX.md pour plus d'informations`);
  } else {
    console.log(`\n✨ Aucune modification nécessaire - le code est déjà à jour!`);
  }
}

// Lancement du script
if (require.main === module) {
  main();
}

module.exports = { processFile, getAllFiles };