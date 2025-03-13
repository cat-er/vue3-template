<template>
  <div>
    <a-modal
      :open="deleteInfo.markOpen"
      wrap-class-name="mark-incomplete"
      :footer="null"
      :closable="false"
    >
      <a-card :title="t('mark_incomplete')" class="mark-incomplete-card">
        <template #extra><close-outlined @click="onClose" /></template>
        <p>{{ t("mark_incomplete_notify_title") }}</p>
        <a-form ref="formRef" :model="modelRef" layout="vertical">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item name="reasonId" v-bind="validateInfos.reasonId">
                <template #label>
                  {{ t("mark_incomplete_tell_field_nation") }}
                </template>
                <a-select
                  v-if="deleteInfo.markOptions"
                  v-model:value="modelRef.reasonId"
                  :placeholder="t('select_reason') + `...`"
                  :options="
                    deleteInfo.markOptions.map((option) => ({
                      value: option.id,
                      label: option.label
                    }))
                  "
                  @change="onChange"
                ></a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item name="description" v-bind="validateInfos.description">
                <template #label>
                  {{ t("mark_incomplete_tell_Provider") }}
                </template>
                <a-textarea
                  v-no-chinese
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
              {{ t("mark_incomplete") }}
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
import { markIncomplete } from "@/api/api/workOrder";
import type { GetIncompleteReasonsRes, MarkIncompleteReq } from "@/api/api/workOrder/types";
const useForm = Form.useForm;

const disabled = ref<boolean>(false);
const loading = ref<boolean>(false);
// 表单验证
const modelRef = ref<{
  reasonId: number;
  description: string;
}>({
  reasonId: null as any,
  description: ""
});
const rulesRef = ref({
  reasonId: [{ required: true, message: t("select_a_reason") }],
  description: [{ required: true, message: t("please_enter_description") }]
});

// 数据接收
interface Props {
  markOpen: boolean;
  markOptions: GetIncompleteReasonsRes[];
  oreder_id: number;
}

const { deleteInfo } = defineProps<{ deleteInfo: Props }>();
const emits = defineEmits(["cancels"]);

// 选择框

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef, {
  onValidate: (...args) => console.log(...args)
});
const onChange = (value) => {
  modelRef.value.reasonId = value;
};
const onSubmit = () => {
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
  disabled.value = true;
  loading.value = true;
  const param = ref<MarkIncompleteReq>({
    order_id: deleteInfo.oreder_id,
    reason_id: modelRef.value.reasonId,
    reason: modelRef.value.description
  });
  try {
    let res = await markIncomplete(param.value);
    if (res) {
      notifySuccess("Mark Incomplete successful");
      setInterval(() => {
        window.location.reload();
      }, 2000);
    }
    onClose();
  } catch {
    notifyError("Mark Incomplete failure");
  }
  disabled.value = false;
  loading.value = false;
};
const onClose = () => {
  emits("cancels");
};
</script>

<style scoped></style>
