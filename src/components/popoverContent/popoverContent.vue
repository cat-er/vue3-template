<template>
  <div class="popover-content full flex-column">
    <slot> </slot>
    <div class="divider"></div>
    <div class="foot flex">
      <a @click="clearHandle">{{ t("clear") }}</a>
      <a-button type="primary" size="small" @click="confirmHandle">{{ t("confirm") }}</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from "@/locale";

interface Emits {
  (e: "clear"): void;
  (e: "confirm"): void;
}

const emits = defineEmits<Emits>();

const clearHandle = () => {
  emits("clear");
};

const confirmHandle = () => {
  emits("confirm");
};
</script>
