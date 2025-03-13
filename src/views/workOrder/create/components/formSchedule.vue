<template>
  <a-card :title="t('schedule')" class="box-shadow">
    <a-form
      :model="temp"
      name="location"
      layout="vertical"
      :wrapper-col="{ span: 24 }"
      :rules="rules"
      ref="formRef"
    >
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item :label="t('schedule')">
            <a-select v-model:value="formData.mode">
              <a-select-option value="exact">
                {{ t("schedule_mode") }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item>
            <a-alert
              type="info"
              :description="t('schedule_description')"
              show-icon
              class="custom-alert"
            >
              <template #message>
                <b>{{ t("schedule_message") }}</b>
              </template>
            </a-alert>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item name="tempDate">
            <a-spin :spinning="dateLoading">
              <a-date-picker
                class="full"
                v-model:value="temp.tempDate"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                :disabledDate="disabledDate"
              />
            </a-spin>
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

        <a-col v-show="holidayTagIsShow" :span="12" class="margin-top-16 margin-bottom-16">
          <a-tag color="orange" class="tag">
            <template #icon>
              <ExclamationCircleOutlined />
            </template>
            Please note that the selected date falls on a local holiday, which may result in fewer
            available technicians.
          </a-tag>
        </a-col>

        <a-col :span="24">
          <a-form-item :label="t('time_zone')" name="time_zone_id">
            <a-select v-model:value="temp.time_zone_id" :disabled="false">
              <a-select-option :value="timeZone?.time_zone_id">
                {{ timeZone?.short }}
              </a-select-option>
            </a-select>
            <div class="form-note">
              {{ t("time_zone_tip") }}
            </div>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <b>{{ t("quick_options") }}:</b>
          <a-radio-group v-model:value="timeRadio" class="margin-left-8">
            <a-radio-button
              v-for="(item, index) in quickOptionsList"
              :key="index"
              :value="item.id"
              @change="quick(item.id)"
            >
              {{ item.label }}
            </a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { ref, onMounted, watch, computed } from "vue";
import { Schedule, GetTemplateDetailsRes } from "@/api/api/workOrder/types";
import type { Rule } from "ant-design-vue/es/form";
import {
  time,
  useWorkOrderCreateStore,
  timeZoneList,
  useWorkOrderaTemplateCreateStore
} from "@/stores";
import { storeToRefs } from "pinia";
import dayjs, { Dayjs } from "dayjs";
import { useOutPutState } from "../hooks";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { getUsHolidays } from "@/api/api/workOrder/index";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

const { timeZone } = storeToRefs(useWorkOrderCreateStore());

const formData = ref<Schedule>({
  mode: "exact", //时间形式：exact/hours/between
  start_local: "2024-07-11", //开始时间(当地时间)
  time_zone_id: undefined //时区ID
});

interface Temp {
  tempDate: string;
  tempTime: string;
  time_zone_id: number | undefined; //时区ID
}

const temp = ref<Temp>({
  tempDate: "",
  tempTime: "",
  time_zone_id: undefined
});

const rules: Record<string, Rule[]> = {
  tempDate: [{ required: true, trigger: ["blur", "change"] }],
  tempTime: [{ required: true, trigger: ["blur", "change"] }],
  time_zone_id: [{ required: true, trigger: ["blur"] }]
};

// 自动选择时区
watch(
  () => timeZone.value?.time_zone_id,
  () => {
    console.log("timeZone.value?.time_zone_id", timeZone.value?.time_zone_id);

    const index = timeZoneList.findIndex(
      (item) => item.time_zone_id === timeZone.value?.time_zone_id
    );
    if (index === -1) return;
    temp.value.time_zone_id = timeZoneList[index].time_zone_id;
  }
);

// 今天以前不能选
const disabledDate = (currentDate: Dayjs) => {
  return currentDate && currentDate < dayjs().startOf("day");
};

// 快速选择
const timeRadio = ref();
const tomorrowDate = () => {
  return dayjs().add(1, "day").format("YYYY-MM-DD");
};
const quickOptionsList = [
  { id: 1, label: `${t("tomorrow")} 8am`, date: tomorrowDate(), time: "08:00:00" },
  { id: 2, label: "10am", date: tomorrowDate(), time: "10:00:00" },
  { id: 3, label: "12pm", date: tomorrowDate(), time: "12:00:00" },
  { id: 4, label: "3pm", date: tomorrowDate(), time: "15:00:00" },
  { id: 5, label: "6pm", date: tomorrowDate(), time: "18:00:00" }
];

const quick = (id: number) => {
  quickOptionsList.forEach((item) => {
    if (item.id === id) {
      temp.value.tempDate = item.date;
      temp.value.tempTime = item.time;
    }
  });
};

const formatForm = () => {
  formData.value.start_local = `${temp.value.tempDate} ${temp.value.tempTime}`;
  formData.value.time_zone_id = temp.value.time_zone_id;
};

// 节假日提示是否展示
const dateLoading = ref(false);
const holidayList = ref<string[]>([]);
const getUsHolidaysAsync = async () => {
  try {
    dateLoading.value = true;
    const res = await getUsHolidays({ year: String(dayjs().year()) });
    if (res.length > 0) {
      holidayList.value = res;
    }
  } catch (error) {
    console.error(error);
  } finally {
    dateLoading.value = false;
  }
};

const holidayTagIsShow = computed(() => {
  return holidayList.value.includes(temp.value.tempDate);
});

// 数据回显
const temDataEcho = (data: GetTemplateDetailsRes) => {
  temp.value.tempTime = "";
  temp.value.tempDate = "";
  temp.value.tempTime = data.schedule.specific_time;
  temp.value.tempDate = data.schedule.start_time_central_date;
};

// 模板数据回显
const { currentTemplateData } = storeToRefs(useWorkOrderaTemplateCreateStore());
watch(
  () => currentTemplateData.value,
  () => {
    if (!currentTemplateData.value) return;
    temDataEcho(currentTemplateData.value);
  }
);

// 校验
const formRef = ref();
const formValidate = async () => {
  formatForm();
  try {
    await formRef.value.validate();
    useOutPutState(true, WorkOrderListKey.SCHEDULE, {
      schedule: formData.value
    });
  } catch (err) {
    useOutPutState(false, WorkOrderListKey.SCHEDULE, {
      schedule: formData.value
    });
  }
};

watch(
  () => temp.value,
  () => {
    formValidate();
  },
  { deep: true }
);

onMounted(() => {
  getUsHolidaysAsync();
  formValidate();
});
</script>
