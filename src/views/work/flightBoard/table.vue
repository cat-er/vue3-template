<template>
  <div class="flight-table">
    <div class="box-shadow full">
      <a-spin :spinning="workOrderListLoading">
        <component :is="currentTableComponent" @getRowSelectionData="getRowSelectionData" />
        <pagination ref="paginationRef" :total="workOrderListTotal" @page-change="pageChange" />
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";
import { GetWorkOrderListReqTypeEnum, GetWorkOrderListReq } from "@/api/api/workOrder/types";
import pagination from "@/components/pagination/pagination.vue";
import {
  useWorkFlightBoardStore,
  useTableRowSelectionDataStore,
  useWorkOrderFilterStore
} from "@/stores";
import { storeToRefs } from "pinia";
import tableDraft from "./components/table/tableDraft.vue";
import tableInFlight from "./components/table/tableInFlight.vue";
import tablePublished from "./components/table/tablePublished.vue";
import tableAssigned from "./components/table/tableAssigned.vue";
import tableApproved from "./components/table/tableApproved.vue";
import tableDone from "./components/table/tableDone.vue";
import tableAll from "./components/table/tableAll.vue";
import { debounce } from "lodash";

interface Props {
  type: GetWorkOrderListReqTypeEnum;
  keywordParams?: { searchValue: string; isGlobalSearch: boolean };
}

const props = defineProps<Props>();

const { workOrderListTotal, workOrderListLoading } = storeToRefs(useWorkFlightBoardStore());
const { getWorkOrderListAsync, setWorkOrderListLoading } = useWorkFlightBoardStore();
const { setRowSelectionData, rowReset } = useTableRowSelectionDataStore();
const { filtersParams } = storeToRefs(useWorkOrderFilterStore());

// 组件映射
const tableComponents = {
  [GetWorkOrderListReqTypeEnum.IN_FLIGHT]: tableInFlight,
  [GetWorkOrderListReqTypeEnum.DRAFT]: tableDraft,
  [GetWorkOrderListReqTypeEnum.PUBLISHED_ROUTED]: tablePublished,
  [GetWorkOrderListReqTypeEnum.ASSIGNED]: tableAssigned,
  [GetWorkOrderListReqTypeEnum.DONE]: tableDone,
  [GetWorkOrderListReqTypeEnum.APPROVED]: tableApproved,
  [GetWorkOrderListReqTypeEnum.ALL]: tableAll,
  [GetWorkOrderListReqTypeEnum.ISSUE]: undefined
};

// 计算当前组件
const currentTableComponent = computed(() => tableComponents[props.type]);

// 初始化工作单请求参数
const getWorkOrderListParams = ref<GetWorkOrderListReq>({
  page: 1,
  limit: 10,
  keyword: props.keywordParams?.searchValue,
  type: props.type
});

// 请求参数更新
const updateParams = () => {
  const params = {
    ...getWorkOrderListParams.value,
    ...filtersParams.value
  };
  params.keyword = props.keywordParams?.searchValue;
  params.type = props.type;

  return params;
};

// 防抖 防止重复请求
const getWorkOrderList = debounce(async () => {
  const params = updateParams();
  await getWorkOrderListAsync(params);
}, 500);

const getWorkOrderListDebounce = () => {
  setWorkOrderListLoading(true);
  getWorkOrderList();
};

// 分页切换
const pageChange = (page: number, pageSize: number) => {
  getWorkOrderListParams.value.page = page;
  getWorkOrderListParams.value.limit = pageSize;
  getWorkOrderListDebounce();
};

// 行选择数据
const getRowSelectionData = (selectedRowKeys: any) => {
  setRowSelectionData(selectedRowKeys);
};

// 重置分页
const paginationRef = ref();
const paginationReset = () => {
  getWorkOrderListParams.value.page = 1;
  getWorkOrderListParams.value.limit = 10;
  paginationRef.value?.reset();
};

// 监听 props 变化
const setupWatchers = () => {
  watch(
    () => filtersParams.value,
    () => {
      console.log("过滤器");
      getWorkOrderListDebounce();
    }
  );

  watch(
    () => props.type,
    () => {
      console.log("type");
      rowReset();
      getWorkOrderListDebounce();
    }
  );

  watch(
    () => props.keywordParams,
    () => {
      console.log("key");
      getWorkOrderListDebounce();
    },
    { deep: true }
  );
};

onMounted(async () => {
  rowReset();
});

setupWatchers();

// 暴露方法
defineExpose({
  paginationReset,
  getWorkOrderList
});
</script>
