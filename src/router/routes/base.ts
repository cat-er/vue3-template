import type { RouteRecordRaw } from "vue-router";

export const LAYOUT = () => import("@/layout/mainLayout.vue");

// 重定向
export const REDIRECT: RouteRecordRaw = {
  path: "/",
  redirect: "/work/flightBoard"
};

// 404
export const NOT_FOUND: RouteRecordRaw = {
  path: "/:pathMatch(.*)*",
  name: "notFound",
  component: () => import("@/views/not-found/404.vue")
};

// 403
export const FORBIDDEN: RouteRecordRaw = {
  path: "/forbidden",
  name: "forbidden ",
  component: () => import("@/views/not-found/403.vue")
};
