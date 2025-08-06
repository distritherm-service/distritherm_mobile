const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Définir les tailles d'icônes Android
const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

// Splash screen géré avec launch_screen.png unique (style Android natif)

// Chemins des assets
const iconPath = path.join(__dirname, '../assets/icon.png');       // 1024x1024
const splashPath = path.join(__dirname, '../assets/splash.png');   // Image splash
const androidResPath = path.join(__dirname, '../android/app/src/main/res');

async function generateAllAndroidAssets() {
  console.log('🎨 Génération COMPLÈTE des assets Android...');
  console.log('📋 Configuration:');
  console.log('   - Icon source: icon.png (1024x1024) → TOUTES les icônes Android');
  console.log('   - Icônes: fond blanc + logo réduit (80% normale, 60% adaptive)');
  console.log('   - Splash source: splash.png → splash screens Android natifs');

  // Vérifier que les fichiers sources existent
  if (!fs.existsSync(iconPath)) {
    console.error('❌ Fichier icon.png non trouvé:', iconPath);
    return;
  }

  if (!fs.existsSync(splashPath)) {
    console.error('❌ Fichier splash.png non trouvé:', splashPath);
    return;
  }

  try {
    // === NETTOYAGE PRÉALABLE ===
    console.log('\n🧹 ÉTAPE 0: Nettoyage des anciens fichiers splash');
    
    // Supprimer tous les anciens fichiers splash qui peuvent causer des conflits
    const oldSplashFiles = [
      'drawable/splashscreen.xml',
      'drawable-mdpi/splashscreen_logo.png',
      'drawable-hdpi/splashscreen_logo.png', 
      'drawable-xhdpi/splashscreen_logo.png',
      'drawable-xxhdpi/splashscreen_logo.png',
      'drawable-xxxhdpi/splashscreen_logo.png'
    ];
    
    let cleanedOldFiles = 0;
    for (const filePath of oldSplashFiles) {
      const fullPath = path.join(androidResPath, filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        cleanedOldFiles++;
      }
    }
    
    console.log(`🗑️ ${cleanedOldFiles} anciens fichiers splash supprimés`);

    // === GÉNÉRATION DES ICÔNES ===
    console.log('\n🔥 ÉTAPE 1: Génération des icônes (toutes basées sur icon.png)');
    
    for (const [folder, size] of Object.entries(iconSizes)) {
      const outputDir = path.join(androidResPath, folder);
      
      // Créer le dossier s'il n'existe pas
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      console.log(`📱 ${folder}: ${size}x${size}px...`);

      // Calculer la taille du logo (80% de la taille de l'icône pour plus de visibilité)
      const logoSize = Math.round(size * 0.8);
      const padding = Math.round((size - logoSize) / 2);

      // 1. Icône principale (ic_launcher.png) avec fond blanc et logo réduit
      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 } // Fond blanc opaque
        }
      })
        .composite([{
          input: await sharp(iconPath)
            .resize(logoSize, logoSize, { 
              kernel: sharp.kernel.lanczos3,
              fit: 'contain',
              position: 'center',
              background: { r: 0, g: 0, b: 0, alpha: 0 } // Fond transparent pour le logo
            })
            .png()
            .toBuffer(),
          top: padding,
          left: padding
        }])
        .png({ quality: 100 })
        .toFile(path.join(outputDir, 'ic_launcher.png'));

      // 2. Icône ronde (ic_launcher_round.png) avec fond blanc et logo réduit
      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 } // Fond blanc opaque
        }
      })
        .composite([{
          input: await sharp(iconPath)
            .resize(logoSize, logoSize, { 
              kernel: sharp.kernel.lanczos3,
              fit: 'contain',
              position: 'center',
              background: { r: 0, g: 0, b: 0, alpha: 0 } // Fond transparent pour le logo
            })
            .png()
            .toBuffer(),
          top: padding,
          left: padding
        }])
        .png({ quality: 100 })
        .toFile(path.join(outputDir, 'ic_launcher_round.png'));

      // 3. Foreground adaptive (ic_launcher_foreground.png) - logo plus petit pour adaptive
      const adaptiveLogoSize = Math.round(size * 0.6); // Plus petit pour l'adaptive (60%)
      const adaptivePadding = Math.round((size - adaptiveLogoSize) / 2);
      
      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Fond transparent pour l'adaptive
        }
      })
        .composite([{
          input: await sharp(iconPath)
            .resize(adaptiveLogoSize, adaptiveLogoSize, { 
              kernel: sharp.kernel.lanczos3,
              fit: 'contain',
              position: 'center',
              background: { r: 0, g: 0, b: 0, alpha: 0 } // Fond transparent pour le logo
            })
            .png()
            .toBuffer(),
          top: adaptivePadding,
          left: adaptivePadding
        }])
        .png({ quality: 100 })
        .toFile(path.join(outputDir, 'ic_launcher_foreground.png'));
    }

    console.log('✅ Toutes les icônes générées avec succès!');

    // === GÉNÉRATION DU LAUNCH SCREEN ===
    console.log('\n🖼️ ÉTAPE 2: Génération du launch_screen (style Android natif)');
    console.log('ℹ️ Reproduction de la structure launch_screen existante');

    // Obtenir les dimensions originales du splash
    const splashMetadata = await sharp(splashPath).metadata();
    console.log(`📐 Splash original: ${splashMetadata.width}x${splashMetadata.height}px`);

    const drawableDir = path.join(androidResPath, 'drawable');
    if (!fs.existsSync(drawableDir)) {
      fs.mkdirSync(drawableDir, { recursive: true });
    }

    // Générer launch_screen.png dans drawable (image unique)
    console.log('🖼️ Génération de launch_screen.png...');
    await sharp(splashPath)
      .png({ 
        quality: 100,
        compressionLevel: 0, // Qualité maximale
        progressive: false
      })
      .toFile(path.join(drawableDir, 'launch_screen.png'));

    // Générer le fichier layout launch_screen.xml
    const layoutDir = path.join(androidResPath, 'layout');
    if (!fs.existsSync(layoutDir)) {
      fs.mkdirSync(layoutDir, { recursive: true });
    }

    const launchScreenXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" android:layout_width="match_parent"
    android:layout_height="match_parent">
    <ImageView android:layout_width="match_parent" android:layout_height="match_parent" android:src="@drawable/launch_screen" android:scaleType="centerCrop" />
</RelativeLayout>`;

    fs.writeFileSync(path.join(layoutDir, 'launch_screen.xml'), launchScreenXmlContent);
    console.log('📄 Fichier launch_screen.xml généré');

    // Vérifier/Créer le thème SplashTheme dans styles.xml
    const valuesDir = path.join(androidResPath, 'values');
    const stylesPath = path.join(valuesDir, 'styles.xml');
    
    if (!fs.existsSync(valuesDir)) {
      fs.mkdirSync(valuesDir, { recursive: true });
    }

    // Créer ou mettre à jour styles.xml avec le thème Theme.App.SplashScreen
    const stylesContent = `<resources>

    <!-- Base application theme. -->
    <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
        <!-- Customize your theme here. -->
        <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
        <item name="android:windowIsTranslucent">true</item>
    </style>

    <!-- Splash Screen Theme - TOUJOURS CLAIR (ne s'adapte pas au mode sombre) -->
    <style name="Theme.App.SplashScreen" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="android:windowBackground">@drawable/launch_screen</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
        <item name="android:windowIsTranslucent">false</item>
        <!-- Forcer le mode clair pour la barre de statut -->
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:statusBarColor">@android:color/white</item>
        <!-- Forcer le mode clair pour la barre de navigation -->
        <item name="android:windowLightNavigationBar">true</item>
        <item name="android:navigationBarColor">@android:color/white</item>
    </style>

</resources>`;

    fs.writeFileSync(stylesPath, stylesContent);
    console.log('📄 Fichier styles.xml mis à jour avec Theme.App.SplashScreen');

    // Corriger le fichier ic_launcher_background.xml pour éviter les conflits
    const icLauncherBackgroundContent = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
  <path android:fillColor="#ffffff"
        android:pathData="M0,0h108v108h-108z"/>
</vector>`;

    fs.writeFileSync(path.join(drawableDir, 'ic_launcher_background.xml'), icLauncherBackgroundContent);
    console.log('📄 Fichier ic_launcher_background.xml corrigé (fond blanc simple)');

    // Vérifier/Créer le fichier colors.xml si nécessaire
    const colorsPath = path.join(valuesDir, 'colors.xml');
    if (!fs.existsSync(colorsPath)) {
      const colorsContent = `<resources>
  <color name="splashscreen_background">#ffffff</color>
  <color name="iconBackground">#ffffff</color>
  <color name="colorPrimary">#023c69</color>
  <color name="colorPrimaryDark">#ffffff</color>
</resources>`;
      
      fs.writeFileSync(colorsPath, colorsContent);
      console.log('📄 Fichier colors.xml créé avec les couleurs de base');
    }

    console.log('✅ Launch screen généré avec succès (style Android natif)!');

    // === NETTOYAGE DES ANCIENS FICHIERS ===
    console.log('\n🧹 ÉTAPE 3: Nettoyage des anciens fichiers .webp...');
    
    let cleanedFiles = 0;
    for (const folder of Object.keys(iconSizes)) {
      const outputDir = path.join(androidResPath, folder);
      const webpFiles = ['ic_launcher.webp', 'ic_launcher_round.webp', 'ic_launcher_foreground.webp'];
      
      for (const webpFile of webpFiles) {
        const webpPath = path.join(outputDir, webpFile);
        if (fs.existsSync(webpPath)) {
          fs.unlinkSync(webpPath);
          cleanedFiles++;
        }
      }
    }
    
    console.log(`🗑️ ${cleanedFiles} anciens fichiers .webp supprimés`);

    // === RÉSUMÉ FINAL ===
    console.log('\n🎉 GÉNÉRATION TERMINÉE !');
    console.log('📊 Résumé:');
    console.log(`   - ${Object.keys(iconSizes).length * 3} icônes générées (normale + ronde + foreground)`);
    console.log(`   - 1 launch_screen.png + 1 layout XML + 1 styles.xml + 1 colors.xml (Android complet)`);
    console.log(`   - ${cleanedFiles} anciens fichiers nettoyés`);
    console.log('\n🚀 Vous pouvez maintenant rebuilder votre app Android !');
    console.log('💡 Commande: npx expo run:android');

  } catch (error) {
    console.error('❌ Erreur lors de la génération des assets:', error);
  }
}

// === VÉRIFICATION DES DIMENSIONS ===
async function checkSourceDimensions() {
  try {
    const iconMetadata = await sharp(iconPath).metadata();
    const splashMetadata = await sharp(splashPath).metadata();
    
    console.log('📐 Vérification des dimensions sources:');
    console.log(`   - icon.png: ${iconMetadata.width}x${iconMetadata.height}px`);
    console.log(`   - splash.png: ${splashMetadata.width}x${splashMetadata.height}px`);
    
    if (iconMetadata.width !== 1024 || iconMetadata.height !== 1024) {
      console.warn('⚠️ ATTENTION: icon.png n\'est pas en 1024x1024px - résultat peut être différent');
    }
    
    if (splashMetadata.width === 0 || splashMetadata.height === 0) {
      console.warn('⚠️ ATTENTION: Problème avec les dimensions de splash.png');
    }
  } catch (error) {
    console.warn('⚠️ Impossible de vérifier les dimensions des fichiers sources');
  }
}

// Exécuter le script
async function main() {
  await checkSourceDimensions();
  await generateAllAndroidAssets();
}

main();