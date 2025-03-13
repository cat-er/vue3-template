import { LAYOUT } from "../base";
import type { AppRouteRecordRaw } from "@/router/types";

export default {
  path: "/work",
  name: "work",
  component: LAYOUT,
  meta: {
    menu: true,
    menuLabel: "Work",
    order: 0
  },
  children: [
    {
      path: "flightBoard",
      name: "flightBoard",
      meta: {
        menu: true,
        menuLabel: "Flight board"
      },
      component: () => import("@/views/work/flightBoard/index.vue")
    }
  ]
} as AppRouteRecordRaw;
