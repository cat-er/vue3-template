<template>
  <div class="pagination flex">
    <a-pagination
      show-size-changer
      show-quick-jumper
      v-model:current="currentPage"
      v-model:pageSize="currentSize"
      :total="total"
      :page-size-options="pageSizeOptions"
      :show-total="totalLabel"
      @change="pageChange"
      @showSizeChange="sizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { t } from "@/locale";

const pageSizeOptions = ref<string[]>(["10", "20", "50", "100", "200"]);

const totalLabel = (total: number) => {
  return `${t("total")} ${total}`;
};

interface Props {
  total: number | undefined;
}
const { total } = defineProps<Props>();

// 当前页数
const currentPage = ref<number>(1);

// 当前条数
const currentSize = ref<number>(10);

const reset = () => {
  currentPage.value = 1;
  currentSize.value = 10;
};

interface Emits {
  (e: "pageChange", page: number, pageSize: number): void;
  (e: "sizeChange", current: number, size: number): void;
}

const emits = defineEmits<Emits>();

const pageChange = (page: number, pageSize: number) => {
  emits("pageChange", page, pageSize);
};

const sizeChange = (current: number, size: number) => {
  emits("sizeChange", current, size);
};

defineExpose({
  reset
});
</script>
