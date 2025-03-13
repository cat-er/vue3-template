<template>
  <div>
    <a-modal
      :open="open"
      wrap-class-name="edit-work-location"
      :footer="null"
      :closable="false"
      width="700px"
    >
      <a-card
        :title="t('edit_contacts')"
        class="edit-work-location-card contacts width-700 height-100"
      >
        <template #extra><close-outlined @click="onClose" /></template>
        <contactsEditItem
          ref="CEItemRef"
          v-for="item in contactsItemList"
          :key="item.id"
          :itemId="item.id"
          :contactsLists="item"
          @removeItem="handleRemoveItem"
          @handleOutPut="handleOutPut"
        />
        <a type="primary" class="margin-top-8" @click="handleAdd">
          <PlusOutlined></PlusOutlined>
          {{ t("add_contact") }}
        </a>
        <template #actions>
          <a-space>
            <a-button @click="onClose" :disabled="disabled">{{ t("cancel") }}</a-button>
            <a-button type="primary" @click="onSubmit" :loading="loading">
              {{ t("save_contacts") }}
            </a-button>
          </a-space>
        </template>
      </a-card>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { t } from "@/locale";
import { notifyError, notifySuccess } from "@/utils/notify";
import { type batchUpdateContactsReq, type ContactsList } from "@/api/api/workOrder/types";
import { PlusOutlined } from "@ant-design/icons-vue";
import contactsEditItem from "./contactsEditItem.vue";
import { storeToRefs } from "pinia";
import { usePageLoadingStore, useWorkOrderDetailStore } from "@/stores";
import { rand } from "ant-design-vue/es/_util/hooks/_vueuse/is";
import { batchUpdateContacts } from "@/api/api/workOrder";
import { toNumber } from "lodash";
const { setWorkOrderDetail } = useWorkOrderDetailStore();
const { changeLoading } = usePageLoadingStore();

const disabled = ref<boolean>(false);
const loading = ref<boolean>(false);
interface Props {
  open: boolean;
}
const { open } = defineProps<Props>();

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());

const order_id = ref<number | undefined>(workOrderDetail.value?.id);

const emits = defineEmits(["cancels", "reloadContacts"]);

// 选择框
const formStatus = ref<boolean>(true);
const CEItemRef = ref<any>();

const updateStatus = ref<boolean>(false);

const contactsItemList = ref<ContactsList[]>([] as any);
watch(
  () => workOrderDetail.value?.id,
  () => {
    getContactsItemList();
  }
);
watch(
  () => updateStatus.value,
  () => {
    getContactsItemList();
    emits("reloadContacts");
  }
);

const getContactsItemList = () => {
  contactsItemList.value = workOrderDetail.value?.contacts_list as ContactsList[];
  order_id.value = workOrderDetail.value?.id;
};
const handleAdd = () => {
  const newObj: ContactsList = {
    id: rand(100000000, 999999999999),
    order_id: 0,
    role: "",
    name: "",
    email: "",
    phone: "",
    ext: "",
    notes: "",
    created_at: "",
    updated_at: ""
  };
  contactsItemList.value.push(newObj);
};

const handleRemoveItem = (id: string) => {
  // 新增，长度判断，至少保留一个
  if (contactsItemList.value.length <= 1) {
    return notifyError("Must keep one contact person!");
  }
  contactsItemList.value = contactsItemList.value.filter((item) => item.id != id);
  delOutPutListItem(id.toString());
};

// 数据汇总
interface OutPutList {
  id: string;
  status: boolean;
  data: batchUpdateContactsReq;
}

const outPutList = ref<OutPutList[]>([]);
const formData = ref<batchUpdateContactsReq[]>([]);

// 删除
const delOutPutListItem = (id: string) => {
  outPutList.value = outPutList.value.filter((item) => item.id != id);
  outPut();
};

const outPut = () => {
  formData.value.length = 0;
  outPutList.value.forEach((item) => {
    formData.value.push(item.data);
    if (!item.status) formStatus.value = false;
  });
};

const handleOutPut = (id: string, value: batchUpdateContactsReq, status: boolean) => {
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

const onSubmit = async () => {
  // 暂时取消操作描述
  await formValidates();
  if ((formStatus.value && formData.value.length > 0) || formData.value.length == 0) {
    await onFinish();
  }
};
// 数据验证
const formValidates = async () => {
  // formData.value.length = 0;/onsite/fn/batchUpdateContacts/{order_id}
  // console.log("formValidates formData:", formData.value);
  formStatus.value = true;
  for (const item of CEItemRef.value) {
    try {
      let status = await item.formValidate();
      if (!status) {
        formStatus.value = false;
      }
    } catch {
      formStatus.value = false;
    }
  }
};

const onFinish = async () => {
  disabled.value = true;
  loading.value = true;
  // 对新加清理ID
  console.log("onFinish:", order_id.value, formData.value);
  if (formData.value.length > 0) {
    for (const item of formData.value) {
      if (item.isCreate == true) {
        item.id = 0;
      }
    }
    // 过滤多余的值
    // formData.value = formData.value.filter((item) =>item.isCreate != true);
    // formData.value = formData.value.filter((item) =>{
    //     if(item.isCreate != true){
    //       item.id = 0;
    //       item.isCreate = true;
    //     }
    //     console.log('item:',item);
    //     formData.value.push(item);
    //   }
    // );
  }

  try {
    let res = await batchUpdateContacts(order_id.value, formData.value);
    if (res) {
      notifySuccess("Contacts update successfully");
      await reloadData();
      formData.value = [];
      outPutList.value = [];
    }
    // onClose();
  } catch {
    notifyError("Contacts update failure");
  }
  disabled.value = false;
  loading.value = false;
};
// 数据重新渲染
const reloadData = async () => {
  try {
    updateStatus.value = false;
    changeLoading(true);
    await setWorkOrderDetail(toNumber(workOrderDetail.value?.id));
    updateStatus.value = true;
  } catch (error) {
    console.error(error);
  } finally {
    changeLoading(false);
  }
};
const onClose = () => {
  emits("cancels");
};

onMounted(() => {
  outPut();
  getContactsItemList();
});
</script>

<style scoped lang="less"></style>
