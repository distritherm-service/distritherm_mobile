# 🎯 Assets Android - Solution Unifiée

## ✅ Problème résolu

Vous aviez des icônes et splash screens par défaut au lieu de vos vraies images. Maintenant, **UN SEUL SCRIPT** génère TOUT à partir de vos assets !

## 📸 Configuration des assets

Placez vos images dans `/assets/` :

- **`icon.png`** (1024x1024px) → Utilisé pour TOUTES les icônes :
  - `ic_launcher.png` (icône normale)
  - `ic_launcher_round.png` (icône ronde)
  - `ic_launcher_foreground.png` (foreground adaptive)

- **`splash.png`** (1242x2436px) → Utilisé pour tous les splash screens :
  - Généré pour toutes les densités Android (mdpi → xxxhdpi)
  - Proportions préservées avec fond blanc

## 🚀 Commandes

### Génération simple (recommandée)
```bash
# Génère TOUS les assets Android en une commande
node scripts/generate-all-android-assets.js
```

### Script bash pratique
```bash
# Version avec interface plus jolie
./scripts/android-assets.sh
```

### Rebuild complet
```bash
# Clean + prebuild + assets + build
./scripts/rebuild-android.sh
```

## 📊 Ce qui est généré

Le script unifié génère automatiquement :

### Icônes (15 fichiers)
- **5 densités** × **3 types** = 15 icônes
- Toutes basées sur votre `icon.png` (1024x1024)
- Tailles : 48px → 192px selon la densité

### Splash Screens (5 fichiers)
- **5 densités** avec proportions de votre `splash.png`
- Dimensions adaptées : 320x627px → 1280x2508px
- Fond blanc, image centrée

### Nettoyage automatique
- Supprime les anciens `.webp` générés par Expo
- Remplace par vos vraies images en `.png`

## 🔧 Configuration technique

### Adaptive Icons
```xml
<!-- android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml -->
<adaptive-icon>
    <background android:drawable="@color/iconBackground"/>  <!-- Blanc -->
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>  <!-- Votre icon.png -->
</adaptive-icon>
```

### Splash Screen
```xml
<!-- android/app/src/main/res/drawable/splashscreen.xml -->
<layer-list>
    <item android:drawable="@color/splashscreen_background"/>  <!-- Fond blanc -->
    <item android:gravity="center">
        <bitmap android:src="@drawable/splashscreen_logo"/>  <!-- Votre splash.png -->
    </item>
</layer-list>
```

## 🎯 Avantages de cette solution

1. **UN SEUL SCRIPT** → Génère tout automatiquement
2. **Vos vraies images** → Plus d'icônes par défaut
3. **Toutes les densités** → Support optimal sur tous Android
4. **Adaptive icons** → Compatible Android 8.0+
5. **Proportions préservées** → Vos images ne sont pas déformées
6. **Nettoyage automatique** → Supprime les anciens fichiers

## 🏃‍♂️ Workflow recommandé

1. Mettez vos images dans `/assets/` :
   - `icon.png` (1024x1024px)
   - `splash.png` (1242x2436px)

2. Générez les assets :
   ```bash
   node scripts/generate-all-android-assets.js
   ```

3. Buildez l'app :
   ```bash
   npx expo run:android
   ```

4. ✅ **Votre app affiche maintenant VOS vraies icônes et splash screen !**

## 📝 Notes importantes

- Le script vérifie automatiquement les dimensions de vos images
- Les proportions sont préservées (pas de déformation)
- Compatible avec tous les Android 5.0+ (API 21+)
- Fond blanc par défaut (modifiable dans `colors.xml`)

---

**Fini les icônes par défaut ! 🎉**