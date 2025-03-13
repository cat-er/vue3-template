<template>
  <a-drawer placement="right" :open="open" @close="onClose" :title="t('details')">
    <a-descriptions :title="t('deposit_details')" v-if="details">
      <a-descriptions-item :span="3" v-if="details.pay_method_info">
        <template #label>
          {{ t("pay_method") }}
        </template>
        {{ details.pay_method_info.name ? details.pay_method_info.name : "" }}
      </a-descriptions-item>
      <a-descriptions-item :span="3">
        <template #label>
          {{ t("applied_amount") }}
        </template>
        {{ details.recharge_mcode }} {{ details.recharge_score }}
      </a-descriptions-item>
      <a-descriptions-item :span="3">
        <template #label>
          {{ t("confirmation_no") }}
        </template>
        {{ details.confirmation_no ? details.confirmation_no : "" }}
      </a-descriptions-item>
      <a-descriptions-item :span="3">
        <template #label>
          {{ t("pay_account") }}
        </template>
        {{ details.pay_from_account ? details.pay_from_account : "" }}
      </a-descriptions-item>
      <a-descriptions-item :span="3">
        <template #label>
          {{ t("attachment") }}
        </template>
        <a-image
          class="image"
          v-if="details.file_path"
          :preview="false"
          :width="200"
          :src="details.file_path"
          @click="showImage(details.file_path)"
          style="cursor: pointer"
        />
      </a-descriptions-item>
    </a-descriptions>
    <div v-if="details.fee_details_info.status == 2">
      <a-divider />
      <a-descriptions :title="t('order_details')">
        <a-descriptions-item :span="3">
          <template #label>
            {{ t("applied_amount") }}
          </template>
          {{ details.recharge_score ? details.recharge_score : "" }}
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <template #label>
            {{ t("applied_currency") }}
          </template>
          {{ details.recharge_mcode ? details.recharge_score : "" }}
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <template #label>
            {{ t("recharge_currency") }}
          </template>
          {{ details.mcode ? details.mcode : "" }}
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <template #label>
            {{ t("recharge_amount") }}
          </template>
          {{ details.score ? details.score : "" }}
          <a-space style="margin-left: 20px">
            <a-tag :bordered="false" color="processing">
              {{ t("exchange_rate") }}：
              {{ details.exchange_rate ? details.exchange_rate : "" }}
            </a-tag>
          </a-space>
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-drawer>
</template>
<script setup lang="ts">
import { t } from "@/locale";
import type { RechargeListRes } from "@/api/api/amount/types";

interface Props {
  open: boolean;
  details: RechargeListRes;
}
const { open, details } = defineProps<Props>();
const emits = defineEmits(["cancels"]);

// const detailsInfo = reactive<object>({
//   open:false,
//   details: {} as any,
// });
// const show = (isOpen,data) => {
//   detailsInfo.open = isOpen;
//   detailsInfo.details = data;
// }
const showImage = (imagePath) => {
  window.open(imagePath);
};
const onClose = () => {
  emits("cancels", 0);
};
</script>
