import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalStyles } from "src/utils/globalStyles";
import { colors } from "src/utils/colors";
import { ms } from "react-native-size-matters";

const RecommandationPresenter = () => {
  return (
    <View style={[globalStyles.container, styles.container]}>
      <Text style={styles.title}>Nos Recommandations</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Découvrez nos produits phares sélectionnés pour vous
        </Text>
      </View>
    </View>
  );
};

export default RecommandationPresenter;

const styles = StyleSheet.create({
  container: {
    padding: ms(20),
    backgroundColor: colors.tertiary[50],
  },
  title: {
    fontSize: ms(20),
    fontWeight: '600',
    color: colors.primary[600],
    marginBottom: ms(15),
  },
  card: {
    backgroundColor: colors.primary[50],
    borderRadius: ms(12),
    padding: ms(15),
    shadowColor: colors.secondary[400],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardText: {
    fontSize: ms(14),
    color: colors.tertiary[600],
    lineHeight: ms(20),
  },
});
