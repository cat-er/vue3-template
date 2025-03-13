<template>
  <a-card :title="t('service_description')" class="box-shadow">
    <a-form
      ref="formRef"
      :model="formData"
      name="serviceDescription"
      layout="vertical"
      :wrapper-col="{ span: 24 }"
      :rules="rules"
    >
      <div class="form-note">{{ t("public_description_tip") }}</div>
      <a-form-item name="description_html" :label="t('public_description')">
        <textEditor v-model:model-value="formData.description_html" />
        <b>Note</b>
        <div class="form-note">
          {{ t("confidential_information_tip") }}
        </div>
      </a-form-item>
      <a-form-item :label="t('confidential_information')">
        <textEditor v-model:model-value="formData.confidential_html" />
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { ref, onMounted, watch } from "vue";
import type { ServiceDescription } from "@/api/api/workOrder/types";
import type { Rule } from "ant-design-vue/es/form";
import textEditor from "@/components/textEditor/textEditor.vue";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { useOutPutState } from "../hooks";
import { useWorkOrderaTemplateCreateStore } from "@/stores";
import { storeToRefs } from "pinia";

const formData = ref<ServiceDescription>({
  description_html: "",
  confidential_html: undefined
});

const rules: Record<string, Rule[]> = {
  // description_html: [
  //   { required: true, trigger: ["change", "blur"] }
  // ]
};

// 校验
const formRef = ref();
// const formValidate = async () => {
//   try {
//     await formRef.value.validate();
//     useOutPutState(true, WorkOrderListKey.SERVICE_DESCRIPTION, formData.value);
//   } catch (err) {
//     useOutPutState(false, WorkOrderListKey.SERVICE_DESCRIPTION, formData.value);
//   }
// };

watch(
  () => formData.value,
  () => {
    useOutPutState(WorkOrderListKey.SERVICE_DESCRIPTION, formData.value);
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
  useOutPutState(WorkOrderListKey.SERVICE_DESCRIPTION, formData.value);
});
</script>
