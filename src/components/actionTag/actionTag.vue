<template>
  <div class="action-tag flex pointer">
    <b class="action-tag-title">
      {{ title }}
      <span v-if="colon">:</span>
    </b>
    <div class="action-tag-content">{{ content }}</div>
    <div class="action-tag-close flex margin-left-8" @click.stop="removeFilter">
      <CloseOutlined class="icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { CloseOutlined } from "@ant-design/icons-vue";

interface Props {
  title?: string;
  content?: string | undefined;
  colon?: boolean; //是否带冒号
}

// 使用 withDefaults 设置默认值
const props = withDefaults(defineProps<Props>(), {
  colon: true
});

interface Emits {
  (e: "remove"): void;
}

const emit = defineEmits<Emits>();

const removeFilter = () => {
  emit("remove");
};
</script>
