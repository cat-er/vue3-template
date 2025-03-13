<template>
  <div class="content-detail flex">
    <div class="detail-left">
      <workCategories />
      <workOrderQualifications />
      <workDesc />
      <workClientDoc />
      <workTasks />
      <workTimeLog />
      <workDeliverables />
      <!-- <workSignatures /> -->
    </div>
    <div class="detail-right margin-left-8">
      <workPay />
      <workSchedule />
      <workLocation />
      <workContacts />
    </div>
  </div>
</template>

<script setup lang="ts">
import workCategories from "./detail/workCategories.vue";
import workOrderQualifications from "./detail/workOrderQualifications.vue";
import workDesc from "./detail/workDesc.vue";
import workClientDoc from "./detail/workClientDoc.vue";
import workTasks from "./detail/workTasks.vue";
import workTimeLog from "./detail/workTimeLog.vue";
import workDeliverables from "./detail/workDeliverables.vue";
import workPay from "./detail/workPay.vue";
import workSchedule from "./detail/workSchedule.vue";
import workLocation from "./detail/workLocation.vue";
import workContacts from "./detail/workContacts.vue";
</script>
