<template>
  <a-spin wrapperClassName="search-bar full" :spinning="searchLoading">
    <a-input
      class="full"
      v-model:value="searchValue"
      :bordered="false"
      allowClear
      placeholder="Workorder ID or Title"
      ref="searchInputRef"
      @pressEnter="searchHandle"
      @blur="searchBlurHandle"
    />
  </a-spin>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { topSearch } from "@/api/api/workOrder";
import { TopSearchReqTypeEnum } from "@/api/api/workOrder/types";
import { useWorkFlightBoardStore } from "@/stores";

const router = useRouter();

const searchValue = ref<string>("");
const searchLoading = ref<boolean>(false);

interface Emit {
  (event: "searchBlur"): void;
}

const emit = defineEmits<Emit>();
const searchBlurHandle = () => {
  searchValue.value = "";
  emit("searchBlur");
};

const searchInputRef = ref();
const searchFocus = () => {
  searchInputRef.value.focus();
};

const currentSearchType = ref<TopSearchReqTypeEnum>(TopSearchReqTypeEnum.WORK_ORDER);

// 检测id是否存在
const topSearchAsync = async () => {
  try {
    searchLoading.value = true;
    const res = await topSearch({
      type: currentSearchType.value,
      id: searchValue.value
    });
    if (res) {
      router.push({
        name: "workOrdersDetail",
        query: {
          orderId: searchValue.value
        }
      });
      searchBlurHandle();
    }
  } catch (error) {
    console.error(error);
  } finally {
    searchLoading.value = false;
  }
};

const isNumeric = (str: string) => {
  return /^[0-9]+$/.test(str);
};

const { setGlobalSearchValue } = useWorkFlightBoardStore();
const searchHandle = () => {
  if (searchLoading.value) return;
  if (isNumeric(searchValue.value)) {
    topSearchAsync();
  } else {
    //走过滤逻辑
    setGlobalSearchValue(searchValue.value);
    router.push({
      name: "flightBoard"
    });
  }
};

defineExpose({
  searchFocus
});
</script>
