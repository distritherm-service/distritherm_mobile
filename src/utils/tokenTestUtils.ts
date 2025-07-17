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
      console.log("🔄 Test du refresh token...");
      
      // Vérifier que nous avons un refresh token
      const refreshToken = await storageService.getRefreshToken();
      if (!refreshToken) {
        console.error("❌ Aucun refresh token trouvé");
        return;
      }
      
      console.log("✅ Refresh token trouvé");
      
      // Faire un appel API protégé pour déclencher le refresh si nécessaire
      const response = await api.get("/users/profile");
      console.log("✅ Appel API réussi:", response.status);
      
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
      
      console.log("🔍 Debug des tokens:");
      console.log("Access token:", accessToken ? "✅ Présent" : "❌ Absent");
      console.log("Refresh token:", refreshToken ? "✅ Présent" : "❌ Absent");
      
      if (accessToken) {
        // Décoder le token pour voir son expiration (sans vérification)
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const exp = new Date(payload.exp * 1000);
          const now = new Date();
          
          console.log("Expiration du token:", exp.toISOString());
          console.log("Temps restant:", Math.round((exp.getTime() - now.getTime()) / 1000), "secondes");
          console.log("Token expiré:", exp < now ? "🔴 OUI" : "🟢 NON");
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
      console.log("🧪 Token d'accès forcé à expirer pour test");
    } catch (error) {
      console.error("Erreur lors de la force d'expiration:", error);
    }
  }

  /**
   * Teste spécifiquement la différenciation entre erreurs d'autorisation et expiration
   */
  static async testAuthorizationVsExpiration(): Promise<void> {
    console.log("🧪 Test de différenciation des erreurs 401...");

    try {
      // 1. Test avec un token expiré
      await this.forceTokenExpiration();
      console.log("📋 Test 1: Token expiré (devrait déclencher refresh)");
      
      try {
        await api.get("/users/profile");
        console.log("✅ Token expiré géré correctement avec refresh");
      } catch (error: any) {
        console.log("❌ Échec du refresh pour token expiré:", error.response?.data?.message);
      }

      // 2. Attendre un peu pour laisser le refresh se terminer
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Test avec un appel vers une ressource qui pourrait retourner 401 pour permissions
      // (à adapter selon vos endpoints spécifiques)
      console.log("📋 Test 2: Appel vers ressource avec potentiel 401 de permission");
      
      try {
        // Remplacez par un endpoint qui peut retourner 401 pour permissions insuffisantes
        await api.get("/admin/users"); // Exemple d'endpoint admin
        console.log("✅ Accès autorisé ou endpoint non protégé");
      } catch (error: any) {
        const message = error.response?.data?.message;
        console.log(`📝 Erreur 401 reçue: "${message}"`);
        
        if (error.response?.status === 401) {
          // Vérifier si c'est une erreur de permission (ne devrait pas déclencher refresh)
          console.log("🔍 Type d'erreur 401 détecté:", 
            message?.includes("autorisé") || message?.includes("permission") 
              ? "❌ Permission refusée (correct - pas de refresh)"
              : "🔄 Expiration de token (devrait déclencher refresh)"
          );
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
    console.log("📋 Messages d'erreur qui déclenchent un refresh:");
    
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

    TOKEN_EXPIRATION_MESSAGES.forEach((msg, index) => {
      console.log(`${index + 1}. "${msg}"`);
    });

    console.log("\n📋 Exemples de messages qui NE déclenchent PAS de refresh:");
    console.log('1. "Vous n\'êtes pas autorisé à accéder aux ressources de cet utilisateur"');
    console.log('2. "Accès refusé"');
    console.log('3. "Permissions insuffisantes"');
    console.log('4. "Plateforme non supportée"');
  }

  /**
   * Test complet du système de refresh
   */
  static async runFullTest(): Promise<void> {
    console.log("🚀 === Test complet du système de refresh token ===\n");
    
    await this.debugTokens();
    console.log("\n");
    
    this.debugInterceptorMessages();
    console.log("\n");
    
    await this.testAuthorizationVsExpiration();
    console.log("\n");
    
    await this.testTokenRefresh();
    
    console.log("\n✅ === Test complet terminé ===");
  }
}

// Fonction globale pour faciliter les tests en dev
if (__DEV__) {
  (global as any).TokenTestUtils = TokenTestUtils;
} 