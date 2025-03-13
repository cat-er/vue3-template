<template>
  <a-popover
    placement="bottomLeft"
    trigger="click"
    :arrow="false"
    overlayClassName="filter-popover"
    v-bind="$attrs"
    v-model:open="internalOpen"
    @openChange="openChange"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #content>
      <slot name="content"></slot>
    </template>
    <slot></slot>
  </a-popover>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, onMounted } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

interface Emits {
  (event: "update:modelValue", value: boolean): void;
  (event: "openChange", value: boolean): void;
}

const emit = defineEmits<Emits>();

// 内部管理的 open 状态
const internalOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
});

const openChange = (value: boolean) => {
  emit("openChange", value);
};
</script>

<style lang="less">
.filter-popover {
  width: 280px;

  .ant-popover-inner {
    padding: 0;
  }
}
</style>
