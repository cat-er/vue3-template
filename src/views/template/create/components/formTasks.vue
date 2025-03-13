<template>
  <a-card :title="t('tasks')" class="tasks box-shadow">
    <a-button type="primary" :icon="h(PlusOutlined)" @click="addTask" class="add-btn">
      Add Task
    </a-button>
    <!-- 拖拽列表 -->
    <div class="tasks-content flex-column">
      <!--    Prep  -->
      <div class="content-group">
        <div class="group-title flex-column">
          {{ t("prep") }}
          <em v-if="!groupPrepList.length" class="no-tasks">{{ t("no_tasks") }}</em>
        </div>
        <div ref="groupPrepRef" class="group-item">
          <taskItem
            v-for="item in groupPrepList"
            :key="item.taskId"
            :taskItemProps="item"
            @outPutHandle="outPutHandle"
            @removeTask="(taskId) => removeTaskHandler(taskId, TaskGroupIdEnum.PREP)"
          ></taskItem>
        </div>
      </div>
      <!--    On Site  -->
      <div class="content-group">
        <div class="group-title flex-column">
          {{ t("on_site") }}
          <em v-if="!groupOnsiteList.length" class="no-tasks">{{ t("no_tasks") }}</em>
        </div>
        <div ref="groupOnsiteRef" class="group-item">
          <taskItem
            v-for="item in groupOnsiteList"
            :key="item.taskId"
            :taskItemProps="item"
            @outPutHandle="outPutHandle"
            @removeTask="(taskId) => removeTaskHandler(taskId, TaskGroupIdEnum.ONSITE)"
          ></taskItem>
        </div>
      </div>
      <!--    Post  -->
      <div class="content-group">
        <div class="group-title flex-column">
          {{ t("post") }}
          <em v-if="!groupPostList.length" class="no-tasks">{{ t("no_tasks") }}</em>
        </div>
        <div ref="groupPostRef" class="group-item">
          <taskItem
            v-for="item in groupPostList"
            :key="item.taskId"
            :taskItemProps="item"
            @outPutHandle="outPutHandle"
            @removeTask="(taskId) => removeTaskHandler(taskId, TaskGroupIdEnum.POST)"
          ></taskItem>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { h, ref, type Ref, onMounted, watch } from "vue";
import uuid from "@/utils/uuid";
import { TaskGroupIdEnum, TaskTypeIdEnum, GetTemplateDetailsRes } from "@/api/api/workOrder/types";
import taskItem from "./components/formTasks/taskItem.vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { useDraggable } from "vue-draggable-plus";
import { FormData } from "./components/formTasks/taskFormSelect.vue";
import { useOutPutState } from "../hooks";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { CollapsibleType } from "ant-design-vue/es/collapse/commonProps";
import _ from "lodash";
import { storeToRefs } from "pinia";
import { useWorkOrderaTemplateCreateStore } from "@/stores";

interface Group {
  taskId: string;
  status?: boolean;
  group_id?: TaskGroupIdEnum;
  type_id?: TaskTypeIdEnum;
  attachment_id?: number;
  label?: string;
  header?: string;
  collapsible?: CollapsibleType;
  delIconShow?: boolean;
  filename?: string;
  link?: string;
}

// 泛型拖拽函数
const setupDraggable = (
  refElement: Ref<HTMLElement | null>,
  list: Ref<Group[]>,
  groupType: TaskGroupIdEnum
) => {
  useDraggable(refElement, list, {
    animation: 300,
    ghostClass: "ghost",
    group: "people",
    handle: ".action-sort",
    onUpdate: () => {
      format();
    },
    onAdd: () => {
      list.value.forEach((item) => {
        item.group_id = groupType;
      });
      format();
    }
  });
};

// Prep列表
const groupPrepRef = ref<HTMLElement | null>(null);
const groupPrepList = ref<Group[]>([
  {
    taskId: uuid(),
    header: t("set_start_time"),
    collapsible: "disabled",
    delIconShow: false,
    group_id: TaskGroupIdEnum.PREP,
    type_id: TaskTypeIdEnum.SET_ETA,
    label: "Set start time"
  }
]);
setupDraggable(groupPrepRef, groupPrepList, TaskGroupIdEnum.PREP);

// Onsite列表
const groupOnsiteRef = ref<HTMLElement | null>(null);
const groupOnsiteList = ref<Group[]>([
  {
    taskId: uuid(),
    header: t("check_in"),
    collapsible: "disabled",
    delIconShow: false,
    group_id: TaskGroupIdEnum.ONSITE,
    type_id: TaskTypeIdEnum.CHECK_IN,
    label: "Check in"
  },
  {
    taskId: uuid(),
    header: t("check_out"),
    collapsible: "disabled",
    delIconShow: false,
    group_id: TaskGroupIdEnum.ONSITE,
    type_id: TaskTypeIdEnum.CHECK_OUT,
    label: "Check out"
  }
]);
setupDraggable(groupOnsiteRef, groupOnsiteList, TaskGroupIdEnum.ONSITE);

// Post列表
const groupPostRef = ref<HTMLElement | null>(null);
const groupPostList = ref<Group[]>([
  {
    taskId: uuid(),
    header: t("enter_closeout_notes"),
    collapsible: "disabled",
    delIconShow: false,
    group_id: TaskGroupIdEnum.POST,
    type_id: TaskTypeIdEnum.ENTER_CLOSE_OUT_NOTES,
    label: "Enter closeout notes"
  }
]);
setupDraggable(groupPostRef, groupPostList, TaskGroupIdEnum.POST);

// 添加任务
const addTask = () => {
  const newTask: Group = {
    taskId: uuid(),
    group_id: TaskGroupIdEnum.ONSITE,
    header: t("select_a_task"),
    collapsible: "icon",
    delIconShow: true
  };
  groupOnsiteList.value.push(newTask);
};

// 移除任务
const removeTaskHandler = (taskId: string, groupType: TaskGroupIdEnum) => {
  const groupLists = {
    [TaskGroupIdEnum.PREP]: groupPrepList,
    [TaskGroupIdEnum.ONSITE]: groupOnsiteList,
    [TaskGroupIdEnum.POST]: groupPostList
  };
  groupLists[groupType].value = groupLists[groupType].value.filter(
    (item) => item.taskId !== taskId
  );
  delete validateStatusMap.value[taskId];
  format();
};

// 数据汇总

// 校验数据
const validateStatusMap = ref<Record<string, boolean>>({});
const validateStatus = ref<boolean>(true);

const format = (value?: FormData) => {
  const allList: Group[] = [
    ...groupPrepList.value,
    ...groupOnsiteList.value,
    ...groupPostList.value
  ];

  if (value) {
    // 更新铺平后的数组
    allList.forEach((item, index) => {
      if (item.taskId === value.id) {
        allList[index] = { ...item, ...value };
      }
    });
  }
  const formatArr = allList.map((item) => {
    return {
      group_id: item.group_id,
      type_id: item.type_id,
      attachment_id: item.attachment_id,
      label: item.label
    };
  });
  validateStatus.value = Object.values(validateStatusMap.value).every((value) => value === true);
  useOutPutState(WorkOrderListKey.TASKS, {
    tasks: formatArr
  });
};

const outPutHandle = (value: FormData, valiStatus: boolean) => {
  if (!value?.id) return;
  validateStatusMap.value[value?.id] = valiStatus;
  switch (value.group_id) {
    case TaskGroupIdEnum.PREP:
      groupPrepList.value = groupPrepList.value.map((item) =>
        item.taskId === value.id ? { ...item, ...value } : item
      );
      break;

    case TaskGroupIdEnum.ONSITE:
      groupOnsiteList.value = groupOnsiteList.value.map((item) =>
        item.taskId === value.id ? { ...item, ...value } : item
      );

      break;

    case TaskGroupIdEnum.POST:
      groupPostList.value = groupPostList.value.map((item) =>
        item.taskId === value.id ? { ...item, ...value } : item
      );
  }

  format(value);
};

// 数据回显
const temDataEcho = (data: GetTemplateDetailsRes) => {
  const { tasks } = data;
  groupPrepList.value = [];
  groupOnsiteList.value = [];
  groupPostList.value = [];

  const taskSettings = (typeId: TaskTypeIdEnum) => {
    const settings: Partial<
      Record<
        TaskTypeIdEnum,
        { header: string; label: string; collapsible: string; delIconShow: boolean }
      >
    > = {
      [TaskTypeIdEnum.CHECK_IN]: {
        header: t("check_in"),
        label: "Check in",
        collapsible: "disabled",
        delIconShow: false
      },
      [TaskTypeIdEnum.CHECK_OUT]: {
        header: t("check_out"),
        label: "Check out",
        collapsible: "disabled",
        delIconShow: false
      },
      [TaskTypeIdEnum.ENTER_CLOSE_OUT_NOTES]: {
        header: t("enter_closeout_notes"),
        label: "Enter closeout notes",
        collapsible: "disabled",
        delIconShow: false
      },
      [TaskTypeIdEnum.SET_ETA]: {
        header: t("set_start_time"),
        label: "Set start time",
        collapsible: "disabled",
        delIconShow: false
      }
    };

    const defaultSetting = {
      header: t("select_a_task"),
      collapsible: "icon",
      delIconShow: true
    };

    return settings[typeId] || defaultSetting;
  };

  const assignTask = (taskGroupList: Ref<Group[]>, task: Group) => {
    if (!task.type_id) return;
    const settings = taskSettings(task.type_id);
    const _task = { ...task, ...settings, taskId: uuid() };
    taskGroupList.value.push(_task as Group);
  };

  tasks.forEach((item) => {
    const _item = _.cloneDeep(item as Group);
    switch (_item.group_id) {
      case TaskGroupIdEnum.PREP:
        assignTask(groupPrepList, _item);
        break;
      case TaskGroupIdEnum.ONSITE:
        assignTask(groupOnsiteList, _item);
        break;
      case TaskGroupIdEnum.POST:
        assignTask(groupPostList, _item);
        break;
    }
  });
};

// 模板数据回显
const { currentTemplateData } = storeToRefs(useWorkOrderaTemplateCreateStore());
watch(
  () => currentTemplateData.value,
  () => {
    if (!currentTemplateData.value) return;
    validateStatusMap.value = {};
    temDataEcho(currentTemplateData.value);
  }
);

onMounted(() => {
  format();
});
</script>
