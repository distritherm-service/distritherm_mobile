import { Animated, Dimensions } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderPresenter from "./HeaderPresenter";
import { Agency } from "src/types/Agency";
import agenciesService from "src/services/agenciesService";
import { ms } from "react-native-size-matters";

const { height: screenHeight } = Dimensions.get("window");

// Clé pour AsyncStorage
const SELECTED_AGENCY_KEY = 'selectedAgency';
const DEFAULT_AGENCY_NAME = 'Taverny (95150)';

interface HeaderProps {
  isScrollingDown?: boolean;
}

const Header = ({ isScrollingDown = false }: HeaderProps) => {
  const [agencies, setAgencies] = useState<Agency[] | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const { register, handleSubmit, control, formState: { errors } } = useForm();

  // Animations pour bottom sheet
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  
  // Animation pour header sticky
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const backdropOpacity = backdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  // AsyncStorage functions
  const saveSelectedAgency = async (agency: Agency) => {
    try {
      const agencyData = JSON.stringify(agency);
      await AsyncStorage.setItem(SELECTED_AGENCY_KEY, agencyData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'agence:', error);
    }
  };

  const loadSelectedAgency = async (): Promise<Agency | null> => {
    try {
      const savedAgencyData = await AsyncStorage.getItem(SELECTED_AGENCY_KEY);
      if (savedAgencyData) {
        const parsedAgency = JSON.parse(savedAgencyData);
        return parsedAgency;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'agence:', error);
      return null;
    }
  };

  const findAgencyByName = (agencyName: string): Agency | undefined => {
    return agencies?.find(agency => 
      agency.name.toLowerCase().includes(agencyName.toLowerCase())
    );
  };

  const findAgencyById = (agencyId: number): Agency | undefined => {
    return agencies?.find(agency => agency.id === agencyId);
  };

  const setDefaultAgency = () => {
    if (agencies) {
      const tavernyAgency = findAgencyByName(DEFAULT_AGENCY_NAME);
      if (tavernyAgency) {
        setSelectedAgency(tavernyAgency);
        saveSelectedAgency(tavernyAgency);
      } else if (agencies.length > 0) {
        // Si Taverny n'existe pas, prendre la première agence
        setSelectedAgency(agencies[0]);
        saveSelectedAgency(agencies[0]);
      }
    }
  };

  // Effects
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setIsLoading(true);
        const agenciesData: any = await agenciesService.getAllAgencies();
        
        // Handle different response structures
        if (agenciesData && Array.isArray(agenciesData.agencies)) {
          setAgencies(agenciesData.agencies);
        } else if (agenciesData && Array.isArray(agenciesData.data)) {
          setAgencies(agenciesData.data);
        } else if (agenciesData && Array.isArray(agenciesData)) {
          setAgencies(agenciesData);
        } else {
          setAgencies([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des agences:", error);
        setAgencies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  // Effect pour charger l'agence sauvegardée ou définir Taverny par défaut
  useEffect(() => {
    const initializeSelectedAgency = async () => {
      if (agencies && agencies.length > 0) {
        // Essayer de charger l'agence sauvegardée
        const savedAgency = await loadSelectedAgency();
        
        if (savedAgency) {
          // Vérifier que l'agence sauvegardée existe toujours dans la liste actuelle
          const currentAgency = findAgencyById(savedAgency.id);
          if (currentAgency) {
            setSelectedAgency(currentAgency);
            return;
          }
        }
        
        // Si pas d'agence sauvegardée ou agence n'existe plus, définir Taverny par défaut
        setDefaultAgency();
      }
    };

    if (!isLoading && agencies) {
      initializeSelectedAgency();
    }
  }, [agencies, isLoading]);

  // Effect pour les animations du bottom sheet
  useEffect(() => {
    if (isBottomSheetVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),

        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isBottomSheetVisible]);

  // Effect pour l'animation du header sticky
  useEffect(() => {
    Animated.timing(headerTranslateY, {
      toValue: isScrollingDown ? -ms(120) : 0, // -120 pour cacher complètement le header
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isScrollingDown, headerTranslateY]);

  // Handlers
  const handleAgencySelect = async (agency: Agency) => {
    setSelectedAgency(agency);
    setIsBottomSheetVisible(false);
    await saveSelectedAgency(agency);
  };

  const openBottomSheet = () => {
    setIsBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  return (
    <HeaderPresenter
      agencies={agencies}
      selectedAgency={selectedAgency}
      isBottomSheetVisible={isBottomSheetVisible}
      slideAnim={slideAnim}
      backdropOpacity={backdropOpacity}
      headerTranslateY={headerTranslateY}
      onAgencySelect={handleAgencySelect}
      onOpenBottomSheet={openBottomSheet}
      onCloseBottomSheet={closeBottomSheet}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
    />
  );
};

export default Header;
