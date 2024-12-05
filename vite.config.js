// import react from '@vitejs/plugin-react';

// export default {
//   plugins: [react()],
//   build: {
//     outDir: 'dist',
//     rollupOptions: {
//       input: {
//         main: 'index.html'
//       }
//     }
//   }
// };

import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
  define: {
    'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(process.env.VITE_FIREBASE_API_KEY),
    'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.VITE_FIREBASE_AUTH_DOMAIN),
    'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(process.env.VITE_FIREBASE_PROJECT_ID),
    'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.VITE_FIREBASE_STORAGE_BUCKET),
    'process.env.VITE_FIREBASE_SENDER_ID': JSON.stringify(process.env.VITE_FIREBASE_SENDER_ID),
    'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(process.env.VITE_FIREBASE_APP_ID),
    'process.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL), // Added VITE_BACKEND_URL
  },
};