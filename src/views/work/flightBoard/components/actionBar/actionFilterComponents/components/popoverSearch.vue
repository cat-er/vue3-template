<template>
  <div class="popover-search flex">
    <a-input
      size="large"
      placeholder="Find Filter..."
      :bordered="false"
      allow-clear
      v-model:value="searchValue"
      @change="inputChange"
    />
    <SearchOutlined class="icon" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";

interface Props {
  modelValue: string;
}

const props = defineProps<Props>();

interface Emits {
  (event: "update:modelValue", value: string): void;
  (event: "inputChange", value: string): void;
}

const emit = defineEmits<Emits>();

const searchValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value)
});

const inputChange = () => {
  emit("inputChange", searchValue.value);
};
</script>

<style lang="less">
.popover-search {
  padding: var(--padding-base);
  border-bottom: 2px solid var(--color-blue);

  .icon {
    font-size: 20px;
  }
}
</style>
