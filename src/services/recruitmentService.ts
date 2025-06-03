import api from "../interceptors/api";

// DTOs et interfaces pour le recrutement
interface RecruitmentFormDto {
  civility: 'M.' | 'Mme.' | 'Non précisé';
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  desiredPosition: 'Technicien' | 'Ingénieur' | 'Commercial' | 'Administratif';
  currentPosition: string;
  address: string;
  postalCode: string;
  city: string;
  message: string;
  cvFile: File;
  motivationFile?: File;
}

const recruitmentService = {
  // POST /recruitment - Envoyer un formulaire de candidature (PUBLIC)
  sendRecruitmentForm: async (recruitmentData: RecruitmentFormDto): Promise<any> => {
    try {
      const formData = new FormData();
      
      // Ajouter tous les champs du formulaire avec les nouvelles variables camelCase
      formData.append('civility', recruitmentData.civility);
      formData.append('firstName', recruitmentData.firstName);
      formData.append('lastName', recruitmentData.lastName);
      formData.append('email', recruitmentData.email);
      formData.append('phoneNumber', recruitmentData.phoneNumber);
      formData.append('desiredPosition', recruitmentData.desiredPosition);
      formData.append('currentPosition', recruitmentData.currentPosition);
      formData.append('address', recruitmentData.address);
      formData.append('postalCode', recruitmentData.postalCode);
      formData.append('city', recruitmentData.city);
      formData.append('message', recruitmentData.message);
      
      // Ajouter les fichiers
      formData.append('cvFile', recruitmentData.cvFile);
      if (recruitmentData.motivationFile) {
        formData.append('motivationFile', recruitmentData.motivationFile);
      }

      const response = await api.post("/recruitment", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return await response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default recruitmentService; 