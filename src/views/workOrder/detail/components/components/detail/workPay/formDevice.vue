<template>
  <a-form :model="formData" name="hourly" layout="vertical" :label-col="{ span: 16 }" ref="formRef">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item
          label="Per device rate"
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
          <a-input v-no-chinese v-model:value.number="formData.base.amount" type="number">
            <template #prefix>
              <DollarTwoTone />
            </template>
          </a-input>
          <span class="font-color-minor">Must add up to $20 work order minimum</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Max devices"
          :name="['base', 'units']"
          :rules="[
            {
              required: true,
              type: 'number',
              min: 1,
              trigger: ['blur']
            }
          ]"
        >
          <a-input v-no-chinese v-model:value.number="formData.base.units" type="number"></a-input>
          <span class="font-color-minor">1 device minimum</span>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          label="Approximate hours to complete"
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
          <a-input v-no-chinese v-model:value.number="formData.hours" type="number"></a-input>
          <span class="font-color-minor">Available in work order activity report</span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Pay, PayTypeEnum } from "@/api/api/workOrder/types";
import { DollarTwoTone } from "@ant-design/icons-vue";
import { useFnWorkOrderPayStore } from "@/stores";
import { storeToRefs } from "pinia";
import _ from "lodash";

const formData = ref<Pay>({
  type: PayTypeEnum.DEVICE,
  base: {
    amount: undefined,
    units: undefined
  },
  additional: {
    amount: 0,
    units: 0
  },
  hours: undefined
});

const { fnWorkOrderPay } = storeToRefs(useFnWorkOrderPayStore());

const format = () => {
  if (fnWorkOrderPay.value?.type === PayTypeEnum.DEVICE) {
    formData.value.base = _.cloneDeep(fnWorkOrderPay.value.base);
    formData.value.hours = fnWorkOrderPay.value.hours;
  }
};

interface Emits {
  (e: "formHandle", value: Pay): void;
}

const emits = defineEmits<Emits>();

const formRef = ref();

const validate = async () => {
  try {
    const res = await formRef.value.validate();
    if (!res) return;
    emits("formHandle", formData.value);
    return res;
  } catch (error) {
    console.error(error);
  }
};

defineExpose({
  validate
});

onMounted(() => {
  format();
});
</script>
