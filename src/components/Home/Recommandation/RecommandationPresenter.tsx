import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalStyles } from "src/utils/globalStyles";
import { colors } from "src/utils/colors";
import { ms } from "react-native-size-matters";
import { ProductBasicDto } from "src/services/productsService";

const RecommandationGroup = (products: any[]) => {
  return <></>;
};
interface RecommandationPresenterProps {
  products: ProductBasicDto[];
  isLoading: boolean;
  error: string | null;
}

const RecommandationPresenter: React.FC<RecommandationPresenterProps> = ({
  products,
  isLoading,
  error,
}) => {
  return (
    <View style={[globalStyles.container]}>
      <Text style={styles.title}>Nos Recommandations</Text>
      <View style={styles.cardContainer}>
        <Text>Big loup</Text>
        <Text>Big loup</Text>
        <Text>Big loup</Text>
      </View>
      <Text></Text>
    </View>
  );
};

export default RecommandationPresenter;

const styles = StyleSheet.create({
  title: {
    fontSize: ms(18),
    fontWeight: "700",
    color: colors.primary[800],
    marginBottom: ms(5),
    marginTop: ms(10),
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardContainer: {
    padding: ms(20),
    marginBottom: ms(20),
    backgroundColor: colors.primary[50],
    borderRadius: ms(12),
    shadowColor: colors.secondary[400],
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderTopWidth: 1,
    borderTopColor: colors.primary[100],
    borderLeftWidth: 1,
    borderLeftColor: colors.primary[100],
  },
  cardText: {
    fontSize: ms(14),
    color: colors.tertiary[600],
    lineHeight: ms(20),
  },
});
