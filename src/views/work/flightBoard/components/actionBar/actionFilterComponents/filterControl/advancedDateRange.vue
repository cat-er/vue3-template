<template>
  <popover v-model:model-value="popoverVisible" @openChange="popoverOpenChange">
    <actionTag :title="name" :content="echoValue" @remove="removeFilter" />
    <template #content>
      <div v-if="filterParams" class="filter-body filter-control-date">
        <a-select
          class="full"
          v-model:value="filterParams[paramsKey].label"
          :options="dateRangeList"
          @change="dateLabelChange"
        ></a-select>
        <div v-if="isCustom">
          <div>
            <div>Start Date</div>
            <a-date-picker
              class="full"
              v-model:value="filterParams[paramsKey].start_date"
              valueFormat="YYYY-MM-DD"
            />
          </div>
          <div class="margin-top-8">
            <div>End Date</div>
            <a-date-picker
              class="full"
              v-model:value="filterParams[paramsKey].end_date"
              valueFormat="YYYY-MM-DD"
            />
          </div>
        </div>
      </div>
      <popoverFooter :apply-disabled="applyDisabled" @apply="applyHandle" @clear="clearHandle" />
    </template>
  </popover>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import actionTag from "@/components/actionTag/actionTag.vue";
import popover from "../components/popover.vue";
import popoverFooter from "../components/popoverFooter.vue";
import {
  FilterTypeEnum,
  FilterDateLabelEnum,
  FilterFieldListRender,
  GetFilterFieldListRes,
  Emits
} from "@/api/api/filter/type";
import { useFilterParams } from "@/views/work/flightBoard/hooks";

interface Props {
  filterData: FilterFieldListRender | GetFilterFieldListRes | undefined;
  isTempFilter: boolean;
}

const props = defineProps<Props>();

const popoverVisible = ref(props.isTempFilter);

// 时间段list
const dateRangeList = [
  {
    label: "Yesterday",
    value: FilterDateLabelEnum.YESTERDAY
  },
  {
    label: "Today",
    value: FilterDateLabelEnum.TODAY
  },
  {
    label: "Last Week",
    value: FilterDateLabelEnum.LAST_WEEK
  },
  {
    label: "This Week",
    value: FilterDateLabelEnum.THIS_WEEK
  },
  {
    label: "Last 2 Weeks",
    value: FilterDateLabelEnum.LAST_2_WEEKS
  },
  {
    label: "Last Month",
    value: FilterDateLabelEnum.LAST_MONTH
  },
  {
    label: "This Month",
    value: FilterDateLabelEnum.THIS_MONTH
  },
  {
    label: "Custom",
    value: FilterDateLabelEnum.CUSTOM
  }
];

const emit = defineEmits<Emits>();
const popoverOpenChange = (value: boolean) => {
  echo();
  emit("popoverOpenChange", value);
};

const name = computed(() => {
  if (!props.filterData) return "";
  return props.filterData.name;
});

const paramsKey = computed(() => {
  return props.filterData?.param_transfer as string;
});

// 表单
const filterParams = ref();

// 当前label是否为CUSTOM
const isCustom = computed(() => {
  if (!filterParams.value) return false;
  return filterParams.value[paramsKey.value]?.label === FilterDateLabelEnum.CUSTOM;
});

const clearFilterParams = () => {
  if (!filterParams.value[paramsKey.value]) return;
  filterParams.value[paramsKey.value].start_date = "";
  filterParams.value[paramsKey.value].end_date = "";
};

// 是否禁用apply
const applyDisabled = computed(() => {
  if (!filterParams.value) return false;
  return (
    (!filterParams.value[paramsKey.value]?.start_date ||
      !filterParams.value[paramsKey.value]?.end_date) &&
    isCustom.value
  );
});

const dateLabelChange = () => {
  clearFilterParams();
};

const clearHandle = () => {
  clearFilterParams();
};

// 提交数据
const applyHandle = () => {
  const res = {
    ...props.filterData,
    value: filterParams.value[paramsKey.value]
  } as FilterFieldListRender;
  emit("addFilterControl", res);
  popoverVisible.value = false;
  popoverOpenChange(false);
};

// 移除对应的过滤器
const filterId = computed(() => {
  return props.filterData?.id as number;
});
const removeFilter = () => {
  emit("removeFilterControl", filterId.value);
};

// 回显相关
const echoValue = computed(() => {
  if (props.filterData && "value" in props.filterData) {
    const value = props.filterData?.value;
    if (value.start_date && value.end_date) {
      return `${value.start_date} - ${value.end_date}`;
    } else {
      return dateRangeList.find((item) => item.value === value.label)?.label;
    }
  }
});
const echo = () => {
  if (props.filterData && "value" in props.filterData) {
    filterParams.value[paramsKey.value] = props.filterData.value;
  }
};

// 初始化
const init = () => {
  if (!paramsKey.value) return;
  const { params } = useFilterParams(FilterTypeEnum.ADVANCED_DATE_RANGE, paramsKey.value);
  filterParams.value = params;
};

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
.filter-control-date {
  padding: calc(var(--padding-base) * 2);
}

.filter-control-date > :not(:first-child) {
  margin-top: calc(var(--margin-base) * 2);
}
</style>
