<template>
  <div>
    <a-modal
      :open="open"
      @ok="handleUpload"
      @cancel="uploadCancel"
      :cancel-text="t('cancel')"
      :ok-text="t('commit')"
      :cancel-button-props="{ disabled: disabled }"
      :confirmLoading="loading"
    >
      <template #title>
        <div>
          <h2>{{ t("uploaded") }}</h2>
          <a-divider></a-divider>
        </div>
      </template>
      <a-upload-dragger
        :fileList="fileList"
        :multiple="false"
        :maxCount="1"
        :beforeUpload="beforeUpload"
        @remove="remove"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">{{ t("drag_file_upload") }}</p>
      </a-upload-dragger>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { InboxOutlined } from "@ant-design/icons-vue";
import type { UploadProps } from "ant-design-vue";
import { notifyError, notifySuccess } from "@/utils/notify";
import { addFile } from "@/api/api/fileManager";

import i18n from "@/locale";

const { t } = i18n.global;

const fileList = ref<UploadProps["fileList"]>([]);
const disabled = ref<boolean>(false);
const loading = ref<boolean>(false);

interface Props {
  open: boolean;
}

const { open } = defineProps<Props>();

const emits = defineEmits(["cancels"]);

const uploadCancel = () => {
  emits("cancels");
};
const reloadData = () => {
  emits("reloadData");
};

const handleUpload = async () => {
  const formData = new FormData();
  if (!fileList.value) return;
  const file = fileList.value[0];
  if (!file) {
    return notifyError(t("choose_a_file"));
  }
  formData.append("file", file as any);
  loading.value = true;
  disabled.value = true;
  try {
    await addFile(formData);
    fileList.value = [];
    notifySuccess("upload successfully.");
    reloadData();
  } catch {
    notifyError("upload failure.");
  }
  loading.value = false;
  disabled.value = false;
  //重新载入记录
};

const beforeUpload = (file: any) => {
  fileList.value = [file];
  return false;
};
const remove = () => {
  fileList.value = [];
};
</script>

<style scoped></style>
