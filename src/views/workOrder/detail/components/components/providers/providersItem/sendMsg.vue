<template>
  <a-modal v-model:open="modal" title="New Message">
    <div class="flex-column">
      <h2 class="margin-bottom-8">
        {{ name }}
      </h2>
      <a-textarea
        v-no-chinese
        v-model:value="inputValue"
        placeholder="Type your message..."
        :rows="4"
      />
    </div>
    <template #footer>
      <a-button @click="hide">Cancel</a-button>
      <a-button
        type="primary"
        :disabled="!Boolean(inputValue)"
        :loading="isLoading"
        @click="sendHandleAsync"
      >
        Send Message
      </a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { sendMessage } from "@/api/api/workOrder/index";
import { notifySuccess } from "@/utils/notify";

interface Props {
  orderId: number | undefined;
  providerId: number | undefined;
  name: string;
}

const props = defineProps<Props>();

const modal = ref(false);

const hide = () => {
  modal.value = false;
};

const show = () => {
  modal.value = true;
};

const inputValue = ref<string>();

const isLoading = ref(false);
const sendHandleAsync = async () => {
  try {
    isLoading.value = true;
    if (!props.orderId || !props.providerId || !inputValue.value) return;
    const res = await sendMessage({
      order_id: props.orderId,
      provider_id: props.providerId,
      message: inputValue.value
    });
    console.log(res);

    if (res) {
      notifySuccess("Success");
      hide();
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

defineExpose({
  show
});
</script>
