<template>
  <div>
    <a-modal v-model:open="modal" :maskClosable="false" destroyOnClose width="40%" title="Edit Pay">
      <div>
        <a-segmented
          block
          v-model:value="currentType"
          :options="payTypeList"
          class="margin-bottom-16"
        >
          <template #label="{ value: val, payload = {} }">
            {{ payload.label }}
          </template>
        </a-segmented>

        <component :is="currentComponent" ref="formRef" @formHandle="formHandle" />
      </div>
      <template #footer>
        <a-button @click="hide">Cancel</a-button>
        <a-button type="primary" :loading="isLoading" @click="submitHandle">Save</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { PayTypeEnum } from "@/api/api/workOrder/types";
import formHourly from "./formHourly.vue";
import formFixed from "./formFixed.vue";
import formDevice from "./formDevice.vue";
import formBlended from "./formBlended.vue";
import { updatePay, getFnWorkOrderPay } from "@/api/api/workOrder";
import { Pay } from "@/api/api/workOrder/types";
import { useWorkOrderDetailStore, useFnWorkOrderPayStore, usePageLoadingStore } from "@/stores";
import { storeToRefs } from "pinia";
import { notifySuccess } from "@/utils/notify";
import { useRoute } from "vue-router";

const route = useRoute();

const modal = ref<boolean>(false);

const show = () => {
  modal.value = true;
};

const hide = () => {
  modal.value = false;
};

const payTypeList = ref([
  {
    value: PayTypeEnum.HOURLY,
    payload: {
      label: "Hourly"
    }
  },
  {
    value: PayTypeEnum.FIXED,
    payload: {
      label: "Fixed"
    }
  },
  {
    value: PayTypeEnum.DEVICE,
    payload: {
      label: "Per Device"
    }
  },
  {
    value: PayTypeEnum.BLENDED,
    payload: {
      label: "Blended"
    }
  }
]);

const currentType = ref<PayTypeEnum>(PayTypeEnum.HOURLY);

const currentComponent = computed(() => {
  switch (currentType.value) {
    case PayTypeEnum.HOURLY:
      return formHourly;
    case PayTypeEnum.FIXED:
      return formFixed;
    case PayTypeEnum.DEVICE:
      return formDevice;
    case PayTypeEnum.BLENDED:
      return formBlended;
    default:
      return null;
  }
});

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());
const { setFnWorkOrderPay } = useFnWorkOrderPayStore();
const { changeLoading } = usePageLoadingStore();

const isLoading = ref(false);

const formRef = ref();
const submitHandle = async () => {
  await formRef.value.validate();
};

const oredrId = computed(() => {
  return Number(route.query.orderId);
});

// 重新获取pay信息
const refresh = async () => {
  try {
    changeLoading(true);
    const res = await getFnWorkOrderPay({ order_id: oredrId.value });
    if (res) {
      setFnWorkOrderPay(res);
    }
  } catch (error) {
    console.error(error);
  } finally {
    changeLoading(false);
  }
};

const submit = async (value: Pay) => {
  try {
    if (!workOrderDetail.value) return;
    isLoading.value = true;
    const res = await updatePay(value, workOrderDetail.value?.id);
    if (res) {
      notifySuccess("Success");
      refresh();
      hide();
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const formHandle = (value: Pay) => {
  submit(value);
};

defineExpose({
  show
});
</script>
