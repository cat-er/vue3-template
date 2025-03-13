<template>
  <a-button
    :type="type"
    :size="size"
    :shape="shape"
    :loading="loading"
    :block="block"
    :disabled="disabled"
    @click="clickHandler"
  >
    <slot name="default"></slot>
    <slot name="icon"></slot>
  </a-button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ButtonType, ButtonSize, ButtonShape } from "ant-design-vue/es/button";

/**
 * 加载按钮,无需在每个页面定义loading状态了
 */

interface Props {
  type?: ButtonType | "primary";
  size?: ButtonSize;
  shape?: ButtonShape;
  block?: boolean;
  disabled?: boolean;
}

const { type, size, shape, block } = defineProps<Props>();

const loading = ref<boolean>(false);

type Emits = {
  (e: "click", callback: (value: boolean) => void): void;
}

const emits = defineEmits<Emits>();

const clickHandler = () => {
  emits("click", (value: boolean) => {
    loading.value = value;
  });
};
</script>
