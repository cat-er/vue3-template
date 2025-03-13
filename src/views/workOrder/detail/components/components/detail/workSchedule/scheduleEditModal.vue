<template>
  <div>
    <a-modal v-model:open="modal" :maskClosable="false" width="40%" title="Edit Schedule">
      <div>
        <a-form
          :model="temp"
          layout="vertical"
          name="schedule"
          :rules="rules"
          :label-col="{ span: 24 }"
          ref="formRef"
        >
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="Schedule Type">
                <a-select v-model:value="formData.mode" disabled class="full">
                  <a-select-option value="exact">
                    Arrive at a specific date and time - (Hard Start)
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="24" class="margin-bottom-16">
              <a-alert :description="alertLabel" type="info" show-icon>
                <template #message>
                  <b>Providers assigned to this schedule type must check in on time.</b>
                </template>
              </a-alert>
            </a-col>

            <a-col :span="12">
              <a-form-item name="tempDate">
                <a-date-picker
                  class="full"
                  v-model:value="temp.tempDate"
                  format="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  :disabledDate="disabledDate"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item name="tempTime">
                <a-select v-model:value="temp.tempTime" showSearch optionFilterProp="key">
                  <a-select-option v-for="item in time" :key="item.key" :value="item.value">
                    {{ item.key }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="Time Zone">
                <a-select v-model:value="formData.time_zone_id" disabled class="full">
                  <a-select-option
                    v-if="workOrderDetail?.time_zone_info"
                    :value="workOrderDetail?.time_zone_info.time_zone_id"
                  >
                    {{ workOrderDetail?.time_zone_info.short }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <template #footer>
        <a-button @click="hide">Cancel</a-button>
        <a-button type="primary" :loading="isLoading" @click="submitHandle">Save</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { Schedule } from "@/api/api/workOrder/types";
import { updateSchedule } from "@/api/api/workOrder";
import {
  useWorkOrderDetailStore,
  time,
  useFnWorkOrderPayStore,
  usePageLoadingStore
} from "@/stores";
import { storeToRefs } from "pinia";
import { notifySuccess } from "@/utils/notify";
import { useRoute } from "vue-router";
import dayjs, { Dayjs } from "dayjs";
import type { Rule } from "ant-design-vue/es/form";

const route = useRoute();

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());
const { setWorkOrderDetail } = useWorkOrderDetailStore();
const { changeLoading } = usePageLoadingStore();

const modal = ref<boolean>(false);

const alertLabel =
  'When a provider checks in more than 30 minutes early or more than 15 minutes late to a "Hard Start" work order, their timeliness rate is negatively impacted. If timeliness is not critical for this work order, please select a different schedule type.';

const formData = ref<Schedule>({
  mode: "exact",
  start_local: "",
  end_local: "",
  time_zone_id: undefined
});

interface Temp {
  tempDate: string;
  tempTime: string;
}

const temp = ref<Temp>({
  tempDate: "",
  tempTime: ""
});

const rules: Record<string, Rule[]> = {
  tempDate: [{ required: true, trigger: ["blur", "change"] }],
  tempTime: [{ required: true, trigger: ["blur", "change"] }]
};

const show = () => {
  modal.value = true;
};

const hide = () => {
  modal.value = false;
  temp.value.tempDate = "";
  temp.value.tempTime = "";
};

const isLoading = ref(false);

// 今天以前不能选
const disabledDate = (currentDate: Dayjs) => {
  return currentDate && currentDate < dayjs().startOf("day");
};

const formatForm = () => {
  formData.value.start_local = `${temp.value.tempDate} ${temp.value.tempTime}`;
};

const init = () => {
  if (!workOrderDetail.value?.time_zone_info) return;
  formData.value.time_zone_id = workOrderDetail.value?.time_zone_info.time_zone_id;
  const res = workOrderDetail.value?.schedule_info.start_local.split(" ");
  if (!res) return;
  temp.value.tempDate = res[0];
  temp.value.tempTime = res[1];
};

const formRef = ref();
const submitHandle = async () => {
  try {
    const res = await formRef.value.validate();
    if (res) {
      formatForm();
      submit();
    }
  } catch (error) {
    console.error(error);
  }
};

const oredrId = computed(() => {
  return Number(route.query.orderId);
});

const refresh = async () => {
  try {
    changeLoading(true);
    await setWorkOrderDetail(oredrId.value);
  } catch (error) {
    console.error(error);
  } finally {
    changeLoading(false);
  }
};

const submit = async () => {
  try {
    isLoading.value = true;
    const res = await updateSchedule(formData.value, oredrId.value);
    if (res) {
      notifySuccess("Success");
      hide();
      refresh();
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => workOrderDetail.value,
  () => {
    init();
  }
);

onMounted(() => {
  init();
});

defineExpose({
  show
});
</script>
