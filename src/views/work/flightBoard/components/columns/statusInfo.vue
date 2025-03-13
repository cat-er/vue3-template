<!-- src/components/StatusTag.vue -->
<template>
  <div>
    <a-tooltip v-if="status_display==='Assigned: At risk'" :title="sub_status">
      <a-tag color="red">{{ status_display }}</a-tag>
    </a-tooltip>
    <a-tag v-else-if="status===3 && status_display!=='Assigned'" color="blue">{{ status_display }}</a-tag>
    <a-tag :color="statusInfo.color" v-else>{{ statusInfo.value }}</a-tag>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue";

interface Props {
  status: number;
  status_display?: string;
  status_name?: string;
  sub_status?: string;
}

const props = defineProps<Props>()

const statusInfo = computed(() => {
  switch (props.status) {
    case 1:
      return {color: 'gray', value: 'Draft'};
    case 2:
      return {color: 'blue', value: 'Published'};
    case 9:
      return {color: 'blue', value: 'Routed'};
    case 7:
      return {color: 'red', value: 'Cancelled'};
    case 3:
      return {color: 'green', value: 'Assigned'};
    case 4:
      return {color: 'orange', value: 'Work Done'};
    case 5:
      return {color: 'cyan', value: 'Approved'};
    case 6:
      return {color: 'pink', value: 'Paid'};
    default:
      return {color: 'purple', value: 'Other'};
  }
})

</script>
