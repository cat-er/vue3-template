<template>
  <div>
    <a-modal :open="isOpen" wrap-class-name="approve-action" :footer="null" :closable="false">
      <div>
        <a-card :title="t('edit_service_description')" class="edit-wd-box-shadow">
          <template #extra><close-outlined @click="onClose" /></template>
          <a-form
            ref="formRef"
            :model="formData"
            name="serviceDescription"
            layout="vertical"
            :wrapper-col="{ span: 24 }"
            :rules="rules"
          >
            <div class="form-note">{{ t("public_description_tip") }}</div>
            <div>&nbsp;</div>
            <a-form-item name="description_html" v-bind="validateInfos.description_html">
              <div class="form-note">
                <b>Note:</b>
                {{ t("confidential_information_tip") }}
              </div>
              <textEditor v-model:model-value="formData.description_html" rows="29" />
            </a-form-item>
            <a-form-item name="confidential_html" v-bind="validateInfos.confidential_html">
              <template #label>
                <b>{{ t("confidential_information") }}</b>
              </template>
              <textEditor v-model:model-value="formData.confidential_html" />
            </a-form-item>
          </a-form>
          <template #actions>
            <div class="right-top margin-right-24">
              <a-space>
                <a-button @click="onClose" :disabled="loading">{{ t("cancel") }}</a-button>
                <a-button @click="resetFields" class="hide">{{ t("reset") }}</a-button>
                <a-button type="primary" @click="onSubmit" :loading="loading">
                  {{ t("save") }}
                </a-button>
              </a-space>
            </div>
          </template>
        </a-card>
      </div>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { t } from "@/locale";
import { notifyError, notifySuccess } from "@/utils/notify";
import textEditor from "@/components/textEditor/textEditor.vue";
import type { ServiceDescription, GetWorkOrderDetailRes } from "@/api/api/workOrder/types";
import { ref } from "vue";
import { type Rule, useForm } from "ant-design-vue/es/form";
import { updateServiceDescription } from "@/api/api/workOrder";
import Template from "@/router/routes/modules/template";

const formData = ref<ServiceDescription>({
  description_html: "",
  confidential_html: ""
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

const loading = ref<boolean>(false);

const formRef = ref();
// 数据接收
const isOpen = ref<boolean>(false);
const order_id = ref<number>(0);

const emits = defineEmits(["reloadPage"]);

const show = (workOrderDetail: GetWorkOrderDetailRes, id: number) => {
  isOpen.value = true;
  formData.value.confidential_html = workOrderDetail.confidential_html;
  formData.value.description_html = workOrderDetail.description_html;
  order_id.value = id;
};
// 数据回显

const onSubmit = async () => {
  // 暂时取消操作描述
  // 用try catch代替.then()逻辑更清晰
  try {
    const res = await validate();
    if (!res) return;
    await onFinish();
  } catch (error) {
    console.error("error:", error);
  } finally {
    // do something...
  }
};

const onFinish = async () => {
  try {
    // 可以用loading替代disabled
    loading.value = true;
    let res = await updateServiceDescription(order_id.value, formData.value);
    if (res) {
      notifySuccess("successfully");
      reloads();
      onClose();
    } else {
      notifyError("failure");
    }
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};
const reloads = () => {
  emits("reloadPage");
};
const onClose = () => {
  isOpen.value = false;
};

const { resetFields, validate, validateInfos } = useForm(formData, rules, {
  onValidate: () => {}
});

defineExpose({
  show
});
</script>

<style scoped lang="less">
.width-700 {
  width: 700px !important;
}
.edit-wd-box-shadow {
  .right-top {
    text-align: right;
  }
  .margin-right-24 {
    margin-right: 24px;
  }
}
</style>
