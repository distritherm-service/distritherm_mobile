import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import GoogleSignInPresenter from './GoogleSignInPresenter';
import authService, { ProviderAuthDto } from 'src/services/authService';

interface GoogleSignInProps {
  type: 'login' | 'register';
  onSuccess?: (response: any) => void;
  onError?: (error: string) => void;
}

const GoogleSignIn = ({ type, onSuccess, onError }: GoogleSignInProps) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: '592794634648-cq50d6pb3llivmbc6bt5a1jee0ashd86.apps.googleusercontent.com',
      offlineAccess: true,
      scopes: ['profile', 'email'],
    });
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Check if Google Play Services is available (Android only)
      await GoogleSignin.hasPlayServices();

      // Sign in and get user info
      const signInResult = await GoogleSignin.signIn();
      
      // Get the ID token for backend authentication
      const { idToken } = await GoogleSignin.getTokens();

      // Check if sign-in was successful and extract user info
      if (signInResult.type === 'success') {
        const userData = signInResult.data.user;

        // Prepare provider auth data using the correct ProviderAuthDto interface
        const providerAuthDto: ProviderAuthDto = {
          providerAuthToken: idToken,
          providerName: 'google',
          // Additional info can be extracted from userData if needed
          additionalInfo: {
            firstName: userData.givenName || '',
            lastName: userData.familyName || '',
          }
        };

        // Call appropriate authService method based on type
        let response;
        if (type === 'login') {
          response = await authService.providerLogin(providerAuthDto);
        } else {
          response = await authService.providerRegister(providerAuthDto);
        }

        // Display server response
        Alert.alert(
          `Google ${type === 'login' ? 'Login' : 'Register'} Response`,
          JSON.stringify(response, null, 2),
          [
            {
              text: 'OK',
              onPress: () => {
                if (onSuccess) {
                  onSuccess(response);
                }
              }
            }
          ]
        );
      } else {
        // Handle cancelled sign-in
        if (onError) {
          onError('Sign-in was cancelled');
        }
      }

    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'You cancelled the sign-in.';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Sign-in is already in progress.';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services not available.';
      } else if (error?.response?.data) {
        // Server error response
        Alert.alert(
          `Google ${type === 'login' ? 'Login' : 'Register'} Error`,
          JSON.stringify(error.response.data, null, 2)
        );
        errorMessage = error.response.data.message || errorMessage;
      }

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleSignInPresenter 
      onPress={handleGoogleSignIn} 
      isLoading={isLoading}
      type={type}
    />
  );
};

export default GoogleSignIn; 