<template>
  <div class="contacts-form full margin-bottom-8">
    <div class="contacts-form-action flex">
      <span>{{ t("additional_contact") }}</span>
      <a-button type="text" shape="circle" size="small" danger @click="handleRemove">
        <template #icon>
          <DeleteOutlined></DeleteOutlined>
        </template>
      </a-button>
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
          <a-form-item name="name">
            <template #label>
              {{ t("name_or_description") }}
            </template>
            <a-input v-no-chinese v-model:value="formData.name"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="role">
            <template #label>
              {{ t("title") }}
            </template>
            <a-select v-model:value="formData.role">
              <a-select-option v-for="(item, index) in roleList" :key="index" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item name="phone">
            <template #label>
              {{ t("phone") }}
            </template>
            <a-input v-no-chinese v-model:value="formData.phone"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item>
            <template #label>
              {{ t("ext") }}
            </template>
            <a-input v-no-chinese v-model:value="formData.ext"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="email">
            <template #label>
              {{ t("email") }}
            </template>
            <a-input v-no-chinese v-model:value="formData.email"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="notes">
            <template #label>
              {{ t("note") }}
            </template>
            <a-textarea v-no-chinese v-model:value="formData.notes" :rows="5"></a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { ref, onMounted, watch } from "vue";
import {
  type batchUpdateContactsReq,
  ContactRoleEnum,
  type ContactsList
} from "@/api/api/workOrder/types";
import type { Rule } from "ant-design-vue/es/form";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { usPhoneRegex, emailRegex } from "@/utils/regexUtils";

const itemStatus = ref<boolean>(false);
interface Props {
  itemId: number;
  contactsLists: ContactsList;
}

const props = defineProps<Props>();

interface Emits {
  (e: "removeItem", value: string): void;

  (e: "handleOutPut", id: string, value: batchUpdateContactsReq, status: boolean): void;
}

const emits = defineEmits<Emits>();

const formData = ref<batchUpdateContactsReq>({
  id: props.contactsLists?.id ? props.contactsLists.id : 0,
  role: props.contactsLists?.role ? props.contactsLists.role : "",
  name: props.contactsLists?.name ? props.contactsLists.name : "",
  phone: props.contactsLists?.phone ? props.contactsLists.phone : "",
  ext: props.contactsLists?.ext ? props.contactsLists.ext : "",
  email: props.contactsLists?.email ? props.contactsLists.email : "",
  notes: props.contactsLists?.notes ? props.contactsLists.notes : "",
  isCreate: !props.contactsLists?.name
});

const rules: Record<string, Rule[]> = {
  name: [{ required: true, trigger: ["blur"] }],
  role: [{ required: true, trigger: ["blur"] }],
  phone: [
    { required: true, trigger: ["blur"] },
    { pattern: usPhoneRegex, message: t("wrong_format"), trigger: ["blur"] }
  ],
  email: [{ required: true, pattern: emailRegex, message: t("wrong_format"), trigger: ["blur"] }]
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
  emits("removeItem", props.itemId.toString());
};

// 校验
const formRef = ref();
const formValidate = async () => {
  try {
    await formRef.value.validate();
    emits("handleOutPut", props.itemId.toString(), formData.value, true);
    itemStatus.value = true;
  } catch (err) {
    emits("handleOutPut", props.itemId.toString(), formData.value, false);
  }
  return itemStatus.value;
};

defineExpose({
  itemStatus,
  formValidate
});

watch(
  () => formData.value,
  () => {
    formValidate();
  },
  { deep: true }
);

onMounted(() => {
  formValidate();
});
</script>

<style scoped lang="less">
.contacts-form {
  background-color: var(--color-background-content);
  padding: var(--font-size-base);
  border-radius: var(--box-border-radius-base);

  .contacts-form-action {
    justify-content: space-between;
    align-items: center;
  }
}
</style>
