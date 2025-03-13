<template>
  <popover v-model:model-value="popoverVisible" @openChange="popoverOpenChange">
    <actionTag :title="name" :content="echoValue" @remove="removeFilter" />
    <template #content>
      <popoverSearch v-model:model-value="searchValue" @input-change="searchHandle" />
      <a-spin :spinning="isLoading">
        <div class="filter-body filter-control-typeahead">
          <div class="flex typeahead-choose">
            <actionTag
              v-for="item in allChooseItem"
              :title="item.label"
              :colon="false"
              @remove="removeHandle(item.value)"
            />
          </div>

          <div
            class="item pointer word-wrap"
            v-for="item in options"
            :key="item.value"
            @click="chooseHandle(item)"
          >
            {{ item.label }}
          </div>
          <a-empty :image="simpleImage" v-show="options.length === 0" />
        </div>
        <popoverFooter :apply-disabled="applyDisabled" @clear="clearHandle" @apply="applyHandle" />
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
import _ from "lodash";
import { getFilterApiUrl } from "@/api/api/filter";
import { Empty } from "ant-design-vue";

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

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

// 列表
const options = computed(() => {
  const source = isLoad.value ? optionsAsync.value : props.filterData?.options;
  return (
    source?.filter((item) => {
      return !allChooseValues.value.includes(item.value);
    }) ?? []
  );
});

// 搜索逻辑
// 是否通过接口获取options
const optionsAsync = ref<GetFilterApiUrlRes[]>([]);
const isLoading = ref(false);
const searchValue = ref("");

const isLoad = computed(() => {
  return props.filterData?.load_options === LoadOptionsEnum.API_URL;
});
const search = async () => {
  if (!isLoad.value) return;
  try {
    isLoading.value = true;
    const res = await getFilterApiUrl(props.filterData?.api_url as string, {
      keyword: searchValue.value
    });
    if (res) {
      optionsAsync.value = res;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// 创建一个防抖函数
const debouncedResize = _.debounce(search, 500);

// 输入事件
const searchHandle = () => {
  if (isLoading.value) return;
  debouncedResize();
};

// 选择相关
const allChooseItem = ref<GetFilterApiUrlRes[]>([]);
const clearAllChooseItem = () => {
  allChooseItem.value = [];
};
// value集合
const allChooseValues = computed(() => {
  return allChooseItem.value.map((item) => item.value);
});
const chooseHandle = (value: GetFilterApiUrlRes) => {
  allChooseItem.value.push(value);
};

const removeHandle = (value: string | number) => {
  allChooseItem.value = allChooseItem.value.filter((item) => item.value !== value);
};

// 提交数据
const filterParams = ref();
const init = () => {
  if (!paramsKey.value) return;
  const { params } = useFilterParams(FilterTypeEnum.TYPEAHEAD, paramsKey.value);
  filterParams.value = params;
};

const applyDisabled = computed(() => {
  return allChooseValues.value.length === 0;
});

const clearHandle = () => {
  clearAllChooseItem();
};
const applyHandle = () => {
  if (!paramsKey.value) return;
  filterParams.value[paramsKey.value] = allChooseItem.value;
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
    const res = props.filterData?.value[0];
    if (props.filterData?.value.length <= 1) {
      return res.label;
    } else {
      return `${res.label}+1`;
    }
  }
});
const echo = () => {
  if (props.filterData && "value" in props.filterData) {
    filterParams.value[paramsKey.value] = props.filterData.value;
    allChooseItem.value = props.filterData.value;
  }
};

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
.filter-control-typeahead {
  padding: var(--padding-base) 0;

  .item {
    padding: var(--padding-base);
  }

  .item:hover {
    background-color: var(--color-background-content);
  }

  .typeahead-choose {
    padding: var(--padding-base);
    margin-bottom: var(--margin-base);
    flex-wrap: wrap;
  }
  .typeahead-choose > :not(:last-child) {
    margin-right: var(--margin-base);
  }
}
</style>
