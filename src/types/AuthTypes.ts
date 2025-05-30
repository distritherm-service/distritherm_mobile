export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  phoneNumber: string;
  siretNumber: string;
}

// Validation rules for forms
export const validationRules = {
  email: {
    required: "Email requis",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Veuillez entrer une adresse email valide",
    },
  },
  password: {
    required: "Mot de passe requis",
    minLength: {
      value: 8,
      message: "Le mot de passe doit contenir au moins 8 caractères",
    },
  },
  firstName: {
    required: "Prénom requis",
    minLength: {
      value: 2,
      message: "Le prénom doit contenir au moins 2 caractères",
    },
  },
  lastName: {
    required: "Nom requis",
    minLength: {
      value: 2,
      message: "Le nom doit contenir au moins 2 caractères",
    },
  },
  companyName: {
    required: "Nom de l'entreprise requis",
    minLength: {
      value: 2,
      message: "Le nom de l'entreprise doit contenir au moins 2 caractères",
    },
  },
  phoneNumber: {
    required: "Numéro de téléphone requis",
    pattern: {
      value: /^[\+]?[1-9][\d]{0,15}$/,
      message: "Veuillez entrer un numéro de téléphone valide",
    },
  },
  siretNumber: {
    required: "Numéro SIRET requis",
    pattern: {
      value: /^[0-9]{14}$/,
      message: "Le numéro SIRET doit contenir exactement 14 chiffres",
    },
  },
};

// Country options for select
export const countryOptions = [
  { label: "France", value: "FR" },
  { label: "États-Unis", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "Royaume-Uni", value: "UK" },
  { label: "Allemagne", value: "DE" },
  { label: "Espagne", value: "ES" },
  { label: "Italie", value: "IT" },
  { label: "Belgique", value: "BE" },
  { label: "Pays-Bas", value: "NL" },
  { label: "Suisse", value: "CH" },
];
