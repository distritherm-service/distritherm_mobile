import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useColors } from 'src/hooks/useColors';
import { ProAccountPostulationDto, ProAccountPostulationStatus } from 'src/services/proAccountService';
import StatusBadge from '../StatusBadge/StatusBadge';

interface ProAccountPostulationCardProps {
  postulation: ProAccountPostulationDto;
  onPress?: () => void;
  showUserInfo?: boolean; // Pour les admins qui voient toutes les postulations
}

const ProAccountPostulationCard: React.FC<ProAccountPostulationCardProps> = ({
  postulation,
  onPress,
  showUserInfo = false,
}) => {
  const colors = useColors();
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusDescription = (status: ProAccountPostulationStatus): string => {
    switch (status) {
      case ProAccountPostulationStatus.PENDING:
        return 'Votre demande est en cours d\'examen par notre équipe.';
      case ProAccountPostulationStatus.APPROVED:
        return 'Félicitations ! Votre demande a été approuvée. Notre équipe vous contactera prochainement.';
      case ProAccountPostulationStatus.REJECTED:
        return 'Votre demande n\'a pas pu être acceptée. Vous pouvez soumettre une nouvelle demande.';
      case ProAccountPostulationStatus.CANCELLED:
        return 'Cette demande a été annulée. Vous pouvez soumettre une nouvelle demande.';
      default:
        return '';
    }
  };

  const CardContent = () => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Demande de compte professionnel
          </Text>
          <StatusBadge status={postulation.status} size="small" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Catégorie :</Text>
          <Text style={[styles.value, { color: colors.text }]}>{postulation.categoryName}</Text>
        </View>

        {showUserInfo && postulation.user && (
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Utilisateur :</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {postulation.user.firstName} {postulation.user.lastName}
            </Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Demandé le :</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {formatDate(postulation.createdAt)}
          </Text>
        </View>

        {postulation.updatedAt !== postulation.createdAt && (
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Mis à jour le :</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatDate(postulation.updatedAt)}
            </Text>
          </View>
        )}

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {getStatusDescription(postulation.status)}
        </Text>
      </View>
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <CardContent />
    </TouchableOpacity>
  ) : (
    <CardContent />
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: ms(12),
    padding: ms(16),
    marginVertical: ms(8),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: ms(12),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: ms(16),
    fontWeight: '600',
    flex: 1,
    marginRight: ms(8),
  },
  content: {
    gap: ms(8),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: ms(12),
    fontWeight: '500',
    minWidth: ms(100),
  },
  value: {
    fontSize: ms(12),
    flex: 1,
  },
  description: {
    fontSize: ms(11),
    fontStyle: 'italic',
    marginTop: ms(8),
    lineHeight: ms(16),
  },
});

export default ProAccountPostulationCard; 