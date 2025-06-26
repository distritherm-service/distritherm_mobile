import React, { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { Devis } from "src/types/Devis";
import { CartItemWithProduct } from "src/types/Cart";
import devisService from "src/services/devisService";
import DevisProductsModalPresenter from "./DevisProductsModalPresenter";

interface DevisProductsModalProps {
  visible: boolean;
  devis: Devis | null;
  onClose: () => void;
}

const DevisProductsModal: React.FC<DevisProductsModalProps> = ({
  visible,
  devis,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<CartItemWithProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalHT, setTotalHT] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);

  const fetchDevisDetails = useCallback(async () => {
    if (!devis?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await devisService.getDevisById(devis.id);
      
      // Extract cart items with products from the response
      const cartItems = response?.cart?.cartItems || [];
      setProducts(cartItems);

      // Calculate totals
      let ht = 0;
      let ttc = 0;
      cartItems.forEach((item: CartItemWithProduct) => {
        ht += item.priceHt * item.quantity;
        ttc += item.priceTtc * item.quantity;
      });
      
      setTotalHT(ht);
      setTotalTTC(ttc);
    } catch (err: any) {
      console.error("Error fetching devis details:", err);
      setError("Impossible de charger les produits du devis");
      Alert.alert("Erreur", "Impossible de charger les produits du devis");
    } finally {
      setLoading(false);
    }
  }, [devis?.id]);

  useEffect(() => {
    if (visible && devis) {
      fetchDevisDetails();
    } else {
      // Reset state when modal is closed
      setProducts([]);
      setError(null);
      setTotalHT(0);
      setTotalTTC(0);
    }
  }, [visible, devis, fetchDevisDetails]);

  const handleRetry = useCallback(() => {
    fetchDevisDetails();
  }, [fetchDevisDetails]);

  return (
    <DevisProductsModalPresenter
      visible={visible}
      devis={devis}
      products={products}
      loading={loading}
      error={error}
      totalHT={totalHT}
      totalTTC={totalTTC}
      onClose={onClose}
      onRetry={handleRetry}
    />
  );
};

export default DevisProductsModal; 