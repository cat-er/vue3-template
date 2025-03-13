<!-- src/components/PriceTag.vue -->
<template>
  <div>
    <a @click="toDetail">{{ formatRequests() }}</a>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { DetailContentSegmentedEnum } from "@/views/workOrder/detail/types";
import { GetProviderListTypeEnum } from "@/api/api/workOrder/types";

interface Props {
  provider_counter: number;
  requests: number;
  routes: number;
  orderId: number;
}

const props = defineProps<Props>();

const formatRequests = () => {
  let data = [];
  if (props.requests === 1) data.push(`${props.requests} Request`);
  if (props.requests > 1) data.push(`${props.requests} Requests`);
  if (props.provider_counter === 1) data.push(`${props.provider_counter} Counter`);
  if (props.provider_counter > 1) data.push(`${props.provider_counter} Counters`);
  if (props.routes === 1) data.push(`${props.routes} Route`);
  if (props.routes > 1) data.push(`${props.routes} Routes`);
  return data.join(", ");
};

// 快速跳转到工程师列表
const router = useRouter();
const toDetail = () => {
  router.push({
    name: "workOrdersDetail",
    query: {
      orderId: props.orderId,
      type: DetailContentSegmentedEnum.PROVIDERS,
      childType: GetProviderListTypeEnum.PENDING_ASSIGNMENT
    }
  });
};
</script>
