<template>
  <div>
    <a-modal
      :open="modal"
      wrap-class-name="deny-change-pay-dialog"
      :footer="null"
      :closable="false"
    >
      <a-card :title="t('deny_pay_change_request')" class="deny-change-pay-card">
        <template #extra><close-outlined @click="onClose" /></template>
        <a-form ref="formRef" :model="modelRef" layout="vertical">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item name="description" v-bind="validateInfos.description">
                <template #label>
                  {{ t("reason_for_denial") }}
                </template>
                <a-textarea
                  v-no-chinese
                  v-model:value="modelRef.description"
                  :placeholder="t('description') + `...`"
                  :auto-size="{ minRows: 5, maxRows: 9 }"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <template #actions>
          <a-space>
            <a-button @click="onClose" :disabled="disabled">{{ t("cancel") }}</a-button>
            <a-button @click="resetFields" style="display: none">{{ t("reset") }}</a-button>
            <a-button
              type="primary"
              @click="onSubmit"
              :loading="loading"
              :disabled="modelRef.description === ''"
            >
              {{ t("confirm") }}
            </a-button>
          </a-space>
        </template>
      </a-card>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { t } from "@/locale";
import { Form } from "ant-design-vue";
import { notifyError, notifySuccess } from "@/utils/notify";
import { examineRequestedPayChange } from "@/api/api/workOrder";
import {
  ExamineRequestedPayChangeEnum,
  type ExamineRequestedPayChangeReq
} from "@/api/api/workOrder/types";
const useForm = Form.useForm;

const loading = ref<boolean>(false);
const disabled = ref<boolean>(false);
const modal = ref<boolean>(false);
const pay_id = ref<number>(0);
const order_id = ref<number>(0);
// 表单验证
const modelRef = ref<{
  description: string;
}>({
  description: ""
});
const rulesRef = ref({
  description: [
    { required: true, min: 11, message: "The reason for denial must be at least 11 characters" }
  ]
});

const show = (id, orderid) => {
  pay_id.value = id;
  order_id.value = orderid;
  modal.value = true;
};
// 数据接收

const emits = defineEmits(["refresh"]);

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const onSubmit = () => {
  console.log(modelRef.value);
  // 暂时取消操作描述
  validate()
    .then(() => {
      onFinish();
    })
    .catch((err) => {
      console.log("error", err);
    });
};
const onFinish = async () => {
  const param = ref<ExamineRequestedPayChangeReq>({
    order_id: order_id.value, //本系统工单id
    status: ExamineRequestedPayChangeEnum.DENIED, //状态，accepted,denied
    status_description: modelRef.value.description //如果审核为不通过则为必填
  });
  loading.value = true;
  disabled.value = true;
  try {
    let res = await examineRequestedPayChange(param.value, pay_id.value.toString());
    if (res) {
      notifySuccess("Deny successful");
    }
    emits("refresh");
    onClose();
  } catch {
    notifyError("Deny failure");
  }
  loading.value = false;
  disabled.value = false;
};
const onClose = () => {
  modal.value = false;
};

defineExpose({
  show
});
</script>

<style scoped></style>
