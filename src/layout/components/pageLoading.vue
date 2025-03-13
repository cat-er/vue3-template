<template>
  <div class="layout-loading full flex">
    <a-spin class="loading" size="large" />
    <div class="mask full"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const move = (e: any) => {
  e.preventDefault();
};

//禁止页面滑动
const stopScroll = () => {
  document.body.style.overflow = "hidden";
  document.addEventListener("touchmove", move, false);
};

// 开启滑动
const openScroll = () => {
  document.body.style.overflow = "";
  document.removeEventListener("touchmove", move, false);
};

onMounted(() => {
  stopScroll();
});

onUnmounted(() => {
  openScroll();
});
</script>
