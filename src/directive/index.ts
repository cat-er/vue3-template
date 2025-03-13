/**
 * 统一管理自定义指令
 */

import { App } from "vue";
import noChineseDirective from "./noChineseDirective";

const directives = {
  noChinese: noChineseDirective
};

export default {
  install(app: App) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key as keyof typeof directives]);
    });
  }
};
