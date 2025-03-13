<template>
  <div class="popover-footer full flex">
    <div>
      <div v-show="showCountsComputed">{{ currentCountsComputed }} / {{ allCountsComputed }}</div>
    </div>
    <div>
      <a-button type="text" @click="clear">Clear</a-button>
      <a-button class="margin-left-8" :disabled="applyDisabled" @click="apply">Apply</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  showCounts?: boolean;
  allCounts?: number | string;
  currentCounts?: number | string;
  applyDisabled?: boolean;
}

const props = defineProps<Props>();

const showCountsComputed = computed(() => {
  return !!props.showCounts;
});

const allCountsComputed = computed(() => {
  return Number(props.allCounts);
});

const currentCountsComputed = computed(() => {
  return Number(props.currentCounts);
});

interface Emits {
  (e: "clear"): void;
  (e: "apply"): void;
}

const emit = defineEmits<Emits>();
const clear = () => {
  emit("clear");
};
const apply = () => {
  emit("apply");
};
</script>

<style lang="less" scoped>
.popover-footer {
  border-top: 1px solid var(--color-border);
  padding: calc(var(--padding-base) * 2);
  justify-content: space-between;
  align-items: center;
}
</style>
