<template>
  <div class="contacts-form full margin-bottom-8">
    <div class="contacts-form-action flex">
      <span>{{ t("additional_contact") }}</span>
      <a-button
        type="text"
        shape="circle"
        size="small"
        danger
        :icon="h(DeleteOutlined)"
        @click="handleRemove"
      />
    </div>
    <a-form
      class="margin-top-8"
      :model="formData"
      name="location"
      layout="vertical"
      :wrapper-col="{ span: 24 }"
      :rules="rules"
      ref="formRef"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="t('name_or_description')" name="name">
            <a-input v-no-chinese v-model:value="formData.name"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('title')" name="role">
            <a-select v-model:value="formData.role">
              <a-select-option v-for="(item, index) in roleList" :key="index" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item :label="t('phone')" name="phone">
            <a-input v-no-chinese v-model:value="formData.phone"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="t('ext')">
            <a-input v-no-chinese v-model:value="formData.ext"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('email')" name="email">
            <a-input v-no-chinese v-model:value="formData.email"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item :label="t('note')">
            <a-input v-no-chinese v-model:value="formData.notes"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { h, ref, onMounted, watch, onUnmounted } from "vue";
import { Contact, ContactRoleEnum } from "@/api/api/workOrder/types";
import type { Rule } from "ant-design-vue/es/form";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { usPhoneRegex, emailRegex } from "@/utils/regexUtils";

interface Props {
  itemId: string;
  echoData?: Contact;
}

const props = defineProps<Props>();

interface Emits {
  (e: "removeItem", value: string): void;

  (e: "handleOutPut", id: string, value: Contact, status: boolean): void;
}

const emits = defineEmits<Emits>();

const formData = ref<Contact>({
  role: ContactRoleEnum.LOCATION_CONTACT,
  name: "",
  phone: "",
  ext: "",
  email: "",
  notes: ""
});

const rules: Record<string, Rule[]> = {
  name: [{ required: true, trigger: ["blur"] }],
  role: [{ required: true, trigger: ["blur"] }],
  phone: [
    { required: true, trigger: ["blur"] },
    { pattern: usPhoneRegex, message: t("wrong_format"), trigger: ["blur"] }
  ],
  email: [{ pattern: emailRegex, message: t("wrong_format"), trigger: ["blur"] }]
};

const roleList = ref([
  { label: "Location Contact", value: ContactRoleEnum.LOCATION_CONTACT },
  { label: "Project manager", value: ContactRoleEnum.PROJECT_MANAGER },
  { label: "Resource coordinator", value: ContactRoleEnum.RESOURCE_COORDINATOR },
  { label: "Emergency contact", value: ContactRoleEnum.EMERGENCY_CONTACT },
  { label: "Technical help", value: ContactRoleEnum.TECHNICAL_HELP },
  { label: "Check-in / Check-out", value: ContactRoleEnum.CHECK }
]);

const handleRemove = () => {
  emits("removeItem", props.itemId);
};

// 校验
const formRef = ref();
const formValidate = async () => {
  try {
    await formRef.value.validate();
    emits("handleOutPut", props.itemId, formData.value, true);
  } catch (err) {
    emits("handleOutPut", props.itemId, formData.value, false);
  }
};

// 回显
const echo = () => {
  if (!props.echoData) return;
  for (const key in formData.value) {
    if (Object.prototype.hasOwnProperty.call(formData.value, key)) {
      (formData.value as any)[key] = (props.echoData as any)[key];
    }
  }
};

onMounted(() => {
  echo();
  formValidate();

  watch(
    () => formData.value,
    () => {
      formValidate();
    },
    { deep: true }
  );
});
</script>
