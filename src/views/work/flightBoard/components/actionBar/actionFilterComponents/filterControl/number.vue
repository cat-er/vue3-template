<template>
  <popover v-model:model-value="popoverVisible" @openChange="popoverOpenChange">
    <actionTag :title="name" :content="echoValue" @remove="removeFilter" />
    <template #content>
      <div class="filter-body filter-control-number">
        <div class="title margin-bottom-8">{{ name }}</div>
        <a-input
          type="number"
          placeholder="Input..."
          allow-clear
          v-if="paramsKey && filterParams"
          v-model:value.number="filterParams[paramsKey]"
        />
      </div>
      <popoverFooter :apply-disabled="applyDisabled" @clear="clearHandle" @apply="applyHandle" />
    </template>
  </popover>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import actionTag from "@/components/actionTag/actionTag.vue";
import popover from "../components/popover.vue";
import popoverFooter from "../components/popoverFooter.vue";
import {
  FilterTypeEnum,
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

const filterParams = ref();

const applyDisabled = computed(() => {
  if (!filterParams.value || !paramsKey.value) return false;
  return !filterParams.value[paramsKey.value];
});

const clearFilterParams = () => {
  if (!paramsKey.value) return;
  filterParams.value[paramsKey.value] = undefined;
};
const init = () => {
  if (!paramsKey.value) return;
  const { params } = useFilterParams(FilterTypeEnum.NUMBER, paramsKey.value);
  filterParams.value = params;
};

const clearHandle = () => {
  clearFilterParams();
};

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
    return props.filterData?.value;
  }
});
const echo = () => {
  if (props.filterData && "value" in props.filterData) {
    filterParams.value[paramsKey.value] = props.filterData.value;
  }
};

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
.filter-control-number {
  padding: calc(var(--padding-base) * 2);
}
</style>
