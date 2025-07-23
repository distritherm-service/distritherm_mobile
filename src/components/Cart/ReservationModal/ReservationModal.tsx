import React from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { CreateReservationDto, EReservation } from "src/types/Reservation";
import ReservationModalPresenter from "./ReservationModalPresenter";

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

  return (
    <ReservationModalPresenter
      visible={visible}
      control={control}
      watchedTimeSlot={watchedTimeSlot}
      timeSlots={timeSlots}
      isCreatingReservation={isCreatingReservation}
      existingReservation={existingReservation}
      mode={mode}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      onTimeSlotSelect={handleTimeSlotSelect}
    />
  );
};

export default ReservationModal; 