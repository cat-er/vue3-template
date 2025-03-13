<template>
  <div class="order-detail-content">
    <keep-alive>
      <component :is="currentComponent"></component>
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { defineProps } from "vue";
import { DetailContentSegmentedEnum } from "../types";
import contentDetail from "./components/contentDetail.vue";
import contentHistory from "./components/contentHistory.vue";
import contentMessages from "./components/contentMessages.vue";
import contentProviders from "./components/contentProviders.vue";

interface Props {
  currentTab: DetailContentSegmentedEnum;
}

// 接收传入的当前选中的 tab
const props = defineProps<Props>();

// 组件映射
const componentMap = {
  [DetailContentSegmentedEnum.DETAILS]: contentDetail,
  [DetailContentSegmentedEnum.HISTORY]: contentHistory,
  [DetailContentSegmentedEnum.MESSAGES]: contentMessages,
  [DetailContentSegmentedEnum.PROVIDERS]: contentProviders
};

// 计算当前应显示的组件
const currentComponent = computed(() => componentMap[props.currentTab]);
</script>
