<template>
  <div class="user-center flex">
    <div class="center-sider box-shadow">
      <a-menu v-model:selectedKeys="selectedKeys" mode="inline" :items="items"></a-menu>
    </div>
    <div class="center-content action-box-white">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, type Component } from "vue";
import { ItemType } from "ant-design-vue";
import userInfo from "./components/userInfo.vue";

// Menu items
const items = ref<ItemType[]>([{ label: "Basic information", key: "info" }]);

const selectedKeys = ref<string[]>(["info"]);

// Component map
const components: Record<string, Component> = {
  ["info"]: userInfo
};

const currentComponent = computed(() => components[selectedKeys.value[0]] || null);
</script>
