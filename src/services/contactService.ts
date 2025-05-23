import api from "../interceptors/api";

// DTOs et interfaces pour le contact
interface ContactFormDto {
  civility: 'M.' | 'Mme.' | 'Non précisé';
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  postal_code: string;
  city: string;
  principal_activity: string;
  message: string;
  agency_id?: number;
}

const contactService = {
  // POST /contact - Envoyer un formulaire de contact
  sendContactForm: async (contactData: ContactFormDto): Promise<any> => {
    try {
      const response = await api.post("/contact", contactData);
      return await response.data;
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire de contact:", error);
      throw error;
    }
  },
};

export default contactService; 