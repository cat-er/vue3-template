<template>
  <a-config-provider :locale="local">
    <RouterView />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { RouterView } from "vue-router";
import useLocalSetting from "@/hooks/useLocalSetting";
import setGlobalAntConf from "@/utils/globalAntConf";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";
import { LocaleKey } from "@/types/enum";
import { usePageLoadingStore, useUserStore } from "@/stores";
import { storeToRefs } from "pinia";

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

// 获取用户信息
const { changeLoading } = usePageLoadingStore();
const { setUserInfo } = useUserStore();
const { userInfoLoading } = storeToRefs(useUserStore());

watch(
  () => userInfoLoading.value,
  () => {
    changeLoading(userInfoLoading.value);
  }
);

onMounted(() => {
  setGlobalAntConf();
  // setUserInfo();
});
</script>
