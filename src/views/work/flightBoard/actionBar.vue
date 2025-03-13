<template>
  <a-spin :spinning="workOrderListLoading">
    <div class="flight-action-bar full flex box-shadow margin-bottom-16">
      <actionSearch
        v-model:model-value="searchValue"
        ref="actionSearchRef"
        @searchHandle="searchEnterHandle"
      />
      <actionFavorite />
      <actionFilter />
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from "vue";
import { useWorkFlightBoardStore } from "@/stores";
import { storeToRefs } from "pinia";
import actionSearch from "./components/actionBar/actionSearch.vue";
import actionFavorite from "./components/actionBar/actionFavorite.vue";
import actionFilter from "./components/actionBar/actionFilter.vue";

interface Emits {
  (e: "searchHandle", searchValue: string, isGlobalSearch: boolean): void;
}

const emit = defineEmits<Emits>();

// 列表数据请求
const { workOrderListLoading, globalSearchValue } = storeToRefs(useWorkFlightBoardStore());
const { setGlobalSearchValue } = useWorkFlightBoardStore();

const searchValue = ref("");

// 搜索框搜索
const searchEnterHandle = () => {
  searchHandle(false);
};

// 这次搜索是否为全局搜索isGlobalSearch
const searchHandle = (isGlobalSearch: boolean) => {
  emit("searchHandle", searchValue.value, isGlobalSearch);
};

const actionSearchRef = ref();
watch(
  () => globalSearchValue.value,
  (newVal) => {
    nextTick(() => {
      if (newVal) {
        searchValue.value = newVal;
        actionSearchRef.value.searchActive();
        searchHandle(true);
      }
    });
  },
  { immediate: true }
);

onUnmounted(() => {
  setGlobalSearchValue("");
});
</script>
