
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Using (process as any) to avoid TypeScript error if @types/node is missing
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Allow usage of process.env.API_KEY in the code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});
