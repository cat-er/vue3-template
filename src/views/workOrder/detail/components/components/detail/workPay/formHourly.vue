<template>
  <a-form :model="formData" name="hourly" layout="vertical" :label-col="{ span: 16 }" ref="formRef">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item
          label="Hourly rate"
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
          <a-input v-no-chinese type="number" v-model:value.number="formData.base.amount">
            <template #prefix>
              <DollarTwoTone />
            </template>
          </a-input>
          <span class="font-color-minor">Must add up to $20 work order minimum</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Max Hours"
          :name="['base', 'units']"
          :rules="[{ required: true, type: 'number', min: 1, trigger: ['blur'] }]"
        >
          <a-input v-no-chinese type="number" v-model:value.number="formData.base.units"></a-input>
          <span class="font-color-minor">1 hour minimum, hours are not rounded</span>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          label="Approximate hours to complete"
          name="hours"
          :rules="[{ required: true, type: 'number', min: 1, trigger: ['blur'] }]"
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

const { fnWorkOrderPay } = storeToRefs(useFnWorkOrderPayStore());

const formData = ref<Pay>({
  type: PayTypeEnum.HOURLY,
  base: {
    amount: 0,
    units: 0
  },
  additional: {
    amount: 0,
    units: 0
  },
  hours: 0
});

const format = () => {
  if (fnWorkOrderPay.value?.type === PayTypeEnum.HOURLY) {
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
