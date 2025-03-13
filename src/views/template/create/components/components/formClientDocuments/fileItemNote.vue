<template>
  <a-modal v-model:open="modal" :title="title" :maskClosable="false">
    <template #footer>
      <a-button @click="hide">{{ t("cancel") }}</a-button>
      <loadButton v-if="isEdit" type="primary" @click="edit">{{ t("confirm") }}</loadButton>
    </template>

    <a-textarea
      v-if="isEdit"
      v-no-chinese
      v-model:value="note"
      :rows="10"
      class="margin-top-8 margin-bottom-8"
    ></a-textarea>
    <div v-else>
      {{ note }}
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { ref, computed } from "vue";
import loadButton from "@/components/loadButton/loadButton.vue";

const isEdit = ref<boolean>(); //是否从编辑按钮进入 还是预览按钮

const modal = ref<boolean>(false);

// note值
const note = ref<string>("");

// title 是编辑备注还是备注
const title = computed(() => {
  return isEdit.value ? t("edit_note") : t("note");
});

const hide = () => {
  modal.value = false;
};

const show = (value: boolean, noteValue?: string) => {
  modal.value = true;
  isEdit.value = value;
  typeof noteValue === "string" ? (note.value = noteValue) : "";
};

interface Emits {
  (e: "edit", value: string): void;
}

const emits = defineEmits<Emits>();

const edit = () => {
  emits("edit", note.value);
  hide();
};

defineExpose({
  show
});
</script>

<style scoped></style>
