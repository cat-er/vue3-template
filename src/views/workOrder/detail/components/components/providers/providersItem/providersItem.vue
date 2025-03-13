<template>
  <div
    :data-selected="currentKey === selectKey"
    class="providers-item action-box-white pointer"
    @click="chooseProvider"
  >
    <headMsg v-if="isPending" :item="providerItem" />
    <div v-if="isPending" class="divider"></div>
    <div class="item-foot flex-column">
      <div class="foot-info flex">
        <div class="flex info">
          <a-avatar :size="32" :src="info.thumbnail_url">
            {{ info.head }}
          </a-avatar>
          <b>{{ info.full_name }}</b>

          <!-- 背景检查 -->
          <div>
            <a-tooltip v-if="info.is_background_check" :title="bgCheck" placement="top">
              <a-avatar :size="20" class="avatar-b">
                <template #icon>
                  <SecurityScanOutlined />
                </template>
              </a-avatar>
            </a-tooltip>

            <!-- 药物检查 -->
            <a-tooltip v-if="info.is_drug_test" :title="dtCheck" placement="top">
              <a-avatar :size="20" class="avatar-d avatar">
                <template #icon>
                  <SafetyOutlined />
                </template>
              </a-avatar>
            </a-tooltip>

            <!-- 公司名称 -->
            <a-tooltip v-if="info.is_sc" :title="info.service_company_name" placement="top">
              <a-avatar :size="20" class="avatar-sc avatar">
                <template #icon>
                  <TableOutlined />
                </template>
              </a-avatar>
            </a-tooltip>

            <!-- BIZ -->
            <a-tooltip v-if="info.has_ein" title="Business Provider (EIN)" placement="top">
              <a-avatar :size="20" class="avatar-biz avatar">BIZ</a-avatar>
            </a-tooltip>
          </div>
          <span v-if="phone">
            {{ phoneFormat(phone) }}
          </span>
        </div>
        <div class="flex info-right">
          <rateTag :rate-data="info" />

          <a-button
            class="margin-right-8"
            type="text"
            shape="circle"
            @click="sendMsgHandle"
            v-if="
              currentProviderType && currentProviderType !== GetProviderListTypeEnum.ALL_PROVIDERS
            "
          >
            <template #icon>
              <MailOutlined class="color-blue" />
            </template>
          </a-button>

          <a-button
            v-if="
              currentProviderType !== GetProviderListTypeEnum.PENDING_ASSIGNMENT &&
              currentProviderType
            "
            :loading="btnIsLoading"
            type="primary"
            :disabled="handleMap[currentProviderType].isDisabled"
            @click="handleMap[currentProviderType].handle"
          >
            {{ handleMap[currentProviderType].label }}
          </a-button>
          <div v-else>
            <a-button
              v-if="groupType === 'requests'"
              :loading="btnIsLoading"
              type="primary"
              :disabled="isDisabledBtn"
              @click="assignHandle"
            >
              Assign
            </a-button>
            <a-button
              v-if="groupType === 'counters'"
              :loading="btnIsLoading"
              :disabled="reviewDisabled"
              type="primary"
              @click="reviewHandle"
            >
              Review Offer
            </a-button>
          </div>
        </div>
      </div>
      <rateIcon :provider-item="providerItem" />
    </div>
    <reviewModal
      ref="reviewModalRef"
      :order-id="workOrderDetail?.id"
      :provider-id="props.providerItem.provider_id"
    />
    <sendMsg
      ref="sendMsgRef"
      :order-id="workOrderDetail?.id"
      :provider-id="props.providerItem.provider_id"
      :name="info.full_name"
    />
    <qualificationsModal
      ref="qualificationsModalRef"
      :order-id="workOrderId"
      :provider-id="info.provider_id"
      @routeConfirm="routeHandleAsync"
      @assignConfirm="assignHandleAsync"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useWorkOrderProvidersList, useWorkOrderDetailStore } from "@/stores";
import { storeToRefs } from "pinia";
import {
  GetProviderListRes,
  GetProviderListTypeEnum,
  WorkOrderDetailStatusEnum
} from "@/api/api/workOrder/types";
import rateTag from "./rateTag.vue";
import rateIcon from "./rateIcon.vue";
import headMsg from "./headMsg.vue";
import {
  SecurityScanOutlined,
  SafetyOutlined,
  TableOutlined,
  MailOutlined
} from "@ant-design/icons-vue";
import {
  routeProvider,
  unRouteProvider,
  assignProvider,
  unAssignProvider
} from "@/api/api/workOrder";
import { notifySuccess } from "@/utils/notify";
import _ from "lodash";
import reviewModal from "./reviewModal.vue";
import sendMsg from "./sendMsg.vue";
import qualificationsModal from "./qualificationsModal.vue";
import phoneFormat from "@/utils/phoneFormat";

// 工程师列表

interface Props {
  currentKey: number | string | undefined;
  selectKey: number | string;
  providerItem: GetProviderListRes;
}

const props = defineProps<Props>();

const { workOrderDetail, workOrderId, workOrderStatus } = storeToRefs(useWorkOrderDetailStore());
const { currentProviderType } = storeToRefs(useWorkOrderProvidersList());
const { setCurrentProvider, delProvider, setProviderTypeCount } = useWorkOrderProvidersList();

// 数据展示相关
const isPending = computed(() => {
  return currentProviderType.value === GetProviderListTypeEnum.PENDING_ASSIGNMENT;
});

const info = computed(() => {
  return props.providerItem.provider_info;
});

const phone = computed(() => {
  if (
    currentProviderType.value &&
    currentProviderType.value < GetProviderListTypeEnum.PENDING_ASSIGNMENT
  )
    return "";
  const { phone_number_ext, phone_number } = props.providerItem.provider_info;
  console.log(" phone_number", phone_number);
  if (phone_number) {
    return phone_number_ext ? `(${phone_number_ext}) ${phone_number}` : `${phone_number}`;
  } else {
    return "";
  }
});

const telPhone = computed(() => {
  return `tel:${phone.value}`;
});

const bgCheck = computed(() => {
  const { background_check } = props.providerItem.provider_info;
  return `Background Check: ${background_check}`;
});

const dtCheck = computed(() => {
  const { drug_test } = props.providerItem.provider_info;
  return `Drug Test: ${drug_test}`;
});

const groupType = computed(() => {
  if (props.providerItem.is_expire) {
    return "expire";
  }
  if (_.isEmpty(props.providerItem.counter) || !props.providerItem.counter) {
    return "requests";
  }
  return "counters";
});

// 按钮相关
const btnIsLoading = ref(false);

const qualificationsModalRef = ref();

const asyncSuccess = () => {
  notifySuccess("Success");
  delProvider(props.providerItem.provider_id);
  if (!workOrderId.value) return;
  setProviderTypeCount(workOrderId.value);
  setInterval(() => {
    window.location.reload();
  }, 1000);
};

// 路由工程师
const routeHandle = () => {
  qualificationsModalRef.value.show("Route");
};

const routeHandleAsync = async () => {
  try {
    btnIsLoading.value = true;
    const res = await routeProvider({
      order_id: workOrderDetail.value?.id as number,
      provider_id: props.providerItem.provider_id
    });
    if (res) {
      asyncSuccess();
    }
  } catch (error) {
    console.error(error);
  } finally {
    btnIsLoading.value = false;
  }
};

// 取消路由工程师
const unRouteProviderAsync = async () => {
  try {
    btnIsLoading.value = true;
    const res = await unRouteProvider({
      order_id: workOrderDetail.value?.id as number,
      provider_id: props.providerItem.provider_id
    });
    if (res) {
      asyncSuccess();
    }
  } catch (error) {
    console.error(error);
  } finally {
    btnIsLoading.value = false;
  }
};

// 分配工程师
const assignHandle = () => {
  qualificationsModalRef.value.show("Assign");
};

const assignHandleAsync = async () => {
  try {
    btnIsLoading.value = true;
    const res = await assignProvider({
      order_id: workOrderDetail.value?.id as number,
      provider_id: props.providerItem.provider_id
    });
    if (res) {
      asyncSuccess();
    }
  } catch (error) {
    console.error(error);
  } finally {
    btnIsLoading.value = false;
  }
};

//unassignHnale
const unassignHandleAsync = async () => {
  try {
    btnIsLoading.value = true;
    const res = await unAssignProvider({
      order_id: workOrderDetail.value?.id as number,
      provider_id: props.providerItem.provider_id
    });
    if (res) {
      asyncSuccess();
    }
  } catch (error) {
    console.error(error);
  } finally {
    btnIsLoading.value = false;
    if (workOrderStatus.value !== 4 && workOrderStatus.value !== 5 && workOrderStatus.value !== 6) {
      setInterval(() => {
        window.location.reload();
      }, 2000);
    }
  }
};
const reviewDisabled = computed(() => {
  return (
    workOrderStatus.value == 3 ||
    workOrderStatus.value == 4 ||
    workOrderStatus.value == 5 ||
    workOrderStatus.value == 6
  );
});
// console.log("reviewDisabled:", reviewDisabled);
//reviewHandle
const reviewModalRef = ref();
const reviewHandle = () => {
  reviewModalRef.value.show();
};

// 按钮处理
const isDisabledBtn = computed(() => {
  const arr = [
    WorkOrderDetailStatusEnum.DRAFT,
    WorkOrderDetailStatusEnum.ASSIGNED,
    WorkOrderDetailStatusEnum.APPROVED,
    WorkOrderDetailStatusEnum.WORK_DONE,
    WorkOrderDetailStatusEnum.PAID,
    WorkOrderDetailStatusEnum.CANCELLED
  ];
  if (!workOrderStatus.value) return;
  return arr.includes(workOrderStatus.value);
});

const handleMap = computed(() => {
  return {
    [GetProviderListTypeEnum.ALL_PROVIDERS]: {
      label: "Route",
      handle: routeHandle,
      isDisabled: isDisabledBtn.value
    },
    [GetProviderListTypeEnum.ROUTES]: {
      label: "Un-route",
      handle: unRouteProviderAsync,
      isDisabled: isDisabledBtn.value
    },
    [GetProviderListTypeEnum.PENDING_ASSIGNMENT]: {
      label: "",
      handle: () => {},
      isDisabled: false
    },
    [GetProviderListTypeEnum.ASSIGNED]: {
      label: "Un-assign",
      handle: unassignHandleAsync,
      isDisabled: false
    }
  };
});

// 消息发送
const sendMsgRef = ref();
const sendMsgHandle = () => {
  sendMsgRef.value.show();
};

const chooseProvider = () => {
  setCurrentProvider(props.providerItem);
};
</script>

<style scoped lang="less">
.avatar {
  margin-left: 2px;
}
</style>
