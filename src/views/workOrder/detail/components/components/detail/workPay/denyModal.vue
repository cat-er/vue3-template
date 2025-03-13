<template>
  <div>
    <a-modal v-model:open="modal" width="45%" :maskClosable="false" title="Deny Expense">
      <a-form
        name="deny"
        layout="vertical"
        :model="formData"
        :label-col="{ span: 8 }"
        :rules="rules"
        @validate="onValidate"
      >
        <a-form-item label="Reason for denial" name="status_description">
          <a-textarea v-no-chinese v-model:value="formData.status_description" :rows="4" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="hide">Cancel</a-button>
        <a-button type="primary" :disabled="isDisabled" @click="submitHandle">Confirm</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Rule } from "ant-design-vue/es/form";

// 拒绝信息窗口

const modal = ref<boolean>(false);

const formData = ref({
  status_description: ""
});

const rules: Record<string, Rule[]> = {
  status_description: [
    {
      required: true,
      message: "The reason for denial must be at least 11 characters",
      trigger: "blur"
    },
    { type: "string", min: 11, trigger: ["blur", "change"] },
    {
      pattern: /^[^\u4e00-\u9fa5]*$/,
      message: "Chinese is not supported",
      trigger: ["blur", "change"]
    }
  ]
};

const show = () => {
  modal.value = true;
};

const hide = () => {
  modal.value = false;
  formData.value.status_description = "";
  isDisabled.value = true;
};

type OnValidateName = string | number | string[] | number[];

const isDisabled = ref<boolean>(true);
const onValidate = (name: OnValidateName, status: boolean) => {
  isDisabled.value = !status;
};

interface Emits {
  (e: "denyDone", value: string | undefined): void;
}

const emits = defineEmits<Emits>();

const submitHandle = () => {
  emits("denyDone", formData.value.status_description);
  hide();
};

defineExpose({
  show
});
</script>
