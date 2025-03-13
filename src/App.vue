<template>
  <a-config-provider :locale="local">
    <RouterView />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed} from "vue";
import { RouterView } from "vue-router";
import useLocalSetting from "@/hooks/useLocalSetting";

import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";
import { LocaleKey } from "@/types/enum";


console.log("当前环境：", import.meta.env);

// 语言
const { currentLocale } = useLocalSetting();
const local = computed(() => {
  switch (currentLocale.value) {
    case LocaleKey.En:
      return enUS;
    case LocaleKey.Cn:
      return zhCN;
    default:
      return enUS;
  }
});

</script>
