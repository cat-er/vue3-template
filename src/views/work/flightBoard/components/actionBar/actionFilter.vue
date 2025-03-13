<template>
  <div class="action-filter">
    <div class="action-filter-content flex">
      <div class="content-left flex">
        <addFilter />
        <renderFilters />
      </div>
      <div class="content-right flex">
        <!-- 保存过滤器 -->
        <a-button
          v-if="!checkParams"
          type="text"
          size="large"
          class="margin-right-8"
          @click="saveFilterToGroup"
        >
          Save
        </a-button>
        <!-- 清除所有过滤器 and 当前选中的过滤器组-->
        <a-popconfirm
          title="Confirm clearance?"
          ok-text="Yes"
          cancel-text="No"
          placement="topRight"
          @confirm="clearAllFilter"
        >
          <a-button v-if="!checkParams" type="text" size="large" danger>Clear</a-button>
        </a-popconfirm>
      </div>
      <saveFilter ref="saveFilterRef" @saveIsDone="saveIsDone" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import addFilter from "./actionFilterComponents/addFilter.vue";
import renderFilters from "./actionFilterComponents/renderFilters.vue";
import { useWorkOrderFilterStore } from "@/stores";
import { storeToRefs } from "pinia";
import saveFilter from "./actionFilterComponents/saveFilter.vue";

const { filtersParams, checkParams } = storeToRefs(useWorkOrderFilterStore());
const { removeAllLocalFilters, getFilterGroupAsync, setCurrentChoosedFilterGroupId } =
  useWorkOrderFilterStore();
const clearAllFilter = () => {
  removeAllLocalFilters();
  setCurrentChoosedFilterGroupId("");
};

const saveFilterRef = ref();
const saveFilterToGroup = () => {
  saveFilterRef.value.show();
};

const saveIsDone = () => {
  getFilterGroupAsync();
};
</script>
