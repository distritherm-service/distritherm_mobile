import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ms, s, vs } from "react-native-size-matters";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useColors } from "src/hooks/useColors";

interface DevisSearchBarPresenterProps {
  searchQuery: string;
  onTextChange: (text: string) => void;
  onClear: () => void;
  placeholder: string;
}

const DevisSearchBarPresenter: React.FC<DevisSearchBarPresenterProps> = ({
  searchQuery,
  onTextChange,
  onClear,
  placeholder,
}) => {
  const colors = useColors();

  const dynamicStyles = {
    container: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: colors.surface,
      borderRadius: ms(16),
      marginHorizontal: s(20),
      marginVertical: vs(16),
      paddingHorizontal: s(16),
      shadowColor: colors.tertiary[900],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border + "40",
    },
    searchIcon: {
      marginRight: s(12),
    },
    input: {
      flex: 1,
      fontSize: ms(16),
      color: colors.text,
      paddingVertical: vs(14),
      fontWeight: "500" as const,
    },
    clearButton: {
      width: ms(32),
      height: ms(32),
      borderRadius: ms(16),
      backgroundColor: colors.tertiary[200],
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginLeft: s(8),
    },
  };

  return (
    <View style={dynamicStyles.container}>
      <FontAwesomeIcon
        icon={faSearch}
        size={ms(18)}
        color={colors.textSecondary}
        style={dynamicStyles.searchIcon}
      />
      <TextInput
        style={dynamicStyles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={searchQuery}
        onChangeText={onTextChange}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          style={dynamicStyles.clearButton}
          onPress={onClear}
          activeOpacity={0.7}
        >
          <FontAwesomeIcon
            icon={faTimes}
            size={ms(12)}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DevisSearchBarPresenter; 