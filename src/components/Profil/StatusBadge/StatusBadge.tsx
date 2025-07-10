import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import { ProAccountPostulationStatus, getPostulationStatusLabel, getPostulationStatusColor } from 'src/services/proAccountService';

interface StatusBadgeProps {
  status: ProAccountPostulationStatus;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'medium',
  showIcon = true 
}) => {
  const statusLabel = getPostulationStatusLabel(status);
  const statusColor = getPostulationStatusColor(status);
  
  const getIconForStatus = (status: ProAccountPostulationStatus): string => {
    switch (status) {
      case ProAccountPostulationStatus.PENDING:
        return '⏳';
      case ProAccountPostulationStatus.APPROVED:
        return '✅';
      case ProAccountPostulationStatus.REJECTED:
        return '❌';
      case ProAccountPostulationStatus.CANCELLED:
        return '🚫';
      default:
        return '❓';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: ms(8),
          paddingVertical: ms(4),
          borderRadius: ms(12),
          fontSize: ms(10),
        };
      case 'large':
        return {
          paddingHorizontal: ms(16),
          paddingVertical: ms(10),
          borderRadius: ms(20),
          fontSize: ms(14),
        };
      default: // medium
        return {
          paddingHorizontal: ms(12),
          paddingVertical: ms(6),
          borderRadius: ms(16),
          fontSize: ms(12),
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: statusColor + '20', // 20% opacity
          borderColor: statusColor,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          borderRadius: sizeStyles.borderRadius,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: statusColor,
            fontSize: sizeStyles.fontSize,
          },
        ]}
      >
        {showIcon && getIconForStatus(status)} {statusLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default StatusBadge; 