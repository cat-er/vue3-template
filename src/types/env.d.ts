/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_ENV: "development" | "production";
  readonly VITE_API_BASE_URL: string;
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_PROXY_URL: string;
  // 你可以在这里添加其他的环境变量类型定义
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
