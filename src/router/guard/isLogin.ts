import type { Router } from "vue-router";
import { NProgressStart } from "@/utils/nprogress";
import { getUserInfoFromStorage, toLogin } from "@/utils/auth";
import { notifyError } from "@/utils/notify";

// 定义白名单数组 这些路径不需要登录验证
// const whiteList = [];
// 检查当前路由是否在白名单中
// if (whiteList.includes(to.path))

// 判断是否登录
export default function isLoginGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgressStart();
    if (getUserInfoFromStorage()) {
      next(); // 已登录，直接通过
    } else {
      console.log("未登录!");
      notifyError("Please login!");
      toLogin(); // 跳转到登录页面
    }
  });
}
