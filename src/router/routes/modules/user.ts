import { LAYOUT } from "../base";
import type { AppRouteRecordRaw } from "@/router/types";

export default {
  path: "/user",
  name: "user",
  component: LAYOUT,
  children: [
    {
      path: "center",
      name: "userCenter",
      component: () => import("@/views/user/center/index.vue")
    }
  ]
} as AppRouteRecordRaw;
