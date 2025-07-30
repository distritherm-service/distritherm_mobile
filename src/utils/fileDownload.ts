import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

/**
 * Interface pour les options de téléchargement
 */
interface DownloadOptions {
  url: string;
  filename?: string;
  showAlert?: boolean;
}

/**
 * Télécharge un fichier PDF et propose de l'ouvrir ou de le partager
 */
export const downloadPDF = async ({ url, filename, showAlert = true }: DownloadOptions): Promise<boolean> => {
  try {
    // Valider l'URL
    if (!url || typeof url !== 'string') {
      throw new Error('URL invalide');
    }

    // Générer un nom de fichier si non fourni
    const finalFilename = filename || `devis_${Date.now()}.pdf`;
    
    // S'assurer que le fichier a l'extension .pdf
    const pdfFilename = finalFilename.endsWith('.pdf') ? finalFilename : `${finalFilename}.pdf`;

    // Définir le chemin de destination
    const fileUri = `${FileSystem.documentDirectory}${pdfFilename}`;

    // Télécharger le fichier
    const downloadResult = await FileSystem.downloadAsync(url, fileUri);

    if (downloadResult.status !== 200) {
      throw new Error(`Erreur de téléchargement: ${downloadResult.status}`);
    }

    // Vérifier que le fichier a été téléchargé
    const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);
    if (!fileInfo.exists) {
      throw new Error('Le fichier n\'a pas pu être sauvegardé');
    }

    if (showAlert) {
      // Proposer d'ouvrir le fichier
      Alert.alert(
        'Téléchargement réussi',
        `Le fichier "${pdfFilename}" a été téléchargé avec succès.`,
        [
          {
            text: 'OK',
            style: 'default',
          },
          {
            text: 'Ouvrir',
            style: 'default',
            onPress: async () => {
              try {
                // Vérifier si le partage est disponible
                const isAvailable = await Sharing.isAvailableAsync();
                if (isAvailable) {
                  await Sharing.shareAsync(downloadResult.uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Ouvrir le PDF avec...',
                  });
                } else {
                  Alert.alert(
                    'Information', 
                    'Le fichier a été téléchargé dans le dossier Documents de l\'application.'
                  );
                }
              } catch (shareError) {
                console.error('Erreur lors du partage:', shareError);
                Alert.alert(
                  'Information', 
                  'Le fichier a été téléchargé mais impossible de l\'ouvrir automatiquement.'
                );
              }
            },
          },
        ]
      );
    }

    console.log('✅ PDF téléchargé avec succès:', downloadResult.uri);
    return true;

  } catch (error: any) {
    console.error('❌ Erreur lors du téléchargement du PDF:', error);
    
    if (showAlert) {
      const errorMessage = error?.message || 'Une erreur est survenue lors du téléchargement';
      Alert.alert('Erreur de téléchargement', errorMessage);
    }
    
    return false;
  }
};

/**
 * Nettoie les anciens fichiers téléchargés (optionnel)
 * Supprime les fichiers de plus de 7 jours pour éviter l'accumulation
 */
export const cleanupOldDownloads = async (): Promise<void> => {
  try {
    const documentDir = FileSystem.documentDirectory;
    if (!documentDir) return;

    const files = await FileSystem.readDirectoryAsync(documentDir);
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 jours en milliseconds

    for (const file of files) {
      if (file.endsWith('.pdf')) {
        const fileUri = `${documentDir}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        
        if (fileInfo.exists && fileInfo.modificationTime && fileInfo.modificationTime < oneWeekAgo) {
          await FileSystem.deleteAsync(fileUri);
          console.log(`🗑️ Ancien fichier supprimé: ${file}`);
        }
      }
    }
  } catch (error) {
    console.warn('⚠️ Erreur lors du nettoyage des fichiers:', error);
  }
};

/**
 * Obtient la taille des fichiers téléchargés
 */
export const getDownloadedFilesSize = async (): Promise<number> => {
  try {
    const documentDir = FileSystem.documentDirectory;
    if (!documentDir) return 0;

    const files = await FileSystem.readDirectoryAsync(documentDir);
    let totalSize = 0;

    for (const file of files) {
      if (file.endsWith('.pdf')) {
        const fileUri = `${documentDir}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        
        if (fileInfo.exists && fileInfo.size) {
          totalSize += fileInfo.size;
        }
      }
    }

    return totalSize;
  } catch (error) {
    console.warn('⚠️ Erreur lors du calcul de la taille des fichiers:', error);
    return 0;
  }
};