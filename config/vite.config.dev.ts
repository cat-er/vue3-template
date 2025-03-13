import { loadEnv, mergeConfig } from "vite";
import baseConfig from "./vite.config.base";
import dns from "dns";

dns.setDefaultResultOrder("verbatim");
// Node.js 在 v17 以下版本中默认会对 DNS 解析地址的结果进行重新排序。当访问 localhost 时，浏览器使用 DNS 来解析地址，这个地址可能与 Vite 正在监听的地址不同。当地址不一致时，Vite 会打印出来。 可以设置 dns.setDefaultResultOrder('verbatim') 来禁用这个重新排序的行为。Vite 会将改地址打印为 localhost。

const env = loadEnv("development", process.cwd());
export default mergeConfig(
  {
    mode: "development",
    base: `/${env.VITE_PUBLIC_PATH}/`,
    server: {
      host: "localhost",
      open: true,
      fs: {
        strict: true
      },
      proxy: {
        [env.VITE_API_BASE_URL]: {
          target: `${env.VITE_API_PROXY_URL}`,
          changeOrigin: true
        }
      }
    },
    plugins: []
  },
  baseConfig
);
