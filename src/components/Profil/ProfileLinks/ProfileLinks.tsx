import React, { useState, useEffect } from 'react';
import ProfileLinksPresenter from './ProfileLinksPresenter';
import { Type, UserWithClientDto } from 'src/types/User';
import proAccountService from 'src/services/proAccountService';
import { Alert } from 'react-native';
import ProAccountCategoryModal from '../../ProAccountCategoryModal/ProAccountCategoryModal';

export interface ProfileLinkItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
  showArrow?: boolean;
  isDestructive?: boolean;
}

export interface ProfileSection {
  id: string;
  title?: string;
  links: ProfileLinkItem[];
}

interface ProfileLinksProps {
  onNavigate?: (screen: string) => void;
  isAuthenticated: boolean;
  userType?: Type; // Add user type to determine if user is provider
  user?: UserWithClientDto | null; // Add user data to check pro status
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({ 
  onNavigate, 
  isAuthenticated, 
  userType,
  user
}) => {
  const [hasPostulation, setHasPostulation] = useState<boolean>(false);
  const [isCreatingPostulation, setIsCreatingPostulation] = useState<boolean>(false);
  const [isLoadingPostulations, setIsLoadingPostulations] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  
  // Check if user has existing postulation
  useEffect(() => {
    const checkExistingPostulation = async () => {
      if (isAuthenticated && user) {
        setIsLoadingPostulations(true);
        try {
          const response = await proAccountService.getPostulationsByUser(user.id);
          setHasPostulation(response.postulations.length > 0);
        } catch (error) {
          console.log('Aucune postulation existante trouvée');
          setHasPostulation(false);
        } finally {
          setIsLoadingPostulations(false);
        }
      }
    };

    checkExistingPostulation();
  }, [isAuthenticated, user]);

  const handleCreatePostulation = async () => {
    if (!user) return;
    setShowCategoryModal(true);
  };

  const handleSubmitPostulation = async (categoryName: string) => {
    if (!user) return;

    setIsCreatingPostulation(true);
    try {
      await proAccountService.createPostulation({ categoryName });
      setHasPostulation(true);
      Alert.alert(
        "Demande envoyée",
        "Votre demande de compte professionnel a été envoyée avec succès. Notre équipe vous contactera prochainement.",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue lors de l'envoi de votre demande.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert("Erreur", errorMessage, [{ text: "OK" }]);
      throw error; // Re-throw pour que le modal gère l'erreur
    } finally {
      setIsCreatingPostulation(false);
    }
  };

  const handleManagePostulation = async () => {
    if (!user) return;

    Alert.alert(
      "Gérer ma demande",
      "Voulez-vous annuler votre demande de compte professionnel en cours ?",
      [
        {
          text: "Non",
          style: "cancel",
        },
        {
          text: "Annuler ma demande",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await proAccountService.getPostulationsByUser(user.id);
              if (response.postulations.length > 0) {
                await proAccountService.deletePostulation(response.postulations[0].id);
                setHasPostulation(false);
                Alert.alert(
                  "Demande annulée",
                  "Votre demande de compte professionnel a été annulée avec succès.",
                  [{ text: "OK" }]
                );
              }
            } catch (error: any) {
              Alert.alert(
                "Erreur", 
                "Une erreur est survenue lors de l'annulation de votre demande.",
                [{ text: "OK" }]
              );
            }
          },
        },
      ]
    );
  };

  const handleNavigation = (screen: string) => {
    if (onNavigate) {
      onNavigate(screen);
    } else {
      console.log(`Navigate to: ${screen}`);
    }
  };

  // Section 1: Connexion/Inscription (uniquement si NON connecté)
  const authSection: ProfileSection = {
    id: 'auth',
    title: 'Authentification',
    links: [
      {
        id: 'login',
        title: 'Connexion',
        subtitle: 'Accédez à votre compte',
        icon: 'sign-in-alt',
        onPress: () => handleNavigation('Login'),
        showArrow: true,
      },
      {
        id: 'register',
        title: 'Inscription',
        subtitle: 'Créez votre compte professionnel',
        icon: 'user-plus',
        onPress: () => handleNavigation('Register'),
        showArrow: true,
      },
    ],
  };

  // Section 2: Commandes et Devis (uniquement si connecté)
  const devisSection: ProfileSection = {
    id: 'devis',
    title: 'Mes activités',
    links: [
      {
        id: 'quotes',
        title: 'Mes devis',
        subtitle: 'Consultez vos devis et estimations',
        icon: 'file-invoice-dollar',
        onPress: () => handleNavigation('Quotes'),
        showArrow: true,
      },
      {
        id: 'reservations',
        title: 'Mes réservations',
        subtitle: 'Consultez vos réservations de retrait',
        icon: 'calendar-check',
        onPress: () => handleNavigation('Reservations'),
        showArrow: true,
      },
    ],
  };

  // Section 3: Paramètres personnels (uniquement si connecté)
  // Create settings links array conditionally based on user type
  const settingsLinks: ProfileLinkItem[] = [
    {
      id: 'personal-info',
      title: 'Informations personnelles',
      subtitle: 'Modifiez vos données de profil',
      icon: 'user-edit',
      onPress: () => handleNavigation('PersonalInfo'),
      showArrow: true,
    },
  ];

  // Only add password change option for REGULAR users (not PROVIDER users)
  if (userType !== Type.PROVIDER) {
    settingsLinks.push({
      id: 'password',
      title: 'Mot de passe',
      subtitle: 'Changez votre mot de passe',
      icon: 'key',
      onPress: () => handleNavigation('ChangePassword'),
      showArrow: true,
    });
  }

  // Always add logout option
  settingsLinks.push({
    id: 'logout',
    title: 'Déconnexion',
    subtitle: 'Quitter votre session',
    icon: 'sign-out-alt',
    onPress: () => handleNavigation('Logout'),
    showArrow: true,
    isDestructive: true,
  });

  const settingsSection: ProfileSection = {
    id: 'settings',
    title: 'Paramètres',
    links: settingsLinks,
  };

  // Section 4: Compte Professionnel (uniquement si connecté et pas encore pro)
  const proAccountSection: ProfileSection = {
    id: 'pro-account',
    title: 'Compte Professionnel',
    links: [
      {
        id: 'pro-postulation',
        title: hasPostulation ? 'Gérer ma demande' : 'Devenir compte pro',
        subtitle: hasPostulation 
          ? 'Demande en cours d\'examen' 
          : isCreatingPostulation 
            ? 'Envoi en cours...' 
            : 'Bénéficiez d\'avantages exclusifs',
        icon: hasPostulation ? 'file-contract' : 'crown',
        onPress: hasPostulation ? handleManagePostulation : handleCreatePostulation,
        showArrow: true,
        isDestructive: hasPostulation,
      },
    ],
  };

  // Affichage conditionnel des sections selon l'état d'authentification
  const sections: ProfileSection[] = isAuthenticated 
    ? [
        devisSection, 
        !isLoadingPostulations ? proAccountSection : null, // Section pro account si pas en chargement
        settingsSection
      ].filter(Boolean) as ProfileSection[] // Filtrer les valeurs null
    : [authSection]; // Si non connecté: connexion + inscription

  return (
    <>
      <ProfileLinksPresenter 
        sections={sections}
      />
      
      <ProAccountCategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSubmit={handleSubmitPostulation}
        isLoading={isCreatingPostulation}
      />
    </>
  );
};

export default ProfileLinks; 