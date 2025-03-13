<template>
  <div class="item-head flex">
    <div class="head-msg flex">
      <a-tag v-if="groupType === 'counters'" color="blue" class="margin-right-8">
        Counter offer
      </a-tag>
      <a-tag v-if="groupType === 'requests'" color="green" class="margin-right-8">Requested</a-tag>
      <a-tag v-if="groupType === 'expire'" class="margin-right-8">
        {{ expiredType }}
      </a-tag>
      <div v-if="item.counter_pay_text" class="margin-right-8">
        Pay ({{ item.counter.pay.type }}):
        <span class="color-yellow-deep" :class="{ 'color-red': groupType === 'expire' }">
          {{ item.counter_pay_text }}
        </span>
      </div>
      <div v-if="item.counter_schedule_text" class="margin-right-8">
        Schedule:
        <span class="color-yellow-deep" :class="{ 'color-red': groupType === 'expire' }">
          {{ timeFormat(item.counter_schedule_text) }}
        </span>
      </div>
      <div v-if="item.counter_expenses_text">
        Expenses:
        <span class="color-yellow-deep" :class="{ 'color-red': groupType === 'expire' }">
          {{ item.counter_expenses_text }}
        </span>
      </div>
      <div v-if="item.expire_text">
        Time to expire:
        <span class="color-red">{{ item.expire_text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { GetProviderListRes, PayTypeEnum } from "@/api/api/workOrder/types";
import timeFormat from "@/utils/timeFormat";
import _ from "lodash";

interface Props {
  item: GetProviderListRes;
}

const props = defineProps<Props>();

const item = computed(() => {
  return props.item;
});

const groupType = computed(() => {
  if (item.value.is_expire) {
    return "expire";
  }
  if (_.isEmpty(item.value.counter) || !item.value.counter) {
    return "requests";
  }
  return "counters";
});

const expiredType = computed(() => {
  if (item.value.is_expire) {
    if (_.isEmpty(item.value.counter) || !item.value.counter) {
      return "Expired request";
    } else {
      return "Counter Offer expired";
    }
  }
});
</script>
