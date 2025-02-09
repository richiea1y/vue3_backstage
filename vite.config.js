import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'
// import type { OutputBundle } from 'rollup';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: process.env.NODE_ENV === 'production' ? '/vue3_backstage/' : './',
    plugins: [
      vue(),
      tailwindcss(),
      Components({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'icon', // 自定義icon前綴
            enabledCollections: ['ep'], // 使用 Element Plus icon set
          }),
        ],
      }),
      createSvgIconsPlugin({
        // 指定需要CACHE的圖標文件夾
        iconDirs: [fileURLToPath(new URL('./src/assets/img/icons', import.meta.url))],
        // 指定symbolId格式
        symbolId: 'icon-[name]',
      }),
      Icons({
        autoInstall: true, // 如果未安裝會自動安裝icon library
      }),
      // vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@/types': fileURLToPath(new URL('./src/types', import.meta.url)),
        '@/styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
        '@/assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@/composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
        '@/components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@/utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@/plugin': fileURLToPath(new URL('./src/plugin', import.meta.url)),
      }
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_BASE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.toString().split('node_modules/')[1].split('/')[0].includes('element-plus')) {
                return 'element-plus'
              } else {
                return 'vendor'
              }
            }
          },
          chunkFileNames: "js/[name].[hash].js",
          entryFileNames: "js/[name].[hash].js",
          assetFileNames: (assetInfo) => {
            const asset = assetInfo
            const info = asset.name.split('.')
            const extType = info[info.length - 1]
            if (/png|jpe?g|gif|svg|webp|ico/i.test(extType)) {
              return `img/[name]-[hash][extname]`
            }
            if (/css/i.test(extType)) {
              return `css/[name]-[hash][extname]`
            }
            if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
              return `fonts/[name]-[hash][extname]`
            }
            return `assets/[name]-[hash][extname]`
          },
        }
      },
      minify: 'esbuild',  // 使用 esbuild 壓縮
    },
    esbuild: {
      //drop: ['console', 'debugger'],  // 移除 console 和 debugger
    },
    css: {
      devSourcemap: true,
    }
  }


})
