<!-- src/components/PriceTag.vue -->
<template>
  <div>
    <div class="price-value">
      <span v-if="schedule.mode === 'exact'">{{ formatTime(schedule.start_local) }} ({{ time_zone_short }})</span>
      <span v-if="schedule.mode === 'hours'">{{ showHours() }} ({{ time_zone_short }})</span>
      <span v-if="schedule.mode === 'between'">{{
          formatTime(schedule.start_local)
        }} → {{ formatTime(schedule.end_local) }} ({{ time_zone_short }})</span>
    </div>
    <span class="price-type" v-if="schedule.mode === 'exact'">Hard Start</span>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

export interface Schedule {
  mode: string;
  start_local: string;
  end_local: string;
}

interface Props {
  schedule: Schedule;
  time_zone_short: string;
}

const props = defineProps<Props>()

const showHours = () => {
  let start_local = dayjs(props.schedule.start_local)
  let end_local = dayjs(props.schedule.end_local)
  let start_local_date = start_local.format("M/D/YYYY")
  let start_local_time = start_local.format("h:mm A")
  let end_local_date = end_local.format("M/D/YYYY")
  let end_local_time = end_local.format("h:mm A")
  return `${start_local_date} → ${end_local_date}<br>" +
          "During: ${start_local_time} → ${end_local_time}`;
}

const formatTime = (dateString:string) => {
  let date = dayjs(dateString);
  return date.format("M/D/YYYY") + " at " + date.format("h:mm A");
}

</script>

<style scoped>
.price-type {
  font-size: 12px;
  color: #a0aec0;
  display: block;
}

.price-value {
  font-size: 16px;
  color: #1a202c;
}
</style>
