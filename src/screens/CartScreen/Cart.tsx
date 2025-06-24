import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "src/hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import cartsService, {
  CartStatus,
  AddProductDto,
  UpdateCartItemDto,
  RemoveProductDto,
} from "src/services/cartsService";
import devisService, { CreateDeviDto } from "src/services/devisService";
import {
  Cart as CartType,
  CartItem,
  CartItemWithProduct,
} from "src/types/Cart";
import { ProductBasicDto } from "src/types/Product";
import { Alert } from "react-native";
import CartPresenter from "./CartPresenter";

interface CartWithDetails extends CartType {
  cartItems: (CartItem & { product: ProductBasicDto })[];
}

const Cart = () => {
  const { user, isAuthenticated } = useAuth();
  const navigation = useNavigation();

  // State management
  const [cart, setCart] = useState<CartWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
  const [isCreatingDevis, setIsCreatingDevis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate cart totals (no delivery charges)
  const calculateTotals = useCallback(() => {
    if (!cart?.cartItems || cart.cartItems.length === 0) {
      return {
        subTotal: 0,
        discount: 0,
        finalTotal: 0,
        itemCount: 0,
      };
    }

    const subTotal = cart.cartItems.reduce((total, item) => {
      // Use the price from the cart item if available, otherwise use product price
      let price = item.priceTtc;

      // If we have product details and it's in promotion, use promotion price
      if (
        item.product &&
        item.product.isInPromotion &&
        item.product.promotionPrice
      ) {
        price = item.product.promotionPrice;
      } else if (item.product && item.product.priceTtc) {
        price = item.product.priceTtc;
      }

      return total + price * item.quantity;
    }, 0);

    const itemCount = cart.cartItems.reduce(
      (count, item) => count + item.quantity,
      0
    );
    const finalTotal = subTotal;

    return {
      subTotal,
      finalTotal,
      itemCount,
    };
  }, [cart]);

  // Load user's active cart
  const loadCart = useCallback(async () => {
    if (!user?.id || !isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await cartsService.getUserActiveCart(user.id);

      // Handle the API response structure - the cart data is nested inside response.cart
      const rawCartData = response.cart || response; // Fallback to response if cart property doesn't exist

      const cartData: CartWithDetails = {
        ...rawCartData,
        createdAt: new Date(rawCartData.createdAt),
        updatedAt: new Date(rawCartData.updatedAt),
        cartItems:
          rawCartData.cartItems?.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          })) || [],
      };

      setCart(cartData);
    } catch (err: any) {
      console.error("Error loading cart:", err);
      if (err?.response?.status === 404) {
        // No active cart found - this is normal, set empty cart
        setCart(null);
      } else {
        setError("Impossible de charger votre panier");
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated]);

  // Update item quantity
  const updateQuantity = useCallback(
    async (cartItemId: number, newQuantity: number) => {
      if (!cart || newQuantity < 1) return;

      // Add item to loading state
      setLoadingItems((prev) => new Set(prev).add(cartItemId));

      try {
        const updateDto: UpdateCartItemDto = {
          cartId: cart.id,
          cartItemId,
          quantity: newQuantity,
        };

        await cartsService.updateCartItem(updateDto);

              // Update local cart state with new quantity and recalculated price
      setCart((prevCart) => {
        if (!prevCart) return prevCart;
        return {
          ...prevCart,
          cartItems: prevCart.cartItems.map((item) => {
            if (item.id === cartItemId) {
              // Calculate the new price based on the updated quantity
              let unitPrice = item.priceTtc;
              
              // Use promotion price if available, otherwise use regular price
              if (item.product && item.product.isInPromotion && item.product.promotionPrice) {
                unitPrice = item.product.promotionPrice;
              } else if (item.product && item.product.priceTtc) {
                unitPrice = item.product.priceTtc;
              }
              
              return { 
                ...item, 
                quantity: newQuantity,
                priceTtc: unitPrice // Keep the unit price, total will be calculated in UI
              };
            }
            return item;
          }),
        };
      });
      } catch (err: any) {
        console.error("Error updating quantity:", err);
        Alert.alert("Erreur", "Impossible de mettre à jour la quantité");
      } finally {
        // Remove item from loading state
        setLoadingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cartItemId);
          return newSet;
        });
      }
    },
    [cart, loadCart]
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (cartItemId: number) => {
      if (!cart) return;

      // Add item to loading state
      setLoadingItems((prev) => new Set(prev).add(cartItemId));

      try {
        const removeDto: RemoveProductDto = {
          cartId: cart.id,
          cartItemId,
        };

        await cartsService.removeCartItem(removeDto);

        // Immediately remove the item from local state for better UX
        setCart((prevCart) => {
          if (!prevCart) return prevCart;
          return {
            ...prevCart,
            cartItems: prevCart.cartItems.filter(
              (item) => item.id !== cartItemId
            ),
          };
        });

        // Remove item from loading state since it's now removed from the cart
        setLoadingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cartItemId);
          return newSet;
        });
      } catch (err: any) {
        console.error("Error removing item:", err);
        Alert.alert("Erreur", "Impossible de supprimer l'article");

        // Remove item from loading state on error
        setLoadingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cartItemId);
          return newSet;
        });

        // Reload cart to restore the correct state on error
        await loadCart();
      }
    },
    [cart, loadCart]
  );

  // Create devis from cart
  const createDevis = useCallback(async () => {
    if (!cart || cart.cartItems.length === 0 || !user?.id) return;

    setIsCreatingDevis(true);
    try {
      // For now, we'll use a default commercialId (1) since we don't have commercial selection
      // In a real app, you might want to let the user select a commercial or assign one automatically
      const createDeviDto: CreateDeviDto = {
        cartId: cart.id,
        commercialId: 1,
      };

      const devisResponse = await devisService.createDevis(createDeviDto);

      // Update cart status to devis
      await cartsService.updateCartStatus(cart.id, {
        status: CartStatus.IS_DEVIS,
      });

      Alert.alert(
        "Devis créé",
        "Votre demande de devis a été créée avec succès! Un commercial vous contactera bientôt.",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate back to home
              (navigation as any).navigate("Home");
              // Reload cart for next session
              loadCart();
            },
          },
        ]
      );
    } catch (err: any) {
      console.error("Error creating devis:", err);
      Alert.alert(
        "Erreur",
        err?.response?.data?.message || "Impossible de créer le devis"
      );
    } finally {
      setIsCreatingDevis(false);
    }
  }, [cart, user?.id, navigation, loadCart]);

  // Navigate to product details
  const navigateToProduct = useCallback(
    (productId: number) => {
      (navigation as any).navigate("Product", { productId });
    },
    [navigation]
  );

  // Navigate back
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Navigate to login
  const navigateToLogin = useCallback(() => {
    (navigation as any).navigate("Auth", { screen: "Login" });
  }, [navigation]);

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const totals = calculateTotals();

  return (
    <CartPresenter
      cart={cart}
      loading={loading}
      error={error}
      loadingItems={loadingItems}
      isCreatingDevis={isCreatingDevis}
      totals={totals}
      isAuthenticated={isAuthenticated}
      onQuantityUpdate={updateQuantity}
      onRemoveItem={removeItem}
      onCreateDevis={createDevis}
      onProductPress={navigateToProduct}
      onBack={handleBack}
      onRetry={loadCart}
      onNavigateToLogin={navigateToLogin}
    />
  );
};

export default Cart;
