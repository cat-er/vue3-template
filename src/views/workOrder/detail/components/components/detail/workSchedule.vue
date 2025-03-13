<template>
  <a-card class="detail-card">
    <template #title>
      <div>
        <span class="work-card-title">Schedule</span>
        <span class="pay-type" v-if="mode === 'exact'">Hard Start</span>
      </div>
    </template>
    <template #extra v-if="editIsDisabled">
      <a-button shape="circle" :icon="h(EditOutlined)" @click="toEdit" />
    </template>
    <div class="schedule-info" v-if="mode === 'exact'">
      <!--      <div>-->
      <!--        <a-alert-->
      <!--            type="warning"-->
      <!--            description="Please update the schedule or revert this work order to draft."-->
      <!--            show-icon-->
      <!--            class="custom-alert"-->
      <!--        >-->
      <!--          <template #message>-->
      <!--            <b>The schedule date is in the past.</b>-->
      <!--          </template>-->
      <!--        </a-alert>-->
      <!--      </div>-->
      <div class="schedule-label">Start at a specific date and time</div>
      <div class="schedule-value">{{ formattedScheduleStartDate(1) }} ({{ timeZone() }})</div>
    </div>
    <div class="schedule-info" v-else-if="mode === 'between'">
      <div class="schedule-label">Complete work between</div>
      <div class="schedule-value">{{ formattedScheduleStartDate(1) }} ({{ timeZone() }})</div>
      <div class="schedule-label">And</div>
      <div class="schedule-value">{{ formattedScheduleEndDate(1) }} ({{ timeZone() }})</div>
    </div>
    <div class="schedule-info" v-else-if="mode === 'hours'">
      <div class="schedule-label">Complete work any day between</div>
      <div class="schedule-value">
        {{ formattedScheduleStartDate(2) }}
        <span class="schedule-label">and</span>
        {{ formattedScheduleEndDate(2) }}
      </div>
      <div class="schedule-label">Only during these times</div>
      <div class="schedule-value">
        {{ formattedScheduleStartDate(0) }}
        <span class="schedule-label">and</span>
        {{ formattedScheduleEndDate(0) }} ({{ timeZone() }})
      </div>
    </div>

    <div class="schedule-info">
      <div class="schedule-label">
        Approximate hours to complete
        <a-tooltip
          title="Approximate hours to complete the job. Work is not done until all tasks are complete, regardless of approximate hours."
        >
          <info-circle-outlined />
        </a-tooltip>
      </div>
      <div class="schedule-value">{{ calculateTimeDifference }}</div>
    </div>
    <div class="schedule-info">
      <div class="schedule-label">Updated by you on {{ formattedScheduleUpdatedDate() }} (CST)</div>
    </div>
    <a-divider />
    <div class="no-schedule-text" v-if="!workOrderDetail?.set_start_time_info.full_name">
      Start time has not been set
    </div>
    <div v-else>
      <div class="schedule-info">
        <div class="schedule-label">Confirmed start time</div>
        <div class="schedule-value">{{ formattedSetStartDate() }} ({{ timeZone() }})</div>
      </div>
      <div class="schedule-info">
        <div class="schedule-label">Duration</div>
        <div class="schedule-value">
          {{ workOrderDetail?.set_start_time_info.hour_estimate }} hour(s)
        </div>
      </div>
      <div class="schedule-info">
        <div class="schedule-label">
          Confirmed by
          <a>{{ workOrderDetail?.set_start_time_info.full_name }}</a>
          {{ formattedSetStartUpdatedDate() }}
          ({{ timeZone() }})
        </div>
      </div>
    </div>
    <scheduleEditModal ref="scheduleEditModalRef" />
  </a-card>
</template>

<script lang="ts" setup>
import { ref, h, computed } from "vue";
import { InfoCircleOutlined, EditOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { useWorkOrderDetailStore } from "@/stores";
import { storeToRefs } from "pinia";
import scheduleEditModal from "./workSchedule/scheduleEditModal.vue";
import { WorkOrderDetailStatusEnum } from "@/api/api/workOrder/types";

const { workOrderDetail, workOrderStatus } = storeToRefs(useWorkOrderDetailStore());

const formattedScheduleStartDate = (t: number) => {
  if (t === 1)
    return dayjs(
      workOrderDetail.value ? workOrderDetail.value.schedule_info.start_local : ""
    ).format("dddd, M/D/YYYY [at] h:mm A");
  if (t === 2)
    return dayjs(
      workOrderDetail.value ? workOrderDetail.value.schedule_info.start_local : ""
    ).format("dddd, M/D/YYYY");
  return dayjs(workOrderDetail.value ? workOrderDetail.value.schedule_info.start_local : "").format(
    "h:mm A"
  );
};
const formattedScheduleEndDate = (t: number) => {
  if (t === 1)
    return dayjs(workOrderDetail.value ? workOrderDetail.value.schedule_info.end_local : "").format(
      "dddd, M/D/YYYY [at] h:mm A"
    );
  if (t === 2)
    return dayjs(workOrderDetail.value ? workOrderDetail.value.schedule_info.end_local : "").format(
      "dddd, M/D/YYYY"
    );
  return dayjs(workOrderDetail.value ? workOrderDetail.value.schedule_info.end_local : "").format(
    "h:mm A"
  );
};
const formattedScheduleUpdatedDate = () => {
  return dayjs(workOrderDetail.value ? workOrderDetail.value.schedule_info.updated_at : "").format(
    "M/D/YYYY [at] h:mm A"
  );
};
const formattedSetStartDate = () => {
  return dayjs(
    workOrderDetail.value ? workOrderDetail.value.set_start_time_info.set_start_time_local : ""
  ).format("dddd, M/D/YYYY [at] h:mm A");
};
const formattedSetStartUpdatedDate = () => {
  return dayjs(
    workOrderDetail.value ? workOrderDetail.value.set_start_time_info.completed_at_local : ""
  ).format("M/D/YYYY [at] h:mm A");
};
const timeZone = () => {
  return workOrderDetail.value ? workOrderDetail.value.time_zone_info?.short : "";
};

const mode = computed(() => {
  return workOrderDetail.value?.schedule_info.mode;
});
const hours = computed(() => {
  return workOrderDetail.value?.pay.hours;
});
const calculateTimeDifference = computed(() => {
  if (mode.value !== "hours") {
    let diff =
      (hours.value
        ? hours.value
        : (workOrderDetail.value?.pay.base && workOrderDetail.value?.pay.base.units) || 0) * 3600;
    if (diff > 0) {
      const diffHours = Math.floor(diff / (60 * 60));
      const diffMinutes = Math.floor((diff % (60 * 60)) / 60);
      return diffHours === 0
        ? `${diffMinutes} minutes`
        : diffMinutes > 0
          ? `${diffHours}h ${diffMinutes}min`
          : `${diffHours} hour(s)`;
    }
    return "Not available";
  }
  let time1 = workOrderDetail.value
    ? workOrderDetail.value.schedule_info.start_local.split(" ")[1]
    : "";
  let time2 = workOrderDetail.value
    ? workOrderDetail.value.schedule_info.end_local.split(" ")[1]
    : "";
  if (!time2) return "Not available";
  // 将时间字符串解析为 Date 对象
  const [hours1, minutes1, seconds1] = time1.split(":").map(Number);
  const [hours2, minutes2, seconds2] = time2.split(":").map(Number);

  const date1 = new Date();
  date1.setHours(hours1, minutes1, seconds1, 0);

  const date2 = new Date();
  date2.setHours(hours2, minutes2, seconds2, 0);

  // 计算两个时间的差异（毫秒）
  let diff = date2.getTime() - date1.getTime();
  if (diff < 0) {
    diff += 24 * 60 * 60 * 1000; // 如果时间差为负数，加一天的毫秒数
  }

  // 将时间差转换为小时和分钟
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return diffMinutes > 0 ? `${diffHours}h ${diffMinutes}min` : `${diffHours} hour(s)`;
});

const scheduleEditModalRef = ref();
const toEdit = () => {
  scheduleEditModalRef.value.show();
};

const editIsDisabled = computed(() => {
  const arr = [
    WorkOrderDetailStatusEnum.PUBLISHED,
    WorkOrderDetailStatusEnum.ASSIGNED,
    WorkOrderDetailStatusEnum.DRAFT
  ];
  if (!workOrderStatus.value) return;
  return arr.includes(workOrderStatus.value);
});
</script>

<style scoped>
.pay-type {
  font-size: 14px;
  color: gray;
  margin-left: 8px;
}

.schedule-info {
  margin-bottom: 16px;
}

.schedule-label {
  color: #595959;
}

.schedule-value {
  font-weight: bold;
  margin-bottom: 4px;
}

.no-schedule-text {
  margin-top: 16px;
  text-align: center;
  color: #8c8c8c;
}
</style>
