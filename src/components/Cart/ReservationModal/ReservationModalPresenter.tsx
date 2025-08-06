import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ms } from "react-native-size-matters";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faCalendarAlt,
  faUser,
  faPhone,
  faEnvelope,
  faStickyNote,
  faEye,
  faClock,
  faCalendar,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { Control } from "react-hook-form";
import Input from "src/components/Input/Input";
import { InputType } from "src/types/InputType";
import { useColors } from "src/hooks/useColors";
import { ReservationFormData } from "./ReservationModal";
import { EReservation, EReservationStatus } from "src/types/Reservation";

const { height: screenHeight } = Dimensions.get('window');

// Helper functions for reservation status
const getStatusText = (status: EReservationStatus): string => {
  switch (status) {
    case EReservationStatus.CONFIRMED:
      return "Confirmée";
    case EReservationStatus.PICKED_UP:
      return "Récupérée";
    case EReservationStatus.CANCELLED:
      return "Annulée";
    default:
      return status;
  }
};

const getStatusColor = (status: EReservationStatus): string => {
  switch (status) {
    case EReservationStatus.CONFIRMED:
      return "#10B981"; // Green
    case EReservationStatus.PICKED_UP:
      return "#3B82F6"; // Blue
    case EReservationStatus.CANCELLED:
      return "#EF4444"; // Red
    default:
      return "#6B7280"; // Gray
  }
};

interface TimeSlot {
  label: string;
  value: string;
}

interface ReservationModalPresenterProps {
  visible: boolean;
  control: Control<ReservationFormData>;
  watchedTimeSlot: string;
  timeSlots: TimeSlot[];
  isCreatingReservation: boolean;
  existingReservation?: EReservation;
  mode?: 'create' | 'view';
  errors: any;
  slideAnim: Animated.Value;
  fadeAnim: Animated.Value;
  onClose: () => void;
  onSubmit: () => void;
  onTimeSlotSelect: (timeSlot: string) => void;
}

const ReservationModalPresenter: React.FC<ReservationModalPresenterProps> = ({
  visible,
  control,
  watchedTimeSlot,
  timeSlots,
  isCreatingReservation,
  existingReservation,
  mode = 'create',
  errors,
  slideAnim,
  fadeAnim,
  onClose,
  onSubmit,
  onTimeSlotSelect,
}) => {
  const colors = useColors();



  // Modern, elegant styles inspired by DevisFicheProduct
  const styles = {
    // Modal structure
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.modalBackground,
      justifyContent: "flex-end" as const,
    },
    modalContainer: {
      backgroundColor: colors.background,
      borderTopLeftRadius: ms(32),
      borderTopRightRadius: ms(32),
      height: screenHeight * 0.90,
      shadowColor: "#0f172a",
      shadowOffset: { width: 0, height: -12 },
      shadowOpacity: 0.35,
      shadowRadius: 32,
      elevation: 24,
      zIndex: 50,
    },

    // Header section with premium design
    header: {
      paddingHorizontal: ms(24),
      paddingTop: ms(16),
      paddingBottom: ms(20),
      borderBottomWidth: 1,
      borderBottomColor: colors.tertiary[200] + "20",
      backgroundColor: colors.background,
      borderTopLeftRadius: ms(32),
      borderTopRightRadius: ms(32),
    },
    dragIndicator: {
      width: ms(48),
      height: ms(5),
      backgroundColor: colors.tertiary[300],
      borderRadius: ms(4),
      alignSelf: "center" as const,
      marginBottom: ms(20),
      opacity: 0.6,
    },
    headerContent: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
    },
    headerLeft: {
      flex: 1,
      flexDirection: "row" as const,
      alignItems: "center" as const,
    },
    headerIconContainer: {
      width: ms(56),
      height: ms(56),
      borderRadius: ms(28),
      backgroundColor: colors.secondary[100],
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginRight: ms(16),
      shadowColor: colors.secondary[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    headerTitles: {
      flex: 1,
    },
    headerTitle: {
      fontSize: ms(20),
      fontWeight: "800" as const,
      color: colors.tertiary[500],
      marginBottom: ms(2),
    },
    headerSubtitle: {
      fontSize: ms(12),
      fontWeight: "500" as const,
      color: colors.tertiary[400],
      lineHeight: ms(16),
    },
    closeButton: {
      width: ms(40),
      height: ms(40),
      borderRadius: ms(20),
      backgroundColor: colors.tertiary[100],
      justifyContent: "center" as const,
      alignItems: "center" as const,
      borderWidth: 1,
      borderColor: colors.tertiary[200],
    },

    // Content area
    content: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: ms(24),
      paddingBottom: ms(24),
      flexGrow: 1,
    },

    // Sections
    section: {
      marginBottom: ms(15),
    },
    sectionTitle: {
      fontSize: ms(16),
      fontWeight: "700" as const,
      color: colors.tertiary[500],
      marginBottom: ms(16),
      flexDirection: "row" as const,
      alignItems: "center" as const,
    },
    clientInfoInput: {
      marginBottom: ms(16),
    },

    // Time slot selection
    timeSlotsContainer: {
      marginBottom: ms(16),
    },
    timeSlotButton: {
      paddingVertical: ms(14),
      paddingHorizontal: ms(16),
      borderRadius: ms(12),
      borderWidth: 1,
      borderColor: colors.tertiary[200],
      backgroundColor: colors.background,
      marginBottom: ms(8),
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    timeSlotButtonSelected: {
      backgroundColor: colors.secondary[50],
      borderColor: colors.secondary[500],
      borderWidth: 2,
    },
    timeSlotButtonText: {
      fontSize: ms(14),
      fontWeight: "600" as const,
      color: colors.tertiary[600],
      marginLeft: ms(8),
    },
    timeSlotButtonTextSelected: {
      color: colors.secondary[700],
      fontWeight: "700" as const,
    },

    // Reservation info (view mode)
    reservationInfoContainer: {
      backgroundColor: colors.tertiary[50],
      borderRadius: ms(16),
      padding: ms(16),
      borderWidth: 1,
      borderColor: colors.tertiary[200],
    },
    reservationInfoRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: ms(12),
      paddingVertical: ms(4),
    },
    reservationInfoLabel: {
      fontSize: ms(14),
      fontWeight: "600" as const,
      color: colors.tertiary[600],
      flex: 1,
    },
    reservationInfoValue: {
      fontSize: ms(14),
      fontWeight: "500" as const,
      color: colors.tertiary[500],
      flex: 1,
      textAlign: "right" as const,
    },
    statusBadge: {
      paddingHorizontal: ms(12),
      paddingVertical: ms(6),
      borderRadius: ms(20),
      alignSelf: "flex-end" as const,
    },
    statusText: {
      fontSize: ms(12),
      fontWeight: "700" as const,
      color: colors.primary[50],
      textAlign: "center" as const,
    },

    // Error display
    errorContainer: {
      backgroundColor: colors.danger[50],
      borderWidth: 1,
      borderColor: colors.danger[200],
      borderRadius: ms(12),
      padding: ms(12),
      marginHorizontal: ms(24),
      marginBottom: ms(12),
      flexDirection: "row" as const,
      alignItems: "center" as const,
    },
    errorText: {
      fontSize: ms(13),
      fontWeight: "600" as const,
      color: colors.danger[600],
      flex: 1,
      marginLeft: ms(6),
    },

    // Actions
    actions: {
      paddingHorizontal: ms(24),
      paddingTop: ms(12),
      paddingBottom: ms(24),
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.tertiary[200] + "30",
    },
    button: {
      paddingVertical: ms(12),
      borderRadius: ms(12),
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: ms(8),
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    confirmButton: {
      backgroundColor: colors.secondary[500],
    },
    cancelButton: {
      backgroundColor: colors.tertiary[100],
      borderWidth: 1,
      borderColor: colors.tertiary[300],
    },
    buttonText: {
      fontSize: ms(14),
      fontWeight: "700" as const,
    },
    confirmButtonText: {
      color: colors.primary[50],
    },
    cancelButtonText: {
      color: colors.tertiary[600],
    },
    loadingContainer: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    loadingText: {
      marginLeft: ms(8),
      color: colors.primary[50],
    },
  };

  // Render form inputs for create mode
  const renderFormInputs = () => (
    <>
      {/* Date Selection */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      <FontAwesomeIcon
            icon={faCalendar}
                        size={ms(14)}
                        color={colors.secondary[500]}
                      />
          {" "}Date de retrait
                    </Text>
        <Input
          control={control}
          name="pickupDate"
          placeholder="JJ/MM/AAAA"
          rules={{
            required: "La date de retrait est obligatoire",
            pattern: {
              value: /^(\d{2})\/(\d{2})\/(\d{4})$/,
              message: "Format de date invalide (JJ/MM/AAAA)"
            }
          }}
          type={InputType.NUMERIC}
          leftLogo={faCalendar}
          editable={true}
        />
                      </View>
                      
      {/* Time Slot Selection */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    <FontAwesomeIcon
            icon={faClock}
                      size={ms(14)}
                      color={colors.secondary[500]}
                    />
          {" "}Créneau horaire
                  </Text>
        <View style={styles.timeSlotsContainer}>
                      {timeSlots.map((slot) => (
                        <TouchableOpacity
                          key={slot.value}
                          style={[
                            styles.timeSlotButton,
                watchedTimeSlot === slot.value && styles.timeSlotButtonSelected,
              ]}
              onPress={() => onTimeSlotSelect(slot.value)}
              activeOpacity={0.7}
            >
              <FontAwesomeIcon
                icon={faClock}
                size={ms(16)}
                color={
                  watchedTimeSlot === slot.value
                    ? colors.secondary[500]
                    : colors.tertiary[400]
                }
              />
                          <Text
                            style={[
                  styles.timeSlotButtonText,
                  watchedTimeSlot === slot.value && styles.timeSlotButtonTextSelected,
                            ]}
                          >
                            {slot.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </View>

      {/* Customer Information */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    <FontAwesomeIcon
                      icon={faUser}
                      size={ms(14)}
                      color={colors.secondary[500]}
                    />
          {" "}Informations du client
                  </Text>

        <View style={styles.clientInfoInput}>
                  <Input
            control={control}
                    name="customerName"
            placeholder="Nom complet"
            rules={{ required: "Le nom est obligatoire" }}
                    type={InputType.DEFAULT}
                    leftLogo={faUser}
            editable={true}
          />
        </View>
        
        <View style={styles.clientInfoInput}>
                  <Input
            control={control}
                    name="customerPhone"
            placeholder="Numéro de téléphone"
            rules={{ 
              required: "Le téléphone est obligatoire",
              pattern: {
                value: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
                message: "Numéro de téléphone invalide"
              }
            }}
                    type={InputType.NUMERIC}
                    leftLogo={faPhone}
            editable={true}
          />
        </View>
        
        <View style={styles.clientInfoInput}>
                  <Input
            control={control}
                    name="customerEmail"
            placeholder="Adresse email"
            rules={{ 
              required: "L'email est obligatoire",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Adresse email invalide"
                      }
            }}
            type={InputType.EMAIL_ADDRESS}
            leftLogo={faEnvelope}
            editable={true}
                  />
        </View>
                </View>

      {/* Notes */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    <FontAwesomeIcon
                      icon={faStickyNote}
                      size={ms(14)}
                      color={colors.secondary[500]}
                    />
          {" "}Remarques (optionnel)
                  </Text>
                  <Input
          control={control}
                    name="notes"
          placeholder="Ajoutez vos remarques..."
          rules={{}}
                    type={InputType.TEXTAREA}
                    multiline={true}
          numberOfLines={3}
                    leftLogo={faStickyNote}
          editable={true}
        />
      </View>
    </>
  );

  // Render reservation info for view mode
  const renderReservationInfo = () => {
    if (!existingReservation) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <FontAwesomeIcon
            icon={faEye}
            size={ms(14)}
            color={colors.secondary[500]}
          />
          {" "}Informations de la réservation
        </Text>
        
        <View style={styles.reservationInfoContainer}>
          <View style={styles.reservationInfoRow}>
            <Text style={styles.reservationInfoLabel}>Date de retrait :</Text>
            <Text style={styles.reservationInfoValue}>
              {existingReservation.pickupDate 
                ? new Date(existingReservation.pickupDate).toLocaleDateString('fr-FR')
                : 'Non définie'
              }
            </Text>
          </View>
          
          <View style={styles.reservationInfoRow}>
            <Text style={styles.reservationInfoLabel}>Créneau :</Text>
            <Text style={styles.reservationInfoValue}>
              {existingReservation.pickupTimeSlot || 'Non défini'}
            </Text>
          </View>
          
          <View style={styles.reservationInfoRow}>
            <Text style={styles.reservationInfoLabel}>Client :</Text>
            <Text style={styles.reservationInfoValue}>
              {existingReservation.customerName || 'Non défini'}
            </Text>
          </View>
          
          <View style={styles.reservationInfoRow}>
            <Text style={styles.reservationInfoLabel}>Téléphone :</Text>
            <Text style={styles.reservationInfoValue}>
              {existingReservation.customerPhone || 'Non défini'}
            </Text>
          </View>
          
          <View style={styles.reservationInfoRow}>
            <Text style={styles.reservationInfoLabel}>Email :</Text>
            <Text style={styles.reservationInfoValue}>
              {existingReservation.customerEmail || 'Non défini'}
            </Text>
          </View>
          
          {existingReservation.notes && (
            <View style={styles.reservationInfoRow}>
              <Text style={styles.reservationInfoLabel}>Remarques :</Text>
              <Text style={styles.reservationInfoValue}>
                {existingReservation.notes}
              </Text>
            </View>
          )}
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(existingReservation.status) }]}>
            <Text style={styles.statusText}>
              {getStatusText(existingReservation.status)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Main content rendering
  const renderContent = () => {
    return (
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={false}
        scrollEventThrottle={1}
        removeClippedSubviews={false}
        keyboardDismissMode="interactive"
      >
        {mode === 'view' ? renderReservationInfo() : renderFormInputs()}
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
          >
            {/* Header */}
            <View style={styles.header}>
            <View style={styles.dragIndicator} />

            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIconContainer}>
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    size={ms(20)}
                    color={colors.secondary[500]}
                  />
                </View>
                <View style={styles.headerTitles}>
                  <Text style={styles.headerTitle}>
                    {mode === 'view' ? 'Réservation' : 'Nouvelle Réservation'}
                  </Text>
                  <Text style={styles.headerSubtitle}>
                    {mode === 'view' 
                      ? `ID: ${existingReservation?.id || 'N/A'}`
                      : 'Réservez vos produits pour un retrait'
                    }
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size={ms(18)}
                  color={colors.tertiary[600]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          {renderContent()}

          {/* Error Display */}
          {Object.keys(errors).length > 0 && mode === 'create' && (
            <View style={styles.errorContainer}>
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                size={ms(16)}
                color={colors.danger[500]}
              />
              <Text style={styles.errorText}>
                Veuillez corriger les erreurs dans le formulaire
              </Text>
            </View>
          )}

          {/* Actions */}
              <View style={styles.actions}>
                {mode === 'view' ? (
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={onClose}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.buttonText, styles.confirmButtonText]}>
                      Fermer
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={onClose}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.buttonText, styles.cancelButtonText]}>
                        Annuler
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.button, 
                        styles.confirmButton,
                        isCreatingReservation && { opacity: 0.7 }
                      ]}
                      onPress={onSubmit}
                      disabled={isCreatingReservation}
                      activeOpacity={0.8}
                    >
                      {isCreatingReservation ? (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator size="small" color={colors.primary[50]} />
                          <Text style={[styles.buttonText, styles.loadingText]}>
                            Traitement...
                          </Text>
                        </View>
                      ) : (
                        <Text style={[styles.buttonText, styles.confirmButtonText]}>
                      ✓ Confirmer la réservation
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default ReservationModalPresenter; 