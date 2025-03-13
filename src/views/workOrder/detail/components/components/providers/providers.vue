<template>
  <div class="providers">
    <filterBar />
    <div v-show="isProviderList">
      <groupAllProviders v-if="currentProviderType === GetProviderListTypeEnum.ALL_PROVIDERS" />
      <groupAssigned v-else-if="currentProviderType === GetProviderListTypeEnum.ASSIGNED" />
      <groupPending
        v-else-if="currentProviderType === GetProviderListTypeEnum.PENDING_ASSIGNMENT"
      />
      <groupRoutes v-else />
    </div>

    <div v-if="providerIsLoading" class="no-providers">
      <skeletonItem :num="3"></skeletonItem>
    </div>
    <div v-else v-show="!isProviderList" class="no-providers flex">
      <a-empty>
        <template #description>
          <div class="flex-column">
            <span>No Provider Assigned</span>
            <span>The assigned provider displays here once assigned, or route is accepted</span>
            <!-- <div>
            <a-button class="margin-top-8" type="primary" @click="toPending">
              See Requests/Counters
            </a-button>
          </div> -->
          </div>
        </template>
      </a-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useWorkOrderProvidersList } from "@/stores";
import { storeToRefs } from "pinia";
import { GetProviderListTypeEnum } from "@/api/api/workOrder/types";
import filterBar from "./filterBar.vue";
import groupAllProviders from "./providersGroup/groupAllProviders.vue";
import groupAssigned from "./providersGroup/groupAssigned.vue";
import groupPending from "./providersGroup/groupPending.vue";
import groupRoutes from "./providersGroup/groupRoutes.vue";
import SkeletonItem from "./providersItem/skeletonItem.vue";

const { workOrderProvidersList, currentProviderType } = storeToRefs(useWorkOrderProvidersList());
const { providerIsLoading } = storeToRefs(useWorkOrderProvidersList());

const isProviderList = computed(() => {
  return !!workOrderProvidersList.value?.length;
});
// 前往pending
// const toPending = () => {};
</script>
