<template>
  <div class="foot-rate flex">
    <div v-if="info.average_rating" class="rate flex">
      <StarFilled class="color-yellow-deep" />
      <span>{{ info.average_rating }}</span>
    </div>

    <div v-else class="rate flex">
      <StarFilled class="color-gray" />
      <span class="color-gray">N/A</span>
    </div>

    <div v-if="info.work_completed" class="rate flex">
      <ShoppingFilled class="color-blue" />
      <span>{{ info.work_completed }} jobs</span>
    </div>

    <div v-else class="rate flex">
      <ShoppingOutlined class="color-gray" />
      <span class="color-gray">N/A</span>
    </div>

    <a-popover>
      <template #content>
        <p>Timeliness Rate (Past 30 WOs)</p>
      </template>
      <div v-if="info.timeliness" class="rate flex">
        <ClockCircleFilled class="color-blue" />
        <span>{{ info.timeliness }}%</span>
      </div>
      <div v-else class="rate flex">
        <ClockCircleOutlined class="color-gray" />
        <span class="color-gray">N/A</span>
      </div>
    </a-popover>

    <a-popover>
      <template #content>
        <p>Cancellation Rate (Past 30 WOs)</p>
      </template>
      <div v-if="info.cancellation_rate !== null" class="rate flex">
        <CloseSquareFilled class="color-blue" />
        <span>{{ info.cancellation_rate }}%</span>
      </div>
      <div v-else class="rate flex">
        <CloseSquareOutlined class="color-gray" />
        <span class="color-gray">N/A</span>
      </div>
    </a-popover>

    <a-popover>
      <template #content>
        <p class="margin-bottom-8">
          <CarFilled class="color-blue margin-right-8" />
          <span class="font-bold">
            {{
              Number(
                providerItem.navigation_miles
                  ? providerItem.navigation_miles
                  : providerItem.distance_in_miles
              ).toFixed(1)
            }}
            mi
          </span>
          driving
        </p>
        <p class="margin-bottom-8">
          <arrow-right-outlined class="color-blue margin-right-8" />
          <span class="font-bold">
            {{ Number(providerItem.distance_in_miles).toFixed(1) }}
            mi
          </span>
          straight-line
        </p>
        <p>
          <a @click="toGoogleMap">
            See driving directions
            <ExportOutlined class="color-blue margin-left-8" />
          </a>
        </p>
      </template>
      <div class="rate flex">
        <CarFilled class="color-blue" />
        <a @click="toGoogleMap">
          {{
            Number(
              providerItem.navigation_miles
                ? providerItem.navigation_miles
                : providerItem.distance_in_miles
            ).toFixed(1)
          }}
          mi
        </a>
      </div>
    </a-popover>

    <!-- <div class="rate flex">
      <ArrowRightOutlined class="color-blue" />
      <span>4.8</span>
    </div> -->

    <div class="rate flex">
      <span class="font-color-minor">{{ info.active_log }}</span>
    </div>
  </div>
  <div class="foot-job">
    <a-tag class="tag">
      <span>
        <b>General Tasks</b>
        <span class="color-blue margin-left-8">{{ info.general_tasks }} jobs</span>
      </span>
    </a-tag>

    <a-tag class="tag" v-if="workTypeName !== 'General Tasks' && workTypeName !== ''">
      <span>
        <b>{{ workTypeName }}</b>
        <span class="color-blue margin-left-8">{{ workTypeTasks }} jobs</span>
      </span>
    </a-tag>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { GetProviderListRes } from "@/api/api/workOrder/types";
import {
  StarFilled,
  ShoppingFilled,
  ShoppingOutlined,
  ClockCircleFilled,
  ClockCircleOutlined,
  CarFilled,
  CloseSquareOutlined,
  CloseSquareFilled,
  ArrowRightOutlined,
  ExportOutlined
} from "@ant-design/icons-vue";
import { useWorkOrderProvidersList, useWorkOrderDetailStore } from "@/stores";
import { storeToRefs } from "pinia";
const { currentProvider } = storeToRefs(useWorkOrderProvidersList());

interface Props {
  providerItem: GetProviderListRes;
}

const props = defineProps<Props>();

const info = computed(() => {
  return props.providerItem.provider_info;
});

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());
const workTypeName = computed(() => {
  return workOrderDetail.value?.work_types_info && workOrderDetail.value?.work_types_info.name
    ? workOrderDetail.value?.work_types_info.name
    : "";
});

const workTypeTasks = computed(() => {
  return props.providerItem.work_type_tasks;
});

// 跳转谷歌地图
const toGoogleMap = () => {
  if (!currentProvider.value?.google_maps_directions_url) return;
  window.open(currentProvider.value?.google_maps_directions_url.toString());
};
</script>

<style lang="less" scoped>
.font-bold {
  font-weight: bold;
}
</style>
