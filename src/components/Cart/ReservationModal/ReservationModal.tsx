import React from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { CreateReservationDto } from "src/types/Reservation";
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
  onClose: () => void;
  onCreateReservation: (data: Omit<CreateReservationDto, 'cartId'>) => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  visible,
  user,
  isCreatingReservation,
  onClose,
  onCreateReservation,
}) => {
  // useForm hook for better form management
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ReservationFormData>({
    defaultValues: {
      pickupDate: '',
      pickupTimeSlot: '',
      customerName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
      customerPhone: user?.phoneNumber || '',
      customerEmail: user?.email || '',
      notes: '',
    },
  });

  const watchedTimeSlot = watch('pickupTimeSlot');

  const timeSlots = [
    { label: '09:00-12:00', value: '09:00-12:00' },
    { label: '14:00-18:00', value: '14:00-18:00' },
  ];

  // Reset form when modal closes
  React.useEffect(() => {
    if (!visible) {
      reset({
        pickupDate: '',
        pickupTimeSlot: '',
        customerName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
        customerPhone: user?.phoneNumber || '',
        customerEmail: user?.email || '',
        notes: '',
      });
    }
  }, [visible, reset, user]);

  const onSubmit = (data: ReservationFormData) => {
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
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      onTimeSlotSelect={handleTimeSlotSelect}
    />
  );
};

export default ReservationModal; 