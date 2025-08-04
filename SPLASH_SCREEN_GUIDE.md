# Guide de Configuration du Splash Screen - DS App

## 🎨 Configuration Actuelle

### Splash Screen configuré dans `app.json` :
```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
```

### 📱 Assets Générés

#### iOS :
- ✅ `ios/DS/Images.xcassets/SplashScreenLogo.imageset/`
  - `image.png` (1x)
  - `image@2x.png` (2x)
  - `image@3x.png` (3x)
- ✅ `SplashScreenBackground.colorset/` (couleur de fond)

#### Android :
- ✅ `android/app/src/main/res/drawable-hdpi/splashscreen_logo.png`
- ✅ Généré dans toutes les densités (hdpi, xhdpi, xxhdpi, xxxhdpi)

## ⚙️ Options de Configuration

### ResizeMode :
- **`"contain"`** ✅ : Garde les proportions, logo centré (recommandé)
- **`"cover"`** : Étire pour couvrir l'écran (peut déformer)

### BackgroundColor :
- **Actuel** : `"#ffffff"` (blanc)
- **Recommandation** : Doit correspondre à la couleur de fond de votre image

## 🔄 Commandes Utiles

### Après modification du splash :
```bash
# Regénérer le projet natif (OBLIGATOIRE)
npm run prebuild

# Ou avec nettoyage complet
npm run prebuild-clean
```

### Tester l'application :
```bash
# Démarrer le serveur Expo
expo start

# Puis scanner le QR code avec Expo Go
# ou appuyer sur 'i' pour iOS, 'a' pour Android
```

## 🎯 Optimisations Possibles

### Couleur de fond personnalisée :
Si votre logo a un fond coloré, ajustez la `backgroundColor` :
```json
"backgroundColor": "#1a1a1a"  // Pour un fond sombre
"backgroundColor": "#0066cc"  // Pour un fond bleu DS
```

### Image optimisée :
- **Taille recommandée** : 1242x2436px (ratio iPhone)
- **Format** : PNG avec transparence si nécessaire
- **Poids** : Optimisé pour un chargement rapide

## ✅ Checklist de Vérification

- [x] Configuration splash dans `app.json`
- [x] Image `splash.png` présente dans `/assets/`
- [x] `expo prebuild` exécuté avec succès
- [x] Assets iOS générés dans `Images.xcassets`
- [x] Assets Android générés dans `drawable-*/`
- [ ] Test sur simulateur iOS
- [ ] Test sur émulateur Android
- [ ] Test sur device réel

## 🔧 Dépannage

### Splash screen ne s'affiche pas :
1. Vérifier que `./assets/splash.png` existe
2. Exécuter `npm run prebuild-clean`
3. Redémarrer l'application complètement
4. Vérifier les logs pour erreurs d'image

### Splash screen déformé :
1. Changer `resizeMode` de `"contain"` à `"cover"`
2. Ou ajuster les dimensions de l'image source

---
*Configuré avec succès le $(date)*