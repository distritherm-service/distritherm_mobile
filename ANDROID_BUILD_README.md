# Configuration Android - Build Guide

## ✅ Problèmes résolus

- **App Icon** : Maintenant utilise les adaptive icons Android 
- **Splash Screen** : Configuration custom avec logo centré
- **Build Process** : Pre-build Android optimisé

## 🛠️ Modifications apportées

### 1. `app.json` amélioré
```json
"android": {
  "icon": "./assets/icon.png",
  "package": "com.distritherm.dsapp",
  "adaptiveIcon": {
    "foregroundImage": "./assets/adaptive-icon.png",
    "backgroundColor": "#ffffff"
  },
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  "softwareKeyboardLayoutMode": "pan"
}
```

### 2. Splash Screen personnalisé
- **Fichier** : `android/app/src/main/res/drawable/splashscreen.xml`
- **Style** : `android/app/src/main/res/values/styles.xml`
- **Theme** : `Theme.App.SplashScreen` avec logo centré

### 3. MainActivity mise à jour
- Utilise maintenant `R.style.Theme_App_SplashScreen`
- Transition automatique vers `AppTheme` après le splash

### 4. Assets générés
- **Icons** : Toutes les résolutions (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- **Adaptive Icons** : Support Android 8.0+
- **Splash Screens** : Toutes les densités d'écran

## 🚀 Commandes utiles

### Build standard
```bash
npx expo run:android
```

### Rebuild complet (après modification d'assets)
```bash
./scripts/rebuild-android.sh
```

### Pre-build uniquement
```bash
npx expo prebuild --platform android
```

## 📱 Résultat

L'application Android affiche maintenant :
- ✅ **App icon** : Adaptive icon avec foreground/background
- ✅ **Splash screen** : Logo DS centré sur fond blanc
- ✅ **Bottom bar** : Se cache automatiquement avec le clavier
- ✅ **Keyboard mode** : `adjustPan` pour une UX optimale

## 🔧 Assets requis

Assurez-vous d'avoir ces fichiers dans `/assets/` :
- `icon.png` (512x512px recommandé)
- `adaptive-icon.png` (320x320px recommandé) 
- `splash.png` (1024x1024px recommandé)
- `favicon.png` (pour web)

## 📝 Notes importantes

- Le `softwareKeyboardLayoutMode: "pan"` est crucial pour le bon fonctionnement de la bottom bar
- Les adaptive icons améliorent l'apparence sur Android 8.0+
- Le splash screen suit les guidelines Material Design