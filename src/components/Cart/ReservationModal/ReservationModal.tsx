import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Animated, Dimensions, Keyboard, ScrollView, StatusBar } from "react-native";
import { CreateReservationDto, EReservation } from "src/types/Reservation";
import ReservationModalPresenter from "./ReservationModalPresenter";

const { height: screenHeight } = Dimensions.get("window");

// Form data interface
export interface ReservationFormData {
  pickupDate: string;
  pickupTimeSlot: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
}

interface ReservationModalProps {
  visible: boolean;
  user?: any;
  isCreatingReservation: boolean;
  existingReservation?: EReservation;
  mode?: 'create' | 'view';
  onClose: () => void;
  onCreateReservation: (data: Omit<CreateReservationDto, 'cartId'>) => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  visible,
  user,
  isCreatingReservation,
  existingReservation,
  mode = 'create',
  onClose,
  onCreateReservation,
}) => {
  // Animation values
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Keyboard detection state
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Scroll indicator state
  const [scrollIndicator, setScrollIndicator] = useState({
    showTop: false,
    showBottom: false,
  });
  const scrollViewRef = useRef<ScrollView>(null);

  // Calculate available height and dynamic modal height
  const statusBarHeight = StatusBar.currentHeight || 0;
  const availableHeight = screenHeight - statusBarHeight;
  const modalHeight = isKeyboardVisible 
    ? availableHeight * 0.55  // Plus compact avec clavier pour laisser plus d'espace
    : availableHeight * 0.85;

  // Helper function to get default values
  const getDefaultValues = (): ReservationFormData => {
    if (existingReservation && mode === 'view') {
      return {
        pickupDate: existingReservation.pickupDate 
          ? new Date(existingReservation.pickupDate).toLocaleDateString('fr-FR')
          : '',
        pickupTimeSlot: existingReservation.pickupTimeSlot || '',
        customerName: existingReservation.customerName || '',
        customerPhone: existingReservation.customerPhone || '',
        customerEmail: existingReservation.customerEmail || '',
        notes: existingReservation.notes || '',
      };
    }
    return {
      pickupDate: '',
      pickupTimeSlot: '',
      customerName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
      customerPhone: user?.phoneNumber || '',
      customerEmail: user?.email || '',
      notes: '',
    };
  };

  // useForm hook for better form management
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ReservationFormData>({
    defaultValues: getDefaultValues(),
  });

  const watchedTimeSlot = watch('pickupTimeSlot');

  const timeSlots = [
    { label: '09:00-12:00', value: '09:00-12:00' },
    { label: '14:00-18:00', value: '14:00-18:00' },
  ];

  // Keyboard detection
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Modal animations
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  // Reset form when modal closes or data changes
  React.useEffect(() => {
    if (!visible) {
      reset(getDefaultValues());
    }
  }, [visible, reset, user, existingReservation, mode]);

  // Update form when existing reservation changes
  React.useEffect(() => {
    if (visible && existingReservation && mode === 'view') {
      reset(getDefaultValues());
    }
  }, [existingReservation, mode, visible]);

  const onSubmit = (data: ReservationFormData) => {
    // Don't submit in view mode
    if (mode === 'view') {
      return;
    }

    // Validation
    if (!data.pickupDate || !data.pickupTimeSlot || 
        !data.customerName || !data.customerPhone || 
        !data.customerEmail) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Transform form data to match API DTO
    const reservationDto: Omit<CreateReservationDto, 'cartId'> = {
      pickupDate: data.pickupDate,
      pickupTimeSlot: data.pickupTimeSlot,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      notes: data.notes || undefined,
    };

    onCreateReservation(reservationDto);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setValue('pickupTimeSlot', timeSlot);
  };

  // Handle scroll events for indicator
  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const scrollHeight = contentSize.height;
    const viewHeight = layoutMeasurement.height;

    setScrollIndicator({
      showTop: scrollY > 20,
      showBottom: scrollY < scrollHeight - viewHeight - 20,
    });
  };

  // Scroll functions
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <ReservationModalPresenter
      visible={visible}
      control={control}
      watchedTimeSlot={watchedTimeSlot}
      timeSlots={timeSlots}
      isCreatingReservation={isCreatingReservation}
      existingReservation={existingReservation}
      mode={mode}
      errors={errors}
      slideAnim={slideAnim}
      fadeAnim={fadeAnim}
      modalHeight={modalHeight}
      scrollIndicator={scrollIndicator}
      scrollViewRef={scrollViewRef}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      onTimeSlotSelect={handleTimeSlotSelect}
      onScroll={handleScroll}
      onScrollToTop={scrollToTop}
      onScrollToBottom={scrollToBottom}
    />
  );
};

export default ReservationModal; 