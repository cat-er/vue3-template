<template>
  <div class="form-list flex">
    <component
      v-for="(Component, index) in components"
      :is="Component"
      :key="index"
      :ref="setRef(index)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useWorkOrderCreateStore } from "@/stores";
import { storeToRefs } from "pinia";

import formOverView from "./components/formOverView.vue";
import formServiceDesc from "./components/formServiceDesc.vue";
import formWorkCategories from "./components/formWorkCategories.vue";
import formWorkOrderQualifications from "./components/formWorkOrderQualifications.vue";
import formLocation from "./components/formLocation.vue";
import formSchedule from "./components/formSchedule.vue";
import formContacts from "./components/formContacts.vue";
import formClientDocuments from "./components/formClientDocuments.vue";
import formTasks from "./components/formTasks.vue";
import formPay from "./components/formPay.vue";

const components = [
  formOverView,
  formServiceDesc,
  formWorkCategories,
  formWorkOrderQualifications,
  formLocation,
  formSchedule,
  formContacts,
  formClientDocuments,
  formTasks,
  formPay
];

const componentRefs = components.map(() => ref());

const setRef = (index: number) => (el: any) => {
  componentRefs[index].value = el;
};

const { currentChooseForm } = storeToRefs(useWorkOrderCreateStore());

// 获取CSS变量值
const root = document.documentElement;
const computedStyle = getComputedStyle(root);
const menuHeight = computedStyle.getPropertyValue("--height-menu").trim();
const titleBarHeight = computedStyle.getPropertyValue("--height-title-bar").trim();
const padding = computedStyle.getPropertyValue("--font-size-base").trim();
const topHeight = parseInt(menuHeight, 10) + parseInt(titleBarHeight, 10) + parseInt(padding, 10);

const elementScroll = () => {
  const element = componentRefs[currentChooseForm.value as number].value?.$el as HTMLElement;
  if (element) {
    const topPosition = element.getBoundingClientRect().top + window.scrollY - topHeight;
    window.scrollTo({ top: topPosition, behavior: "smooth" });
  }
};

onMounted(() => {
  watch(
    () => currentChooseForm.value,
    () => {
      elementScroll();
    }
  );
});
</script>
