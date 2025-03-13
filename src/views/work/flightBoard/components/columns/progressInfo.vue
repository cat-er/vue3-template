<!-- src/components/PriceTag.vue -->
<template>
  <div>
    <span class="price-type">Tasks</span>
    <div class="price-value">
      {{ completed_tasks }}/{{ total_tasks }}
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  completed_tasks: number;
  total_tasks: number;
}
const props = defineProps<Props>()

</script>

<style scoped>
.price-type {
  font-size: 12px;
  color: #a0aec0;
  display: block;
}
.price-value {
  font-size: 16px;
  color: #1a202c;
}
</style>
