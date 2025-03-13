<template>
  <a-collapse v-model:activeKey="activeKey" :expand-icon-position="expandIconPosition" ghost>
    <a-collapse-panel key="1" v-if="requestsList?.length">
      <template #header>
        <h2>({{ requestsList?.length }}) Requests</h2>
      </template>
      <providersItem
        v-for="item in requestsList"
        :key="item.provider_id"
        :selectKey="item.provider_id"
        :currentKey="currentKey"
        :providerItem="item"
        @click="currentKey = item.provider_id"
      ></providersItem>
    </a-collapse-panel>
    <a-collapse-panel key="2" v-if="countersList?.length">
      <template #header>
        <h2>({{ countersList?.length }}) Counters</h2>
      </template>
      <providersItem
        v-for="item in countersList"
        :key="item.provider_id"
        :selectKey="item.provider_id"
        :currentKey="currentKey"
        :providerItem="item"
        @click="currentKey = item.provider_id"
      ></providersItem>
    </a-collapse-panel>
    <a-collapse-panel key="3" v-if="inactiveList?.length">
      <template #header>
        <h2>({{ inactiveList?.length }}) Inactive</h2>
      </template>
      <providersItem
        v-for="item in inactiveList"
        :key="item.provider_id"
        :selectKey="item.provider_id"
        :currentKey="currentKey"
        :providerItem="item"
        @click="currentKey = item.provider_id"
      ></providersItem>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import providersItem from "../providersItem/providersItem.vue";
import { useWorkOrderProvidersList } from "@/stores";
import { storeToRefs } from "pinia";
import type { CollapseProps } from "ant-design-vue";
import { GetProviderListRes } from "@/api/api/workOrder/types";
import _ from "lodash";

// 折叠面板
const expandIconPosition = ref<CollapseProps["expandIconPosition"]>("end");
const activeKey = ref(["1", "2", "3"]);

// 当前选中item
const currentKey = ref<string | number>();

const { workOrderProvidersList } = storeToRefs(useWorkOrderProvidersList());

const requestsList = computed(() => {
  return workOrderProvidersList.value?.filter(
    (item) => !item.is_expire && (_.isEmpty(item.counter) || !item.counter)
  );
});

const countersList = computed(() => {
  return workOrderProvidersList.value?.filter(
    (item) => !item.is_expire && !_.isEmpty(item.counter) && item.counter
  );
});

const inactiveList = computed(() => {
  return workOrderProvidersList.value?.filter((item) => item.is_expire);
});
</script>
