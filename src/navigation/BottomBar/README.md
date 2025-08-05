# Bottom Bar avec Gestion du Clavier

## Problème Résolu

La bottom bar était visible au-dessus du clavier lors de la saisie, ce qui créait une mauvaise expérience utilisateur.

## Solution Implementée

### 1. Hook personnalisé `useKeyboard`

Création d'un hook robuste pour détecter l'état du clavier :

- Utilise `keyboardWillShow`/`keyboardWillHide` sur iOS pour une synchronisation parfaite
- Utilise `keyboardDidShow`/`keyboardDidHide` sur Android
- Filtre les faux positifs (hauteur < 50px)
- Récupère la durée d'animation native du clavier

### 2. Animation synchronisée

- Animation de translation `translateY` pour cacher/afficher la bottom bar
- Durée d'animation dynamique basée sur l'événement clavier natif
- Utilisation de `useNativeDriver` pour des performances optimales

### 3. Gestion des interactions

- `pointerEvents="none"` quand la bottom bar est cachée
- Évite les touches accidentelles sur la zone cachée

## Avantages de cette approche

1. **Fiabilité** : Basée sur les meilleures pratiques mentionnées dans les issues React Navigation
2. **Performance** : Animations natives avec `useNativeDriver`
3. **Cross-platform** : Comportement optimisé pour iOS et Android
4. **Maintenabilité** : Code modulaire avec hook réutilisable

## Alternatives considérées

1. `tabBarHideOnKeyboard: true` - Nécessiterait une refonte complète avec `@react-navigation/bottom-tabs`
2. `react-native-keyboard-controller` - Dépendance externe supplémentaire
3. `react-native-avoid-softinput` - Ne convient pas aux bottom bars personnalisées

## Tests recommandés

- [ ] Test sur iPhone avec different types de claviers
- [ ] Test sur Android avec clavier tiers
- [ ] Test en mode paysage
- [ ] Test avec InputAccessoryView
- [ ] Test avec clavier flottant (iPad)

## Structure des fichiers

```
BottomBar/
├── BottomBar.tsx              # Container logic
├── BottomBarPresenter.tsx     # UI et animation logic
├── useKeyboard.ts             # Hook de détection clavier
└── README.md                  # Cette documentation
```