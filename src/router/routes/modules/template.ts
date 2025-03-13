import { LAYOUT } from "../base";
import type { AppRouteRecordRaw } from "@/router/types";

export default {
  path: "/template",
  name: "template",
  component: LAYOUT,
  children: [
    {
      path: "create",
      name: "templateCreate",
      component: () => import("@/views/template/create/index.vue")
    },
    {
      path: "edit",
      name: "templateEdit",
      component: () => import("@/views/template/create/index.vue")
    }
  ]
} as AppRouteRecordRaw;
