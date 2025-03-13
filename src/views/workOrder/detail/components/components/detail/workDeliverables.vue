<template>
  <a-spin :spinning="isLoading">
    <a-card class="detail-card">
      <template #title>
        <span class="work-card-title">{{ t('deliverables') }}</span>
      </template>
      <div class="work-deliverables flex-column">
        <a-collapse v-model:activeKey="currentKey" :expand-icon-position="expandIconPosition">
          <a-collapse-panel v-for="item in fNWorkOrderFileList" :key="item.id">
            <template #header>{{ item.name }} ({{ item.file_count }})</template>
            <div v-for="_item in item.results" class="deliverables-item">
              <div class="action-box item">
                <div class="item-name flex">
                  <a
                    class="name"
                    v-if="isView(_item.file.mime)"
                    @click="preview(_item.file.link)"
                  >
                    {{ _item.file.name }}
                  </a>
                  <span v-else>
                    {{ _item.file.name }}
                  </span>
                  <span class="font-color-minor margin-left-8">({{ _item.file.size }} KB)</span>
                </div>
                <div class="item-action margin-top-8">
                  <deliverablesAction :fileItem="_item" @actionDone="actionDone" />
                </div>
                <div class="item-file flex margin-top-8">
                  <div class="preview margin-right-8">
                    <FileTextOutlined />
                  </div>
                  <div class="info flex-column">
                    <span>
                      {{ timeFormat(_item.created.local.date + " " + _item.created.local.time) }}
                    </span>
                    <em>{{ itemStatus(_item) }}</em>
                  </div>
                </div>
                <div v-if="_item.notes">{{ t("note") }}: {{ _item.notes }}</div>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </a-card>
  </a-spin>

  <imgPreview :url="previewLink" ref="imgPreviewRef"></imgPreview>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { t } from "@/locale";
import { useWorkOrderDetailStore } from "@/stores";
import { storeToRefs } from "pinia";
import { getFNWorkOrderFileList } from "@/api/api/workOrder/index";
import {
  GetFNWorkOrderFileListRes,
  DeliverablesFileStatusEnum,
  FNWorkOrderFileListResult
} from "@/api/api/workOrder/types";
import type { CollapseProps } from "ant-design-vue";
import deliverablesAction from "./deliverablesAction.vue";
import imgPreview from "@/components/imgPreview/imgPreview.vue";
import { FileTextOutlined } from "@ant-design/icons-vue";
import timeFormat from "@/utils/timeFormat";

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());

// 获取工单Deliverables信息
const fNWorkOrderFileList = ref<GetFNWorkOrderFileListRes[]>();

const isLoading = ref<boolean>(false);
const getFNWorkOrderFileListAsync = async () => {
  if (!workOrderDetail.value?.id) return;
  try {
    isLoading.value = true;
    const res = await getFNWorkOrderFileList({ order_id: String(workOrderDetail.value?.id) });
    if (res) {
      fNWorkOrderFileList.value = res;
      openAllCollapse();
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// 面板状态
const expandIconPosition = ref<CollapseProps["expandIconPosition"]>("end");
const currentKey = ref<number[]>([]);

// 初始打开所有面板
const openAllCollapse = () => {
  fNWorkOrderFileList.value?.forEach((item) => {
    currentKey.value.push(item.id);
  });
};

// 预览图片
const imgPreviewRef = ref();
const previewLink = ref<string>("");
const preview = (url: string) => {
  previewLink.value = url;
  imgPreviewRef.value.show();
};

// status
const itemStatus = (item: FNWorkOrderFileListResult) => {
  if (item.status === DeliverablesFileStatusEnum.PENDING) {
    return t("pending_review");
  } else if (item.status === DeliverablesFileStatusEnum.APPROVED) {
    const { reviewed } = item;
    return `${t("approved")} ${t("on")} ${reviewed.local.date} ${t("at")} ${reviewed.local.time}`;
  } else {
    const { status_description } = item;
    return `${t("denied")}: ${status_description}`;
  }
};

// 更新状态
const actionDone = () => {
  getFNWorkOrderFileListAsync();
};

// 是否能预览
const isView = (mime: string) => {
  let imageMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/tiff",
    "image/svg+xml",
    "image/x-icon"
  ];
  return imageMimeTypes.includes(mime);
};

watch(
  () => workOrderDetail.value?.id,
  () => {
    getFNWorkOrderFileListAsync();
  }
);

onMounted(() => {
  getFNWorkOrderFileListAsync();
});
</script>
