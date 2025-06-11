import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { useColors } from "src/hooks/useColors";
import { FontAwesome5 } from '@expo/vector-icons';
import { ProfileSection } from './ProfileLinks';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileLinksPresenterProps {
  sections: ProfileSection[];
}

const ProfileLinksPresenter: React.FC<ProfileLinksPresenterProps> = ({
  sections,
}) => {
  const colors = useColors(); // Using react-native-size-matters for responsive design

  // Dynamic styles using colors from useColors hook
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: ms(20), // Utilise react-native-size-matters pour la responsivité
    },
    scrollContent: {
      paddingHorizontal: ms(2),
    },
    section: {
      marginBottom: ms(8),
    },
    sectionHeader: {
      marginBottom: ms(12),
      paddingHorizontal: ms(6),
    },
    sectionTitleContainer: {
      paddingHorizontal: ms(16),
      paddingVertical: ms(8),
      borderRadius: ms(12),
      marginBottom: ms(6),
      alignSelf: 'flex-start',
    },
    sectionTitle: {
      fontSize: ms(16),
      fontWeight: '700',
      color: colors.primary[50],
      letterSpacing: 0.3,
    },
    sectionTitleUnderline: {
      width: ms(32),
      height: ms(2),
      borderRadius: ms(1),
      marginLeft: ms(3),
    },
    sectionContent: {
      borderRadius: ms(16),
      overflow: 'hidden',
      ...Platform.select({
        ios: {
          shadowColor: colors.tertiary[900],
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
      }),
      borderWidth: Platform.OS === 'ios' ? ms(1.5) : ms(1),
    },
    linkItem: {
      paddingHorizontal: ms(18),
      paddingVertical: ms(14),
      minHeight: ms(64),
      justifyContent: 'center',
      transform: [{ scale: 1 }],
    },
    linkItemPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    linkContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    linkLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      maxWidth: '85%',
    },
    iconContainer: {
      width: ms(40),
      height: ms(40),
      borderRadius: ms(20),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: ms(16),
      ...Platform.select({
        ios: {
          shadowColor: colors.tertiary[900],
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    textContainer: {
      flex: 1,
      paddingRight: ms(8),
    },
    linkTitle: {
      fontSize: ms(16),
      fontWeight: '600',
      color: colors.tertiary[900],
      marginBottom: ms(1),
      letterSpacing: 0.1,
      lineHeight: ms(20),
    },
    linkSubtitle: {
      fontSize: ms(12),
      color: colors.tertiary[600],
      lineHeight: ms(16),
      marginTop: ms(1),
    },
    destructiveText: {
      color: colors.secondary[700],
    },
    arrowContainer: {
      width: ms(28),
      height: ms(28),
      borderRadius: ms(14),
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: ms(8),
      ...Platform.select({
        ios: {
          shadowColor: colors.tertiary[400],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    separator: {
      height: Platform.OS === 'ios' ? ms(1.5) : ms(1),
      marginLeft: ms(74),
      marginRight: ms(18),
      opacity: Platform.OS === 'ios' ? 0.8 : 0.6,
    },
    sectionSpacer: {
      height: ms(20),
    },
    bottomSpacer: {
      height: ms(24),
    },
  });
  const renderLinkItem = (item: any) => {
    return (
      <Pressable
        key={item.id}
        style={({ pressed }) => [
          dynamicStyles.linkItem,
          { backgroundColor: colors.primary[50] },
                      pressed && dynamicStyles.linkItemPressed,
        ]}
        onPress={item.onPress}
      >
        <View style={dynamicStyles.linkContent}>
          <View style={dynamicStyles.linkLeft}>
            <LinearGradient
              colors={
                item.isDestructive 
                  ? ['#ef4444', '#dc2626'] as const 
                  : [colors.tertiary[400], colors.tertiary[600]] as const
              }
              style={dynamicStyles.iconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5
                name={item.icon}
                size={ms(16)}
                color={colors.primary[50]}
              />
            </LinearGradient>
            <View style={dynamicStyles.textContainer}>
              <Text style={[
                dynamicStyles.linkTitle,
                item.isDestructive && dynamicStyles.destructiveText
              ]}>
                {item.title}
              </Text>
              {item.subtitle && (
                <Text style={dynamicStyles.linkSubtitle}>{item.subtitle}</Text>
              )}
            </View>
          </View>
          
          {item.showArrow && (
            <LinearGradient
              colors={
                item.isDestructive 
                  ? ['#ef4444', '#dc2626'] as const
                  : [colors.tertiary[300], colors.tertiary[500]] as const
              }
              style={dynamicStyles.arrowContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5
                name="chevron-right"
                size={ms(14)}
                color={colors.primary[50]}
              />
            </LinearGradient>
          )}
        </View>
      </Pressable>
    );
  };

  const renderSection = (section: ProfileSection) => {
    return (
      <View key={section.id} style={dynamicStyles.section}>
        {section.title && (
          <View style={dynamicStyles.sectionHeader}>
            <LinearGradient
              colors={[colors.secondary[500], colors.secondary[600]] as const}
              style={dynamicStyles.sectionTitleContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={dynamicStyles.sectionTitle}>{section.title}</Text>
            </LinearGradient>
            <View style={[dynamicStyles.sectionTitleUnderline, { backgroundColor: colors.secondary[500] }]} />
          </View>
        )}
        <View style={[
          dynamicStyles.sectionContent,
          { 
            backgroundColor: colors.primary[50],
            borderColor: colors.tertiary[200],
          }
        ]}>
          {section.links.map((link, index) => (
            <View key={link.id}>
              {renderLinkItem(link)}
              {index < section.links.length - 1 && (
                <View style={[dynamicStyles.separator, { backgroundColor: colors.tertiary[200] }]} />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      {sections.map((section, index) => (
        <View key={section.id}>
          {renderSection(section)}
          {index < sections.length - 1 && <View style={dynamicStyles.sectionSpacer} />}
        </View>
      ))}
      <View style={dynamicStyles.bottomSpacer} />
    </View>
  );
};

export default ProfileLinksPresenter;

