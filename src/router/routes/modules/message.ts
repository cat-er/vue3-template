import { LAYOUT } from "../base";
import type { AppRouteRecordRaw } from "@/router/types";

export default {
  path: "/message",
  name: "message",
  component: LAYOUT,
  meta: {
    menu: false,
    menuLabel: "Message",
    order: 5
  },
  children: [
    {
      path: "list",
      name: "messageList",
      meta: {
        menu: true,
        menuLabel: "List"
      },
      component: () => import("@/views/message/list/index.vue")
    },
  ]
} as AppRouteRecordRaw;

