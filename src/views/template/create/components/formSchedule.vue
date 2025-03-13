<template>
  <a-card :title="t('schedule')" class="box-shadow">
    <a-form
      :model="formData"
      name="location"
      layout="vertical"
      :wrapper-col="{ span: 24 }"
      ref="formRef"
    >
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item name="tempDate">
            <a-select v-model:value="formData.relative_time" showSearch optionFilterProp="key">
              <a-select-option
                v-for="item in relativeTimeList"
                :key="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12" v-if="formData.relative_time">
          <a-form-item>
            <a-select v-model:value="formData.mode">
              <a-select-option value="exact">
                {{ t("schedule_mode") }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12" v-if="formData.relative_time">
          <a-form-item name="tempTime">
            <a-select v-model:value="formData.specific_time" showSearch optionFilterProp="key">
              <a-select-option v-for="item in time" :key="item.key" :value="item.value">
                {{ item.key }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="24" v-if="formData.relative_time">
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
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { ref, onMounted, watch } from "vue";
import type { Rule } from "ant-design-vue/es/form";
import { time, useWorkOrderaTemplateCreateStore } from "@/stores";
import { storeToRefs } from "pinia";
import { useOutPutState } from "../hooks";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import {
  AddTemplateScheduleSpecificTimeEnum,
  AddTemplateSchedule
} from "@/api/api/workOrder/types";

const formData = ref<AddTemplateSchedule>({
  mode: "exact",
  relative_time: undefined,
  specific_time: undefined
});

// 相对时间列表
const relativeTimeList = [
  { label: "Same day", value: AddTemplateScheduleSpecificTimeEnum.SAME_DAY },
  { label: "Next day", value: AddTemplateScheduleSpecificTimeEnum.NEXT_DAY },
  { label: "Next business day", value: AddTemplateScheduleSpecificTimeEnum.NEXT_BUSINESS_DAY },
  { label: "Next monday", value: AddTemplateScheduleSpecificTimeEnum.NEXT_MONDAY },
  { label: "Next tuesday", value: AddTemplateScheduleSpecificTimeEnum.NEXT_TUESDAY },
  { label: "Next wednesday", value: AddTemplateScheduleSpecificTimeEnum.NEXT_WEDNESDAY },
  { label: "Next thursday", value: AddTemplateScheduleSpecificTimeEnum.NEXT_THURSDAY },
  { label: "Next friday", value: AddTemplateScheduleSpecificTimeEnum.NEXT_FRIDAY },
  { label: "Next saturday", value: AddTemplateScheduleSpecificTimeEnum.NEXT_SATURDAY },
  { label: "Next sunday", value: AddTemplateScheduleSpecificTimeEnum.NEXT_SUNDAY }
];

const { currentTemplateData, isCreateTemplate } = storeToRefs(useWorkOrderaTemplateCreateStore());

// 编辑模板回显
const editEcho = () => {
  if (isCreateTemplate.value) return;
  formData.value.relative_time = currentTemplateData.value?.schedule.relative_time;
  formData.value.specific_time = currentTemplateData.value?.schedule.specific_time;
};

watch(
  () => currentTemplateData.value,
  () => {
    editEcho();
  }
);

watch(
  () => formData.value,
  () => {
    useOutPutState(WorkOrderListKey.SCHEDULE, {
      schedule: formData.value
    });
  },
  { deep: true }
);

onMounted(() => {
  useOutPutState(WorkOrderListKey.SCHEDULE, {
    schedule: formData.value
  });
});
</script>
