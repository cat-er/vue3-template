<template>
  <div>
    <providersItem v-for="item in workOrderProvidersList" :key="item.provider_id" :selectKey="item.provider_id"
      :providerItem="item" :currentKey="currentKey" @click="currentKey = item.provider_id">
    </providersItem>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import providersItem from "../providersItem/providersItem.vue";
import { useWorkOrderProvidersList } from "@/stores";
import { storeToRefs } from "pinia";

// 当前选中item
const currentKey = ref<string | number>();

const { workOrderProvidersList } = storeToRefs(useWorkOrderProvidersList());
</script>
