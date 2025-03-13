<template>
  <div>
    <component
      v-bind="$attrs"
      :is="filterControl"
      :filterData="filterData"
      :isTempFilter="isTempFilter"
      @popoverOpenChange="popoverOpenChange"
      @addFilterControl="addFilterControl"
      @removeFilterControl="removeFilterControl"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import multiSelect from "./filterControl/multiSelect.vue";
import textUi from "./filterControl/text.vue";
import typeahead from "./filterControl/typeahead.vue";
import advancedDateRange from "./filterControl/advancedDateRange.vue";
import booleanUi from "./filterControl/boolean.vue";
import numberUi from "./filterControl/number.vue";
import {
  FilterTypeEnum,
  GetFilterFieldListRes,
  FilterFieldListRender
} from "@/api/api/filter/type";
import { useWorkOrderFilterStore } from "@/stores";
import { storeToRefs } from "pinia";

const { setTempFilter, setLocalFilters, removeLocalFilterById } = useWorkOrderFilterStore();
const { tempFilter } = storeToRefs(useWorkOrderFilterStore());

interface Props {
  filterData: FilterFieldListRender | GetFilterFieldListRes | undefined;
  isTempFilter: boolean;
}

const props = defineProps<Props>();

// 过滤器map
const filterControlMap = {
  [FilterTypeEnum.MULTI_SELECT]: multiSelect,
  [FilterTypeEnum.TEXT]: textUi,
  [FilterTypeEnum.TYPEAHEAD]: typeahead,
  [FilterTypeEnum.ADVANCED_DATE_RANGE]: advancedDateRange,
  [FilterTypeEnum.BOOLEAN]: booleanUi,
  [FilterTypeEnum.NUMBER]: numberUi
};
const filterControl = computed(() => {
  if (!props.filterData) return;
  const { type } = props.filterData;
  return filterControlMap[type];
});

const popoverOpenChange = (value: boolean) => {
  // 弹窗失焦时清空临时过滤器
  if (!value && tempFilter.value) {
    setTempFilter(undefined);
  }
};

// 添加过滤器
const addFilterControl = (value: FilterFieldListRender) => {
  console.log(value);
  setLocalFilters(value);
};

// 移除过滤器
const removeFilterControl = (id: number | string) => {
  popoverOpenChange(false);
  if (props.isTempFilter) return;
  removeLocalFilterById(id);
};
</script>
