<template>
  <div class="providers-filter flex-column action-box-white">
    <div class="flex filter-bar-head">
      <a-input
        class="filter-search"
        :class="{ 'filter-search-open': isFocus }"
        v-no-chinese
        v-model:value="searchValue"
        allowClear
        :placeholder="t('find_providers')"
        @focus="isFocus = true"
        @blur="isFocus = false"
        @pressEnter="onSearch"
      >
        <template #addonBefore>
          <SearchOutlined />
        </template>
      </a-input>
      <!-- 筛选按钮暂时不展示 -->
      <!-- <qualityBtn />
      <myCompanyBtn />
      <talentPoolsBtn /> -->
    </div>
    <filterSelect
      v-model:model-value="currentMiles"
      @milesChoose="milesChange"
      @sortChoose="sortChoose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed, watch, onMounted, nextTick } from "vue";
import { t } from "@/locale";
import filterSelect from "./filterSelect/filterSelect.vue";
import { getProviderList } from "@/api/api/workOrder/index";
import {
  GetProviderListReq,
  GetProviderListReqMilesEnum,
  ProviderSortEnum,
  GetProviderListTypeEnum
} from "@/api/api/workOrder/types";
import { useWorkOrderProvidersList, useWorkOrderDetailStore } from "@/stores";
import { storeToRefs } from "pinia";
import { SearchOutlined } from "@ant-design/icons-vue";
import useScrollBottom from "@/hooks/useScrollBottom";

const searchValue = ref<string | undefined>("");

const isFocus = ref(false);
const onSearch = () => {
  getProviderListAsync();
};

// 请求数据

const { workOrderId } = storeToRefs(useWorkOrderDetailStore());
const { currentProviderType } = storeToRefs(useWorkOrderProvidersList());

const currentLimit = ref<number>(10);
const paramsAsync = computed<GetProviderListReq>(() => {
  return {
    order_id: workOrderId.value as number,
    type: currentProviderType.value,
    keyword: searchValue.value,
    distance_in_miles: currentMiles.value,
    sort: currentSort.value,
    limit: currentLimit.value,
    page: 1
  };
});

const { setWorkOrderProviders, setProviderIsLoading } = useWorkOrderProvidersList();
const { providerTotal, workOrderProvidersList } = storeToRefs(useWorkOrderProvidersList());
const getProviderListAsync = async () => {
  try {
    setProviderIsLoading(true);
    const res = await getProviderList(paramsAsync.value);
    if (res) {
      setWorkOrderProviders(res);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setProviderIsLoading(false);
  }
};

// 英里切换
const currentMiles = ref<GetProviderListReqMilesEnum | number | undefined>(
  GetProviderListReqMilesEnum.MILES_60
);
const milesChange = (value: number | GetProviderListReqMilesEnum | undefined) => {
  currentMiles.value = value;
  getProviderListAsync();
};

// 排序切换
const currentSort = ref<ProviderSortEnum | number>(ProviderSortEnum.RANKING_SCORE);
const sortChoose = (value: ProviderSortEnum | number) => {
  currentSort.value = value;
  getProviderListAsync();
};

// 页面触底逻辑
const { isBottom } = useScrollBottom();

const isBottomHandle = () => {
  if (!workOrderProvidersList.value || !providerTotal.value) return;
  if (workOrderProvidersList.value?.length >= providerTotal?.value) return;
  currentLimit.value += 10;
  getProviderListAsync();
};

watch(isBottom, (newValue) => {
  if (newValue) {
    isBottomHandle();
  }
});

const typeChange = () => {
  if (currentProviderType.value !== GetProviderListTypeEnum.ALL_PROVIDERS) {
    currentMiles.value = undefined;
  } else {
    currentMiles.value = GetProviderListReqMilesEnum.MILES_60;
  }
  getProviderListAsync();
};

watch(
  () => currentProviderType.value,
  () => {
    typeChange();
  }
);

onMounted(() => {
  typeChange();
});

onUnmounted(() => {
  currentLimit.value = 10;
});
</script>
