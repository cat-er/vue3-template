<template>
  <div class="action-bar-tabs">
    <a-menu mode="horizontal" v-model:selectedKeys="current" :items="items" @click="menuSelect" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { MenuProps } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
import createMenu from "@/utils/createMenu";

const route = useRoute();
const router = useRouter();

const current = ref<string[]>(["flightBoard"]);
watch(() => route.name, () => {
  current.value = [route.name as string];
}, { immediate: true });

const allRoutes = router.options.routes;
const items = ref<MenuProps["items"]>([
  ...createMenu(allRoutes)
]);

const menuSelect: MenuProps["onClick"] = (e) => {
  router.push({ name: e.key as string });
};


</script>

<style scoped>

</style>
