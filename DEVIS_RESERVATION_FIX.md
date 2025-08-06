# Fix Devis et Réservations - Suppression des champs totalHt/totalTtc

## Problème identifié

L'erreur `Null constraint violation on the fields: (total_ht)` se produit car le schéma de base de données **ne contient plus les champs `totalHt` et `totalTtc`** dans les modèles `Devis` et `EReservation`, mais les types TypeScript du frontend les référencent encore.

## Modifications apportées

### 1. Types TypeScript mis à jour

#### `/src/types/Devis.ts`
- ✅ Supprimé `totalHt` et `totalTtc` de l'interface `Devis`
- ✅ Supprimé `totalHt` et `totalTtc` de l'interface `DevisItem`
- ✅ Ajouté la propriété `cartItems` dans `cart` pour accéder aux données du panier

#### `/src/types/Reservation.ts`
- ✅ Supprimé `totalHt` et `totalTtc` de l'interface `EReservation`
- ✅ Supprimé `totalHt` et `totalTtc` de l'interface `ReservationItem`
- ✅ Ajouté la propriété `cartItems` dans `cart` pour accéder aux données du panier

### 2. Fonctions utilitaires créées

#### `/src/utils/devisUtils.ts`
```typescript
// Calcul des totaux pour un devis
import { calculateDevisTotals } from '../utils/devisUtils';

const devis = getDevisFromAPI();
const { totalHt, totalTtc } = calculateDevisTotals(devis);
```

#### `/src/utils/reservationUtils.ts`
```typescript
// Calcul des totaux pour une réservation
import { calculateReservationTotals } from '../utils/reservationUtils';

const reservation = getReservationFromAPI();
const { totalHt, totalTtc } = calculateReservationTotals(reservation);
```

## Comment utiliser les nouvelles fonctions

### Avant (❌ ne fonctionne plus)
```typescript
// Code qui ne fonctionne plus
const devis: Devis = await getDevis(id);
console.log(devis.totalHt, devis.totalTtc); // ❌ Ces champs n'existent plus
```

### Après (✅ solution)
```typescript
import { calculateDevisTotals } from '../utils/devisUtils';

const devis: Devis = await getDevis(id);
const { totalHt, totalTtc } = calculateDevisTotals(devis);
console.log(totalHt, totalTtc); // ✅ Totaux calculés dynamiquement
```

### Exemple complet
```typescript
import { Devis } from '../types/Devis';
import { calculateDevisTotals } from '../utils/devisUtils';

const DevisComponent = ({ devisId }: { devisId: number }) => {
  const [devis, setDevis] = useState<Devis | null>(null);

  useEffect(() => {
    const fetchDevis = async () => {
      const data = await devisService.getById(devisId);
      setDevis(data);
    };
    fetchDevis();
  }, [devisId]);

  if (!devis) return <Loading />;

  const { totalHt, totalTtc } = calculateDevisTotals(devis);

  return (
    <View>
      <Text>Total HT: {totalHt.toFixed(2)} €</Text>
      <Text>Total TTC: {totalTtc.toFixed(2)} €</Text>
    </View>
  );
};
```

## Prochaines étapes

1. **Mise à jour du code existant** : Remplacer toutes les références directes à `devis.totalHt` et `devis.totalTtc` par les fonctions utilitaires
2. **Tests** : Vérifier que tous les écrans utilisant des devis/réservations fonctionnent correctement
3. **Rebuild** : Faire un clean build de l'application pour s'assurer que les changements sont appliqués

## Notes importantes

- Les totaux sont maintenant calculés côté frontend à partir des données du panier
- Cette approche est plus flexible et évite la duplication de données
- S'assurer que les appels API incluent bien les `cartItems` dans la réponse