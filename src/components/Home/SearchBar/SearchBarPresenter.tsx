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
import colors from 'src/utils/colors';
import Input from 'src/components/Input/Input';

interface SearchBarPresenterProps {
  searchQuery: string;
  isFocused: boolean;
  placeholder: string;
  autoFocus: boolean;
  onSearchChange: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onClear: () => void;
  onSubmit: () => void;
}

const SearchBarPresenter: React.FC<SearchBarPresenterProps> = ({
  searchQuery,
  isFocused,
  placeholder,
  autoFocus,
  onSearchChange,
  onFocus,
  onBlur,
  onClear,
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      {/* Conteneur principal avec Input et boutons */}
      <View style={styles.searchWrapper}>
        {/* Composant Input avec icône de recherche */}
        <View style={styles.inputContainer}>
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

        {/* Conteneur des boutons à droite */}
        {(searchQuery.length > 0 || (isFocused && searchQuery.trim().length > 0)) && (
          <View style={styles.buttonsContainer}>
            {/* Bouton clear (affiché seulement s'il y a du texte) */}
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={onClear}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={styles.clearIconContainer}>
                  <FontAwesome6
                    name="xmark"
                    size={ms(12)}
                    color={colors.tertiary[500]}
                  />
                </View>
              </TouchableOpacity>
            )}

            {/* Bouton de recherche (affiché quand focused et qu'il y a du texte) */}
            {isFocused && searchQuery.trim().length > 0 && (
              <Pressable
                style={styles.searchButton}
                onPress={onSubmit}
              >
                <LinearGradient
                  colors={[colors.tertiary[500], colors.tertiary[600]]}
                  style={styles.searchButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome6
                    name="arrow-right"
                    size={ms(14)}
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ms(20), // Utilise react-native-size-matters pour la responsivité
    paddingVertical: ms(12),
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: ms(8),
  },
  clearButton: {
    marginRight: ms(8),
    padding: ms(4),
  },
  clearIconContainer: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    backgroundColor: colors.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    borderRadius: ms(20),
    shadowColor: colors.tertiary[700],
    shadowOffset: { width: 0, height: ms(2) },
    shadowOpacity: 0.15,
    shadowRadius: ms(4),
    elevation: 4,
  },
  searchButtonGradient: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 