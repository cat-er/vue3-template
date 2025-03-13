<template>
  <div>
    <a-card class="detail-card">
      <template #title>
        <span class="work-card-title">{{ t("contacts") }}</span>
      </template>
      <template #extra>
        <a-button
          shape="circle"
          @click="editContact"
          v-if="
            workOrderDetail?.status && workOrderDetail?.status >= 1 && workOrderDetail?.status <= 6
          "
        >
          <template #icon>
            <EditOutlined></EditOutlined>
          </template>
        </a-button>
      </template>
      <div v-for="item in contacts" :key="item.id">
        <h3>{{ item.role }}</h3>
        <p>{{ item.name }}</p>
        <p>
          <a :href="'tel:' + item.phone">{{ phoneFormat(item.phone ? item.phone : "") }}</a>
          <br />
          <a :href="'mailto:' + item.email">{{ item.email }}</a>
        </p>
        <a-divider />
      </div>
      <div>
        <editWorkContacts
          :open="open"
          @cancels="cancels"
          @reloadContacts="getContacts"
        ></editWorkContacts>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useWorkOrderDetailStore } from "@/stores";
import { EditOutlined } from "@ant-design/icons-vue";
import type { ContactsList } from "@/api/api/workOrder/types";
import editWorkContacts from "@/views/workOrder/detail/components/components/detail/components/editWorkContacts.vue";
import { t } from "@/locale";
import phoneFormat from "@/utils/phoneFormat";

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());
const contacts = ref<ContactsList[]>([] as any);

const open = ref<boolean>(false);

watch(
  () => workOrderDetail.value?.id,
  () => {
    getContacts();
  }
);

const getContacts = () => {
  if (workOrderDetail.value?.contacts_list) {
    contacts.value = workOrderDetail.value?.contacts_list as ContactsList[];
  }
  cancels();
};

const editContact = () => {
  open.value = true;
};
const cancels = () => {
  open.value = false;
};

const getFNWorkOrderDataAsync = async () => {
  if (!workOrderDetail.value?.id) return;
  try {
    getContacts();
  } catch (error) {
    console.error(error);
  }
};
onMounted(() => {
  getFNWorkOrderDataAsync();
});
</script>

<style scoped></style>
