<template>
  <div>
    <a-modal
      :open="deleteInfo.approveOpen"
      wrap-class-name="approve-action"
      :footer="null"
      :closable="false"
    >
      <a-card :title="t('Approve Work Order')" class="approve-card">
        <template #extra><close-outlined @click="onClose" /></template>
        <p>{{ t("mark_incomplete_notify_title") }}</p>
        <template #actions>
          <a-space>
            <a-button @click="onClose" :disabled="disabled">{{ t("close") }}</a-button>
            <a-button type="primary" @click="onSubmit" :loading="loading">
              {{ t("confirm_approval") }}
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
import { approveWorkOrder } from "@/api/api/workOrder";
import type { GetWorkOrderDetailReq } from "@/api/api/workOrder/types";

const disabled = ref<boolean>(false);
const loading = ref<boolean>(false);
// 数据接收
interface Props {
  approveOpen: boolean;
  oreder_id: number;
}
const { deleteInfo } = defineProps<{ deleteInfo: Props }>();
const emits = defineEmits(["cancels"]);

const onSubmit = async () => {
  disabled.value = true;
  loading.value = true;
  const param = ref<GetWorkOrderDetailReq>({
    order_id: deleteInfo.oreder_id
  });
  try {
    let res = await approveWorkOrder(param.value);
    if (res) {
      notifySuccess("Approved successfully");
      setInterval(() => {
        window.location.reload();
      }, 2000);
    }
    onClose();
  } catch {
    notifyError("Approved failure");
  }
  disabled.value = false;
  loading.value = false;
};
const onClose = () => {
  emits("cancels");
};
</script>

<style scoped></style>
