import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement (ex: depuis .env ou GitHub Secrets)
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    // 'base' défini sur './' permet à l'application de fonctionner dans un sous-répertoire
    // C'est essentiel pour un déploiement sur https://user.github.io/repo/
    base: './', 
    define: {
      // Remplace process.env.API_KEY par sa valeur réelle lors du build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});