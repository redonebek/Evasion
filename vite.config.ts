import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement (ex: depuis .env ou Vercel Environment Variables)
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    // Sur Vercel, on déploie généralement à la racine, donc on retire "base: './'"
    // pour éviter des problèmes de routing si l'app évolue.
    define: {
      // Remplace process.env.API_KEY par sa valeur réelle lors du build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});