import { LAYOUT } from "../base";
import type { AppRouteRecordRaw } from "@/router/types";

export default {
  path: "/amount",
  name: "amount",
  // component: LAYOUT,
  meta: {
    menu: false,
    menuLabel: "Amount",
    order: 2
  },
  children: [
    {
      path: "list",
      name: "amountList",
      meta: {
        menu: true,
        menuLabel: "List"
      },
      component: () => import("@/views/amount/list/index.vue")
    },
    {
      path: "balance",
      name: "amountBalance",
      meta: {
        menu: true,
        menuLabel: "Balance"
      },
      component: () => import("@/views/amount/balance/index.vue")
    }
  ]
} as AppRouteRecordRaw;
