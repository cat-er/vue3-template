<template>
  <!--标题栏组件-->
  <div class="title-bar box-shadow flex" :class="{ 'title-bar-sticky': sticky }">
    <div class="title-bar-left flex">
      <slot name="title"></slot>
    </div>

    <div class="title-bar-right flex">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 是否开启粘性布局
interface Props {
  sticky?: boolean;
}

const props = defineProps<Props>();
</script>
