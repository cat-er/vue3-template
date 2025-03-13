<template>
  <a-form name="pay" :model="formData" :label-col="{ span: 24 }" ref="formRef">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item :label="t('fixed_payment')" :name="['base', 'amount']">
          <a-input
            v-no-chinese
            v-model:value.number="formData.base.amount"
            type="number"
            size="large"
          >
            <template #prefix>
              <DollarTwoTone />
            </template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="t('fixed_hours')" :name="['base', 'units']">
          <a-input
            v-no-chinese
            v-model:value.number="formData.base.units"
            type="number"
            size="large"
          ></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="t('additional_hourly_rate')" :name="['additional', 'amount']">
          <a-input
            v-model:value.number="additionalAmountModel"
            v-no-chinese
            type="number"
            size="large"
          ></a-input>
          <div class="form-note">
            {{ t("additional_hourly_rate_tip") }}
          </div>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="t('max_additional_hours')" :name="['additional', 'units']">
          <a-input
            v-no-chinese
            v-model:value.number="additionalUnitsModel"
            type="number"
            size="large"
          ></a-input>
          <div class="form-note">
            {{ t("max_additional_hours_tip") }}
          </div>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item :label="t('approximate_hours_to_complete')" name="hours">
          <a-input v-model:value.number="formData.hours" type="number" size="large"></a-input>
          <div class="form-note">
            {{ t("approximate_hours_to_complete_blended_tip") }}
          </div>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { t } from "@/locale";
import { DollarTwoTone } from "@ant-design/icons-vue";
import { Pay, PayTypeEnum } from "@/api/api/workOrder/types";
import { useOutPutState } from "@/views/template/create/hooks";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { storeToRefs } from "pinia";
import { useWorkOrderaTemplateCreateStore } from "@/stores";
import _ from "lodash";

const formData = ref<Pay>({
  type: PayTypeEnum.BLENDED,
  base: {
    amount: undefined,
    units: undefined
  },
  additional: {
    amount: undefined,
    units: undefined
  },
  hours: undefined
});

const additionalAmountModel = computed({
  get() {
    return formData.value.additional?.amount ?? 0;
  },
  set(value: number) {
    if (!formData.value.additional) {
      formData.value.additional = { amount: undefined, units: undefined };
    }
    formData.value.additional.amount = value;
  }
});

const additionalUnitsModel = computed({
  get() {
    return formData.value.additional?.units ?? 0;
  },
  set(value: number) {
    if (!formData.value.additional) {
      formData.value.additional = { amount: undefined, units: undefined };
    }
    formData.value.additional.units = value;
  }
});

// 校验
const formRef = ref();
const formValidate = async () => {
  try {
    await formRef.value.validate();
    useOutPutState(WorkOrderListKey.PAY, {
      pay: formData.value
    });
  } catch (err) {
    useOutPutState(WorkOrderListKey.PAY, {
      pay: formData.value
    });
  }
};

watch(
  () => formData.value,
  () => {
    formValidate();
  },
  {
    deep: true
  }
);

// 回显
const { currentTemplateData } = storeToRefs(useWorkOrderaTemplateCreateStore());
const resetData: Pay = {
  type: PayTypeEnum.BLENDED,
  base: {
    amount: undefined,
    units: undefined
  },
  additional: {
    amount: undefined,
    units: undefined
  },
  hours: undefined
};

const temEchoData = async () => {
  formData.value = _.merge(formData.value, resetData);
  if (
    !currentTemplateData.value?.pay ||
    currentTemplateData.value?.pay.type !== PayTypeEnum.BLENDED
  )
    return;
  const { pay } = currentTemplateData.value;
  formData.value = _.merge(formData.value, pay);
};

watch(
  () => currentTemplateData.value,
  () => {
    temEchoData();
  },
  { immediate: true }
);

onMounted(() => {
  formValidate();
});

onUnmounted(() => {
  formData.value = _.merge(formData.value, resetData);
});
</script>
