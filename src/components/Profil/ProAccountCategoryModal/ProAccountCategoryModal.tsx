import React, { useRef, useEffect } from 'react';
import { Alert, Animated } from 'react-native';
import { useForm } from 'react-hook-form';
import ProAccountCategoryModalPresenter from './ProAccountCategoryModalPresenter';

interface ProAccountCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (categoryName: string) => Promise<void>;
  isLoading?: boolean;
}

interface FormData {
  categoryName: string;
}

const ProAccountCategoryModal: React.FC<ProAccountCategoryModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  // Animation References
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Form setup with react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      categoryName: ''
    }
  });

  // Watch categoryName to detect changes
  const categoryName = watch('categoryName');
  const hasContent = Boolean(categoryName && categoryName.trim().length > 0);

  // Animation Effects
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, fadeAnim, slideAnim]);

  // Business Logic Handlers
  const onFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data.categoryName.trim());
      reset();
      onClose();
    } catch (error) {
      // L'erreur sera gérée par le composant parent
      console.error('Error submitting pro account category:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Handle touch outside to close modal
  const handleOverlayPress = () => {
    if (!isLoading) {
      handleClose();
    }
  };

  return (
    <ProAccountCategoryModalPresenter
      visible={visible}
      control={control}
      errors={errors}
      hasContent={hasContent}
      isLoading={isLoading}
      scaleAnim={scaleAnim}
      fadeAnim={fadeAnim}
      slideAnim={slideAnim}
      onClose={handleClose}
      onSubmit={handleSubmit(onFormSubmit)}
      onOverlayPress={handleOverlayPress}
    />
  );
};

export default ProAccountCategoryModal; 