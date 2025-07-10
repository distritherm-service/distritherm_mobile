import React, { useState, useEffect } from 'react';
import ProfileLinksPresenter from './ProfileLinksPresenter';
import { Type, UserWithClientDto } from 'src/types/User';
import proAccountService, { 
  ProAccountPostulationDto, 
  ProAccountPostulationStatus,
  getPostulationStatusLabel,
  getPostulationStatusColor 
} from '@/pro-account';
import { Alert } from 'react-native';
import ProAccountCategoryModal from '../ProAccountCategoryModal/ProAccountCategoryModal';

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
  const [userPostulation, setUserPostulation] = useState<ProAccountPostulationDto | null>(null);
  const [isCreatingPostulation, setIsCreatingPostulation] = useState<boolean>(false);
  const [isLoadingPostulations, setIsLoadingPostulations] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [proAccountStatus, setProAccountStatus] = useState<{
    canRequest: boolean;
    canManage: boolean;
    reason?: string;
    userStatus: 'not_pro' | 'pro_with_postulation' | 'pro_direct_validation';
  } | null>(null);
  
  // Check user's pro account status and postulations
  useEffect(() => {
    const checkProAccountStatus = async () => {
      if (isAuthenticated && user) {
        setIsLoadingPostulations(true);
        try {
          const status = await proAccountService.canInteractWithProAccount(user);
          setProAccountStatus(status);
          setUserPostulation(status.postulation || null);
        } catch (error) {

          setProAccountStatus({
            canRequest: !user.proInfo?.isPro,
            canManage: false,
            userStatus: user.proInfo?.isPro ? 'pro_direct_validation' : 'not_pro'
          });
          setUserPostulation(null);
        } finally {
          setIsLoadingPostulations(false);
        }
      }
    };

    checkProAccountStatus();
  }, [isAuthenticated, user]);

  // Fonction pour recharger le statut après une action
  const refreshProAccountStatus = async () => {
    if (isAuthenticated && user) {
      try {
        const status = await proAccountService.canInteractWithProAccount(user);
        setProAccountStatus(status);
        setUserPostulation(status.postulation || null);
      } catch (error) {

      }
    }
  };

  const handleCreatePostulation = async () => {
    if (!user) return;
    setShowCategoryModal(true);
  };

  const handleSubmitPostulation = async (categoryName: string) => {
    if (!user) return;

    setIsCreatingPostulation(true);
    try {
      // Utilise le nouveau service unifié requestProAccount
      const response = await proAccountService.requestProAccount(categoryName);
      
      // Recharger le statut complet au lieu de juste setter la postulation
      await refreshProAccountStatus();
      
      Alert.alert(
        "Demande envoyée",
        response.message || "Votre demande de compte professionnel a été envoyée avec succès. Notre équipe vous contactera prochainement.",
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
    if (!user || !userPostulation) return;

    const statusLabel = getPostulationStatusLabel(userPostulation.status);
    
    // Affichage différent selon le statut
    switch (userPostulation.status) {
      case ProAccountPostulationStatus.PENDING:
        Alert.alert(
          "Demande en cours",
          `Votre demande de compte professionnel est en cours d'examen.\nStatut: ${statusLabel}\n\nVoulez-vous annuler votre demande ?`,
          [
            { text: "Non", style: "cancel" },
            {
              text: "Annuler ma demande",
              style: "destructive",
              onPress: () => handleCancelPostulation(),
            },
          ]
        );
        break;
        
      case ProAccountPostulationStatus.APPROVED:
        Alert.alert(
          "Demande approuvée",
          `Félicitations ! Votre demande de compte professionnel a été approuvée.\nStatut: ${statusLabel}\n\nNotre équipe va prendre contact avec vous prochainement pour finaliser l'activation de votre compte.`,
          [{ text: "OK" }]
        );
        break;
    }
  };

  const handleCancelPostulation = async () => {
    if (!userPostulation) return;
    
    try {
      const response = await proAccountService.cancelPostulation(userPostulation.id);
      
      // Recharger le statut complet au lieu de juste remettre à null
      await refreshProAccountStatus();
      
      Alert.alert(
        "Demande annulée",
        response.message || "Votre demande de compte professionnel a été annulée avec succès. Vous pouvez maintenant faire une nouvelle demande.",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue lors de l'annulation de votre demande.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert(
        "Erreur",
        errorMessage,
        [{ text: "OK" }]
      );
    }
  };

  const handleCreateNewPostulation = () => {
    setUserPostulation(null);
    setShowCategoryModal(true);
  };

  const getProAccountLinkConfig = () => {
    if (!proAccountStatus) {
      return {
        title: 'Chargement...',
        subtitle: 'Vérification du statut',
        icon: 'spinner',
        onPress: () => {},
        isDestructive: false,
      };
    }

    // Si l'utilisateur est déjà pro, on ne retourne rien (la section ne s'affichera pas)
    if (proAccountStatus.userStatus === 'pro_with_postulation' || 
        proAccountStatus.userStatus === 'pro_direct_validation') {
      return null;
    }

    // Cas 1: Postulation en cours (PENDING)
    if (userPostulation?.status === ProAccountPostulationStatus.PENDING) {
      return {
        title: 'Demande en cours',
        subtitle: 'En attente de validation - Touchez pour gérer',
        icon: 'clock',
        onPress: handleManagePostulation,
        isDestructive: false,
      };
    }

    // Cas 2: Postulation approuvée mais utilisateur pas encore pro (en transition)
    if (userPostulation?.status === ProAccountPostulationStatus.APPROVED && !user?.proInfo?.isPro) {
      return {
        title: 'Demande approuvée',
        subtitle: 'Finalisation en cours - Touchez pour plus d\'infos',
        icon: 'check-circle',
        onPress: handleManagePostulation,
        isDestructive: false,
      };
    }

    // Cas 3: Aucune postulation - permettre de créer une demande
    if (proAccountStatus.canRequest && !userPostulation) {
      return {
        title: 'Devenir compte pro',
        subtitle: isCreatingPostulation 
          ? 'Envoi en cours...' 
          : 'Bénéficiez d\'avantages exclusifs',
        icon: 'crown',
        onPress: handleCreatePostulation,
        isDestructive: false,
      };
    }

    // Cas par défaut - ne pas afficher
    return null;
  };

  const handleNavigation = (screen: string) => {
    if (onNavigate) {
      onNavigate(screen);
    } else {

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

  // Section 4: Compte Professionnel 
  // Affichage seulement si l'utilisateur n'est pas déjà pro
  const proAccountLinkConfig = getProAccountLinkConfig();
  const proAccountSection: ProfileSection | null = 
    isAuthenticated && 
    user && 
    proAccountStatus &&
    !isLoadingPostulations &&
    proAccountLinkConfig ? {
      id: 'pro-account',
      title: 'Compte Professionnel',
      links: [
        {
          id: 'pro-postulation',
          ...proAccountLinkConfig,
          showArrow: true,
        },
      ],
    } : null;

  // Affichage conditionnel des sections selon l'état d'authentification
  const sections: ProfileSection[] = isAuthenticated 
    ? [
        devisSection,
        proAccountSection, // Sera null si l'utilisateur est déjà pro
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