import { LAYOUT } from "../base";
import type { AppRouteRecordRaw } from "@/router/types";

export default {
  path: "/manage",
  name: "manage",
  component: LAYOUT,
  meta: {
    menu: true,
    menuLabel: "Manage",
    order: 1
  },
  children: [
    {
      path: "documents",
      name: "documents",
      meta: {
        menu: true,
        menuLabel: "Documents"
      },
      component: () => import("@/views/manage/documents/index.vue")
    },
    {
      path: "templates",
      name: "templates",
      meta: {
        menu: true,
        menuLabel: "Templates"
      },
      component: () => import("@/views/manage/templates/index.vue")
    }
  ]
} as AppRouteRecordRaw;
