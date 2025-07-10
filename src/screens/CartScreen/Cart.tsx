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
import reservationsService from "@/reservations";
import { CreateReservationDto } from "src/types/Reservation";
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
  const [isCreatingReservation, setIsCreatingReservation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);

  // Calculate cart totals using the actual cartItem prices (already calculated with promotions on backend)
  const calculateTotals = useCallback(() => {
    if (!cart?.cartItems || cart.cartItems.length === 0) {
      return {
        subTotal: 0,
        finalTotal: 0,
        itemCount: 0,
      };
    }

    // Use the priceHt from cartItems for subtotal (HT prices)
    const subTotal = cart.cartItems.reduce((total, item) => {
      return total + (item.priceHt || 0);
    }, 0);

    // Count unique products instead of total quantity
    const itemCount = cart.cartItems.length;

    return {
      subTotal,
      finalTotal: subTotal,
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
          }))
          // Sort cart items by creation date - most recent first
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [],
      };

      setCart(cartData);
    } catch (err: any) {
      console.error("Error loading cart:", err);
      if (err?.response?.status === 404) {
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

        // Reload the cart to get fresh data with updated prices from backend
        await loadCart();
      } catch (err: any) {
        console.error("Error updating quantity:", err);
        Alert.alert("Erreur", "Impossible de mettre à jour la quantité");
        // Reload cart to restore correct state on error
        await loadCart();
      } finally {
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

        // Reload the cart to get fresh data
        await loadCart();
      } catch (err: any) {
        console.error("Error removing item:", err);
        Alert.alert("Erreur", "Impossible de supprimer l'article");
        // Reload cart to restore correct state on error
        await loadCart();
      } finally {
        setLoadingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cartItemId);
          return newSet;
        });
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
      };

     await devisService.createDevis(createDeviDto);

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
              // Navigate back to home tab in bottom bar
              (navigation as any).navigate("Main", { initialTab: "Home" });
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

  // Create reservation from cart
  const createReservation = useCallback(async (reservationData: Omit<CreateReservationDto, 'cartId'>) => {
    if (!cart || cart.cartItems.length === 0 || !user?.id) return;

    setIsCreatingReservation(true);
    try {
      const createReservationDto: CreateReservationDto = {
        cartId: cart.id,
        ...reservationData,
      };

      await reservationsService.createReservation(createReservationDto);

      // Update cart status to reserved
      await cartsService.updateCartStatus(cart.id, {
        status: CartStatus.IS_RESERVED,
      });

      Alert.alert(
        "Réservation créée",
        "Votre réservation a été créée avec succès! Vous recevrez une confirmation par email.",
        [
          {
            text: "OK",
            onPress: () => {
              // Close modal and navigate back to home
              setShowReservationModal(false);
              (navigation as any).navigate("Main", { initialTab: "Home" });
              // Reload cart for next session
              loadCart();
            },
          },
        ]
      );
    } catch (err: any) {
      console.error("Error creating reservation:", err);
      Alert.alert(
        "Erreur",
        err?.response?.data?.message || "Impossible de créer la réservation"
      );
    } finally {
      setIsCreatingReservation(false);
    }
  }, [cart, user?.id, navigation, loadCart]);

  // Handle reservation modal
  const openReservationModal = useCallback(() => {
    setShowReservationModal(true);
  }, []);

  const closeReservationModal = useCallback(() => {
    setShowReservationModal(false);
  }, []);

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
      isCreatingReservation={isCreatingReservation}
      showReservationModal={showReservationModal}
      totals={totals}
      isAuthenticated={isAuthenticated}
      user={user}
      onQuantityUpdate={updateQuantity}
      onRemoveItem={removeItem}
      onCreateDevis={createDevis}
      onCreateReservation={createReservation}
      onOpenReservationModal={openReservationModal}
      onCloseReservationModal={closeReservationModal}
      onProductPress={navigateToProduct}
      onBack={handleBack}
      onRetry={loadCart}
      onNavigateToLogin={navigateToLogin}
    />
  );
};

export default Cart;
