<template>
  <a-card :title="t('contacts')" class="contacts box-shadow">
    <contactsItem
      v-for="(item, index) in contactsItemList"
      :key="item.id"
      :itemId="item.id"
      :echoData="templateEchoData ? templateEchoData[index] : undefined"
      @removeItem="handleRemoveItem"
      @handleOutPut="handleOutPut"
    />
    <a-button type="primary" :icon="h(PlusOutlined)" class="margin-top-8" @click="handleAdd">
      {{ t("add_contact") }}
    </a-button>
  </a-card>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { ref, h, onMounted, watch } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import contactsItem from "./components/formContacts/contactsItem.vue";
import uuid from "@/utils/uuid";
import { Contact } from "@/api/api/workOrder/types";
import { useOutPutState } from "../hooks";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { useWorkOrderaTemplateCreateStore } from "@/stores";
import { storeToRefs } from "pinia";
import _ from "lodash";

// 组件相关
interface ContactsItem {
  id: string;
}

const contactsItemList = ref<ContactsItem[]>([]);

const handleAdd = () => {
  const newObj: ContactsItem = {
    id: uuid()
  };
  contactsItemList.value.push(newObj);
};

const handleRemoveItem = (id: string) => {
  contactsItemList.value = contactsItemList.value.filter((item) => item.id !== id);
  delOutPutListItem(id);
};

// 数据汇总
interface OutPutList {
  id: string;
  status: boolean;
  data: Contact;
}

const outPutList = ref<OutPutList[]>([]);
const formData = ref<Contact[]>([]);

// 删除
const delOutPutListItem = (id: string) => {
  outPutList.value = outPutList.value.filter((item) => item.id !== id);
  outPut();
};

// 回显
const { currentTemplateData, isCreateTemplate } = storeToRefs(useWorkOrderaTemplateCreateStore());

const templateEchoData = ref();

const templateDataEcho = () => {
  if (isCreateTemplate.value) return;
  contactsItemList.value = [];
  currentTemplateData.value?.contacts.forEach(() => {
    handleAdd();
  });
};

watch(
  () => currentTemplateData.value,
  () => {
    templateDataEcho();
    templateEchoData.value = _.cloneDeep(currentTemplateData.value?.contacts);
  }
);

const outPut = () => {
  formData.value.length = 0;
  outPutList.value.forEach((item) => {
    formData.value.push(item.data);
  });
  useOutPutState(WorkOrderListKey.CONTACTS, {
    contacts: formData.value
  });
};

const handleOutPut = (id: string, value: Contact, status: boolean) => {
  const newObj = {
    id,
    status,
    data: value
  };
  const index = outPutList.value.findIndex((item) => item.id === id);
  if (index === -1) {
    outPutList.value.push(newObj);
  } else {
    outPutList.value[index] = newObj;
  }
  outPut();
};

onMounted(() => {
  outPut();
});
</script>
