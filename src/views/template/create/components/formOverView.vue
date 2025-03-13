<template>
  <a-card :title="t('overview')" class="box-shadow">
    <a-form
      ref="formRef"
      :model="formData"
      name="overview"
      layout="vertical"
      :wrapper-col="{ span: 24 }"
      :rules="rules"
    >
      <a-form-item
        label="Template name"
        name="name"
        :rules="[
          {
            required: true,
            trigger: ['blur', 'change']
          }
        ]"
      >
        <a-input v-no-chinese v-model:value="formData.name" />
      </a-form-item>

      <a-form-item :label="t('work_order_title')" name="title">
        <a-input v-no-chinese v-model:value="formData.title" />
        <div class="form-note">
          {{ t("work_order_title_tip") }}
        </div>
      </a-form-item>

      <span>{{ t("work_order_options") }}</span>
      <a-form-item label="" class="overview-checkbox">
        <a-checkbox v-model:checked="formData.printable">
          {{ t("allow_export_button") }}
        </a-checkbox>
      </a-form-item>

      <a-form-item label="" class="overview-checkbox">
        <a-checkbox v-model:checked="formData.allow_counter_offers">
          {{ t("allow_counter_offers") }}
        </a-checkbox>
      </a-form-item>

      <a-form-item label="" class="overview-checkbox">
        <a-checkbox v-model:checked="formData.require_gps">
          {{ t("require_gps") }}
        </a-checkbox>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { ref, onMounted, watch } from "vue";
import type { Overview } from "@/api/api/workOrder/types";
import type { Rule } from "ant-design-vue/es/form";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { useOutPutState } from "../hooks";
import { useWorkOrderaTemplateCreateStore } from "@/stores";
import { storeToRefs } from "pinia";

const formData = ref({
  title: "",
  name: undefined,
  allow_counter_offers: true,
  require_gps: true,
  printable: false
});

const rules: Record<string, Rule[]> = {
  // title: [{ required: true, trigger: ["blur"] }],
  // allow_counter_offers: [{ required: true, trigger: ["change"] }],
  // require_gps: [{ required: true, trigger: ["change"] }],
  // printable: [{ required: true, trigger: ["change"] }]
};

// 校验
const formRef = ref();
// const formValidate = async () => {
//   try {
//     await formRef.value.validate();
//     useOutPutState(true, WorkOrderListKey.OVERVIEW, formData.value);
//   } catch (err) {
//     useOutPutState(false, WorkOrderListKey.OVERVIEW, formData.value);
//   }
// };

watch(
  () => formData.value,
  () => {
    useOutPutState(WorkOrderListKey.OVERVIEW, formData.value);
  },
  { deep: true }
);

const { currentTemplateData, isCreateTemplate } = storeToRefs(useWorkOrderaTemplateCreateStore());
// 编辑模板回显
const editEcho = () => {
  if (isCreateTemplate.value) return;
  for (const key in formData.value) {
    if (Object.prototype.hasOwnProperty.call(formData.value, key)) {
      (formData.value as any)[key] = (currentTemplateData.value as any)[key];
    }
  }
};

watch(
  () => currentTemplateData.value,
  () => {
    editEcho();
  }
);

onMounted(() => {
  useOutPutState(WorkOrderListKey.OVERVIEW, formData.value);
});
</script>

<style scoped>
.overview-checkbox {
  margin-bottom: 0;
}
</style>
