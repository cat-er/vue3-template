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
      <a-form-item name="confidential_html" :label="t('confidential_information')">
        <textEditor v-model:model-value="formData.confidential_html" />
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { ref, onMounted, watch } from "vue";
import type {
  ServiceDescription,
  GetTemplateDetailsRes,
  AddWorkOrderReq
} from "@/api/api/workOrder/types";
import type { Rule } from "ant-design-vue/es/form";
import textEditor from "@/components/textEditor/textEditor.vue";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { useOutPutState } from "../hooks";
import { storeToRefs } from "pinia";
import { useWorkOrderaTemplateCreateStore } from "@/stores";

const formData = ref<ServiceDescription>({
  description_html: "",
  confidential_html: undefined
});

const rules: Record<string, Rule[]> = {
  description_html: [
    { required: true, trigger: ["change", "blur"] },
    {
      pattern: /^[^\u4E00-\u9FFF]*$/,
      message: "English inputs only",
      trigger: ["change", "blur"]
    }
  ],
  confidential_html: [
    { required: false },
    {
      pattern: /^[^\u4E00-\u9FFF]*$/,
      message: "English inputs only",
      trigger: ["change", "blur"]
    }
  ]
};

// 数据回显
const temDataEcho = (data: GetTemplateDetailsRes | AddWorkOrderReq) => {
  for (const key in formData.value) {
    if (Object.prototype.hasOwnProperty.call(formData.value, key)) {
      (formData.value as any)[key] = (data as any)[key];
    }
  }
};

// 模板数据回显
const { currentTemplateData } = storeToRefs(useWorkOrderaTemplateCreateStore());
watch(
  () => currentTemplateData.value,
  () => {
    if (!currentTemplateData.value) return;
    temDataEcho(currentTemplateData.value);
  }
);

// 校验
const formRef = ref();
const formValidate = async () => {
  try {
    await formRef.value.validate();
    useOutPutState(true, WorkOrderListKey.SERVICE_DESCRIPTION, formData.value);
  } catch (err) {
    useOutPutState(false, WorkOrderListKey.SERVICE_DESCRIPTION, formData.value);
  }
};

watch(
  () => formData.value,
  () => {
    formValidate();
  },
  { deep: true }
);

onMounted(() => {
  formValidate();
});
</script>
