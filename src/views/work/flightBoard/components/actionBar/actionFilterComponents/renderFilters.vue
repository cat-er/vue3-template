<template>
  <div class="render-filters flex">
    <!-- 临时操作的过滤器 失焦时移除 -->
    <renderFiltersItem :filterData="tempFilter" is-temp-filter />
    <renderFiltersItem
      v-for="item in renderFiltersListComputed"
      :key="item.id"
      :filter-data="item"
      :is-temp-filter="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import renderFiltersItem from "./renderFiltersItem.vue";
import {
  FilterTypeEnum,
  FilterFieldListRender,
  GetFilterFieldListRes
} from "@/api/api/filter/type";
import { GetWorkOrderListReqTypeEnum } from "@/api/api/workOrder/types";
import { useWorkOrderFilterStore, useWorkFlightBoardStore } from "@/stores";
import { storeToRefs } from "pinia";

const { tempFilter, renderFiltersList, workOrderFilterList, renderFiltersListComputed } =
  storeToRefs(useWorkOrderFilterStore());
const { updateRenderFiltersList } = useWorkOrderFilterStore();

onMounted(() => {
  updateRenderFiltersList();
});
</script>
