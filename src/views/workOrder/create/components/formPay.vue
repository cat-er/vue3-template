<template>
  <a-card :title="t('pay')" class="box-shadow">
    <a-radio-group v-model:value="currentRadio" class="pay-radio">
      <a-radio-button v-for="item in radioList" :value="item.key" :key="item.key">
        {{ item.label }}
      </a-radio-button>
    </a-radio-group>

    <component :is="currentComponent" />
  </a-card>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { ref, computed, watch } from "vue";
import { Pay, PayTypeEnum } from "@/api/api/workOrder/types";
import { storeToRefs } from "pinia";
import { useWorkOrderaTemplateCreateStore } from "@/stores";
import formHourly from "./components/formPay/formHourly.vue";
import formFixed from "./components/formPay/formFixed.vue";
import formDevice from "./components/formPay/formDevice.vue";
import formBlended from "./components/formPay/formBlended.vue";

// 单选框列表
interface RadioList {
  label: string;
  key: PayTypeEnum;
}

const radioList = ref<RadioList[]>([
  { label: t("pay_radio_hourly"), key: PayTypeEnum.HOURLY },
  { label: t("pay_radio_fixed"), key: PayTypeEnum.FIXED },
  { label: t("pay_radio_device"), key: PayTypeEnum.DEVICE },
  { label: t("pay_radio_blended"), key: PayTypeEnum.BLENDED }
]);

const currentRadio = ref<PayTypeEnum>(PayTypeEnum.HOURLY);

// 组件索引
const componentMap = {
  [PayTypeEnum.HOURLY]: formHourly,
  [PayTypeEnum.FIXED]: formFixed,
  [PayTypeEnum.DEVICE]: formDevice,
  [PayTypeEnum.BLENDED]: formBlended
};

const currentComponent = computed(() => componentMap[currentRadio.value]);

// 模板数据回显
const { currentTemplateData } = storeToRefs(useWorkOrderaTemplateCreateStore());

const temEchoData = () => {
  currentRadio.value = PayTypeEnum.HOURLY;
  if (!currentTemplateData.value?.pay) return;
  currentRadio.value = currentTemplateData.value?.pay.type;
};

watch(
  () => currentTemplateData.value,
  () => {
    temEchoData();
  }
);
</script>
