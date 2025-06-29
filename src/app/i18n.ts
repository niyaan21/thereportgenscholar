
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { z } from 'zod';

// Define the structure of your translation file
const translationSchema = z.object({
  // Login Page
  welcomeBack: z.string(),
  loginDescription: z.string(),
  signInWithGoogle: z.string(),
  or: z.string(),
  emailLabel: z.string(),
  passwordLabel: z.string(),
  forgotPassword: z.string(),
  loginWithEmail: z.string(),
  noAccount: z.string(),
  signUp: z.string(),
  // Signup Page
  createAccount: z.string(),
  signupDescription: z.string(),
  signupWithGoogle: z.string(),
  passwordMinChars: z.string(),
  createAccountWithEmail: z.string(),
  haveAccount: z.string(),
  login: z.string(),
  // Account Settings
  accountSettingsTitle: z.string(),
  accountSettingsDescription: z.string(),
  generalTab: z.string(),
  researchHistoryTab: z.string(),
  languageRegionSectionTitle: z.string(),
  languageRegionDescription: z.string(),
  interfaceLanguageLabel: z.string(),
  languageChangeToastTitle: z.string(),
  languageChangeToastDescription: z.string(),
  lang_en: z.string(),
  lang_es: z.string(),
  lang_fr: z.string(),
  lang_de: z.string(),
  lang_ja: z.string(),
});

type Translation = z.infer<typeof translationSchema>;

// Helper to fetch and validate translations
async function fetchTranslations(lang: string): Promise<Translation | object> {
  try {
    const response = await fetch(`/locales/${lang}/translation.json`);
    if (!response.ok) {
      console.error(`Failed to fetch translation for ${lang}: ${response.statusText}`);
      return {};
    }
    const data = await response.json();
    const validation = translationSchema.safeParse(data);
    if (validation.success) {
      return validation.data;
    } else {
      console.error(`Invalid translation file for ${lang}:`, validation.error.issues);
      return {};
    }
  } catch (error) {
    console.error(`Error loading translation file for ${lang}:`, error);
    return {};
  }
}

const resources = {
  en: {
    translation: {
      welcomeBack: 'Welcome Back!',
      loginDescription: 'Log in to continue your research with Foss AI.',
      signInWithGoogle: 'Sign in with Google',
      or: 'OR',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      forgotPassword: 'Forgot Password?',
      loginWithEmail: 'Log In with Email',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
      createAccount: 'Create an Account',
      signupDescription: 'Enter your email and password to join Foss AI.',
      signupWithGoogle: 'Sign up with Google',
      passwordMinChars: '•••••••• (min. 6 characters)',
      createAccountWithEmail: 'Create Account with Email',
      haveAccount: 'Already have an account?',
      login: 'Log In',
      accountSettingsTitle: 'Account Settings',
      accountSettingsDescription: 'Manage your Foss AI profile, preferences, and security settings.',
      generalTab: 'General',
      researchHistoryTab: 'Research History',
      languageRegionSectionTitle: 'Language & Region',
      languageRegionDescription: 'Set your language for the UI. AI responses are not yet translated.',
      interfaceLanguageLabel: 'Interface Language',
      languageChangeToastTitle: 'Language Updated',
      languageChangeToastDescription: 'Interface language set to {{language}}.',
      lang_en: 'English',
      lang_es: 'Español (Spanish)',
      lang_fr: 'Français (French)',
      lang_de: 'Deutsch (German)',
      lang_ja: '日本語 (Japanese)',
    },
  },
  es: {
    translation: {
      welcomeBack: '¡Bienvenido de Nuevo!',
      loginDescription: 'Inicia sesión para continuar tu investigación con Foss AI.',
      signInWithGoogle: 'Iniciar sesión con Google',
      or: 'O',
      emailLabel: 'Correo Electrónico',
      passwordLabel: 'Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      loginWithEmail: 'Iniciar Sesión con Correo',
      noAccount: '¿No tienes una cuenta?',
      signUp: 'Regístrate',
      createAccount: 'Crear una Cuenta',
      signupDescription: 'Ingresa tu correo y contraseña para unirte a Foss AI.',
      signupWithGoogle: 'Registrarse con Google',
      passwordMinChars: '•••••••• (mín. 6 caracteres)',
      createAccountWithEmail: 'Crear Cuenta con Correo',
      haveAccount: '¿Ya tienes una cuenta?',
      login: 'Iniciar Sesión',
      accountSettingsTitle: 'Configuración de la Cuenta',
      accountSettingsDescription: 'Administra tu perfil, preferencias y configuraciones de seguridad de Foss AI.',
      generalTab: 'General',
      researchHistoryTab: 'Historial de Investigación',
      languageRegionSectionTitle: 'Idioma y Región',
      languageRegionDescription: 'Establece tu idioma para la interfaz. Las respuestas de la IA aún no están traducidas.',
      interfaceLanguageLabel: 'Idioma de la Interfaz',
      languageChangeToastTitle: 'Idioma Actualizado',
      languageChangeToastDescription: 'El idioma de la interfaz se ha establecido en {{language}}.',
      lang_en: 'English (Inglés)',
      lang_es: 'Español',
      lang_fr: 'Français (Francés)',
      lang_de: 'Deutsch (Alemán)',
      lang_ja: '日本語 (Japonés)',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
