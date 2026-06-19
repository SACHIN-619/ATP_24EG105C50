// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'
// // import tailwindcss from '@tailwindcss/vite'


// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react(),tailwindcss()],
// // })
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss()
//   ],
//   build: {
//     outDir: 'dist',
//     emptyOutDir: true
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 🌟 Step 1: Import the Tailwind v4 plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // 🌟 Step 2: Add the plugin instance to the array
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})