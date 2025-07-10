import React from 'react';
import ProfileLinks from 'src/components/Profil/ProfileLinks/ProfileLinks';
import PageStyle from 'src/components/Profil/PageStyle/PageStyle';
import { UserWithClientDto } from 'src/types/User';

interface ProfilPresenterProps {
  onNavigate: (screen: string) => void;
  isAuthenticated: boolean;
  user: UserWithClientDto | null;
  deconnectionLoading?: boolean;
  onUserUpdate: (updatedUser: UserWithClientDto) => void;
}

const ProfilPresenter: React.FC<ProfilPresenterProps> = ({ 
  onNavigate, 
  isAuthenticated, 
  user,
  deconnectionLoading = false,
  onUserUpdate,
}) => {
  return (
    <PageStyle 
      user={user}
      isAuthenticated={isAuthenticated}
      deconnectionLoading={deconnectionLoading}
      onUserUpdate={onUserUpdate}
    >
      <ProfileLinks 
        onNavigate={onNavigate} 
        isAuthenticated={isAuthenticated}
        userType={user?.type}
        user={user}
      />
    </PageStyle>
  );
};

export default ProfilPresenter;


