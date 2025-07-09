import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
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
} from "@fortawesome/free-solid-svg-icons";
import { Control } from "react-hook-form";
import Input from "src/components/Input/Input";
import { InputType } from "src/types/InputType";
import { useColors } from "src/hooks/useColors";
import { ReservationFormData } from "./ReservationModal";

const { height: screenHeight } = Dimensions.get('window');

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
  onClose,
  onSubmit,
  onTimeSlotSelect,
}) => {
  const colors = useColors();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    container: {
      backgroundColor: colors.primary[50],
      borderTopLeftRadius: ms(20),
      borderTopRightRadius: ms(20),
      height: screenHeight * 0.85,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
    handle: {
      width: ms(40),
      height: ms(4),
      backgroundColor: colors.tertiary[300],
      borderRadius: ms(2),
      alignSelf: "center",
      marginTop: ms(8),
      marginBottom: ms(16),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: ms(20),
      paddingBottom: ms(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.tertiary[200],
    },
    title: {
      fontSize: ms(20),
      fontWeight: "700",
      color: colors.tertiary[500],
      flex: 1,
    },
    closeButton: {
      backgroundColor: colors.tertiary[50],
      borderRadius: ms(20),
      width: ms(40),
      height: ms(40),
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.tertiary[200],
    },
    content: {
      flex: 1,
      backgroundColor: colors.primary[50],
    },
    scrollContent: {
      paddingHorizontal: ms(20),
      paddingBottom: ms(20),
    },
    section: {
      marginVertical: ms(10),
      backgroundColor: colors.primary[50],
      borderRadius: ms(12),
      padding: ms(16),
      borderWidth: 1,
      borderColor: colors.tertiary[200],
    },
    sectionTitle: {
      fontSize: ms(16),
      fontWeight: "700",
      color: colors.tertiary[500],
      marginBottom: ms(12),
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeSlotContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: ms(8),
      marginTop: ms(12),
    },
    timeSlotButton: {
      backgroundColor: colors.primary[50],
      borderRadius: ms(12),
      paddingHorizontal: ms(16),
      paddingVertical: ms(12),
      borderWidth: 1.5,
      borderColor: colors.secondary[200],
      flex: 0.48,
      alignItems: "center",
      justifyContent: "center",
    },
    timeSlotButtonActive: {
      backgroundColor: colors.secondary[400],
      borderColor: colors.secondary[500],
    },
    timeSlotText: {
      fontSize: ms(14),
      color: colors.tertiary[500],
      fontWeight: "600",
      textAlign: 'center',
    },
    timeSlotTextActive: {
      color: colors.primary[50],
      fontWeight: "700",
    },
    errorMessage: {
      color: colors.danger[600],
      fontSize: ms(12),
      marginTop: ms(8),
      fontWeight: "500",
      backgroundColor: colors.danger[50],
      paddingHorizontal: ms(12),
      paddingVertical: ms(8),
      borderRadius: ms(8),
      textAlign: "center",
      borderLeftWidth: ms(3),
      borderLeftColor: colors.danger[400],
    },
    actions: {
      flexDirection: "row",
      gap: ms(12),
      padding: ms(20),
      paddingBottom: Platform.OS === 'ios' ? ms(34) : ms(20),
      borderTopWidth: 1,
      borderTopColor: colors.tertiary[200],
      backgroundColor: colors.primary[50],
    },
    button: {
      flex: 1,
      borderRadius: ms(12),
      paddingVertical: ms(14),
      alignItems: "center",
      justifyContent: "center",
      minHeight: ms(48),
    },
    cancelButton: {
      backgroundColor: colors.primary[50],
      borderWidth: 1.5,
      borderColor: colors.tertiary[300],
    },
    confirmButton: {
      backgroundColor: colors.secondary[400],
      borderWidth: 1,
      borderColor: colors.secondary[500],
    },
    buttonText: {
      fontSize: ms(15),
      fontWeight: "700",
      textAlign: 'center',
    },
    cancelButtonText: {
      color: colors.tertiary[500],
    },
    confirmButtonText: {
      color: colors.primary[50],
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginLeft: ms(8),
      fontSize: ms(15),
      fontWeight: "700",
      color: colors.primary[50],
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.container}>
              <View style={styles.handle} />
              
              <View style={styles.header}>
                <Text style={styles.title}>Réserver pour retrait</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    size={ms(16)}
                    color={colors.tertiary[500]}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  bounces={true}
                  keyboardDismissMode="on-drag"
                  contentContainerStyle={styles.scrollContent}
                >
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      size={ms(14)}
                      color={colors.secondary[500]}
                    />
                    {" "}Informations de retrait
                  </Text>
                  
                  <Input
                    name="pickupDate"
                    control={control}
                    type={InputType.DATE}
                    label="Date de retrait *"
                    placeholder="JJ/MM/AAAA"
                    leftLogo={faCalendarAlt}
                    rules={{
                      required: 'La date de retrait est obligatoire',
                      pattern: {
                        value: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                        message: 'Format attendu: JJ/MM/AAAA'
                      },
                      validate: {
                        validDate: (value: string) => {
                          if (!value) return true;
                          const [day, month, year] = value.split('/').map(Number);
                          const date = new Date(year, month - 1, day);
                          const isValidDate = 
                            date.getFullYear() === year &&
                            date.getMonth() === month - 1 &&
                            date.getDate() === day;
                          const isNotPast = date >= new Date(new Date().setHours(0, 0, 0, 0));
                          
                          if (!isValidDate) return 'Date invalide';
                          if (!isNotPast) return 'La date ne peut pas être dans le passé';
                          return true;
                        }
                      }
                    }}
                  />

                  <View style={{ marginTop: ms(12) }}>
                    <Text style={styles.sectionTitle}>Créneau horaire *</Text>
                    <View style={styles.timeSlotContainer}>
                      {timeSlots.map((slot) => (
                        <TouchableOpacity
                          key={slot.value}
                          style={[
                            styles.timeSlotButton,
                            watchedTimeSlot === slot.value && styles.timeSlotButtonActive,
                          ]}
                          onPress={() => onTimeSlotSelect(slot.value)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.timeSlotText,
                              watchedTimeSlot === slot.value && styles.timeSlotTextActive,
                            ]}
                          >
                            {slot.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {!watchedTimeSlot && (
                      <Text style={styles.errorMessage}>
                        ⚠️ Veuillez sélectionner un créneau horaire
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    <FontAwesomeIcon
                      icon={faUser}
                      size={ms(14)}
                      color={colors.secondary[500]}
                    />
                    {" "}Informations de contact
                  </Text>

                  <Input
                    name="customerName"
                    control={control}
                    type={InputType.DEFAULT}
                    label="Nom complet *"
                    placeholder="Votre nom complet"
                    leftLogo={faUser}
                    rules={{
                      required: 'Le nom est obligatoire',
                      minLength: {
                        value: 2,
                        message: 'Le nom doit contenir au moins 2 caractères'
                      }
                    }}
                  />

                  <Input
                    name="customerPhone"
                    control={control}
                    type={InputType.NUMERIC}
                    label="Téléphone *"
                    placeholder="Votre numéro de téléphone"
                    leftLogo={faPhone}
                    rules={{
                      required: 'Le téléphone est obligatoire',
                      pattern: {
                        value: /^[0-9+\-\s()]+$/,
                        message: 'Format de téléphone invalide'
                      }
                    }}
                  />

                  <Input
                    name="customerEmail"
                    control={control}
                    type={InputType.EMAIL_ADDRESS}
                    label="Email *"
                    placeholder="Votre adresse email"
                    leftLogo={faEnvelope}
                    rules={{
                      required: 'L\'email est obligatoire',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Format d\'email invalide'
                      }
                    }}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    <FontAwesomeIcon
                      icon={faStickyNote}
                      size={ms(14)}
                      color={colors.secondary[500]}
                    />
                    {" "}Notes optionnelles
                  </Text>

                  <Input
                    name="notes"
                    control={control}
                    type={InputType.TEXTAREA}
                    label="Instructions particulières"
                    placeholder="Ajoutez des instructions particulières pour le retrait..."
                    multiline={true}
                    numberOfLines={3}
                    leftLogo={faStickyNote}
                  />
                </View>
                </ScrollView>
              </View>

              <View style={styles.actions}>
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
                      ✓ Confirmer
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReservationModalPresenter; 