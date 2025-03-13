<template>
  <a-form :model="formData" name="hourly" layout="vertical" :label-col="{ span: 16 }" ref="formRef">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item
          label="Total pay"
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
          <span class="font-color-minor">$20 minimum</span>
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
  type: PayTypeEnum.FIXED,
  base: {
    amount: undefined,
    units: 1
  },
  additional: {
    amount: 0,
    units: 0
  },
  hours: undefined
});

const format = () => {
  if (fnWorkOrderPay.value?.type === PayTypeEnum.FIXED) {
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
