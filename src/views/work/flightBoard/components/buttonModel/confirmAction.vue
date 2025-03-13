<template>
  <div>
    <a-modal
      :open="open"
      wrap-class-name="fb-batch-confirm-action"
      :footer="null"
      :closable="false"
    >
      <a-card :title="title" class="confirm-card">
        <template #extra><close-outlined @click="onClose" /></template>
        <p>{{ title }} {{ getDescText(type) }}</p>
        <template #actions>
          <a-space>
            <a-button @click="onClose" :disabled="disabled">{{ t("close") }}</a-button>
            <a-button type="primary" @click="onConfirm(type)" :loading="loading">
              {{ title }}
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
import { notifyError, notifySuccess } from "@/utils/notify";
import { batchApproveWorkOrder, publishWorkOrder, revertToDraft } from "@/api/api/workOrder";
import type { PublishWorkOrderReq } from "@/api/api/workOrder/types";
import "@/assets/style/views/work/batchOperate.less";
import { storeToRefs } from "pinia";
import { useTableRowSelectionDataStore } from "@/stores";
const { rowSelectionData } = storeToRefs(useTableRowSelectionDataStore());

const disabled = ref<boolean>(false);
const loading = ref<boolean>(false);
const open = ref<boolean>(false);
// 数据接收

const title = ref<string>("");
const type = ref<string>("");
const numbers = ref<number>(0);
const emits = defineEmits(["reloadData"]);

const show = (tp, num) => {
  open.value = true;
  numbers.value = num;
  type.value = tp;

  title.value = getTitle(tp, num);
};
const getTitle = (tp, num) => {
  let tle = t("publish");
  let unit = t("work_orders");
  if (num <= 1) {
    unit = t("work_order");
  }
  if (tp === "revert") {
    tle = t("revert");
    unit += " to draft";
  } else if (tp === "approve") {
    tle = t("approve");
  }
  return `${tle} ${num} ${unit}`;
};
const getDescText = (type) => {
  switch (type) {
    case "publish":
      return description.value.publish;
    case "approve":
      return description.value.approve;
    case "revert":
      return description.value.revert;
    default:
      return;
  }
};
interface descInterface {
  publish: string;
  approve: string;
  revert: string;
}
const description = ref<descInterface>({
  publish: `? The work order will immediately be available on the marketplace where technicians to begin to make requests and counter-offers.`,
  approve: `? The work order will immediately be approved. This action cannot be undone.`,
  revert: ` status? This will cancel any pending requests or routes and allow you to make more changes.`
});
const onConfirm = (type) => {
  switch (type) {
    case "publish":
      finished(type);
      break;
    case "approve":
      finished(type);
      break;
    case "revert":
      finished(type);
      break;
    default:
      return;
  }
};
const finished = async (type) => {
  disabled.value = true;
  loading.value = true;
  try {
    let res = "";
    const param = ref<PublishWorkOrderReq>({
      ids: rowSelectionData.value
    });
    if (type === "publish") {
      res = await publishWorkOrder(param.value);
    } else if (type === "approve") {
      res = await batchApproveWorkOrder(param.value);
    } else if (type === "revert") {
      res = await revertToDraft(param.value);
    }
    if (res) {
      notifySuccess(t("successfully"));
      onClose();
      // 重新加载数据
      emits("reloadData");
    }
  } catch {
    notifyError(t("failure"));
  } finally {
    disabled.value = false;
    loading.value = false;
  }
};

const onClose = () => {
  open.value = false;
};
defineExpose({
  show
});
</script>

<style scoped></style>
