import { mergeConfig, loadEnv } from "vite";
import baseConfig from "./vite.config.base";

// loadEnv()加载根目录中的env文件
const env = loadEnv("production", process.cwd());
export default mergeConfig(
  {
    mode: "production",
    base: `/${env.VITE_PUBLIC_PATH}/`,
    plugins: [],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            arco: ["@arco-design/web-vue"],
            chart: ["echarts", "vue-echarts"],
            vue: ["vue", "vue-router", "pinia", "@vueuse/core", "vue-i18n"]
          }
        }
      },
      chunkSizeWarningLimit: 2000
    }
  },
  baseConfig
);
