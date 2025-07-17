import api from "../interceptors/api";
import storageService from "../services/storageService";

/**
 * Utilitaires pour tester le système de refresh token
 */
export class TokenTestUtils {
  /**
   * Teste la fonctionnalité de refresh token
   */
  static async testTokenRefresh(): Promise<void> {
    try {
      // 🔄 Test du refresh token...
      
      // Vérifier que nous avons un refresh token
      const refreshToken = await storageService.getRefreshToken();
      if (!refreshToken) {
        console.error("❌ Aucun refresh token trouvé");
        return;
      }
      
      // ✅ Refresh token trouvé
      
      // Faire un appel API protégé pour déclencher le refresh si nécessaire
      const response = await api.get("/users/profile");
      // ✅ Appel API réussi: response.status
      
    } catch (error: any) {
      console.error("❌ Erreur lors du test de refresh:", error);
    }
  }

  /**
   * Affiche les informations de debug sur les tokens
   */
  static async debugTokens(): Promise<void> {
    try {
      const accessToken = await storageService.getAccessToken();
      const refreshToken = await storageService.getRefreshToken();
      
      // 🔍 Debug des tokens:
      // Access token: accessToken ? "✅ Présent" : "❌ Absent"
      // Refresh token: refreshToken ? "✅ Présent" : "❌ Absent"
      
      if (accessToken) {
        // Décoder le token pour voir son expiration (sans vérification)
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const exp = new Date(payload.exp * 1000);
          const now = new Date();
          
          // Expiration du token: exp.toISOString()
          // Temps restant: Math.round((exp.getTime() - now.getTime()) / 1000) secondes
          // Token expiré: exp < now ? "🔴 OUI" : "🟢 NON"
        } catch (decodeError) {
          console.error("Erreur lors du décodage du token:", decodeError);
        }
      }
      
    } catch (error) {
      console.error("Erreur lors du debug des tokens:", error);
    }
  }

  /**
   * Force l'expiration du token d'accès pour tester le refresh
   */
  static async forceTokenExpiration(): Promise<void> {
    try {
      // Sauvegarder un token invalide pour forcer le refresh
      await storageService.setAccessToken("invalid_token_for_testing");
      // 🧪 Token d'accès forcé à expirer pour test
    } catch (error) {
      console.error("Erreur lors de la force d'expiration:", error);
    }
  }

  /**
   * Teste spécifiquement la différenciation entre erreurs d'autorisation et expiration
   */
  static async testAuthorizationVsExpiration(): Promise<void> {
    // 🧪 Test de différenciation des erreurs 401...

    try {
      // 1. Test avec un token expiré
      await this.forceTokenExpiration();
      // 📋 Test 1: Token expiré (devrait déclencher refresh)
      
      try {
        await api.get("/users/profile");
        // ✅ Token expiré géré correctement avec refresh
      } catch (error: any) {
        // ❌ Échec du refresh pour token expiré: error.response?.data?.message
      }

      // 2. Attendre un peu pour laisser le refresh se terminer
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Test avec un appel vers une ressource qui pourrait retourner 401 pour permissions
      // (à adapter selon vos endpoints spécifiques)
      // 📋 Test 2: Appel vers ressource avec potentiel 401 de permission
      
      try {
        // Remplacez par un endpoint qui peut retourner 401 pour permissions insuffisantes
        await api.get("/admin/users"); // Exemple d'endpoint admin
        // ✅ Accès autorisé ou endpoint non protégé
      } catch (error: any) {
        const message = error.response?.data?.message;
        // 📝 Erreur 401 reçue: "${message}"
        
        if (error.response?.status === 401) {
          // Vérifier si c'est une erreur de permission (ne devrait pas déclencher refresh)
          // 🔍 Type d'erreur 401 détecté: 
          // message?.includes("autorisé") || message?.includes("permission") 
          //   ? "❌ Permission refusée (correct - pas de refresh)"
          //   : "🔄 Expiration de token (devrait déclencher refresh)"
        }
      }

    } catch (error) {
      console.error("Erreur durant le test:", error);
    }
  }

  /**
   * Affiche tous les messages d'erreur capturés par l'intercepteur
   */
  static debugInterceptorMessages(): void {
    // 📋 Messages d'erreur qui déclenchent un refresh:
    
    const TOKEN_EXPIRATION_MESSAGES = [
      "Le token d'accès est manquant ou mal formaté",
      "Le token d'accès est manquant", 
      "Token invalide",
      "Cet utilisateur n'existe pas, veuillez vous re-connecter. Votre session a été révoquée.",
      "Le token a expiré. Veuillez vous reconnecter.",
      "Le token est invalide. Veuillez vérifier votre authentification.",
      "L'utilisateur actuellement connecté n'existe pas, veuillez vous reconnecter",
      "Token invalide ou expiré",
      "Utilisateur non trouvé",
      "Échec du rafraîchissement du token",
      "Authentification requise",
      "Non autorisé - Token invalide",
      "Non autorisé - Token manquant",
      "jwt expired",
      "jwt malformed", 
      "invalid token",
      "token expired"
    ];

    // TOKEN_EXPIRATION_MESSAGES.forEach((msg, index) => {
    //   console.log(`${index + 1}. "${msg}"`);
    // });

    // 📋 Exemples de messages qui NE déclenchent PAS de refresh:
    // 1. "Vous n'êtes pas autorisé à accéder aux ressources de cet utilisateur"
    // 2. "Accès refusé"
    // 3. "Permissions insuffisantes"
    // 4. "Plateforme non supportée"
  }

  /**
   * Test complet du système de refresh
   */
  static async runFullTest(): Promise<void> {
    // 🚀 === Test complet du système de refresh token ===
    
    await this.debugTokens();
    
    this.debugInterceptorMessages();
    
    await this.testAuthorizationVsExpiration();
    
    await this.testTokenRefresh();
    
    // ✅ === Test complet terminé ===
  }
}

// Fonction globale pour faciliter les tests en dev
if (__DEV__) {
  (global as any).TokenTestUtils = TokenTestUtils;
} 