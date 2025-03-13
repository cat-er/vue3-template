<template>
  <a-form name="task" :model="formData" :label-col="{ span: 24 }" :rules="rules" ref="formRef">
    <a-form-item :label="t('select')" name="type_id">
      <a-select
        v-model:value="formData.type_id"
        :placeholder="t('select_placeholder')"
        @select="change"
      >
        <a-select-option
          v-for="(item, index) in defaultSelectList"
          :key="index"
          :value="item.type_id"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item name="attachment_id" v-if="formData.type_id === TaskTypeIdEnum.DOWNLOAD_FILE">
      <uploadFile
        accept="all"
        :upload-file="uploadFileEcho"
        :show-upload-list="true"
        :max-count="1"
        @upload-removed="handleRemove"
        @upload-done="handleUpload"
      />
    </a-form-item>

    <a-form-item v-if="reasonIsShow" :label="t('reason')" name="label">
      <a-textarea
        v-no-chinese
        v-model:value="formData.label"
        :placeholder="t('input_placeholder')"
        :rows="2"
      />
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { TaskTypeIdEnum, TaskGroupIdEnum } from "@/api/api/workOrder/types";
import { t } from "@/locale";
import uploadFile from "@/components/uploadFile/uploadFile.vue";
import type { Rule } from "ant-design-vue/es/form";
import type { UploadChangeParam, UploadFile } from "ant-design-vue";
import { CollapsibleType } from "ant-design-vue/es/collapse/commonProps";
import uuid from "@/utils/uuid";

interface Props {
  taskId: string; //唯一标识符
  header?: string;
  collapsible?: CollapsibleType;
  delIconShow?: boolean | false;
  status?: boolean;
  group_id?: TaskGroupIdEnum;
  type_id?: TaskTypeIdEnum;
  attachment_id?: number;
  label?: string;
  filename?: string;
  link?: string;
}

const { form } = defineProps<{ form: Props }>();

export interface FormData {
  id?: string;
  current: string | undefined;
  type_id: TaskTypeIdEnum | undefined;
  label: string | undefined;
  attachment_id?: number;
  status: boolean;
  group_id?: TaskGroupIdEnum;
}

const formData = ref<FormData>({
  current: undefined,
  type_id: undefined,
  label: undefined,
  attachment_id: undefined,
  status: false
});

const rules: Record<string, Rule[]> = {
  type_id: [
    { required: true, message: t("rule_select_a_task_type"), trigger: ["change"] },
    { type: "number" }
  ],
  label: [
    { required: true, message: t("rule_enter_a_reason"), trigger: ["blur"] },
    { type: "string" }
  ],
  attachment_id: [
    { required: true, message: "Upload a file for the download task", trigger: ["change"] }
  ]
};

interface DefaultSelectList {
  label: string;
  type_id: TaskTypeIdEnum | undefined;
}

const defaultSelectList: DefaultSelectList[] = [
  // { label: t("select_a_task"), type_id: undefined },
  { label: t("download_file"), type_id: TaskTypeIdEnum.DOWNLOAD_FILE },
  { label: t("upload_take_photo"), type_id: TaskTypeIdEnum.UPLOAD_OR_TAKE_A_PICTURE }
];

// 在特定的type_id下展示
const reasonIsShow = computed<boolean>(() => {
  const list: TaskTypeIdEnum[] = [
    TaskTypeIdEnum.DOWNLOAD_FILE,
    TaskTypeIdEnum.UPLOAD_OR_TAKE_A_PICTURE
  ];
  return list.includes(formData.value.type_id as TaskTypeIdEnum);
});

// 非枚举选项清空type_id
const clearSelect = () => {
  if (Object.values(TaskTypeIdEnum).includes(formData.value.type_id as TaskTypeIdEnum)) return;
  formData.value.type_id = undefined;
};

const handleUpload = (file: UploadChangeParam) => {
  formData.value.attachment_id = file.file.response.data.file_id;
};

const handleRemove = () => {
  formData.value.attachment_id = undefined;
};

// 表单验证
interface Emits {
  (e: "outPutHandle", value: FormData, validateStatus: boolean): void;
}

const emits = defineEmits<Emits>();

const formRef = ref();
const formValidate = async () => {
  try {
    await formRef.value.validate();
    formData.value.status = true;
    emits("outPutHandle", formData.value, true);
  } catch (err) {
    formData.value.status = false;
    emits("outPutHandle", formData.value, false);
  }
};

// 数据回显
const uploadFileEcho = ref<UploadFile>();

watch(
  () => form.filename,
  () => {
    if (!form.filename) return;
    uploadFileEcho.value = {
      uid: uuid(),
      status: "done",
      name: form.filename,
      url: form.link
    };
  },
  { immediate: true, deep: true }
);

watch(
  () => formData.value,
  () => {
    formValidate();
  },
  { deep: true }
);

// 监听props
watch(
  () => form,
  (newForm) => {
    formData.value = {
      id: newForm.taskId,
      current: newForm.header,
      type_id: newForm.type_id,
      label: newForm.label,
      attachment_id: newForm.attachment_id,
      status: newForm.status ?? false
    };
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  formValidate();
});

const change = () => {
  clearSelect();
  nextTick(() => {
    formValidate();
  });
};
</script>
