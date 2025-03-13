<template>
  <div>
    <a-modal :open="open" wrap-class-name="delete-batch-dialog" :footer="null" :closable="false">
      <a-card :title="title" class="delete-batch-dialog-card">
        <template #extra><close-outlined @click="onClose" /></template>
        <a-form ref="formRef" :model="modelRef" layout="vertical">
          <a-row :gutter="24">
            <a-col :span="24" class="margin-bottom-8">{{ description }}</a-col>
            <a-col :span="24">
              <a-form-item name="selectValue" v-bind="validateInfos.selectValue">
                <template #label>
                  {{ t("reason_for") }}
                  {{ typeNum == 1 ? t("the_deletion") : t("the_cancellation") }}
                </template>
                <a-select
                  v-if="depositOptions"
                  v-model:value="modelRef.selectValue"
                  :placeholder="t('select_reason') + `...`"
                  :options="
                    depositOptions.map((option) => ({
                      value: option.id,
                      label: option.name
                    }))
                  "
                  @change="onChange"
                ></a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item name="description" class="hide" v-bind="validateInfos.description">
                <template #label>
                  {{ t("work_order_cancellation_explanation") }}
                </template>

                <a-textarea
                  v-model:value="modelRef.description"
                  :placeholder="t('description') + `...`"
                  :auto-size="{ minRows: 7, maxRows: 9 }"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <template #actions>
          <a-space>
            <a-button @click="onClose" :disabled="disabled">{{ t("cancel") }}</a-button>
            <a-button @click="resetFields" style="display: none">{{ t("reset") }}</a-button>
            <a-button type="primary" @click="onSubmit" :loading="loading">
              {{ title }}
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
import { delWorkOrder } from "@/api/api/workOrder";
import { DelWorkOrderEnum, type DelWorkOrderReq } from "@/api/api/workOrder/types";
import "@/assets/style/views/work/batchOperate.less";
const useForm = Form.useForm;
import { useTableRowSelectionDataStore } from "@/stores";
import { storeToRefs } from "pinia";
const { rowSelectionData } = storeToRefs(useTableRowSelectionDataStore());

const loading = ref<boolean>(false);
const disabled = ref<boolean>(false);
const open = ref<boolean>(false);
// 表单验证
const modelRef = ref<{
  reasonId: DelWorkOrderEnum;
  selectValue: number | null;
  description: string;
}>({
  reasonId: 0,
  selectValue: null,
  description: "Your description"
});
const rulesRef = ref({
  selectValue: [{ required: true, message: t("select_a_reason") }],
  description: [{ required: true, message: t("please_enter_description") }]
});

const typeNum = ref<number>(1);
const title = ref<string>("");
const description = ref<string>("");

const emits = defineEmits(["cancels"]);

const show = (tp, num) => {
  open.value = true;
  typeNum.value = tp;
  let tt = tp == 1 ? "Delete" : "Cancel";
  let unit = num <= 1 ? "order" : "orders";
  title.value = tt + ` ${num} work ` + unit;
  description.value = tt + ` the ${num} work ${unit} that you selected.`;
};
// 选择框
interface options {
  id: DelWorkOrderEnum;
  name: string;
}
const depositOptions = ref<options[]>([
  { id: 58, name: "Customer cancelled" },
  { id: 59, name: "Pending reschedule" },
  { id: 60, name: "Scope of Work changed" },
  { id: 61, name: "Site not ready / turned away" },
  { id: 45, name: "All requests above pay rate listed" },
  { id: 46, name: "No provider with adequate skills/experience" },
  { id: 47, name: "No requesting providers" },
  { id: 51, name: "Requesting providers lack Work Order history" },
  { id: 3, name: "Completed internally" },
  { id: 4, name: "Completed elsewhere" },
  { id: 52, name: "Creation error" }
]);

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef, {
  onValidate: (...args) => console.log(...args)
});
const onChange = (value) => {
  modelRef.value.reasonId = value;
  modelRef.value.selectValue = value;
};
const onSubmit = () => {
  // 暂时取消操作描述
  rulesRef.value.description[0].required = false;
  validate()
    .then(() => {
      onFinish();
    })
    .catch((err) => {
      console.log(err);
    });
};
const onFinish = async () => {
  const param = ref<DelWorkOrderReq>({
    ids: rowSelectionData.value,
    cancel_reason: modelRef.value.reasonId
  });
  loading.value = true;
  disabled.value = true;
  try {
    let res = await delWorkOrder(param.value);
    if (res) {
      notifySuccess((typeNum.value == 1 ? "Delete" : "Cancel") + " successful");
      onClose();
      // 重新加载数据
      emits("reloadData");
    }
  } catch {
    notifyError((typeNum.value == 1 ? "Delete" : "Cancel") + " failure");
  }
  loading.value = false;
  disabled.value = false;
};
const onClose = () => {
  open.value = false;
};
defineExpose({
  show
});
</script>

<style scoped></style>
