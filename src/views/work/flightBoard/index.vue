<template>
  <div class="work-filght-board">
    <TitleBar>
      <template #title>
        {{ t("flight_board") }}
      </template>
    </TitleBar>

    <actionBar v-show="actionBarIsShow <= 0" :type="currentType" @searchHandle="searchHandle" />

    <batchOperate
      ref="batchOperateRef"
      :disabled="workOrderListLoading"
      :type="currentType"
      @reloadData="reloadData"
    />
    <filterBar
      :disabled="workOrderListLoading"
      :keywordParams="keywordParams"
      @filter-change="filterChange"
    />
    <workTable :type="currentType" :keywordParams="keywordParams" ref="workTableRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { t } from "@/locale";
import filterBar from "./filter.vue";
import workTable from "./table.vue";
import batchOperate from "./batchOperate.vue";
import { GetWorkOrderListReqTypeEnum } from "@/api/api/workOrder/types";
import { useWorkFlightBoardStore } from "@/stores";
import { storeToRefs } from "pinia";
import actionBar from "./actionBar.vue";

const { workOrderListLoading } = storeToRefs(useWorkFlightBoardStore());

// filter中选中的工单类型
const currentType = ref<GetWorkOrderListReqTypeEnum>(GetWorkOrderListReqTypeEnum.PUBLISHED_ROUTED);

const workTableRef = ref();
const filterChange = (type: GetWorkOrderListReqTypeEnum) => {
  workTableRef.value.paginationReset();
  currentType.value = type;
};

const batchOperateRef = ref();
const actionBarIsShow = computed(() => {
  return batchOperateRef.value?.length;
});
const reloadData = () => {
  batchOperateRef.value.getWorkOrderList();
};

// 搜索
const keywordParams = ref<{ searchValue: string; isGlobalSearch: boolean }>({
  searchValue: "",
  isGlobalSearch: false
});
const searchHandle = (searchValue: string, isGlobalSearch: boolean) => {
  workTableRef.value.paginationReset();
  keywordParams.value.searchValue = searchValue;
  keywordParams.value.isGlobalSearch = isGlobalSearch;
};
</script>
