<template>
  <popover v-model:model-value="popoverVisible" @openChange="popoverOpenChange">
    <actionTag :title="name" :content="echoValue" @remove="removeFilter" />
    <template #content>
      <a-spin :spinning="isLoading">
        <popoverSearch v-model:model-value="searchValue" />
        <div class="filter-body">
          <a-checkbox-group
            class="flex-column filter-control-multiSelect"
            name="checkboxgroup"
            v-if="paramsKey && filterParams"
            v-model:value="filterParams[paramsKey]"
          >
            <a-checkbox v-for="item in options" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-checkbox>
          </a-checkbox-group>
        </div>
        <popoverFooter
          v-if="paramsKey && filterParams"
          showCounts
          :apply-disabled="applyDisabled"
          :all-counts="allCounts"
          :current-counts="currentCounts"
          @clear="clearHandle"
          @apply="applyHandle"
        />
      </a-spin>
    </template>
  </popover>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import actionTag from "@/components/actionTag/actionTag.vue";
import popover from "../components/popover.vue";
import popoverSearch from "../components/popoverSearch.vue";
import popoverFooter from "../components/popoverFooter.vue";
import {
  FilterTypeEnum,
  FilterFieldListRender,
  LoadOptionsEnum,
  GetFilterApiUrlRes,
  GetFilterFieldListRes,
  Emits
} from "@/api/api/filter/type";
import { useFilterParams } from "@/views/work/flightBoard/hooks";
import { getFilterApiUrl } from "@/api/api/filter";

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
  return !filterParams.value[paramsKey.value].length;
});

const clearFilterParams = () => {
  if (!paramsKey.value) return;
  filterParams.value[paramsKey.value] = [];
};
const init = () => {
  if (!paramsKey.value) return;
  const { params } = useFilterParams(FilterTypeEnum.MULTI_SELECT, paramsKey.value);
  filterParams.value = params;
};

// 列表数据
const searchValue = ref("");
const options = computed(() => {
  const source = isLoad.value ? optionsAsync.value : props.filterData?.options;
  if (!source) return [];
  // 过滤逻辑
  return source.filter((option) =>
    option.label.toLowerCase().includes(searchValue.value.toLowerCase())
  );
});

// 列表总数
const allCounts = computed(() => {
  return options.value.length;
});
// 当前选中数量
const currentCounts = computed(() => {
  const optionValues = options.value.map((item) => item.value);
  return filterParams.value[paramsKey.value].filter((item: string | number) => {
    return optionValues.includes(item);
  }).length;
});

// 是否通过接口获取options
const isLoad = computed(() => {
  return props.filterData?.load_options === LoadOptionsEnum.API_URL;
});

// 当通过apiurl获取列表时的请求方法
const isLoading = ref(false);
const optionsAsync = ref<GetFilterApiUrlRes[]>([]);
const getOptionsAsync = async () => {
  if (!isLoad.value) return;
  try {
    isLoading.value = true;
    const res = await getFilterApiUrl(props.filterData?.api_url as string);
    if (res) {
      optionsAsync.value = res;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
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
    const value = props.filterData?.value[0];
    const res = options.value?.find((item) => item.value === value)?.label;
    const length = props.filterData?.value.length;
    return length <= 1 ? res : `${res}+${length}`;
  }
});

const echo = () => {
  if (props.filterData && "value" in props.filterData) {
    filterParams.value[paramsKey.value] = props.filterData.value;
  }
};

onMounted(() => {
  init();
  getOptionsAsync();
});
</script>

<style lang="less" scoped>
.filter-control-multiSelect {
  padding: calc(var(--padding-base) * 2);
}

.filter-control-multiSelect > :not(:last-child) {
  margin-bottom: var(--margin-base);
}
</style>
