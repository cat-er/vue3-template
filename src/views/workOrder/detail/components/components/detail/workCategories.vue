<template>
  <a-card class="detail-card">
    <template #title>
      <span class="work-card-title">{{ t("work_categories") }}</span>
    </template>
    <div class="flex over-view flex-column">
      <div class="margin-bottom-8">
        <b>{{ t("type_of_work") }}:</b>
        <a-tag class="tag margin-left-8">
          {{
            workOrderDetail?.work_types_info && workOrderDetail?.work_types_info.name
              ? workOrderDetail?.work_types_info.name
              : ""
          }}
        </a-tag>
      </div>
      <div>
        <b>{{ t("service_types") }}:</b>
        <a-tag
          class="tag margin-left-8"
          v-for="item in workOrderDetail?.service_type_names"
          :key="item"
        >
          {{ item }}
        </a-tag>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { useWorkOrderDetailStore } from "@/stores";
import { storeToRefs } from "pinia";

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());
</script>
