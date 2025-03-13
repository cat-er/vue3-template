<template>
  <a-form :model="formData" name="hourly" layout="vertical" :label-col="{ span: 16 }" ref="formRef">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item
          label="Fixed payment"
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
      <a-col :span="12">
        <a-form-item
          label="Fixed hours"
          :name="['base', 'units']"
          :rules="[{ required: true, type: 'number', min: 1, trigger: ['blur'] }]"
        >
          <a-input v-no-chinese v-model:value.number="formData.base.units" type="number"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Additional hour rate"
          :name="['additional', 'amount']"
          :rules="[{ required: true, type: 'number', min: 1, trigger: ['blur'] }]"
        >
          <a-input
            v-no-chinese
            v-model:value.number="additionalAmountModel"
            type="number"
          ></a-input>
          <span class="font-color-minor">Must add up to $20 work order minimum</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Max additional hours"
          :name="['additional', 'units']"
          :rules="[{ required: true, type: 'number', min: 1, trigger: ['blur'] }]"
        >
          <a-input v-no-chinese v-model:value.number="additionalUnitsModel"></a-input>
          <span class="font-color-minor">1 hour minimum, hours are not rounded</span>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          label="Approximate hours to complete"
          name="hours"
          :rules="[{ required: true, type: 'number', min: 1, trigger: ['blur'] }]"
        >
          <a-input v-no-chinese v-model:value.number="formData.hours"></a-input>
          <span class="font-color-minor">Available in work order activity report</span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Pay, PayTypeEnum } from "@/api/api/workOrder/types";
import { DollarTwoTone } from "@ant-design/icons-vue";
import { useFnWorkOrderPayStore } from "@/stores";
import { storeToRefs } from "pinia";
import _ from "lodash";

const { fnWorkOrderPay } = storeToRefs(useFnWorkOrderPayStore());

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

const format = () => {
  if (fnWorkOrderPay.value?.type === PayTypeEnum.BLENDED) {
    formData.value.base = _.cloneDeep(fnWorkOrderPay.value.base);
    formData.value.additional = _.cloneDeep(fnWorkOrderPay.value.additional);
    formData.value.hours = fnWorkOrderPay.value.hours;
  }
};

onMounted(() => {
  format();
});
</script>
