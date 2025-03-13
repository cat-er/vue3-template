<template>
  <div class="order-detail-action-bar action-box-white flex">
    <div>
      <a-radio-group>
        <a-radio-button value="a" :class="buttonShow.copy ? '' : 'hide'" @click="orderTaskCopy">
          {{ t("copy") }}
        </a-radio-button>
        <a-radio-button value="b" class="hide">{{ t("print") }}</a-radio-button>
        <a-radio-button
          value="c"
          :class="buttonShow.delete ? '' : 'hide'"
          @click="deleteWordOrder(1)"
        >
          {{ t("delete") }}
        </a-radio-button>
        <a-radio-button
          value="d"
          :class="buttonShow.cancel ? '' : 'hide'"
          @click="deleteWordOrder(2)"
        >
          {{ t("cancel") }}
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class="btn-list">
      <a-button class="hide">{{ t("edit") }}</a-button>
      <a-button :class="buttonShow.mark_incomplete ? '' : 'hide'" @click="showMark">
        {{ t("mark_incomplete") }}
      </a-button>
      <a-button :class="buttonShow.approve ? '' : 'hide'" @click="showApprove">
        {{ t("approve") }}
      </a-button>
      <a-button
        :class="buttonShow.publish ? '' : 'hide'"
        @click="publishOrder"
        type="primary"
        :loading="loadding.publish"
      >
        {{ t("publish") }}
      </a-button>
      <a-button
        :class="buttonShow.revert_to_draft ? '' : 'hide'"
        @click="toDraft"
        :loading="loadding.revert_to_draft"
      >
        {{ t("revert_to_draft") }}
      </a-button>
      <div>
        <deleteWorkOrder :deleteInfo="deleteInfo" @cancels="cancels"></deleteWorkOrder>
        <markIncomplete :deleteInfo="deleteInfo" @cancels="cancels"></markIncomplete>
        <approveAction :deleteInfo="deleteInfo" @cancels="cancels"></approveAction>
        <publish-action :deleteInfo="deleteInfo" @cancels="cancels"></publish-action>
        <approve-warning :warming-info="warmingInfo" @cancels="cancels"></approve-warning>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useFnWorkOrderPayStore, useWorkOrderDetailStore } from "@/stores";
import DeleteWorkOrder from "@/views/workOrder/detail/components/components/components/deleteWorkOrder.vue";
import markIncomplete from "@/views/workOrder/detail/components/components/components/markIncomplete.vue";
import {
  copyWorkOrder,
  getIncompleteReasons,
  publishWorkOrder,
  revertToDraft
} from "@/api/api/workOrder";
import type { GetApproveFeeRes, GetIncompleteReasonsRes } from "@/api/api/workOrder/types";
import ApproveAction from "@/views/workOrder/detail/components/components/components/approveAction.vue";
import PublishAction from "@/views/workOrder/detail/components/components/components/publishAction.vue";
import { notifyError, notifySuccess } from "@/utils/notify";
import ApproveWarning from "@/views/workOrder/detail/components/components/components/approveWarning.vue";

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());
const { approveFee } = storeToRefs(useFnWorkOrderPayStore());

// 按钮控制
const buttonShow = ref<{
  copy: boolean;
  print: boolean;
  delete: boolean;
  cancel: boolean;
  edit: boolean;
  mark_incomplete: boolean;
  approve: boolean;
  publish: boolean;
  revert_to_draft: boolean;
}>({
  copy: true,
  print: false,
  delete: false,
  cancel: false,
  edit: false,
  mark_incomplete: false,
  approve: false,
  publish: false,
  revert_to_draft: false
});

// 组件谁组装
const deleteInfo = ref<{
  open: boolean;
  markOpen: boolean;
  approveOpen: boolean;
  publishOpen: boolean;
  markOptions: GetIncompleteReasonsRes[];
  typeNum: number;
  oreder_id: number;
}>({
  open: false,
  markOpen: false,
  approveOpen: false,
  publishOpen: false,
  markOptions: [],
  typeNum: 1,
  oreder_id: 0
});
// 按钮状态控制
const loadding = ref<{
  publish: boolean;
  revert_to_draft: boolean;
}>({
  publish: false,
  revert_to_draft: false
});
// 删除和取消
const deleteWordOrder = (num: number) => {
  deleteInfo.value.typeNum = num;
  deleteInfo.value.open = true;
};
// 标记不完成组件显示
const showMark = () => {
  deleteInfo.value.markOpen = true;
};
// 支付通过组件显示
interface warmingInterface {
  open: boolean;
  info: GetApproveFeeRes;
}
const warmingInfo = ref<warmingInterface>({
  open: false,
  info: approveFee.value as GetApproveFeeRes
});
const showApprove = () => {
  if (approveFee.value?.is_error) {
    warmingInfo.value.open = true;
  } else {
    deleteInfo.value.approveOpen = true;
  }
};

// 发布组件显示
const showPublish = () => {
  deleteInfo.value.publishOpen = true;
};
watch(
  () => workOrderDetail.value?.id,
  () => {
    detailInit();
  }
);
const detailInit = () => {
  // 工单相关的赋值处理
  deleteInfo.value.oreder_id = Number(workOrderDetail.value?.id);
  // 按钮状态控制
  getButtonShow();
  // 获取标记未完成选项
  getMarkOptions();
};
// 按钮显示控制
const getButtonShow = () => {
  buttonHide();
  let workStatus = workOrderDetail.value?.status;
  if (workStatus === 1) {
    buttonShow.value.delete = true;
    buttonShow.value.publish = true;
  } else if (workStatus === 2 || workStatus === 3 || workStatus === 9) {
    buttonShow.value.cancel = true;
    if (workStatus === 2) {
      buttonShow.value.revert_to_draft = true;
    }
  } else if (workStatus === 4) {
    buttonShow.value.mark_incomplete = true;
    buttonShow.value.approve = true;
  }
};
// 按钮初始化
const buttonHide = () => {
  buttonShow.value.copy = true;
  buttonShow.value.print = false;
  buttonShow.value.delete = false;
  buttonShow.value.cancel = false;
  buttonShow.value.edit = false;
  buttonShow.value.mark_incomplete = false;
  buttonShow.value.approve = false;
  buttonShow.value.publish = false;
  buttonShow.value.revert_to_draft = false;
};
// 标记选项
const getMarkOptions = async () => {
  deleteInfo.value.markOptions = await getIncompleteReasons();
};
// 发布
const publishOrder = async () => {
  loadding.value.publish = true;
  try {
    let res = await publishWorkOrder({ ids: [Number(workOrderDetail.value?.id)] });
    if (res) {
      notifySuccess(t("published_successfully"));
      setInterval(() => {
        window.location.reload();
      }, 2000);
    }
  } catch {
    notifyError(t("published_failure"));
    showPublish();
  }
  loadding.value.publish = false;
};

// 退回草稿
const toDraft = async () => {
  loadding.value.revert_to_draft = true;
  try {
    let res = await revertToDraft({ ids: [Number(workOrderDetail.value?.id)] });
    if (res) {
      notifySuccess(t("successfully"));
      setInterval(() => {
        window.location.reload();
      }, 1000);
    }
  } catch {
    notifyError(t("failure"));
  }
  loadding.value.revert_to_draft = false;
};

// 任务复制
const orderTaskCopy = async () => {
  try {
    let res = await copyWorkOrder({ source_id: Number(workOrderDetail.value?.id) });
    if (res) {
      notifySuccess(t("copy_successfully"));
      setInterval(() => {
        window.location.href = "?orderId=" + res.id;
      }, 2000);
    }
  } catch {
    notifyError(t("copy_failure"));
  }
};
// 关闭弹窗
const cancels = () => {
  deleteInfo.value.open = false;
  deleteInfo.value.markOpen = false;
  deleteInfo.value.approveOpen = false;
  deleteInfo.value.publishOpen = false;
  warmingInfo.value.open = false;
};
onMounted(() => {
  detailInit();
});
</script>
