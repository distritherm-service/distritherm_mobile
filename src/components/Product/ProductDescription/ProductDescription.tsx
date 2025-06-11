import React, { useState, useEffect } from 'react';
import { ProductDetailDto } from 'src/types/Product';
import ProductDescriptionPresenter from './ProductDescriptionPresenter';

interface ProductDescriptionProps {
  product: ProductDetailDto;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  // Check if description exists and has content
  const hasDescription = Boolean(product.description && product.description.trim().length > 0);
  // const hasDescription = Boolean(product.description && product.description.trim().length > 0);
  
  // Set default tab: if no description, start with details; otherwise start with description
  const [activeTab, setActiveTab] = useState<'description' | 'details'>(
    hasDescription ? 'description' : 'details'
  );

  const handleTabChange = (tab: 'description' | 'details') => {
    setActiveTab(tab);
  };

  // Prepare product details data
  const getProductDetails = () => {
    const details = [];
    
    if (product.productDetail) {
      const { productDetail } = product;
      
      if (productDetail.itemCode) {
        details.push({ label: 'Code article', value: productDetail.itemCode });
      }
      
      if (productDetail.designation1) {
        details.push({ label: 'Désignation', value: productDetail.designation1 });
      }
      
      if (productDetail.designation2) {
        details.push({ label: 'Désignation 2', value: productDetail.designation2 });
      }
      
      if (productDetail.complementDesignation) {
        details.push({ label: 'Complément de désignation', value: productDetail.complementDesignation });
      }
      
      if (productDetail.packaging) {
        details.push({ label: 'Conditionnement', value: productDetail.packaging });
      }
      
      if (productDetail.packagingType) {
        details.push({ label: 'Type de conditionnement', value: productDetail.packagingType });
      }
      
      if (productDetail.weight) {
        details.push({ label: 'Poids', value: `${productDetail.weight} kg` });
      }
      
      if (productDetail.unity) {
        details.push({ label: 'Unité', value: productDetail.unity });
      }
      
      if (productDetail.familyCode) {
        details.push({ label: 'Code famille', value: productDetail.familyCode });
      }
      
      if (productDetail.ecoContributionPercentage) {
        details.push({ 
          label: 'Éco-contribution', 
          value: `${productDetail.ecoContributionPercentage}%` 
        });
      }
      
      if (productDetail.label) {
        details.push({ label: 'Label', value: productDetail.label });
      }
    }

    // Add basic product info
    if (product.priceHt) {
      details.push({ label: 'Prix HT', value: `${product.priceHt.toFixed(2)} €` });
    }
    details.push({ label: 'Prix TTC', value: `${product.priceTtc.toFixed(2)} €` });
    
    if (product.category) {
      details.push({ label: 'Catégorie', value: product.category.name });
    }
    
    if (product.mark) {
      details.push({ label: 'Marque', value: product.mark.name });
    }

    return details;
  };

  const productDetails = getProductDetails();
  const hasDetails = productDetails.length > 0;

  // Effect to switch to details tab if description becomes unavailable
  useEffect(() => {
    if (!hasDescription && hasDetails && activeTab === 'description') {
      setActiveTab('details');
    }
  }, [hasDescription, hasDetails, activeTab]);

  return (
    <ProductDescriptionPresenter
      product={product}
      activeTab={activeTab}
      hasDescription={hasDescription}
      hasDetails={hasDetails}
      productDetails={productDetails}
      onTabChange={handleTabChange}
    />
  );
};

export default ProductDescription; 