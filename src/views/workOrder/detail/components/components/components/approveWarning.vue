<template>
  <div>
    <a-modal
      :open="warmingInfo.open"
      wrap-class-name="publish-action"
      :footer="null"
      :closable="false"
    >
      <a-card title="Approve Work Order" class="publish-card">
        <template #extra><close-outlined @click="onClose" /></template>
        <p>This work order cannot be approved until following items are reviewed:</p>
        <div class="flex-column order-detail-title-bar">
          <div class="flex order-detail-info">
            <div class="info-item">
              <div class="flex">
                <div class="margin-left-8 flex-colum">
                  <div class="msg-data margin-top-8 margin-bottom-8">
                    <ul>
                      <li v-if="warmingInfo.info.expenses_count > 0">
                        {{ warmingInfo.info.expenses_count }} pending expenses.
                      </li>
                      <li v-if="warmingInfo.info.pay_change">a pending pay change request.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>Please review each of these items before approving this work order.</p>
        <template #actions>
          <a-space>
            <a-button @click="onClose">{{ t("close") }}</a-button>
          </a-space>
        </template>
      </a-card>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { t } from "@/locale";
import type { GetApproveFeeRes } from "@/api/api/workOrder/types";

// 数据接收
interface Props {
  open: boolean;
  info: GetApproveFeeRes;
}
const { warmingInfo } = defineProps<{ warmingInfo: Props }>();
const emits = defineEmits(["cancels"]);

const onClose = () => {
  emits("cancels");
};
</script>

<style scoped></style>
