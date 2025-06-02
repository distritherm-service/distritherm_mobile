# Guide de Configuration Google Sign-In - Résolution DEVELOPER_ERROR

## Problème
Erreur `DEVELOPER_ERROR` code 10 lors de la sélection d'un compte Google.

## Solutions étape par étape

### 1. Vérifier la configuration Google Console

#### A. Aller sur [Google Cloud Console](https://console.cloud.google.com/)

#### B. Sélectionner votre projet avec project number `592794634648`

#### C. Aller dans "APIs & Services" > "Credentials"

#### D. Vérifier vos OAuth 2.0 Client IDs :

**Client Web (OBLIGATOIRE pour React Native):**
- Client ID: `592794634648-38n0hj2dhk0frc5tm2o7c3gol5d06clc.apps.googleusercontent.com`
- Type: Web application
- Authorized origins: `http://localhost`, `https://localhost`

**Client Android (pour le fichier google-services.json):**
- Client ID: `592794634648-cq50d6pb3llivmbc6bt5a1jee0ashd86.apps.googleusercontent.com`
- Type: Android
- Package name: `com.anonymous.DS`
- SHA-1: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

### 2. Configuration actuelle

**Votre fingerprint SHA-1 :** `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

**Dans Google Console, assurez-vous que :**
- Le client Android a le bon package name : `com.anonymous.DS`
- Le client Android a le bon SHA-1 fingerprint (ci-dessus)
- Le client Web est configuré correctement

### 3. Vérifier la configuration OAuth Consent Screen

- Aller dans "APIs & Services" > "OAuth consent screen"
- Vérifier que tous les champs obligatoires sont remplis
- Ajouter votre email dans "Test users" si en mode test

### 4. Nettoyer et reconstruire l'app

```bash
# Nettoyer le cache
cd android
./gradlew clean
cd ..

# Reconstruire
npx react-native run-android
```

### 5. Vérifications supplémentaires

#### A. Package name dans android/app/build.gradle
```gradle
android {
    defaultConfig {
        applicationId "com.anonymous.DS"  // Doit correspondre à Google Console
    }
}
```

#### B. Bundle ID dans app.json
```json
{
  "expo": {
    "android": {
      "package": "com.anonymous.DS"
    },
    "ios": {
      "bundleIdentifier": "com.anonymous.DS"
    }
  }
}
```

## Points importants

1. **TOUJOURS utiliser le Web Client ID** dans `GoogleSignin.configure()` : `592794634648-38n0hj2dhk0frc5tm2o7c3gol5d06clc.apps.googleusercontent.com`
2. **Le Android Client ID** est uniquement pour le fichier `google-services.json` : `592794634648-cq50d6pb3llivmbc6bt5a1jee0ashd86.apps.googleusercontent.com`
3. **SHA-1 doit correspondre** exactement à celui de votre keystore
4. **Package name doit être identique** partout

## Test de validation

Après ces modifications, testez avec ce code simple :

```javascript
const testGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log('Success:', userInfo);
  } catch (error) {
    console.log('Error details:', error);
  }
};
```

## Checklist final

- [ ] Client Android configuré avec SHA-1 : `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
- [ ] Package name : `com.anonymous.DS` partout
- [ ] Web Client ID utilisé dans le code React Native
- [ ] OAuth Consent Screen configuré
- [ ] App nettoyée et reconstruite

Si l'erreur persiste, vérifiez les logs détaillés pour identifier le problème spécifique. 