import React from 'react';
import ProfileLinksPresenter from './ProfileLinksPresenter';

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
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({ onNavigate }) => {
  
  const handleNavigation = (screen: string) => {
    if (onNavigate) {
      onNavigate(screen);
    } else {
      console.log(`Navigate to: ${screen}`);
    }
  };

  // Section 1: Connexion/Inscription
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
  // Section 2: Commandes et Devis
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
    ],
  };

  // Section 3: Paramètres personnels

  // Section 2: Paramètres personnels
  const settingsSection: ProfileSection = {
    id: 'settings',
    title: 'Paramètres',
    links: [
      {
        id: 'personal-info',
        title: 'Informations personnelles',
        subtitle: 'Modifiez vos données de profil',
        icon: 'user-edit',
        onPress: () => handleNavigation('PersonalInfo'),
        showArrow: true,
      },
      {
        id: 'password',
        title: 'Mot de passe',
        subtitle: 'Changez votre mot de passe',
        icon: 'key',
        onPress: () => handleNavigation('ChangePassword'),
        showArrow: true,
      },
      {
        id: 'logout',
        title: 'Déconnexion',
        subtitle: 'Quitter votre session',
        icon: 'sign-out-alt',
        onPress: () => handleNavigation('Logout'),
        showArrow: true,
        isDestructive: true,
      },
    ],
  };

  const sections: ProfileSection[] = [authSection, devisSection, settingsSection];

  return (
    <ProfileLinksPresenter 
      sections={sections}
    />
  );
};

export default ProfileLinks; 