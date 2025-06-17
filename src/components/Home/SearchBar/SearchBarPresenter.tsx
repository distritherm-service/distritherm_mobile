import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useColors } from 'src/hooks/useColors';
import Input from 'src/components/Input/Input';

interface SearchBarPresenterProps {
  searchQuery: string;
  isFocused: boolean;
  placeholder: string;
  autoFocus: boolean;
  editable: boolean;
  onSearchChange: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onClear: () => void;
  onSubmit: () => void;
  onPress: () => void;
}

const SearchBarPresenter: React.FC<SearchBarPresenterProps> = ({
  searchQuery,
  isFocused,
  placeholder,
  autoFocus,
  editable,
  onSearchChange,
  onFocus,
  onBlur,
  onClear,
  onSubmit,
  onPress,
}) => {
  const colors = useColors();

  // Dynamic styles using react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    container: {
      paddingHorizontal: ms(20), // Using react-native-size-matters for responsive padding
      paddingVertical: ms(12), // Using react-native-size-matters for responsive padding
    },
    searchWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputContainer: {
      flex: 1,
    },
    pressableInputContainer: {
      flex: 1,
      position: 'relative',
    },
    pressableOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
      backgroundColor: 'transparent',
    },
    buttonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: ms(8), // Using react-native-size-matters for responsive margin
    },
    clearButton: {
      marginRight: ms(8), // Using react-native-size-matters for responsive margin
      padding: ms(4), // Using react-native-size-matters for responsive padding
    },
    clearIconContainer: {
      width: ms(20), // Using react-native-size-matters for responsive width
      height: ms(20), // Using react-native-size-matters for responsive height
      borderRadius: ms(10), // Using react-native-size-matters for responsive border radius
      backgroundColor: colors.primary[200],
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchButton: {
      borderRadius: ms(20), // Using react-native-size-matters for responsive border radius
      shadowColor: colors.tertiary[700],
      shadowOffset: { width: 0, height: ms(2) }, // Using react-native-size-matters for responsive shadow
      shadowOpacity: 0.15,
      shadowRadius: ms(4), // Using react-native-size-matters for responsive shadow radius
      elevation: 4,
    },
    searchButtonGradient: {
      width: ms(32), // Using react-native-size-matters for responsive width
      height: ms(32), // Using react-native-size-matters for responsive height
      borderRadius: ms(16), // Using react-native-size-matters for responsive border radius
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const renderInputContainer = () => {
    if (!editable) {
      // Render a pressable container when not editable
      return (
        <View style={dynamicStyles.pressableInputContainer}>
          <Input
            name="search" // Requis par Input mais pas utilisé ici
            value={searchQuery}
            onChangeText={onSearchChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            leftLogo={faMagnifyingGlass}
            autoFocus={false} // Never auto focus when not editable
            returnKeyType="search"
            onSubmitEditing={onSubmit}
            autoCapitalize="none"
            autoCorrect={false}
            editable={false}
            pointerEvents="none"
          />
          <Pressable
            style={dynamicStyles.pressableOverlay}
            onPress={onPress}
          />
        </View>
      );
    }

    // Render normal editable input
    return (
      <View style={dynamicStyles.inputContainer}>
        <Input
          name="search" // Requis par Input mais pas utilisé ici
          value={searchQuery}
          onChangeText={onSearchChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          leftLogo={faMagnifyingGlass}
          autoFocus={autoFocus}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      {/* Conteneur principal avec Input et boutons */}
      <View style={dynamicStyles.searchWrapper}>
        {/* Composant Input avec icône de recherche */}
        {renderInputContainer()}

        {/* Conteneur des boutons à droite */}
        {(searchQuery.length > 0 || (isFocused && searchQuery.trim().length > 0)) && (
          <View style={dynamicStyles.buttonsContainer}>
            {/* Bouton clear (affiché seulement s'il y a du texte) */}
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={dynamicStyles.clearButton}
                onPress={onClear}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={dynamicStyles.clearIconContainer}>
                  <FontAwesome6
                    name="xmark"
                    size={ms(12)} // Using react-native-size-matters for responsive icon size
                    color={colors.tertiary[500]}
                  />
                </View>
              </TouchableOpacity>
            )}

            {/* Bouton de recherche (affiché quand focused et qu'il y a du texte) */}
            {isFocused && searchQuery.trim().length > 0 && (
              <Pressable
                style={dynamicStyles.searchButton}
                onPress={onSubmit}
              >
                <LinearGradient
                  colors={[colors.tertiary[500], colors.tertiary[600]]}
                  style={dynamicStyles.searchButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome6
                    name="arrow-right"
                    size={ms(14)} // Using react-native-size-matters for responsive icon size
                    color={colors.primary[50]}
                  />
                </LinearGradient>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchBarPresenter; 