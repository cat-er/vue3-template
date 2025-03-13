import type { Router } from "vue-router";
import { NProgressClose } from "@/utils/nprogress";
import { isvalidatePass } from "@/utils/auth";

export default function permissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    if (to.path === "/forbidden") {
      // 如果目标路由已经是禁止页面，直接导航
      next();
    } else if (await isvalidatePass()) {
      // 权限验证通过，则继续导航
      next();
    } else {
      // 权限验证失败，重定向到禁止页面
      next("/forbidden");
    }
  });

  router.afterEach(() => {
    NProgressClose();
  });
}
