<template>
  <a-card :title="t('client_documents')" class="client-documents box-shadow">
    <a-row :gutter="16">
      <a-col :span="12">
        <upload-file accept="all" @upload-done="handleUpload"></upload-file>
      </a-col>
      <a-col :span="12">
        <div @click="openLibrary" class="library full flex-column pointer">
          <div class="library-btn">
            <a-button type="primary">
              {{ t("document_library") }}
            </a-button>
          </div>
          <div class="library-label">
            {{ t("document_library_tip") }}
          </div>
        </div>
      </a-col>
    </a-row>

    <fileItem
      class="margin-top-16"
      v-for="item in fileItemList"
      :key="item.file_id ? item.file_id : item.attachment_id"
      :fileItem="item"
      :isEdit="true"
      @removeItem="removeItem"
      @switchChange="switchChange"
      @noteEdit="noteEdit"
    />

    <library ref="libraryRef" @addFile="handleAddFile" />
  </a-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { t } from "@/locale";
import uploadFile from "@/components/uploadFile/uploadFile.vue";
import fileItem from "./components/formClientDocuments/fileItem.vue";
import library from "./components/formClientDocuments/library.vue";
import { FileList } from "@/api/api/fileManager/types";
import type { UploadChangeParam } from "ant-design-vue";
import { useOutPutState } from "@/views/workOrder/create/hooks";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { GetTemplateDetailsRes } from "@/api/api/workOrder/types";
import { storeToRefs } from "pinia";
import { useWorkOrderaTemplateCreateStore } from "@/stores";

export interface FileItemList extends FileList {
  show_before_assignment: boolean;
  notes?: string;
}

const fileItemList = ref<FileItemList[]>([]);

// 弹窗相关
const libraryRef = ref();
const openLibrary = () => {
  libraryRef.value.show();
};
const handleAddFile = (list: FileList[]) => {
  list.forEach((item) => {
    item.show_before_assignment = false;
    const index = fileItemList.value.findIndex(
      (obj) => obj.file_id === item.file_id || obj.attachment_id === item.file_id
    );
    if (index !== -1) {
      fileItemList.value[index] = item; // 覆盖现有对象
    } else {
      fileItemList.value.push(item); // 添加新对象
    }
  });
};

// 文件组件相关

// 移除
const removeItem = (id: string | number) => {
  fileItemList.value = fileItemList.value.filter(
    (item) => item.file_id !== id && item.attachment_id !== id
  );
};

// 是否可见
const switchChange = (id: string | number) => {
  const index = fileItemList.value.findIndex(
    (item) => item.file_id === id || item.attachment_id === id
  );
  if (index !== -1) {
    fileItemList.value[index].show_before_assignment =
      !fileItemList.value[index].show_before_assignment;
  }
};

//编辑
const noteEdit = (note: string, id: string | number) => {
  const index = fileItemList.value.findIndex(
    (item) => item.file_id === id || item.attachment_id === id
  );
  if (index !== -1) {
    fileItemList.value[index].notes = note;
  }
};

// 上传
const handleUpload = (file: UploadChangeParam) => {
  fileItemList.value.push(file.file.response.data);
};

// 数据回显
const temDataEcho = (data: GetTemplateDetailsRes) => {
  if (data.client_documents) {
    fileItemList.value = data.client_documents as unknown as FileItemList[];
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

// 数据汇总
// 格式化
const format = () => {
  return fileItemList.value.map((item) => ({
    attachment_id: item.file_id ? item.file_id : item.attachment_id,
    show_before_assignment: item.show_before_assignment,
    notes: item.notes
  }));
};

watch(
  () => fileItemList.value,
  () => {
    useOutPutState(true, WorkOrderListKey.CLIENT_DOCUMENTS, {
      client_documents: format()
    });
  },
  {
    deep: true
  }
);

onMounted(() => {
  useOutPutState(true, WorkOrderListKey.CLIENT_DOCUMENTS, {
    client_documents: format()
  });
});
</script>
