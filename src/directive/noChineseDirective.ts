/**
 * 禁止输入中文
 * 用法: v-no-chinese="'你想提示的字符...'"  or  v-no-chinese  只提示默认设置的字符
 */

import { Directive } from "vue";
import { message } from "ant-design-vue";

const noChineseDirective: Directive = {
  mounted(el, binding) {
    el.addEventListener("input", (event: Event) => {
      const input = event.target as HTMLInputElement;
      const regex = /[\u4E00-\u9FFF]/g;

      if (regex.test(input.value)) {
        // 阻止这次输入
        input.value = input.value.replace(regex, "");

        // 触发input事件更新v-model
        input.dispatchEvent(new Event("input"));

        // 弹出提示框
        message.info(binding.value || "English inputs only");
      }
    });
  }
};

export default noChineseDirective;
