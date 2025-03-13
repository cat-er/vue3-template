import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { resolve } from "path";
import antResolver from "./plugin/antResolver";
// import autogeneration from "./plugin/autogeneration";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), antResolver()],
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "../src")
      },
      {
        find: "assets",
        replacement: resolve(__dirname, "../src/assets")
      },
      {
        find: "vue-i18n",
        replacement: "vue-i18n/dist/vue-i18n.cjs.js" // Resolve the i18n warning issue
      }
    ]
  },
  build: {
    rollupOptions: {
      output: {
        // 将pinia的全局库实例打包进vendor，避免和页面一起打包造成资源重复引入
        manualChunks(id) {
          if (id.includes(resolve(__dirname, "/src/store/index.ts"))) {
            return "vendor";
          }
        }
      }
    }
  }
});
