<!-- src/components/PriceTag.vue -->
<template>
  <div>
    <span>{{ timeFormat(date_str) }} ({{ time_zone_short }})</span>
  </div>
</template>

<script setup lang="ts">
import timeFormat from "@/utils/timeFormat";

interface Props {
  date_str: string;
  time_zone_short: string;
}

const props = defineProps<Props>()

</script>
