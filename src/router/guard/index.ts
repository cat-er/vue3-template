import type { Router } from "vue-router";
import isLoginGuard from "./isLogin";
import permissionGuard from "./permission";

const createRouteGuard = (router: Router) => {
  isLoginGuard(router);
  permissionGuard(router);
};

export default createRouteGuard;
