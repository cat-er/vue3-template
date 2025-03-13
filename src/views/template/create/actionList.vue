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
        <!-- <span>
          <StopOutlined v-if="item.status === ValidateFormStatus.ERROR" class="color-red" />
          <CheckOutlined
            v-else-if="item.status === ValidateFormStatus.SUCCESS"
            class="color-green"
          />
        </span> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { t } from "@/locale";
import { WorkOrderTemlateListKey, ActionListTemlateType } from "./types";
import { useWorkOrderaTemplateCreateStore } from "@/stores";

const { setCurrentChooseForm } = useWorkOrderaTemplateCreateStore();

const actionList = ref<ActionListTemlateType[]>([
  {
    label: t("overview"),
    key: WorkOrderTemlateListKey.OVERVIEW
    // status: formStatusList.value[WorkOrderTemlateListKey.OVERVIEW]
  },
  {
    label: t("service_description"),
    key: WorkOrderTemlateListKey.SERVICE_DESCRIPTION
    // status: formStatusList.value[WorkOrderTemlateListKey.SERVICE_DESCRIPTION]
  },
  {
    label: t("work_categories"),
    key: WorkOrderTemlateListKey.WORK_CATEGORIES
    // status: formStatusList.value[WorkOrderTemlateListKey.WORK_CATEGORIES]
  },
  {
    label: t("qualification"),
    key: WorkOrderTemlateListKey.QUALIFICATION
    // status: formStatusList.value[WorkOrderTemlateListKey.QUALIFICATION]
  },
  // {
  //   label: t("location"),
  //   key: WorkOrderTemlateListKey.LOCATION
  //   // status: formStatusList.value[WorkOrderTemlateListKey.LOCATION]
  // },
  {
    label: t("schedule"),
    key: WorkOrderTemlateListKey.SCHEDULE
    // status: formStatusList.value[WorkOrderTemlateListKey.SCHEDULE]
  },
  {
    label: t("contacts"),
    key: WorkOrderTemlateListKey.CONTACTS
    // status: formStatusList.value[WorkOrderTemlateListKey.CONTACTS]
  },
  {
    label: t("client_documents"),
    key: WorkOrderTemlateListKey.CLIENT_DOCUMENTS
    // status: formStatusList.value[WorkOrderTemlateListKey.CLIENT_DOCUMENTS]
  },
  {
    label: t("tasks"),
    key: WorkOrderTemlateListKey.TASKS
    // status: formStatusList.value[WorkOrderTemlateListKey.TASKS]
  },
  {
    label: t("pay"),
    key: WorkOrderTemlateListKey.PAY
    // status: formStatusList.value[WorkOrderTemlateListKey.PAY]
  }
]);

// watch(
//   () => formStatusList.value,
//   () => {
//     actionList.value.forEach((item, index) => {
//       item.status = formStatusList.value[index];
//     });
//   },
//   { deep: true }
// );

// 当前选择列表项
const currentItemKey = ref<number>();

const chooseItem = (key: WorkOrderTemlateListKey) => {
  currentItemKey.value = key;
  setCurrentChooseForm(key);
};
</script>

<style scoped></style>
