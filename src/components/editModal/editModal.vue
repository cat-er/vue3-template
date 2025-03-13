<template>
  <a-modal v-model:open="modal" :title="t('edit_note')" @ok="handleOk">
    <a-textarea
      v-no-chinese
      v-model:value="text"
      :placeholder="t('select_placeholder')"
      :rows="4"
    />
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { t } from "@/locale";

const modal = ref<boolean>(false);

const text = ref<string>("");

const show = () => {
  modal.value = true;
};

const hide = () => {
  modal.value = false;
};

interface Emits {
  (e: "textInput", value: string): void;
}

const emits = defineEmits<Emits>();

const handleOk = () => {
  emits("textInput", text.value);
  text.value = "";
  hide();
};

defineExpose({
  show,
  hide
});
</script>
