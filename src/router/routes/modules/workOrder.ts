import { LAYOUT } from "../base";
import type { AppRouteRecordRaw } from "@/router/types";

export default {
  path: "/workOrders",
  name: "workOrders",
  component: LAYOUT,
  children: [
    {
      path: "create",
      name: "workOrdersCreate",
      component: () => import("@/views/workOrder/create/index.vue")
    },
    {
      path: "detail",
      name: "workOrdersDetail",
      component: () => import("@/views/workOrder/detail/index.vue")
    }
  ]
} as AppRouteRecordRaw;
