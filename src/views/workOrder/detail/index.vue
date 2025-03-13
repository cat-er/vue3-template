<template>
  <div class="work-order-detail">
    <detailTitleBar></detailTitleBar>
    <detailActionBar></detailActionBar>
    <detailTab @segmented-change="changeHandle"></detailTab>
    <detailContent v-if="domDisabled" :currentTab="currentTab"></detailContent>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { usePageLoadingStore, useWorkOrderDetailStore } from "@/stores";
import { storeToRefs } from "pinia";
import detailTitleBar from "./components/detailTitleBar.vue";
import detailActionBar from "./components/detailActionBar.vue";
import detailTab from "./components/detailTab.vue";
import detailContent from "./components/detailContent.vue";
import { DetailContentSegmentedEnum } from "./types";

const route = useRoute();

const { setWorkOrderDetail } = useWorkOrderDetailStore();

const { changeLoading } = usePageLoadingStore();

const domDisabled = ref(false);
const getWorkOrderDetailAsync = async (id: number) => {
  try {
    changeLoading(true);
    domDisabled.value = false;
    await setWorkOrderDetail(id);
  } catch (error) {
    console.error(error);
  } finally {
    changeLoading(false);
    domDisabled.value = true;
  }
};

const currentTab = ref<DetailContentSegmentedEnum>(DetailContentSegmentedEnum.DETAILS);
const changeHandle = (value: DetailContentSegmentedEnum) => {
  currentTab.value = value;
};

const oredrId = computed(() => {
  return Number(route.query.orderId);
});
onMounted(() => {
  getWorkOrderDetailAsync(oredrId.value);
});
</script>
