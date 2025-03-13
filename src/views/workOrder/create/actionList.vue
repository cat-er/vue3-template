<template>
  <div class="action-list flex">
    <div
      v-for="item in actionList"
      :key="item.key"
      @click="chooseItem(item.key)"
      :data-choose="item.key === currentItemKey"
      class="action-list-item flex pointer"
    >
      <span :data-choose="item.key === currentItemKey" class="choose-space"></span>
      <div class="item-content flex">
        <span class="label">{{ item.label }}</span>
        <span>
          <StopOutlined v-if="item.status === ValidateFormStatus.ERROR" class="color-red" />
          <CheckOutlined
            v-else-if="item.status === ValidateFormStatus.SUCCESS"
            class="color-green"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import { t } from "@/locale";
import { WorkOrderListKey, ActionListType, ValidateFormStatus } from "./types";
import { useWorkOrderCreateStore } from "@/stores";
import { storeToRefs } from "pinia";
import { StopOutlined, CheckOutlined } from "@ant-design/icons-vue";

const workOrderCreateStore = useWorkOrderCreateStore();
const { setCurrentChooseForm } = workOrderCreateStore;
const { formStatusList } = storeToRefs(workOrderCreateStore);

const actionList = ref<ActionListType[]>([
  {
    label: t("overview"),
    key: WorkOrderListKey.OVERVIEW,
    status: formStatusList.value[WorkOrderListKey.OVERVIEW]
  },
  {
    label: t("service_description"),
    key: WorkOrderListKey.SERVICE_DESCRIPTION,
    status: formStatusList.value[WorkOrderListKey.SERVICE_DESCRIPTION]
  },
  {
    label: t("work_categories"),
    key: WorkOrderListKey.WORK_CATEGORIES,
    status: formStatusList.value[WorkOrderListKey.WORK_CATEGORIES]
  },
  {
    label: t("qualification"),
    key: WorkOrderListKey.QUALIFICATION,
    status: formStatusList.value[WorkOrderListKey.QUALIFICATION]
  },
  {
    label: t("location"),
    key: WorkOrderListKey.LOCATION,
    status: formStatusList.value[WorkOrderListKey.LOCATION]
  },
  {
    label: t("schedule"),
    key: WorkOrderListKey.SCHEDULE,
    status: formStatusList.value[WorkOrderListKey.SCHEDULE]
  },
  {
    label: t("contacts"),
    key: WorkOrderListKey.CONTACTS,
    status: formStatusList.value[WorkOrderListKey.CONTACTS]
  },
  {
    label: t("client_documents"),
    key: WorkOrderListKey.CLIENT_DOCUMENTS,
    status: formStatusList.value[WorkOrderListKey.CLIENT_DOCUMENTS]
  },
  {
    label: t("tasks"),
    key: WorkOrderListKey.TASKS,
    status: formStatusList.value[WorkOrderListKey.TASKS]
  },
  {
    label: t("pay"),
    key: WorkOrderListKey.PAY,
    status: formStatusList.value[WorkOrderListKey.PAY]
  }
]);

watch(
  () => formStatusList.value,
  () => {
    actionList.value.forEach((item, index) => {
      item.status = formStatusList.value[index];
    });
  },
  { deep: true }
);

// 当前选择列表项
const currentItemKey = ref<number>();

const chooseItem = (key: WorkOrderListKey) => {
  currentItemKey.value = key;
  setCurrentChooseForm(key);
};

//清除store中的key
onUnmounted(() => {
  setCurrentChooseForm(undefined);
});
</script>
