import React, { useCallback } from "react";
import { Alert } from "react-native";
import { Devis, DevisStatus } from "src/types/Devis";
import DevisCardPresenter from "./DevisCardPresenter";

interface DevisCardProps {
  devis: Devis;
  onDownload: (devisId: number) => void;
  onViewProducts: (devis: Devis) => void;
  onDelete?: (devisId: number) => void;
  isDownloading: boolean;
  isDeleting?: boolean;
}

const DevisCard: React.FC<DevisCardProps> = ({
  devis,
  onDownload,
  onViewProducts,
  onDelete,
  isDownloading,
  isDeleting = false,
}) => {
  const getStatusText = useCallback((status: DevisStatus): string => {
    switch (status) {
      case DevisStatus.SENDED:
        return "Envoyé";
      case DevisStatus.CONSULTED:
        return "Consulté";
      case DevisStatus.PROGRESS:
        return "En cours";
      case DevisStatus.EXPIRED:
        return "Expiré";
      default:
        return status;
    }
  }, []);

  const getStatusColor = useCallback((status: DevisStatus): string => {
    switch (status) {
      case DevisStatus.SENDED:
        return "#3B82F6"; // Blue
      case DevisStatus.CONSULTED:
        return "#10B981"; // Green
      case DevisStatus.PROGRESS:
        return "#F59E0B"; // Orange
      case DevisStatus.EXPIRED:
        return "#EF4444"; // Red
      default:
        return "#6B7280"; // Gray
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (!devis.fileUrl) {
      Alert.alert("Erreur", "Aucun fichier disponible pour ce devis");
      return;
    }
    onDownload(devis.id);
  }, [devis.fileUrl, devis.id, onDownload]);

  const handleViewProducts = useCallback(() => {
    onViewProducts(devis);
  }, [devis, onViewProducts]);

  const handleDelete = useCallback(() => {
    if (!onDelete) return;
    
    Alert.alert(
      "Supprimer le devis",
      "Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => onDelete(devis.id),
        },
      ]
    );
  }, [devis.id, onDelete]);

  const formatDate = useCallback((date: Date): string => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  }, []);

  return (
    <DevisCardPresenter
      devis={devis}
      onDownload={handleDownload}
      onViewProducts={handleViewProducts}
      onDelete={onDelete ? handleDelete : undefined}
      isDownloading={isDownloading}
      isDeleting={isDeleting}
      getStatusText={getStatusText}
      getStatusColor={getStatusColor}
      formatDate={formatDate}
    />
  );
};

export default DevisCard; 