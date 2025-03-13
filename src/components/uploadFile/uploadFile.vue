<template>
  <a-spin :spinning="uploadLoading">
    <a-upload-dragger
      class="upload-file"
      v-model:file-list="fileList"
      :accept="acceptStr"
      :disabled="disabled"
      :action="action"
      :headers="headers"
      :maxCount="maxCount"
      :showUploadList="showUploadList"
      :multiple="multiple"
      :withCredentials="true"
      @remove="handleRemove"
      @change="handleChange"
    >
      <div class="upload-file-icon">
        <inbox-outlined></inbox-outlined>
      </div>
      <div>
        {{ t("upload_label") }}
      </div>
      <div class="upload-file-label">
        {{ desc || t("upload_default_label") }}
      </div>
    </a-upload-dragger>
  </a-spin>
</template>

<script setup lang="ts">
import { InboxOutlined } from "@ant-design/icons-vue";
import { t } from "@/locale";
import { ref, computed, watch } from "vue";
import { FileTypeEnum } from "@/types/enum";
import type { UploadChangeParam, UploadFile } from "ant-design-vue";
import { notifySuccess, notifyError } from "@/utils/notify";
import { Form } from "ant-design-vue";

const formItemContext = Form.useInjectFormItemContext();
const validate = () => {
  formItemContext.onFieldChange();
  formItemContext.onFieldBlur();
};

/**
 * 文件上传
 */

interface Props {
  accept: FileTypeEnum[] | "all"; //文件类型 all则支持所有常用类型
  disabled?: boolean;
  headers?: any; //请求头
  maxCount?: number; //最大上传数量
  showUploadList?: boolean;
  multiple?: boolean;
  desc?: string; //描述
  uploadFile?: UploadFile;
}

const props = defineProps<Props>();

const acceptStr = computed(() => {
  if (props.accept === "all") {
    return Object.values(FileTypeEnum).join(",");
  } else {
    return props.accept.join(",");
  }
});

// 上传的文件列表
const fileList = ref<UploadFile[]>([]);

// 上传地址
const action = computed(() => {
  return `${import.meta.env.VITE_API_BASE_URL}/onsite/fn/addFile`;
});

// 事件处理
const uploadLoading = ref<boolean>(false);

type Emits = {
  (e: "uploading"): void;
  (e: "uploadDone", value: UploadChangeParam): void;
  (e: "uploadError", value: UploadChangeParam): void;
  (e: "uploadRemoved"): void;
};

const emit = defineEmits<Emits>();
const handleChange = (info: UploadChangeParam) => {
  switch (info.file.status) {
    case "uploading":
      uploadLoading.value = true;
      emit("uploading");
      break;
    case "done":
      uploadLoading.value = false;
      notifySuccess(t("successfully_upload"));
      emit("uploadDone", info);
      validate();
      break;
    case "error":
      uploadLoading.value = false;
      notifyError(t("fail_to_upload"));
      emit("uploadError", info);
      validate();
      break;
  }
};

const handleRemove = () => {
  fileList.value = [];
  emit("uploadRemoved");
};

watch(
  () => props.uploadFile,
  () => {
    if (!props.uploadFile) return;
    fileList.value = [props.uploadFile];
  },
  { immediate: true, deep: true }
);
</script>
