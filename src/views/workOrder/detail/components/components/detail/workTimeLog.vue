<template>
  <a-card class="detail-card">
    <template #title>
      <span class="work-card-title">{{ t('time_log') }}</span>
    </template>
    <a href="" id="word-detail-time-log">
      <!--  锚地  -->
    </a>
    <div v-if="timeLogList?.results" class="work-time-log">
      <b>{{ timeLogList.hours }} {{ t("total_hours") }}</b>
      <div v-for="item in timeLogList?.results" :key="item.id" class="action-box time-log-item">
        <div class="time-log-head">
          {{ item.hours }} {{ t("hour") }}
          <a-divider v-if="item.devices" type="vertical" />
          {{ item.devices }} {{ t("device") }}
        </div>
        <div class="divider"></div>
        <div class="time-log-foot flex">
          <div class="check-in">
            <b>
              {{ timeFormat(item.in.created.local.date+' '+item.in.created.local.time) }} ({{ timeZone() }})
            </b>
            <div v-if="item.in.coords.latitude && item.in.coords.longitude">
              {{ item.in.distance.toFixed(2) }} {{ t("miles_from_site") }}
            </div>
            <div v-else class="color-red">
              {{ t("gps_unavailable") }}
            </div>
          </div>
          <div>
            <ArrowRightOutlined />
          </div>
          <div class="check-out">
            <div v-if="item.out.created.local.date && item.out.created.local.time">
              <b>
                {{ timeFormat(item.out.created.local.date+' '+item.out.created.local.time) }} ({{ timeZone() }})
              </b>
              <div v-if="item.out.coords.latitude && item.out.coords.longitude">
                {{ item.out.distance.toFixed(2) }} {{ t("miles_from_site") }}
              </div>
              <div v-else class="color-red">
                {{ t("gps_unavailable") }}
              </div>
            </div>
            <em v-else>
              {{ t("currently_checked_in") }}
            </em>
          </div>
        </div>
        <div class="font-color-minor">
          {{ loggedBy(item) }}
        </div>
      </div>
    </div>
    <div class="form-note" v-else>
      No time has been logged on this work order.
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/locale";
import { useWorkOrderDetailStore } from "@/stores";
import { storeToRefs } from "pinia";
import { TimeLogsResult } from "@/api/api/workOrder/types";
import { ArrowRightOutlined } from "@ant-design/icons-vue";
import timeFormat from "@/utils/timeFormat";
const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());

const timeLogList = computed(() => {
  return workOrderDetail.value?.time_logs;
});

const timeZone = () => {
  return workOrderDetail.value ? workOrderDetail.value.time_zone_info.short : '';
};
// logged by
const loggedBy = (item: TimeLogsResult) => {
  const { first_name, last_name, created } = item.logged_by;
  let time_zone_short = timeZone();
  let time_desc = timeFormat(`${created.local.date} ${created.local.time}`)
  return `${t("logged_by")} ${first_name} ${last_name} ${t("on")} ${time_desc} (${time_zone_short})`;
};
</script>
