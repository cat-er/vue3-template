<template>
  <a-modal v-model:open="modal" :title="t('document_library')" :maskClosable="false">
    <template #footer>
      <a-button @click="hide">{{ t("cancel") }}</a-button>
      <loadButton type="primary" @click="add">{{ t("add") }}</loadButton>
    </template>

    <div class="library-modal">
      <a-spin :spinning="pageLoading">
        <a-input-search
          class="search"
          v-no-chinese
          v-model:value="searchValue"
          :placeholder="t('input_placeholder')"
          enter-button
          @search="onSearch"
        />

        <a-checkbox-group name="group">
          <a-row>
            <a-col class="col" v-for="item in fileList" :key="item.id" :span="24">
              <a-checkbox :value="item" @click="checkboxHandle(item)">
                {{ item.filename }}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-spin>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { t } from "@/locale";
import loadButton from "@/components/loadButton/loadButton.vue";
import { fileListNoPage } from "@/api/api/fileManager";
import { FileList } from "@/api/api/fileManager/types";

const modal = ref<boolean>(false);

const hide = () => {
  modal.value = false;
};

const show = () => {
  modal.value = true;
  getFileListNoPage();
  chooseFileList.value = [];
};

// 数据获取
const pageLoading = ref<boolean>(false);
const fileList = ref<FileList[]>([]);
const getFileListNoPage = async (keyWords?: string) => {
  try {
    pageLoading.value = true;
    fileList.value = await fileListNoPage({
      keyword: keyWords
    });
  } catch (err) {
    console.error(err);
  } finally {
    pageLoading.value = false;
  }
};

// 搜索
const searchValue = ref<string>();
const onSearch = () => {
  getFileListNoPage(searchValue.value);
};

// add
interface Emits {
  (e: "addFile", list: FileList[]): void;
}

const emits = defineEmits<Emits>();

// 选中文件checkbox
const chooseFileList = ref<FileList[]>([]);
const add = () => {
  emits("addFile", chooseFileList.value);
  hide();
};

const checkboxHandle = (file: FileList) => {
  const fileIndex = chooseFileList.value.findIndex((item) => item.file_id === file.file_id);
  if (fileIndex !== -1) {
    chooseFileList.value.splice(fileIndex, 1);
  } else {
    chooseFileList.value.push(file);
  }
};

defineExpose({
  show
});
</script>

<style scoped>
.library-modal {
  max-height: 70vh;
  overflow: auto;
}

.search {
  margin-top: var(--font-size-base);
}

.col {
  margin-top: 24px;
}
</style>
