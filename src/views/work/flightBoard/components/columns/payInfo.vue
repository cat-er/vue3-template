<!-- src/components/PriceTag.vue -->
<template>
  <div>
    <span class="price-type">{{ pay.type }}</span>
    <div class="price-value">
      <span v-if="pay.type === 'fixed'">${{ formattedPrice() }}</span>
      <span v-else-if="pay.type === 'hourly'">{{ pay.base.units }} hourly @ ${{ formattedPrice() }}/hr</span>
      <span v-else-if="pay.type === 'device'">{{ pay.base.units }} devices @ ${{ formattedPrice() }}/unit</span>
      <span v-else-if="pay.type === 'blended'">{{ pay.base.units }} hours @ ${{
          formattedPrice()
        }} and then up to {{ pay.additional.units }} hours @ ${{ formattedPrice() }}/hr</span>
    </div>
  </div>
</template>

<script setup lang="ts">

import type { Pay } from "@/api/api/workOrder/types";

interface Props {
  pay: Pay;
}

const props = defineProps<Props>()

const formattedPrice = () => {
  return parseFloat(props.pay.base.amount?.toString()).toFixed(2);
}

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
