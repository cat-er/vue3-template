<template>
  <a-modal v-model:open="modal" :title="t('preview')" @ok="hide">
    <img :src="url" />
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { t } from "@/locale";

interface Props {
  url: string;
}

const props = defineProps<Props>();

const modal = ref<boolean>(false);

const show = () => {
  modal.value = true;
};
const hide = () => {
  modal.value = false;
};

defineExpose({
  show,
  hide
});
</script>
