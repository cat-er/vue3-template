<template>
  <a-form name="pay" :model="formData" :label-col="{ span: 24 }" ref="formRef">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item
          :label="t('per_device_rate')"
          :name="['base', 'amount']"
          :rules="[
            {
              required: true,
              type: 'number',
              message: 'Minimum work order payment amount is $20',
              min: 20,
              trigger: ['blur']
            }
          ]"
        >
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
          <div class="form-note">
            {{ t("per_device_rate_tip") }}
          </div>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :label="t('max_devices')"
          :name="['base', 'units']"
          :rules="[
            {
              required: true,
              type: 'number',
              message: t('it_can_only_be_numbers'),
              min: 1,
              trigger: ['blur']
            }
          ]"
        >
          <a-input
            v-no-chinese
            v-model:value.number="formData.base.units"
            type="number"
            size="large"
          ></a-input>
          <div class="form-note">
            {{ t("max_devices_tip") }}
          </div>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          :label="t('approximate_hours_to_complete')"
          name="hours"
          :rules="[
            {
              required: true,
              type: 'number',
              message: 'Enter approximate hours to complete',
              min: 1,
              trigger: ['blur']
            }
          ]"
        >
          <a-input
            v-no-chinese
            v-model:value.number="formData.hours"
            type="number"
            size="large"
          ></a-input>
          <div class="form-note">
            {{ t("approximate_hours_to_complete_fixed_tip") }}
          </div>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from "vue";
import { t } from "@/locale";
import { DollarTwoTone } from "@ant-design/icons-vue";
import { Pay, PayTypeEnum } from "@/api/api/workOrder/types";
import { useOutPutState } from "@/views/workOrder/create/hooks";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { storeToRefs } from "pinia";
import { useWorkOrderaTemplateCreateStore } from "@/stores";
import _ from "lodash";

const formData = ref<Pay>({
  type: PayTypeEnum.DEVICE,
  base: {
    amount: undefined,
    units: undefined
  },
  hours: undefined
});

// 校验
const formRef = ref();
const formValidate = async () => {
  try {
    await formRef.value.validate();
    useOutPutState(true, WorkOrderListKey.PAY, {
      pay: formData.value
    });
  } catch (err) {
    useOutPutState(false, WorkOrderListKey.PAY, {
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
  type: PayTypeEnum.DEVICE,
  base: {
    amount: undefined,
    units: undefined
  },
  hours: undefined
};

const temEchoData = () => {
  formData.value = _.merge(formData.value, resetData);
  if (!currentTemplateData.value?.pay || currentTemplateData.value?.pay.type !== PayTypeEnum.DEVICE)
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
