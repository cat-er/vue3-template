<template>
  <div class="form-list flex">
    <component
      v-for="Component in components"
      :is="Component.value"
      :key="Component.key"
      :ref="setRef(Component.key)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, ComponentPublicInstance } from "vue";
import { useWorkOrderaTemplateCreateStore } from "@/stores";
import { storeToRefs } from "pinia";
import { WorkOrderTemlateListKey } from "./types";

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
  {
    key: WorkOrderTemlateListKey.OVERVIEW,
    value: formOverView
  },
  {
    key: WorkOrderTemlateListKey.SERVICE_DESCRIPTION,
    value: formServiceDesc
  },
  {
    key: WorkOrderTemlateListKey.WORK_CATEGORIES,
    value: formWorkCategories
  },
  {
    key: WorkOrderTemlateListKey.QUALIFICATION,
    value: formWorkOrderQualifications
  },
  // {
  //   key: WorkOrderTemlateListKey.LOCATION,
  //   value: formLocation
  // },
  {
    key: WorkOrderTemlateListKey.SCHEDULE,
    value: formSchedule
  },
  {
    key: WorkOrderTemlateListKey.CONTACTS,
    value: formContacts
  },
  {
    key: WorkOrderTemlateListKey.CLIENT_DOCUMENTS,
    value: formClientDocuments
  },
  {
    key: WorkOrderTemlateListKey.TASKS,
    value: formTasks
  },
  {
    key: WorkOrderTemlateListKey.PAY,
    value: formPay
  }
];

const componentRefs = Object.keys(WorkOrderTemlateListKey)
  .filter((key) => isNaN(Number(key))) // 过滤出枚举中的键
  .reduce(
    (refs, key) => {
      refs[WorkOrderTemlateListKey[key as keyof typeof WorkOrderTemlateListKey]] = ref();
      return refs;
    },
    {} as Record<WorkOrderTemlateListKey, ReturnType<typeof ref>>
  );

const setRef = (key: WorkOrderTemlateListKey) => (el: any) => {
  componentRefs[key].value = el;
};

const { currentChooseForm } = storeToRefs(useWorkOrderaTemplateCreateStore());

// 获取CSS变量值
const root = document.documentElement;
const computedStyle = getComputedStyle(root);
const menuHeight = computedStyle.getPropertyValue("--height-menu").trim();
const titleBarHeight = computedStyle.getPropertyValue("--height-title-bar").trim();
const padding = computedStyle.getPropertyValue("--font-size-base").trim();
const topHeight = parseInt(menuHeight, 10) + parseInt(titleBarHeight, 10) + parseInt(padding, 10);

const elementScroll = () => {
  const selectedKey = currentChooseForm.value as WorkOrderTemlateListKey;
  const componentInstance = componentRefs[selectedKey]?.value as
    | ComponentPublicInstance
    | undefined;
  const element = componentInstance?.$el as HTMLElement;

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
