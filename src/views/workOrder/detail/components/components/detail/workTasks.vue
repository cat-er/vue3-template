<template>
  <a-card class="detail-card">
    <template #title>
      <span class="work-card-title">{{ t("tasks") }}</span>
    </template>
    <div class="work-tasks flex-column">
      <div v-for="(items, key) in groupedData" :key="key" class="tasks-group flex-column">
        <div>
          {{ groupId[key] }}
        </div>
        <div class="tasks-item margin-top-8">
          <div v-for="item in items" :key="item.id" class="item">
            <div class="flex">
              <div>
                <CheckCircleTwoTone
                  v-if="taskStatus(item.status)"
                  class="icon-size"
                  two-tone-color="#52c41a"
                />
                <div
                  v-else
                  class="icon-size"
                  style="border: 2px solid #b0b4be; border-radius: 50%; height: 20px; width: 20px"
                ></div>
              </div>

              <div class="margin-left-8 flex-column info">
                <b>{{ item.description ? item.description : item.label }}</b>
                <div v-html="handleLineBreak(item.closing_notes)"></div>
                <a
                  v-if="isViewPhoto(item.type_id) && taskStatus(item.status)"
                  @click="viewPhoto(item)"
                >
                  {{ t("view_photo") }}
                </a>
                <a v-if="isDownload(item)" @click="download(item)">{{ t("download_file") }}</a>
                <em class="label">{{ completedTime(item) }}</em>
                <a-tag v-if="checkStatus(item)" class="margin-top-8" color="#ffe7ba">
                  <template #icon>
                    <ExclamationCircleFilled class="color-yellow-deep" />
                  </template>
                  <span class="font-color-base">{{ checkStatus(item) }}</span>
                </a-tag>
                <!-- <div class="margin-top-8">Enter closeout notes</div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/locale";
import { useWorkOrderDetailStore } from "@/stores";
import { ExclamationCircleFilled, CheckCircleTwoTone } from "@ant-design/icons-vue";
import { storeToRefs } from "pinia";
import {
  TasksListStatusEnum,
  TasksList,
  TaskGroupIdEnum,
  TaskTypeIdEnum
} from "@/api/api/workOrder/types";
import dayjs from "dayjs";

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());

// 分组
type GroupedData = {
  [key in TaskGroupIdEnum]?: TasksList[];
};

const groupedData = computed((): GroupedData | undefined => {
  if (!workOrderDetail.value) return;

  return workOrderDetail.value.tasks_list.reduce((acc: GroupedData, item: TasksList) => {
    const groupId = item.group_id as TaskGroupIdEnum;
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId]!.push(item);
    return acc;
  }, {} as GroupedData);
});
const groupId = {
  [TaskGroupIdEnum.PREP]: t("prep"),
  [TaskGroupIdEnum.ONSITE]: t("on_site"),
  [TaskGroupIdEnum.POST]: t("post")
};

// 状态
const taskStatus = (status: TasksListStatusEnum) => {
  return status === TasksListStatusEnum.COMPLETE;
};

// view photo是否展示
const isViewPhoto = (typeId: TaskTypeIdEnum) => {
  return typeId === TaskTypeIdEnum.UPLOAD_OR_TAKE_A_PICTURE;
};

// download是否展示
const isDownload = (item: TasksList) => {
  return item.download_file && item.type_id === TaskTypeIdEnum.DOWNLOAD_FILE;
};

// 时间
const completedTime = (item: TasksList) => {
  let { completed_at_local, full_name } = item;
  if (!completed_at_local || !full_name) return;
  let time_zone_short = timeZone();
  completed_at_local = dayjs(completed_at_local).format("M/D/YYYY [at] h:mm A");
  return `${t("completed_by")} ${full_name} ${t("on")} ${completed_at_local} (${time_zone_short})`;
};

const timeZone = () => {
  if (!workOrderDetail.value) return;
  return workOrderDetail.value.time_zone_info ? workOrderDetail.value.time_zone_info.short : "";
};

// too early or late
const checkStatus = (item: TasksList) => {
  const { completed_at_local, type_id } = item;
  // check in
  if (type_id !== 3) return false;
  const start_local = workOrderDetail.value?.schedule_info.start_local;
  if (!completed_at_local || !start_local) return;
  const timeA = dayjs(completed_at_local, "YYYY-MM-DD HH:mm:ss");
  const timeB = dayjs(start_local, "YYYY-MM-DD HH:mm:ss");
  const minutesDifference = timeA.diff(timeB, "minute");

  if (Number(minutesDifference) < -30) {
    return t("too_early");
  } else if (Number(minutesDifference) > 15) {
    return t("late");
  } else {
    return false;
  }
};

const viewPhoto = (item: TasksList) => {
  window.scroll({
    top: document.documentElement.scrollHeight,
    behavior: "smooth" // 平滑滚动
  });
};

const download = (item: TasksList) => {
  window.open(item.download_file);
};

// 处理换行
const handleLineBreak = (str: string) => {
  return str.replace(/\n/g, "<br/>");
};
</script>
