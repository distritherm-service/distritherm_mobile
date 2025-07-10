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

console.log('=== EXEMPLES DE CALCUL DE PRIX ===\n');

// CAS 1: Utilisateur pro pour la bonne catégorie
console.log('🔹 CAS 1: Utilisateur PRO pour la catégorie Sanitaires');
const pricingPro = calculateProductPricing(exampleProduct, userProSanitaires);
console.log(`Type de remise: ${pricingPro.type}`);
console.log(`Prix original: ${formatPrice(pricingPro.originalPriceHt)} HT`);
console.log(`Prix réduit: ${formatPrice(pricingPro.discountedPriceHt)} HT`);
console.log(`Pourcentage: ${pricingPro.percentage}%`);
console.log(`Économies: ${formatPrice(pricingPro.savings)}`);
console.log(`✅ RÈGLE: Prix PRO prioritaire, promotion ignorée\n`);

// CAS 2: Utilisateur pro pour une autre catégorie
console.log('🔹 CAS 2: Utilisateur PRO mais pour catégorie Chauffage (différente du produit)');
const pricingProOther = calculateProductPricing(exampleProduct, userProChauffage);
console.log(`Type de remise: ${pricingProOther.type}`);
console.log(`Prix original: ${formatPrice(pricingProOther.originalPriceHt)} HT`);
console.log(`Prix réduit: ${formatPrice(pricingProOther.discountedPriceHt)} HT`);
console.log(`Pourcentage: ${pricingProOther.percentage}%`);
console.log(`Économies: ${formatPrice(pricingProOther.savings)}`);
console.log(`✅ RÈGLE: Promotion appliquée car pas pro pour cette catégorie\n`);

// CAS 3: Utilisateur normal
console.log('🔹 CAS 3: Utilisateur NORMAL (non pro)');
const pricingNormal = calculateProductPricing(exampleProduct, userNormal);
console.log(`Type de remise: ${pricingNormal.type}`);
console.log(`Prix original: ${formatPrice(pricingNormal.originalPriceHt)} HT`);
console.log(`Prix réduit: ${formatPrice(pricingNormal.discountedPriceHt)} HT`);
console.log(`Pourcentage: ${pricingNormal.percentage}%`);
console.log(`Économies: ${formatPrice(pricingNormal.savings)}`);
console.log(`✅ RÈGLE: Promotion appliquée car utilisateur non pro\n`);

// Exemple de calcul pour plusieurs quantités
console.log('🔹 CALCUL POUR DIFFÉRENTES QUANTITÉS:');
const quantities = [1, 2, 5];
quantities.forEach(qty => {
  const total = calculateTotalPrice(pricingPro.discountedPriceHt, qty);
  console.log(`${qty} unité(s): ${formatPrice(total)} HT`);
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