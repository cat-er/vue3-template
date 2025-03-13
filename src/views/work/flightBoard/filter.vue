<template>
  <div class="flight-filter-bar">
    <a-spin :spinning="workOrderListCountsLoading">
      <div class="action-box-white">
        <a-segmented
          block
          v-model:value="currentWorkTypeLabe"
          :disabled="disabled"
          :options="workTypeLabelList"
          @change="workTypeChange"
        >
          <template #label="{ value, payload }">
            <div class="segmented">
              <b>{{ value }}</b>
              {{ payload.total }}
            </div>
          </template>
        </a-segmented>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { t } from "@/locale";
import { SegmentedOption } from "ant-design-vue/es/segmented/src/segmented";
import { GetWorkOrderListReqTypeEnum } from "@/api/api/workOrder/types";
import { getWorkOrderListCounts } from "@/api/api/workOrder/index";
import { GetWorkOrderListCountsRes } from "@/api/api/workOrder/types";
import { useWorkFlightBoardStore } from "@/stores";
import { storeToRefs } from "pinia";
import Constant from "./constant";

interface Props {
  disabled?: boolean;
  keywordParams?: { searchValue: string; isGlobalSearch: boolean };
}

const props = defineProps<Props>();

// 选项数组
const workTypeLabelList = ref<SegmentedOption[]>([
  {
    value: t("in_flight"),
    payload: {
      countsKey: "in_flight_count",
      type: GetWorkOrderListReqTypeEnum.IN_FLIGHT,
      total: "0"
    }
  },
  {
    value: t("draft"),
    payload: {
      countsKey: "draft_count",
      type: GetWorkOrderListReqTypeEnum.DRAFT,
      total: "0"
    }
  },
  {
    value: t("published_routed"),
    payload: {
      countsKey: "published_routed_count",
      type: GetWorkOrderListReqTypeEnum.PUBLISHED_ROUTED,
      total: "0"
    }
  },
  {
    value: t("assigned"),
    payload: {
      countsKey: "assigned_count",
      type: GetWorkOrderListReqTypeEnum.ASSIGNED,
      total: "0"
    }
  },
  {
    value: t("done"),
    payload: {
      countsKey: "done_count",
      type: GetWorkOrderListReqTypeEnum.DONE,
      total: "0"
    }
  },
  {
    value: t("approved"),
    payload: {
      type: GetWorkOrderListReqTypeEnum.APPROVED
    }
  },
  // {
  //   value: t("issue"),
  //   payload: {
  //     type: GetWorkOrderListReqTypeEnum.ISSUE,
  //     total: 123
  //   }
  // },
  {
    value: t("all"),
    payload: {
      type: GetWorkOrderListReqTypeEnum.ALL
    }
  }
]);

const workOrderListCountsLoading = ref<boolean>(false);
const workOrderListCounts = ref<GetWorkOrderListCountsRes>();

// 赋值函数
const updateWorkTypeTotals = () => {
  workTypeLabelList.value.forEach((option) => {
    const countsKey = option.payload.countsKey as keyof GetWorkOrderListCountsRes;
    if (countsKey && workOrderListCounts.value) {
      option.payload.total = workOrderListCounts.value[countsKey] || undefined;
    }
  });
};

const getWorkOrderListCountsAsync = async () => {
  try {
    workOrderListCountsLoading.value = true;
    const res = await getWorkOrderListCounts({ keyword: "" });
    if (!res) return;
    workOrderListCounts.value = res;
    updateWorkTypeTotals();
  } catch (error) {
    console.error(error);
  } finally {
    workOrderListCountsLoading.value = false;
  }
};

// 当前选中的label
const currentWorkTypeLabe = ref<string>(t("published_routed"));

// label对应的type
const currentWorkType = computed(() => {
  const target = workTypeLabelList.value.find((item) => item.value === currentWorkTypeLabe.value);
  return target?.payload.type;
});

// 抛出事件
interface Emits {
  (e: "filterChange", params: GetWorkOrderListReqTypeEnum): void;
}

const emits = defineEmits<Emits>();

const { setCurrentType } = useWorkFlightBoardStore();
const { globalSearchValue } = storeToRefs(useWorkFlightBoardStore());
const workTypeChange = () => {
  setCurrentType(currentWorkType.value);
  emits("filterChange", currentWorkType.value);
  sessionStorage.setItem(Constant.LOCAL_WORK_TYPE, currentWorkTypeLabe.value);
};

watch(
  () => props.keywordParams,
  () => {
    if (props.keywordParams?.isGlobalSearch) {
      currentWorkTypeLabe.value = t("all");
      workTypeChange();
    }
  },
  { deep: true }
);

onMounted(() => {
  currentWorkTypeLabe.value =
    sessionStorage.getItem(Constant.LOCAL_WORK_TYPE) || t("published_routed");
  getWorkOrderListCountsAsync();
  emits("filterChange", currentWorkType.value);
});
</script>
