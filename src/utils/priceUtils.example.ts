/**
 * EXEMPLE D'UTILISATION DU SYSTÈME DE PRIX PRO/PROMOTION
 * 
 * Ce fichier montre comment utiliser la logique centralisée pour gérer
 * les prix professionnels et les promotions selon les règles métier.
 */

import { calculateProductPricing, formatPrice, calculateTotalPrice } from './priceUtils';
import { ProductBasicDto } from '../types/Product';
import { UserProInfoDto } from '../types/User';

// Exemple de produit avec informations pro et promotion
const exampleProduct: ProductBasicDto = {
  id: 1,
  name: 'Climatiseur réversible Midea Inverter 9000 BTU',
  priceHt: 699.99,
  priceTtc: 839.99,
  quantity: 18,
  description: 'Climatiseur réversible inverter mural haute performance',
  categoryId: 3,
  markId: 7,
  imagesUrl: ['https://example.com/image.jpg'],
  unity: 'unité',
  category: { id: 3, name: 'Chauffage' },
  mark: { id: 7, name: 'Atlantic' },
  isInPromotion: true,
  promotionPrice: 713.99,
  promotionPercentage: 15,
  promotionEndDate: new Date('2025-09-08T22:00:00.000Z'),
  isFavorited: false,
  proInfo: {
    isPro: true,
    categoryIdPro: 12,
    categoryProName: 'Sanitaires',
    percentage: 10,
    proPriceHt: 629.99,
    proPriceTtc: 755.99
  }
};

// Utilisateur pro dans la catégorie Sanitaires (correspond au produit)
const userProSanitaires: UserProInfoDto = {
  isPro: true,
  categoryIdPro: 12,
  categoryProName: 'Sanitaires',
  percentage: 10
};

// Utilisateur pro dans une autre catégorie
const userProChauffage: UserProInfoDto = {
  isPro: true,
  categoryIdPro: 3,
  categoryProName: 'Chauffage',
  percentage: 15
};

// Utilisateur normal (non pro)
const userNormal = null;

// CAS 1: Utilisateur pro pour la bonne catégorie
// 🔹 CAS 1: Utilisateur PRO pour la catégorie Sanitaires
const pricingPro = calculateProductPricing(exampleProduct, userProSanitaires);
// Type de remise: PRO
// Prix original: 699.99 HT
// Prix réduit: 629.99 HT
// Pourcentage: 10%
// ✅ RÈGLE: Prix PRO prioritaire, promotion ignorée

// CAS 2: Utilisateur pro pour une autre catégorie
// 🔹 CAS 2: Utilisateur PRO mais pour catégorie Chauffage (différente du produit)
const pricingProOther = calculateProductPricing(exampleProduct, userProChauffage);
// Type de remise: PROMOTION
// Prix original: 699.99 HT
// Prix réduit: 594.99 HT (promotion 15%)
// Pourcentage: 15%
// ✅ RÈGLE: Promotion appliquée car pas pro pour cette catégorie

// CAS 3: Utilisateur normal
// 🔹 CAS 3: Utilisateur NORMAL (non pro)
const pricingNormal = calculateProductPricing(exampleProduct, userNormal);
// Type de remise: PROMOTION
// Prix original: 699.99 HT
// Prix réduit: 594.99 HT (promotion 15%)
// Pourcentage: 15%
// ✅ RÈGLE: Promotion appliquée car utilisateur non pro

// Exemple de calcul pour plusieurs quantités
// 🔹 CALCUL POUR DIFFÉRENTES QUANTITÉS:
const quantities = [1, 2, 5];
quantities.forEach(qty => {
  const total = calculateTotalPrice(pricingPro.discountedPriceHt, qty);
  // ${qty} unité(s): ${total} HT
});

/*
RÉSUMÉ DES RÈGLES MÉTIER:

1. 📋 UTILISATEUR PRO + CATÉGORIE CORRESPONDANTE
   → Prix pro appliqué automatiquement
   → Promotions IGNORÉES (prix pro prioritaire)
   → Badge vert avec icône 👨‍💼

2. 📋 UTILISATEUR PRO + CATÉGORIE DIFFÉRENTE
   → Prix promotion si disponible
   → Sinon prix normal
   → Badge rouge avec icône 🔥 (si promotion)

3. 📋 UTILISATEUR NORMAL
   → Prix promotion si disponible
   → Sinon prix normal
   → Badge rouge avec icône 🔥 (si promotion)

4. 📋 PROMOTIONS EXPIRÉES
   → Automatiquement ignorées par vérification de date
   → Retour au prix normal ou pro selon le cas
*/ 