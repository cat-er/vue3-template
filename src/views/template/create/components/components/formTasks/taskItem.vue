<template>
  <a-collapse
    class="tasks-item"
    v-model:activeKey="activeKey"
    :expand-icon-position="expandIconPosition"
    :collapsible="taskItemProps.collapsible"
  >
    <a-collapse-panel key="1" :header="taskItemProps.header">
      <template #header>
        <slot name="header"></slot>
      </template>
      <template #extra>
        <div class="action flex full">
          <div v-show="taskItemProps.delIconShow">
            <a-button
              @click="del"
              type="text"
              shape="circle"
              size="small"
              danger
              :icon="h(DeleteOutlined)"
            />
            <a-divider type="vertical" />
          </div>
          <HolderOutlined :rotate="90" class="action-sort" />
        </div>
      </template>

      <!--表单组件-->
      <taskFormSelect :form="taskItemProps" @outPutHandle="outPutHandle"></taskFormSelect>
    </a-collapse-panel>
  </a-collapse>
</template>
<script lang="ts" setup>
import { HolderOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { h, ref, onMounted, watch } from "vue";
import type { CollapseProps } from "ant-design-vue";
import { CollapsibleType } from "ant-design-vue/es/collapse/commonProps";
import taskFormSelect from "./taskFormSelect.vue";
import { FormData } from "./taskFormSelect.vue";
import { TaskGroupIdEnum, TaskTypeIdEnum } from "@/api/api/workOrder/types";

const activeKey = ref([""]);
const expandIconPosition = ref<CollapseProps["expandIconPosition"]>("start");

interface Props {
  taskId: string; //唯一标识符
  header?: string;
  collapsible?: CollapsibleType;
  delIconShow?: boolean | false;
  status?: boolean;
  group_id?: TaskGroupIdEnum;
  type_id?: TaskTypeIdEnum;
  attachment_id?: number;
  label?: string;
  filename?: string;
  link?: string;
}

const { taskItemProps } = defineProps<{ taskItemProps: Props }>();

type Emits = {
  (e: "removeTask", value: string): void;
  (e: "outPutHandle", value: FormData, validateStatus: boolean): void;
};
// 抛出移除事件
const emits = defineEmits<Emits>();
const del = () => {
  emits("removeTask", taskItemProps.taskId);
};

// task自动展开
const autoUnfolding = () => {
  if (taskItemProps.collapsible === "disabled") return;
  activeKey.value = ["1"];
};

const outPutHandle = (value: FormData, validateStatus: boolean) => {
  value.id = taskItemProps.taskId;
  value.group_id = taskItemProps.group_id;
  emits("outPutHandle", value, validateStatus);
};

onMounted(() => {
  autoUnfolding();
});
</script>
