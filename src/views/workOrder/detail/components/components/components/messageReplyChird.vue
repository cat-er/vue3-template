<template>
  <div class="message-reply-chird">
    <a-row class="margin-bottom-8">
      <a-col :span="12">
        <a>
          {{ message.from.name ? message.from.name : '' }}
        </a>
      </a-col>
      <a-col :span="11" class="right">
        <clock-circle-outlined />
        {{ formatTimeLocal(message.created_at_local) }} ({{ zone }})
      </a-col>
      <a-col :span="1">
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="23" >
        <div
          class="message-bubble"
        >
          <div
            class="message-bubble-inner"
          >
            <pre class="margin-bottom-0">{{ message.message }}</pre>
          </div>
          <div
            class="nipple nipple-size-sm nipple-position-right"
          ></div>
        </div>
      </a-col>
      <a-col :span="1" class="right">
        <a-row>
          <a-col :span="24">
            <template v-if="message.from">
              <a-avatar
                :src="message.from.thumbnail ? message.from.thumbnail : ''"
                alt="message.from.name ? message.from.name : ''"
              >
                <template v-if="!message.from.thumbnail" #icon><UserOutlined /></template>
              </a-avatar>
            </template>
            <template v-else>
              <a-avatar>
                <template #icon><UserOutlined /></template>
              </a-avatar>
            </template>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">

import { defineProps, ref } from "vue";
import type { MessagesList } from "@/api/api/workOrder/types";
import { formatTimeLocal } from "@/api/api/workOrder";
import { ClockCircleOutlined } from "@ant-design/icons-vue";
import { storeToRefs } from "pinia";
import { useWorkOrderDetailStore } from "@/stores";

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());
const zone = ref<string>(workOrderDetail.value?.time_zone_info?.short ? workOrderDetail.value.time_zone_info.short : "");

const { message } = defineProps<{
  message: MessagesList;
}>();

</script>

<style scoped>

</style>