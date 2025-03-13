<template>
  <div class="action-search flex">
    <a-input
      class="search-input"
      v-model:value="searchValue"
      placeholder="Search ID or Title"
      ref="searchInputRef"
      :class="searchIsFocused ? 'search-input-active' : 'search-input-unactivated'"
      :bordered="false"
      :disabled="disabled"
      @focus="searchFocusHandle"
      @blur="searchBlurHandle"
      @pressEnter="searchHandle"
    />
    <a-button
      shape="circle"
      type="text"
      size="large"
      :icon="h(SearchOutlined)"
      v-show="!searchIsFocused"
      @click="searchActive"
    />
    <a-button
      shape="circle"
      type="text"
      size="large"
      :icon="h(CloseCircleFilled)"
      v-show="searchIsFocused"
      @mousedown="clearInputValue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from "vue";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons-vue";

const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

interface Emit {
  (e: "update:modelValue", value: string): void;
  (e: "searchHandle"): void;
}

const emit = defineEmits<Emit>();

const searchValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value)
});

const searchInputRef = ref<HTMLInputElement | null>(null);

const searchActive = () => {
  searchInputRef.value?.focus();
};

const clearInputValue = (e: MouseEvent) => {
  e.preventDefault(); //点击清除按钮不会使input失焦
  if (searchValue.value) {
    searchValue.value = "";
    searchHandle();
  }
};

const searchIsFocused = ref(false);

const searchFocusHandle = () => {
  searchIsFocused.value = true;
};

const searchBlurHandle = () => {
  if (searchValue.value) return;
  searchIsFocused.value = false;
};

const searchHandle = () => {
  emit("searchHandle");
};

defineExpose({
  searchActive
});
</script>
