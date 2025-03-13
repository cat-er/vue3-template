<template>
  <a-card :title="t('contacts')" class="contacts box-shadow">
    <div v-show="!contactsItemList.length" class="color-red">Add at least one contact</div>
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
import { ref, h, onMounted, computed, watch } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import contactsItem from "./components/formContacts/contactsItem.vue";
import uuid from "@/utils/uuid";
import { Contact } from "@/api/api/workOrder/types";
import { useOutPutState } from "../hooks";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { storeToRefs } from "pinia";
import { useWorkOrderaTemplateCreateStore } from "@/stores";
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

const outPut = () => {
  formData.value = outPutList.value.map((item) => item.data);
  const _status = outPutList.value.every((item) => item.status);

  useOutPutState(outPutList.value.length > 0 ? _status : false, WorkOrderListKey.CONTACTS, {
    contacts: formData.value
  });
};

// 模板数据回显
const { currentTemplateData } = storeToRefs(useWorkOrderaTemplateCreateStore());

const templateEchoData = ref();

const templateDataEcho = () => {
  contactsItemList.value = [];
  currentTemplateData.value?.contacts.forEach((item) => {
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
