<template>
  <a-card class="detail-card">
    <template #title>
      <span class="work-card-title">{{ t('client_documents') }}</span>
    </template>
    <div class="work-client-doc">
      <fileItem v-for="item in workOrderDetail?.attachments_list" :file-item="item.fn_attachments_info"
        :isEdit="false" />
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/locale";
import { useWorkOrderDetailStore } from "@/stores";
import { storeToRefs } from "pinia";
import fileItem from "@/views/workOrder/create/components/components/formClientDocuments/fileItem.vue";

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());
</script>
