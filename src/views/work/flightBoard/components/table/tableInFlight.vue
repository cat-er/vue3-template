<template>
  <a-table
    class="ant-table-striped"
    :columns="columns"
    :data-source="workOrderList"
    :pagination="false"
    :bordered="true"
    rowKey="id"
    :row-selection="rowSelectionOption"
    :scroll="{ x: 1920 }"
  >
    <template #bodyCell="{ text, column, record }">
      <template v-if="column.dataIndex === 'id'">
        <a @click="toWorkOrdersDetail(text)">{{ text }}</a>
      </template>
      <template v-if="column.dataIndex === 'title'">
        <a @click="toWorkOrdersDetail(record.id)">{{ text }}</a>
      </template>
      <template v-if="column.dataIndex === 'location_info'">
        <div>{{ text.address1 }} {{ text.address2 }}</div>
        <div>{{ text.city }}, {{ text.state }} {{ text.zip }}</div>
      </template>

      <template v-if="column.dataIndex === 'providers_info'">
        <div class="main-view" v-if="text">
          <UserInfo :userInfo="text" />
        </div>
      </template>
      <template v-if="column.dataIndex === 'status'">
        <div class="main-view" v-if="text">
          <StatusInfo
            :status="text"
            :status_display="record.status_display"
            :sub_status="record.sub_status"
          />
        </div>
      </template>
      <template v-if="column.dataIndex === 'pay'">
        <div class="main-view" v-if="text">
          <PayInfo :pay="text" />
        </div>
      </template>
      <template v-if="column.dataIndex === 'schedule_info'">
        <div class="main-view" v-if="text">
          <ScheduleInfo :schedule="text" :time_zone_short="record.time_zone_info.short" />
        </div>
      </template>
      <template v-if="column.dataIndex === 'messages_count'">
        <div>{{ text }} msgs</div>
      </template>
      <template v-if="column.dataIndex === 'progress'">
        <div class="main-view">
          <ProgressInfo
            :completed_tasks="record.completed_tasks"
            :total_tasks="record.total_tasks"
          />
        </div>
      </template>
      <template v-if="column.dataIndex === 'check_in_local'">
        <div class="main-view" v-if="text">
          <ShowTimeInfo :date_str="text" :time_zone_short="record.time_zone_info.short" />
        </div>
      </template>
      <template v-if="column.dataIndex === 'check_out_local'">
        <div class="main-view" v-if="text">
          <ShowTimeInfo :date_str="text" :time_zone_short="record.time_zone_info.short" />
        </div>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { t } from "@/locale";
import { useWorkFlightBoardStore } from "@/stores";
import { storeToRefs } from "pinia";
import type { ColumnsType } from "ant-design-vue/es/table/interface";
import type { TableRowSelection } from "ant-design-vue/es/table/interface.d.ts";
import { useRouter } from "vue-router";
import UserInfo from "../columns/userInfo.vue";
import StatusInfo from "../columns/statusInfo.vue";
import PayInfo from "../columns/payInfo.vue";
import ScheduleInfo from "../columns/scheduleInfo.vue";
import ProgressInfo from "../columns/progressInfo.vue";
import ShowTimeInfo from "../columns/showTimeInfo.vue";

// workOrderList是列表数据
const { workOrderList } = storeToRefs(useWorkFlightBoardStore());

// 单选框类型
type Key = string | number;
const rowSelectionData = ref<Key[]>([]);

// 单选框点击事件
const onSelectChange = (selectedRowKeys: Key[]) => {
  rowSelectionData.value = selectedRowKeys;
  console.log("selectedRowKeys:", selectedRowKeys);
};

// 表格单选框配置项
const rowSelectionOption = computed<TableRowSelection>(() => ({
  selectedRowKeys: rowSelectionData.value,
  onChange: onSelectChange,
  fixed: true
}));

// 点击ID跳转工单详情
const router = useRouter();
const toWorkOrdersDetail = (id: number) => {
  router.push({
    name: "workOrdersDetail",
    query: {
      orderId: id
    }
  });
};

// 表头配置
const columns: ColumnsType = [
  {
    title: "ID",
    dataIndex: "id",
    width: 100,
    align: "center",
    fixed: true
  },
  {
    title: t("title"),
    dataIndex: "title",
    width: 250
  },
  {
    title: t("location"),
    width: 220,
    dataIndex: "location_info"
  },
  {
    title: t("provider"),
    width: 200,
    dataIndex: "providers_info"
  },
  {
    title: t("status"),
    dataIndex: "status",
    align: "center"
  },
  {
    title: t("pay"),
    width: 220,
    dataIndex: "pay"
  },
  {
    title: t("schedule"),
    width: 220,
    dataIndex: "schedule_info"
  },
  {
    title: t("messages"),
    dataIndex: "messages_count"
  },
  {
    title: t("progress"),
    dataIndex: "progress"
  },
  {
    title: t("check_in"),
    dataIndex: "check_in_local"
  },
  {
    title: t("check_out"),
    dataIndex: "check_out_local"
  }
];
const emits = defineEmits(["getRowSelectionData"]);
const getSelectRow = () => {
  console.log("getSelectRow");
  emits("getRowSelectionData", rowSelectionData.value);
};
watch(
  () => rowSelectionData.value?.length,
  () => {
    console.log("rowSelectionData:", rowSelectionData.value);
    getSelectRow();
  }
);
</script>
