import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { ms } from 'react-native-size-matters'; // Using react-native-size-matters for responsive design
import { FontAwesome6 } from '@expo/vector-icons';
import colors from 'src/utils/colors';

interface GoogleSignInPresenterProps {
  onPress: () => void;
  isLoading: boolean;
  type: 'login' | 'register';
}

const GoogleSignInPresenter = ({ onPress, isLoading, type }: GoogleSignInPresenterProps) => {
  return (
    <View style={styles.container}>
      {/* Divider with "OU" text */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OU</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Google Sign-In Button */}
      <Pressable
        style={[
          styles.googleButton,
          isLoading && styles.googleButtonDisabled,
        ]}
        onPress={onPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.secondary[600]} />
        ) : (
          <>
            <FontAwesome6
              name="google"
              size={ms(18)} // Using ms() for responsive sizing
              color={colors.secondary[600]}
            />
            <Text style={styles.googleButtonText}>
              {type === 'login' ? 'Se connecter avec Google' : "S'inscrire avec Google"}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
};

export default GoogleSignInPresenter;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: ms(20), // Using ms() for responsive margins
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(20), // Using ms() for responsive margins
  },
  dividerLine: {
    flex: 1,
    height: ms(1), // Using ms() for responsive height
    backgroundColor: colors.secondary[300],
  },
  dividerText: {
    marginHorizontal: ms(16), // Using ms() for responsive spacing
    fontSize: ms(14), // Using ms() for responsive font size
    color: colors.secondary[500],
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: colors.primary[50],
    borderRadius: ms(12), // Using ms() for responsive border radius
    paddingVertical: ms(12), // Using ms() for responsive padding
    paddingHorizontal: ms(24), // Using ms() for responsive padding
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(12), // Using ms() for responsive gap
    borderWidth: ms(2), // Using ms() for responsive border
    borderColor: colors.secondary[200],
    shadowColor: colors.secondary[800],
    shadowOffset: {
      width: 0,
      height: ms(2), // Using ms() for responsive shadow
    },
    shadowOpacity: 0.1,
    shadowRadius: ms(4), // Using ms() for responsive shadow
    elevation: 2,
  },
  googleButtonDisabled: {
    backgroundColor: colors.tertiary[100],
    borderColor: colors.tertiary[200],
    shadowOpacity: 0,
    elevation: 0,
  },
  googleButtonText: {
    color: colors.secondary[600],
    fontSize: ms(16), // Using ms() for responsive font size
    fontWeight: '600',
  },
}); 