import { createRouter, createWebHistory } from "vue-router";
import createRouteGuard from "./guard";
import { NOT_FOUND, REDIRECT, FORBIDDEN } from "./routes/base";
import { APP_ROUTES } from "./routes/appRoutes";

// const base = import.meta.env.VITE_ENV === "production" ? `/${import.meta.env.VITE_PUBLIC_PATH}` : "/";
const base = `/${import.meta.env.VITE_PUBLIC_PATH}`;

const router = createRouter({
  history: createWebHistory(base),
  routes: [NOT_FOUND, REDIRECT, FORBIDDEN, ...APP_ROUTES]
});

// 调用路由守卫
createRouteGuard(router);
export default router;
