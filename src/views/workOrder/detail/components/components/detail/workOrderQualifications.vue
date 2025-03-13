<template>
  <a-card class="detail-card">
    <template #title>
      <span class="work-card-title">{{ t('work_order_qualifications') }}</span>
    </template>
    <div v-if="workOrderDetail?.qualifications_show.length > 0">
      {{ t("qualifications_detail_label") }}
      <a-table class="margin-top-8" :columns="columns" :data-source="tableData" :pagination="false">
        <template #bodyCell="{ text, column, index, record }">
          <template v-if="column.dataIndex === 'type'">
            <div v-if="text === 'certifications'">Certifications</div>
            <div v-else-if="text === 'licenses'">Licenses</div>
            <div v-else-if="text === 'equipments'">Equipment</div>
            <div v-else-if="text === 'insurances'">Insurance</div>
            <div v-else-if="text === 'backgroundCheck'">Background Check</div>
            <div v-else-if="text === 'drugTest'">Drug Test</div>
            <div v-else-if="text === 'covid19'">COVID-19 Vaccination Proof</div>
          </template>
        </template>
      </a-table>
    </div>
    <div class="form-note" v-else>
      There are no requirements for requesting or being assigned to this work order.
    </div>
  </a-card>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {t} from "@/locale";
import {useWorkOrderDetailStore} from "@/stores";
import {storeToRefs} from "pinia";

const {workOrderDetail} = storeToRefs(useWorkOrderDetailStore());

const tableData = computed(() => {
  return workOrderDetail.value?.qualifications_show;
});

const columns = [
  {
    title: t("type"),
    dataIndex: "type",
    key: "type"
  },
  {
    title: t("qualification"),
    dataIndex: "qualification",
    key: "qualification"
  },
  {
    title: t("verification"),
    dataIndex: "verification",
    key: "verification"
  }
];
</script>
