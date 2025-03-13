<template>
  <div class="flex-column action-box-white box-shadow order-detail-title-bar">
    <div class="flex order-detail-title">
      <div class="info flex">
        <div class="info-status flex">
          <div class="flex-column info-time">
            <div class="margin-bottom-8 width-100">
              <a-tag :color="tagColor" class="tag margin-right-16">
                {{ workOrderDetail?.status_name }}
              </a-tag>
              <b class="font-size-20">#{{ workOrderDetail?.id }}</b>
            </div>
            <div>
              <span class="date">
                On {{ timeFormat(workOrderDetail?.created_local as string) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="title">
        <div>
          <a-row>
            <a-col :span="24" class="margin-bottom-16">
              <a-button
                shape="circle"
                @click="editOverview"
                class="right-top"
                v-if="editOVItemRefIsshow"
              >
                <EditOutlined></EditOutlined>
              </a-button>
              <h2 class="detail-title word-wrap">
                {{ workOrderDetail?.title }}
              </h2>
            </a-col>
            <a-col :span="24">
              <a-row>
                <a-col :span="5">
                  <stop-outlined style="color: red" v-if="!workOrderDetail?.printable" />
                  <check-outlined style="color: green" v-else />
                  Allow export button
                </a-col>
                <a-col :span="5">
                  <stop-outlined style="color: red" v-if="!workOrderDetail?.allow_counter_offers" />
                  <check-outlined style="color: green" v-else />
                  Allow counter offers
                </a-col>
                <a-col>
                  <stop-outlined style="color: red" v-if="!workOrderDetail?.require_gps" />
                  <check-outlined style="color: green" v-else />
                  Require GPS during check in and check out
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
    <div class="flex order-detail-info full">
      <div class="info-item flex-colum">
        <div class="flex">
          <div class="item-icon">
            <PieChartOutlined v-if="workStatus == 1" />
            <InfoCircleOutlined v-else-if="workStatus == 3" />
            <dashboard-outlined v-else-if="workStatus == 4" />
            <clock-circle-outlined v-else />
          </div>
          <div class="margin-left-8 flex-colum">
            <b class="margin-bottom-8">{{ timeStatusText(workStatus) }}</b>
            <div class="msg-data">
              <div
                class="margin-bottom-8"
                v-if="
                  workOrderDetail?.status == 3 ||
                  workOrderDetail?.status == 4 ||
                  workOrderDetail?.status == 5 ||
                  workOrderDetail?.status == 6
                "
              >
                {{ detailText.unitText }}
                <template v-if="detailText.isHour">
                  <a-anchor-link
                    href="#word-detail-time-log"
                    :title="detailText.unit"
                    style="float: right; clear: both"
                  ></a-anchor-link>
                </template>
                <template v-else>
                  {{ detailText.unit }}
                </template>
              </div>
              <div class="margin-bottom-8" v-if="detailTextLow">
                {{
                  workOrderDetail?.schedule_info.set_start_time_local
                    ? formatTime(workOrderDetail?.schedule_info.set_start_time_local)
                    : formatTime(workOrderDetail?.schedule_info.start_local)
                }}({{ zone }})
              </div>
              <div class="margin-bottom-8" v-if="workOrderDetail?.status == 3">
                Estimated Duration:
                {{ workOrderDetail?.schedule_info?.hour_estimate }}
                {{ t("hours") }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-item">
        <div class="flex">
          <div class="item-icon">
            <dollar-two-tone v-if="workStatus > 3 && workStatus < 7" />
            <environment-outlined v-else />
          </div>
          <div class="margin-left-8 flex-colum">
            <b class="margin-bottom-8">
              {{ locationText.title }}
            </b>
            <div class="msg-data">
              <a :href="detailText.href" target="_blank" v-if="detailTextLow">
                <div class="margin-bottom-8">
                  {{ detailText.address }}
                </div>
                <div class="margin-bottom-8">
                  {{ detailText.city }}
                </div>
              </a>
              <span v-else>$ {{ formatedPriceString(locationText.total) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="info-item">
        <div class="flex">
          <div class="item-icon">
            <a-avatar
              v-if="providerTextLow"
              style="color: #1890ff; background-color: #ffffff; border-color: #1890ff"
            >
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
            <a-avatar v-else-if="providerText.thumbnail_url" :src="providerText.thumbnail_url">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
            <a-avatar v-else>
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </div>
          <div class="margin-left-8 flex-colum">
            <b class="margin-bottom-8">{{ providerText.title }}</b>
            <div class="msg-data">
              <template v-if="providerTextLow">
                <div class="margin-bottom-8">
                  {{ providerText.description }}
                </div>
              </template>
              <template v-else>
                <div class="margin-bottom-8">
                  <a-space :size="20">
                    <span>{{ providerText.name }}</span>
                    <span>ID: {{ providerText.id }}</span>
                  </a-space>
                </div>
                <div class="margin-bottom-8">
                  <span>
                    {{ phoneFormat(providerText.phone ? providerText.phone : "") }}
                  </span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <editOverviewItem ref="editOVItemRef" @reloadPage="reloadPage"></editOverviewItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import {
  UserOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  CheckOutlined,
  StopOutlined,
  EnvironmentOutlined,
  PieChartOutlined,
  DollarTwoTone,
  EditOutlined
} from "@ant-design/icons-vue";
import { type GetFnWorkOrderPayRes, WorkOrderDetailStatusEnum } from "@/api/api/workOrder/types";
import { storeToRefs } from "pinia";
import { useFnWorkOrderPayStore, useWorkOrderDetailStore } from "@/stores";
import { formatTime, getFnWorkOrderPay } from "@/api/api/workOrder";
import { t } from "@/locale";
import { formatedPriceString } from "@/api/api/amount";
import timeFormat from "@/utils/timeFormat";
import phoneFormat from "@/utils/phoneFormat";
import Template from "@/router/routes/modules/template";
import editOverviewItem from "@/views/workOrder/detail/components/components/components/editOverview.vue";

const editOVItemRefIsshow = ref(false);
const detailText = ref<{
  unitText: string;
  unit: string;
  isHour: boolean;
  address: string | undefined;
  city: string | undefined;
  href: string | undefined;
}>({
  unitText: "",
  unit: "",
  isHour: true,
  address: "",
  city: "",
  href: ""
});
const providerText = ref<{
  title: string | undefined;
  description: string | undefined;
  name: string | undefined;
  id: number | null;
  phone: string | undefined;
  thumbnail_url: string | undefined;
}>({
  title: "",
  description: "",
  name: "",
  id: 0,
  phone: "",
  thumbnail_url: ""
});
const locationText = ref<{
  title: string | undefined;
  total: string | undefined;
}>({
  title: "",
  total: "0.00"
});

const providerTextLow = computed(() => {
  return (
    workOrderDetail.value?.status <= 2 ||
    workOrderDetail.value?.status == 7 ||
    workOrderDetail.value?.status == 9
  );
});
const detailTextLow = computed(() => {
  return (
    workOrderDetail.value?.status <= 3 ||
    workOrderDetail.value?.status == 7 ||
    workOrderDetail.value?.status == 9
  );
});
const payList = ref<GetFnWorkOrderPayRes>([] as any);

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());
const { setWorkOrderDetail } = useWorkOrderDetailStore();

const { setFnWorkOrderPay } = useFnWorkOrderPayStore();

const workStatus = computed(() => {
  return Number(workOrderDetail.value?.status);
});
const zone = ref<string>("");

const timeStatusText = (status) => {
  const text = ref<string>("");
  if (status == 1 || status == 2 || status == 7 || status == 9) {
    text.value = "Schedule: Hard Start";
  } else if (status == 3) {
    text.value = "Status: Start Time Set";
    if (workOrderDetail.value?.status_display !== "") {
      text.value = "Status: " + workOrderDetail.value?.status_display;
      if (workOrderDetail.value?.status_display === "No Start Time Set") {
        text.value = "Schedule: " + workOrderDetail.value?.status_display;
      }
    }
  } else {
    if (workOrderDetail.value?.pay.type === "device") {
      text.value = "Devices logged";
    } else {
      text.value = "Time Logged";
    }
  }

  return text.value;
};
const unitText = (status) => {
  if (!detailText.value.isHour) {
    detailText.value.unitText = "Devices Logged: ";
    detailText.value.unit = t("units");
    detailText.value.unit =
      (workOrderDetail.value?.time_logs && workOrderDetail.value?.time_logs.devices
        ? workOrderDetail.value?.time_logs.devices
        : 0) +
      " " +
      t("units");
  } else {
    detailText.value.unitText = "Time Logged: ";
    detailText.value.unit =
      (workOrderDetail.value?.time_logs && workOrderDetail.value?.time_logs.hours
        ? workOrderDetail.value?.time_logs.hours
        : 0) +
      " " +
      t("hours");
  }
  if (status == 4 || status == 5 || status == 6) {
    detailText.value.unitText = "";
  }
};

const getWorkOrderPay = async () => {
  if (!workOrderDetail.value?.id) return;
  try {
    payList.value = await getFnWorkOrderPay({ order_id: Number(workOrderDetail.value?.id) });
    detailText.value.isHour = !(payList.value.type && payList.value.type == "device");
    locationText.value.total = payList.value.total.toString();
    unitText(workStatus.value);
    setFnWorkOrderPay(payList.value);
  } catch (e) {
    console.log("error:", e);
  }
};
const workDataDo = () => {
  //地址赋值
  const address1 = ref<string | undefined>(workOrderDetail.value?.location_info.address1);
  const address2 = ref<string | undefined>(workOrderDetail.value?.location_info.address2);
  detailText.value.address = address2.value
    ? address1.value + "," + address2.value
    : address1.value;

  const city = ref<string | undefined>(workOrderDetail.value?.location_info.city);
  const state = ref<string | undefined>(workOrderDetail.value?.location_info.state);
  const zip = ref<string | undefined>(workOrderDetail.value?.location_info.zip);
  const country = ref<string | undefined>(workOrderDetail.value?.location_info.country);
  detailText.value.city = city.value + ", " + state.value + " " + zip.value + " " + country.value;

  const longitude = ref<string | undefined>(workOrderDetail.value?.location_info.longitude);
  const latitude = ref<string | undefined>(workOrderDetail.value?.location_info.latitude);
  const href = ref<string | undefined>(workOrderDetail.value?.location_info.map_href);
  detailText.value.href = href.value
    ? href.value
    : "https://www.google.com/maps/search/" +
      detailText.value.address +
      "" +
      detailText.value.city +
      "/@" +
      latitude.value +
      "," +
      longitude.value;

  //工程师相关
  if (workStatus.value <= 2 || workStatus.value == 7 || workStatus.value == 9) {
    providerText.value.title = "Provider: Unassigned";
    providerText.value.description = "No Requests";
    if (workStatus.value == 2 || workStatus.value == 9) {
      providerText.value.description = computedProviderText();
    }
  } else {
    providerText.value.description = "";
    const proInfo = ref<any>(workOrderDetail.value?.providers_info);
    providerText.value.phone = proInfo.value?.phone_number;
    providerText.value.name = proInfo.value?.full_name;
    providerText.value.thumbnail_url = proInfo.value?.thumbnail_url;
    providerText.value.id = proInfo.value?.provider_id;
    providerText.value.title =
      "Provider: " + (providerText.value.name ? providerText.value.name : "");
  }

  //地址相关

  locationText.value.title =
    t("location") +
    ": " +
    (workOrderDetail.value?.location_info.display_name
      ? workOrderDetail.value?.location_info.display_name
      : "");

  if (workStatus.value == 4) {
    locationText.value.title = t("pay") + ": " + t("estimated_total");
  } else if (workStatus.value >= 5 && workStatus.value <= 6) {
    locationText.value.title = t("pay") + ": " + t("paid");
  }

  zone.value = workOrderDetail.value?.time_zone_info?.short
    ? workOrderDetail.value.time_zone_info.short
    : "";

  //判断是否显示
  editOVItemRefIsshow.value =
    !!workOrderDetail.value?.id &&
    workStatus.value != 5 &&
    workStatus.value != 6 &&
    workStatus.value != 7;
};
const computedProviderText = () => {
  let text = "No Requests";
  let provider_counter = workOrderDetail.value?.provider_counter;
  let requests = workOrderDetail.value?.requests;
  let routes = workOrderDetail.value?.routes;

  if (provider_counter > 0 || requests > 0 || routes > 0) {
    text = "";
    if (provider_counter > 0) {
      text = provider_counter + (provider_counter == 1 ? " Counter" : " Counters");
    }
    if (requests > 0) {
      if (text !== "") {
        text += ", ";
      }
      text += requests + (requests == 1 ? " Request" : " Requests");
    }
    if (routes > 0) {
      if (text !== "") {
        text += ", ";
      }
      text += routes + (routes == 1 ? " Route" : " Routes");
    }
  }
  return text;
};
// tag颜色
const blue = [
  WorkOrderDetailStatusEnum.PUBLISHED,
  WorkOrderDetailStatusEnum.ASSIGNED,
  WorkOrderDetailStatusEnum.WORK_DONE,
  WorkOrderDetailStatusEnum.APPROVED
];
const tagColor = computed(() => {
  if (!workOrderDetail.value) return "";
  const isBlue = blue.includes(Number(workOrderDetail.value?.status));
  if (isBlue) return "blue";
  if (workOrderDetail.value?.status == 6) return "green";
  return "";
});

const editOVItemRef = ref();
const editOverview = () => {
  editOVItemRef.value.show(workOrderDetail.value);
};
// 重新更新订单信息
const reloadPage = () => {
  setWorkOrderDetail(Number(workOrderDetail.value?.id));
  workDataDo();
};
watch(
  () => workOrderDetail.value?.id,
  () => {
    getWorkOrderPay();
    // 工单相关的赋值处理
    workDataDo();
  }
);
onMounted(() => {
  getWorkOrderPay();
  workDataDo();
});
</script>

<style lang="less" scoped>
.order-detail-title-bar {
  .width-100 {
    width: 100%;
  }

  .tag {
    padding-right: 20px;
    padding-left: 20px;
    border-radius: 10px;
  }
  .line-height-25 {
    line-height: 25px;
  }
  .right-top {
    float: right;
    clear: both;
  }
}
</style>
