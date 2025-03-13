<template>
  <a-button class="button-color" ghost @click="batchSubmit()">
    <SendOutlined />
    {{ t("export") }}
  </a-button>
</template>
<script setup lang="ts">
import { t } from "@/locale/index.js";
import { SendOutlined } from "@ant-design/icons-vue";
import { GetWorkOrderListReqTypeEnum } from "@/api/api/workOrder/types";
import { useTableRowSelectionDataStore, useWorkFlightBoardStore } from "@/stores";
import { storeToRefs } from "pinia";
import "@/assets/style/views/work/batchOperate.less";

import * as XLSX from "xlsx";
import dayjs from "dayjs";
import timeFormat from "@/utils/timeFormat";
import { notifyError } from "@/utils/notify";

// workOrderList是列表数据
const { workOrderList } = storeToRefs(useWorkFlightBoardStore());

const { rowSelectionData } = storeToRefs(useTableRowSelectionDataStore());
interface Props {
  type: GetWorkOrderListReqTypeEnum;
}

const props = defineProps<Props>();

const batchSubmit = () => {
  // console.log("rowSelectionData:", rowSelectionData.value);
  // console.log("workOrderList:", workOrderList.value);
  let length = rowSelectionData.value.length;
  if (length < 1) {
    return notifyError("Please select the data you want to export!");
  }
  //先检查是否有提交内容
  exportData();
};

// 数据导出
const exportData = () => {
  let data = getDataFormat();
  // 将数据转换为工作表
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // 创建工作簿并添加工作表
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 生成Excel文件并导出
  const now = new Date();
  let filename = "svcon" + dayjs(now).format("YY-MM-DD HH_mm_ss");
  XLSX.writeFile(workbook, filename + ".xlsx");
};
const getDataFormat = () => {
  let type = props.type;
  let colu = getDataColumns(type);
  const dataList = [];
  dataList.push(colu);
  for (const item of workOrderList.value) {
    const isTrue = rowSelectionData.value.includes(item.id);
    if (!isTrue) {
      // console.log("id:", item.id);
      continue;
    }
    const temp = [];
    let address1 = "";
    let providers = "";
    address1 = item.location_info
      ? `${item.location_info.address1} ${item.location_info.address2 ? item.location_info.address2 : ""} ${item.location_info.city}, ${item.location_info.state} ${item.location_info.zip}`
      : "";
    providers = item.providers_info ? item.providers_info.full_name : "";
    let check_in_local = item.check_in_local
      ? timeFormat(item.check_in_local) + ` (${item.time_zone_info.short})`
      : "";
    let check_out_local = item.check_out_local
      ? timeFormat(item.check_out_local) + ` (${item.time_zone_info.short})`
      : "";

    switch (type) {
      case GetWorkOrderListReqTypeEnum.IN_FLIGHT:
        temp.push(
          item.id,
          item.title,
          address1,
          providers,
          statusInfo(item.status, item.status_display),
          getPrices(item.pay),
          getScheduleInfo(item.schedule_info, item.time_zone_info),
          item.messages_count + " msgs",
          `Tasks ${item.completed_tasks}/${item.total_tasks}`,
          check_in_local,
          check_out_local
        );
        break;

      case GetWorkOrderListReqTypeEnum.DRAFT:
        temp.push(
          item.id,
          item.title,
          address1,
          getPrices(item.pay),
          getScheduleInfo(item.schedule_info, item.time_zone_info)
        );
        break;

      case GetWorkOrderListReqTypeEnum.PUBLISHED_ROUTED:
        temp.push(
          item.id,
          item.title,
          formatRequests(item.requests, item.provider_counter, item.routes),
          item.messages_count + " msgs",
          address1,
          getPrices(item.pay),
          getScheduleInfo(item.schedule_info, item.time_zone_info),
          statusInfo(item.status, item.status_display)
        );
        break;

      case GetWorkOrderListReqTypeEnum.ASSIGNED:
        temp.push(
          item.id,
          item.title,
          address1,
          providers,
          statusInfo(item.status, item.status_display),
          getPrices(item.pay),
          getScheduleInfo(item.schedule_info, item.time_zone_info),
          item.messages_count + " msgs",
          `Tasks ${item.completed_tasks}/${item.total_tasks}`,
          check_in_local,
          check_out_local
        );
        break;

      case GetWorkOrderListReqTypeEnum.DONE:
        temp.push(
          item.id,
          `${item.approve_days} days`,
          item.title,
          address1,
          providers,
          getPrices(item.pay),
          getScheduleInfo(item.schedule_info, item.time_zone_info),
          item.hours_logged,
          item.messages_count + " msgs"
        );
        break;

      case GetWorkOrderListReqTypeEnum.APPROVED:
        temp.push(
          item.id,
          item.title,
          address1,
          providers,
          getPrices(item.pay),
          getScheduleInfo(item.schedule_info, item.time_zone_info),
          statusInfo(item.status, item.status_display)
        );
        break;

      default: // GetWorkOrderListReqTypeEnum.ALL
        temp.push(
          item.id,
          item.title,
          address1,
          getPrices(item.pay),
          getScheduleInfo(item.schedule_info, item.time_zone_info),
          statusInfo(item.status, item.status_display),
          item.messages_count + " msgs"
        );
        break;
    }
    dataList.push(temp);
  }
  return dataList;
};

const formatRequests = (requests, provider_counter, routes) => {
  let data = [];
  if (requests === 1) data.push(`${requests} Request`);
  if (requests > 1) data.push(`${requests} Requests`);
  if (provider_counter === 1) data.push(`${provider_counter} Counter`);
  if (provider_counter > 1) data.push(`${provider_counter} Counters`);
  if (routes === 1) data.push(`${routes} Route`);
  if (routes > 1) data.push(`${routes} Routes`);
  return data.join(", ");
};
const getScheduleInfo = (schedule, time_zone_info) => {
  let info = "";
  let time_zone_short = time_zone_info && time_zone_info.short ? time_zone_info.short : "";
  if (schedule.mode === "exact") {
    info = formatTime(schedule.start_local) + " (" + time_zone_short + ") Hard Start";
  } else if (schedule.mode === "hours") {
    info = showHours(schedule) + " (" + time_zone_short + ")";
  } else if (schedule.mode === "between") {
    info =
      formatTime(schedule.start_local) +
      " → " +
      formatTime(schedule.end_local) +
      `(${time_zone_short})`;
  }

  return info;
};
const showHours = (schedule) => {
  let start_local = dayjs(schedule.start_local);
  let end_local = dayjs(schedule.end_local);
  let start_local_date = start_local.format("M/D/YYYY");
  let start_local_time = start_local.format("h:mm A");
  let end_local_date = end_local.format("M/D/YYYY");
  let end_local_time = end_local.format("h:mm A");
  return `${start_local_date} → ${end_local_date}" + "During: ${start_local_time} → ${end_local_time}`;
};
const formatTime = (dateString: string) => {
  let date = dayjs(dateString);
  return date.format("M/D/YYYY") + " at " + date.format("h:mm A");
};
const getPrices = (pay) => {
  let prices = pay.type;
  let amount = parseFloat(pay.base.amount?.toString()).toFixed(2);
  amount = "$" + amount;
  if (pay.type === "fixed") {
    prices += " " + amount;
  } else if (pay.type === "hourly") {
    prices += " " + pay.base.units + ` hourly @ ${amount}/hr`;
  } else if (pay.type === "device") {
    prices += " " + pay.base.units + ` devices @ ${amount}/unit`;
  } else if (pay.type === "blended") {
    prices +=
      " " +
      pay.base.units +
      `hours @ ${amount} and then up to ${pay.additional.units} hours @ ${amount}/hr`;
  }
  return prices;
};
const statusInfo = (status, status_display) => {
  if (status_display === "Assigned: At risk" || (status === 3 && status_display !== "Assigned")) {
    return status_display;
  }

  switch (status) {
    case 1:
      return "Draft";
    case 2:
      return "Published";
    case 9:
      return "Routed";
    case 7:
      return "Cancelled";
    case 3:
      return "Assigned";
    case 4:
      return "Work Done";
    case 5:
      return "Approved";
    case 6:
      return "Paid";
    default:
      return "Other";
  }
};
const getDataColumns = (type) => {
  switch (type) {
    case GetWorkOrderListReqTypeEnum.IN_FLIGHT:
      return [
        "ID",
        t("title"),
        t("location"),
        t("provider"),
        t("status"),
        t("pay"),
        t("schedule"),
        t("messages"),
        t("progress"),
        t("check_in"),
        t("check_out")
      ];

    case GetWorkOrderListReqTypeEnum.DRAFT:
      return ["ID", t("title"), t("location"), t("pay"), t("schedule")];

    case GetWorkOrderListReqTypeEnum.PUBLISHED_ROUTED:
      return [
        "ID",
        t("title"),
        t("requests"),
        t("messages"),
        t("location"),
        t("pay"),
        t("schedule"),
        t("status")
      ];

    case GetWorkOrderListReqTypeEnum.ASSIGNED:
      return [
        "ID",
        t("title"),
        t("location"),
        t("provider"),
        t("status"),
        t("pay"),
        t("schedule"),
        t("messages"),
        t("progress"),
        t("check_in"),
        t("check_out")
      ];

    case GetWorkOrderListReqTypeEnum.DONE:
      return [
        "ID",
        t("time_to_approve"),
        t("title"),
        t("location"),
        t("provider"),
        t("pay"),
        t("schedule"),
        t("hours_logged"),
        t("messages")
      ];

    case GetWorkOrderListReqTypeEnum.APPROVED:
      return ["ID", t("title"), t("location"), t("provider"), t("pay"), t("schedule"), t("status")];

    default: // GetWorkOrderListReqTypeEnum.ALL
      return ["ID", t("title"), t("location"), t("pay"), t("schedule"), t("status"), t("messages")];
  }
};
</script>
