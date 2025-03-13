<template>
  <div>
    <a-modal
      :open="descriptInfo.open"
      @ok="handleOk"
      @cancel="Cancel"
      :cancel-text="t('cancel')"
      :ok-text="t('commit')"
    >
      <template #title>
        <div>
          <h2>{{ t("edit") }}</h2>
          <a-divider></a-divider>
        </div>
      </template>
      <p>
        <span>{{ t("file_name") }}:</span>
        <span>{{ descriptInfo.name }}</span>
      </p>
      <a-textarea
        v-no-chinese
        v-model:value="param.description"
        :placeholder="t('please_enter_description')"
        :auto-size="{ minRows: 7, maxRows: 9 }"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { notifyError, notifySuccess } from "@/utils/notify";
import i18n from "@/locale";

import { editFile } from "@/api/api/fileManager";
import type { EditFileReq } from "@/api/api/fileManager/types.ts";
import { ref, watch } from "vue";
import { DescriptInfoObject } from "@/views/manage/types/manage";

const { t } = i18n.global;
const { descriptInfo } = defineProps<{
  descriptInfo: DescriptInfoObject;
}>();
const param = ref<EditFileReq>({
  file_id: 0,
  description: descriptInfo.description
});
const handleOk = async () => {
  // 没有加删除描述功能，允许提交空描述
  param.value.file_id = descriptInfo.id;

  try {
    await editFile(param.value);
    notifySuccess(t("change_success"));
    //隐藏窗口
    reloadData();
  } catch {
    notifyError(t("change_fail"));
  }
};
const emits = defineEmits(["cancels", "reloadData"]);

const Cancel = () => {
  emits("cancels");
};
const reloadData = () => {
  emits("reloadData");
};
watch(
  () => descriptInfo.description,
  () => {
    param.value.description = descriptInfo.description;
  }
);
</script>

<style scoped></style>
