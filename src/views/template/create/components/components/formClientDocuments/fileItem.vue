<template>
  <div v-if="fileItem" class="action-box documents-details flex-column">
    <div class="documents-details-info full">
      <div class="info-content flex">
        <div class="info-content-msg flex">
          <div class="action-icon">
            <FileTextOutlined />
          </div>
          <div class="action-text flex-column">
            <a v-if="isPhoto(fileItem.mime)" @click="previewImg(fileItem.link)">
              {{ fileItem.filename }}
            </a>
            <span v-else>{{ fileItem.filename }}</span>
            <span>
              {{ fileItem.created_at }}
            </span>
          </div>
        </div>
        <div class="info-content-action flex">
          <a-button
            @click="download"
            type="text"
            size="small"
            shape="circle"
            :icon="h(DownloadOutlined)"
            class="margin-right-8"
          />
          <a-button
            v-if="isEdit"
            @click="editNote"
            type="text"
            size="small"
            shape="circle"
            :icon="h(FormOutlined)"
            class="margin-right-8"
          />
          <a-button
            v-if="isEdit"
            @click="removeItem"
            type="text"
            danger
            size="small"
            shape="circle"
            :icon="h(DeleteOutlined)"
          />
        </div>
      </div>
    </div>
    <div class="documents-details-switch flex full">
      <a-switch
        :checked="fileItem.show_before_assignment"
        :disabled="!isEdit"
        @change="switchChange"
      />
      <span class="margin-left-8">
        {{ t("file_switch_label") }}
      </span>
    </div>
    <div v-if="desc" class="documents-details-note flex full">
      <div class="details-note flex">
        <b class="margin-right-8">{{ t("note") }}:</b>
        <div class="note">
          {{ desc }}
        </div>
      </div>

      <a-button type="link" @click="view">
        {{ t("view_more") }}
      </a-button>
    </div>

    <fileItemNote ref="fileItemNoteRef" @edit="noteEdit" />

    <imgPreview ref="imgPreviewRef" :url="fileItem.link" />
  </div>
</template>

<script setup lang="ts">
import { h, ref, computed } from "vue";
import { t } from "@/locale";
import {
  DeleteOutlined,
  DownloadOutlined,
  FileTextOutlined,
  FormOutlined
} from "@ant-design/icons-vue";
import { FileItemList } from "@/views/workOrder/create/components/formClientDocuments.vue";
import fileItemNote from "./fileItemNote.vue";
import imgPreview from "@/components/imgPreview/imgPreview.vue";
import { isPhoto } from "@/utils/common";

interface Props {
  fileItem: FileItemList;
  isEdit: boolean; //是否从编辑页进入
}

const { fileItem, isEdit } = defineProps<Props>();

const fileId = computed(() => {
  return fileItem.file_id ? fileItem.file_id : fileItem.attachment_id;
});

// 描述 创建页进入和详情页进入字段不一样
const desc = computed(() => {
  return isEdit ? fileItem.notes : fileItem.description;
});

interface Emits {
  (e: "removeItem", value: string | number): void;

  (e: "switchChange", value: string | number): void;

  (e: "noteEdit", value: string, id: string | number): void;
}

const emits = defineEmits<Emits>();

// 下载
const download = () => {
  console.log("fileItem.link", fileItem.link);

  window.open(fileItem.link);
};

// 编辑note
const fileItemNoteRef = ref();
const editNote = () => {
  fileItemNoteRef.value.show(true);
};

const noteEdit = (value: string) => {
  emits("noteEdit", value, fileId.value as number);
};

const view = () => {
  fileItemNoteRef.value.show(false, desc.value);
};

// 移除
const removeItem = () => {
  emits("removeItem", fileId.value as number);
};

const switchChange = () => {
  console.log("fileId.value", fileId.value);

  emits("switchChange", fileId.value as number);
};

// 图片预览
const imgPreviewRef = ref();
const previewImg = (url: string) => {
  imgPreviewRef.value.show();
};
</script>

<style scoped></style>
