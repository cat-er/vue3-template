<template>
  <a-radio-group v-model:value="actionValue">
    <a-spin :spinning="isLoading">
      <template v-for="item in actionBar" :key="item.key">
        <a-radio-button v-if="item.show" :value="item.key" @click="actionHandle(item.key)">
          {{ item.label }}
        </a-radio-button>
      </template>
    </a-spin>
  </a-radio-group>
  <editModal ref="editModalRef" @text-input="textInput"></editModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { t } from "@/locale";
import { updateDeliverablesFile } from "@/api/api/workOrder/index";
import {
  UpdateDeliverablesFileReq,
  DeliverablesFileStatusEnum,
  FNWorkOrderFileListResult
} from "@/api/api/workOrder/types";
import { storeToRefs } from "pinia";
import { useWorkOrderDetailStore } from "@/stores";
import editModal from "@/components/editModal/editModal.vue";

interface Prop {
  fileItem: FNWorkOrderFileListResult;
}

const prop = defineProps<Prop>();

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());

// action按钮
const actionValue = ref();
const actionBar = [
  {
    label: t("approve"),
    show: true,
    key: 1
  },
  {
    label: t("deny"),
    show: true,
    key: 2
  },
  {
    label: t("revert_to_pending"),
    show: false,
    key: 3
  },
  {
    label: t("download_file"),
    show: true,
    key: 4
  },
  {
    label: prop.fileItem.notes ? t("edit_note") : t("add_note"),
    show: true,
    key: 5
  }
];

interface Emits {
  (e: "actionDone"): void;
}

const emits = defineEmits<Emits>();

// 操作
const status = ref<DeliverablesFileStatusEnum>(DeliverablesFileStatusEnum.PENDING);

// 更新
const statusDescription = ref<string>("");
const notes = ref<string>("");
const updateData = computed<UpdateDeliverablesFileReq>(() => {
  return {
    folder_id: prop.fileItem.folder_id,
    attachment_id: prop.fileItem.id,
    status: status.value,
    status_description: statusDescription.value,
    notes: notes.value
  };
});

const editModalRef = ref();
// 1是点击add note 2是点击拒绝
const isAddNote = ref<number>();
const actionHandle = (key: number) => {
  switch (key) {
    case 1:
      status.value = DeliverablesFileStatusEnum.APPROVED;
      updateDeliverablesFileAsync(updateData.value);
      break;
    case 2:
      status.value = DeliverablesFileStatusEnum.DENIED;
      editModalRef.value.show();
      isAddNote.value = 2;
      break;
    case 3:
      status.value = DeliverablesFileStatusEnum.PENDING;
      updateDeliverablesFileAsync(updateData.value);
      break;
    case 4:
      window.open(prop.fileItem.file.link);
      break;
    default:
      editModalRef.value.show();
      isAddNote.value = 1;
      break;
  }
};

// 变更按钮状态函数
const toReset = () => {
  actionBar[0].show = false;
  actionBar[1].show = false;
  actionBar[2].show = true;
};

const toPending = () => {
  actionBar[0].show = true;
  actionBar[1].show = true;
  actionBar[2].show = false;
};

const textInput = (value: string) => {
  if (isAddNote.value === 2) {
    statusDescription.value = value;
  } else {
    notes.value = value;
  }
  updateDeliverablesFileAsync(updateData.value);
  statusDescription.value = "";
  notes.value = "";
};

const isLoading = ref(false);
const updateDeliverablesFileAsync = async (item: UpdateDeliverablesFileReq) => {
  try {
    isLoading.value = true;
    const res = await updateDeliverablesFile(item, String(workOrderDetail.value?.id));
    if (!res) return;
    if (status.value === DeliverablesFileStatusEnum.PENDING) {
      toPending();
    } else {
      toReset();
    }
    emits("actionDone");
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const init = () => {
  if (prop.fileItem.status === DeliverablesFileStatusEnum.PENDING) {
    toPending();
  } else {
    toReset();
  }
};

watch(
  () => actionValue.value,
  (newValue) => {
    if (newValue !== 0) {
      actionValue.value = 0;
    }
  }
);

onMounted(() => {
  init();
});
</script>
