<template>
  <div class="flight-filter-bar batch-operate-container" v-if="length > 0">
    <div class="batch-operate">
      <div>
        <a-space>
          <a-button
            class="button-color"
            ghost
            @click="batchSubmit('publish')"
            v-if="buttonShow.publish"
          >
            <TeamOutlined />
            {{ t("publish") }}
          </a-button>
          <a-button
            class="button-color"
            ghost
            @click="batchSubmit('delete')"
            v-if="buttonShow.delete"
          >
            <DeleteOutlined />
            {{ t("delete") }}
          </a-button>
          <a-button
            class="button-color"
            ghost
            @click="batchSubmit('approve')"
            v-if="buttonShow.approve"
          >
            <CheckCircleOutlined />
            {{ t("approve") }}
          </a-button>
          <a-button
            class="button-color"
            ghost
            @click="batchSubmit('revert')"
            v-if="buttonShow.revert"
          >
            <ArrowLeftOutlined />
            {{ t("revert_to_draft") }}
          </a-button>
          <a-button
            class="button-color"
            ghost
            @click="batchSubmit('cancel')"
            v-if="buttonShow.cancel"
          >
            <DeleteOutlined />
            {{ t("cancel") }}
          </a-button>
          <exportModel :type="props.type" v-if="buttonShow.export"></exportModel>
        </a-space>
      </div>
      <div>
        <confirmAction ref="comConfirm" @reloadData="reloadData"></confirmAction>
        <deleteBatch ref="CDRefs" @reloadData="reloadData"></deleteBatch>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  DeleteOutlined
} from "@ant-design/icons-vue";

import { computed, onMounted, ref, watch } from "vue";
import { t } from "@/locale";
import { GetWorkOrderListReqTypeEnum } from "@/api/api/workOrder/types";
import { useTableRowSelectionDataStore } from "@/stores";
import { storeToRefs } from "pinia";
import "@/assets/style/views/work/batchOperate.less";
import confirmAction from "./components/buttonModel/confirmAction.vue";
import deleteBatch from "./components/buttonModel/deleteBatch.vue";
import exportModel from "./components/buttonModel/exportModel.vue";

const { rowSelectionData } = storeToRefs(useTableRowSelectionDataStore());
const { rowReset } = useTableRowSelectionDataStore();

const length = computed(() => {
  return rowSelectionData.value.length > 0 ? rowSelectionData.value.length : 0;
});
interface Props {
  type: GetWorkOrderListReqTypeEnum;
}

const props = defineProps<Props>();

const comConfirm = ref();
const CDRefs = ref();

// 按钮控制
const buttonShow = ref<{
  publish: boolean;
  delete: boolean;
  approve: boolean;
  revert: boolean;
  cancel: boolean;
  export: boolean;
}>({
  publish: false,
  delete: false,
  approve: false,
  revert: false,
  cancel: false,
  export: false
});
const getButtonShow = () => {
  buttonHide();
  let typeEnum = props.type;
  buttonShow.value.export = true;
  if (typeEnum === 1) {
    buttonShow.value.approve = true;
    buttonShow.value.revert = true;
    buttonShow.value.cancel = true;
  } else if (typeEnum === 2) {
    buttonShow.value.publish = true;
    buttonShow.value.delete = true;
  } else if (typeEnum === 3) {
    buttonShow.value.revert = true;
    buttonShow.value.cancel = true;
  } else if (typeEnum === 5) {
    buttonShow.value.approve = true;
  } else if (typeEnum === 8) {
    buttonShow.value.publish = true;
    buttonShow.value.approve = true;
    buttonShow.value.revert = true;
    buttonShow.value.cancel = true;
  }
};
// 按钮初始化
const buttonHide = () => {
  buttonShow.value.delete = false;
  buttonShow.value.cancel = false;
  buttonShow.value.approve = false;
  buttonShow.value.publish = false;
  buttonShow.value.export = false;
  buttonShow.value.revert = false;
};
const batchSubmit = (type: string) => {
  //先检查是否有提交内容
  switch (type) {
    case "publish":
      comConfirm.value.show(type, length.value);
      break;
    case "delete":
      CDRefs.value.show(1, length.value);
      break;
    case "approve":
      comConfirm.value.show(type, length.value);
      break;
    case "revert":
      comConfirm.value.show(type, length.value);
      break;
    case "cancel":
      CDRefs.value.show(2, length.value);
      break;
    case "export":
      break;
    default:
      return;
  }
};

// 抛出事件
interface Emits {
  (e: "reloadData"): void;
}

const emits = defineEmits<Emits>();

const reloadData = () => {
  rowReset();
  emits("reloadData");
};
watch(
  () => props.type,
  () => {
    getButtonShow();
  }
);
onMounted(() => {
  getButtonShow();
});

defineExpose({
  length
});
</script>
