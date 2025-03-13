<template>
  <div class="work-order-messages">
    <a-row :class="workStatus == 7 || workStatus == 1 ? 'hide' : ''">
      <a-col :span="24" class="margin-bottom-16">{{ sendMessageTitle }}:</a-col>
      <a-col :class="isHide ? 'hide' : ''" v-if="providerList.length > 0" class="margin-bottom-16">
        Send to specific Provider:
        <a-select
          v-model:value="selectArr"
          placeholder="Leave blank to send to all providers"
          style="width: 260px"
          mode="multiple"
          :open="selectOpen"
          @blur="selectBlur"
          @focus="selectFocus"
          @click="selectFocus"
          :options="
            providerList.map((option) => ({
              key: option.provider_info.provider_id,
              id: option.provider_info.provider_id,
              value: option.provider_info.full_name,
              label: option.provider_info.full_name
            }))
          "
          @change="handleChange"
        ></a-select>
      </a-col>
    </a-row>
    <a-row class="margin-bottom-16" :class="workStatus == 7 || workStatus == 1 ? 'hide' : ''">
      <a-col :span="24" class="margin-bottom-16">
        <a-textarea
          v-no-chinese
          v-model:value="text"
          placeholder="Please enter sending information"
          :rows="4"
          @change="validateAscii"
          :class="error ? 'border-red' : ''"
        />
        <p v-if="error" style="color: red">{{ errorDescription }}</p>
      </a-col>
      <a-col :span="24" class="right">
        <a-button type="primary" class="send-botton" @click="submitReply" :loading="loading">
          {{ sendMessageButton }}
        </a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24" class="margin-bottom-16">
        <messageReply
          v-for="(item, index) in comments"
          :key="index"
          :item="item"
          :disabled="workStatus == 7 || workStatus == 1"
          @reloadMessage="reloadMessage"
        ></messageReply>
      </a-col>
    </a-row>
    <a-divider></a-divider>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import MessageReply from "./components/messageReply.vue";
import { getMessageList, getProviderList, sendMessage } from "@/api/api/workOrder";
import { GetProviderListTypeEnum } from "@/api/api/workOrder/types";
import {
  GetMessageListReq,
  GetProviderListReq,
  MessageListRes,
  ProvidersInfo,
  SendMessageReq,
  WorkOrderDetailStatusEnum
} from "@/api/api/workOrder/types";
import { storeToRefs } from "pinia";
import { useNewMessagesStore, useWorkOrderDetailStore } from "@/stores";
import { notifyError, notifySuccess } from "@/utils/notify";

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());
const { setNewMessages } = useNewMessagesStore();

const orderId = ref<number>(Number(workOrderDetail.value?.id));
const providerId = ref<number>(Number(workOrderDetail.value?.provider_id));
const workStatus = ref<number>(Number(workOrderDetail.value?.status));
const text = ref<string>("");
const loading = ref<boolean>(false);
const error = ref<boolean>(false);

const errorDescription = ref<string>("Only English characters are allowed");

const comments = ref<MessageListRes[]>([] as MessageListRes[]);

//工程师
type providersType = {
  id: number;
  provider_info: ProvidersInfo;
};

const providerList = ref<providersType[]>([] as any);
const select = ref<number | null>();
const selectArr = ref<any[]>([]);
const selectOpen = ref<boolean>(false);

const isHide = computed(() => {
  let arr = [
    WorkOrderDetailStatusEnum.ASSIGNED,
    WorkOrderDetailStatusEnum.WORK_DONE,
    WorkOrderDetailStatusEnum.APPROVED,
    WorkOrderDetailStatusEnum.PAID
  ];
  return arr.includes(workStatus.value);
});

const sendMessageTitle = computed(() => {
  if (workStatus.value == 2 && providerList.value.length > 0) {
    return "Send to Pending Assigned Providers";
  } else if (isHide.value) {
    return "Send to Assigned Provider";
  } else {
    return "Send to";
  }
});
const sendMessageButton = computed(() => {
  if (workStatus.value == 2) {
    return "Send To Pending Assignment Providers";
  } else {
    return "Send to Assigned Provider";
  }
});
const validateAscii = () => {
  errorDescription.value = "Only English characters are allowed!";
  error.value = false;
  if (text.value != "") {
    // 正则表达式匹配ASCII字符
    const asciiRegex = /^[\x00-\x7F]+$/;
    error.value = !asciiRegex.test(text.value);
  }
  return error.value;
};
const submitReply = async () => {
  if (validateAscii()) {
    return;
  }
  if (!text.value) {
    error.value = true;
    errorDescription.value = "Please enter sending information!";
    return;
  }
  loading.value = true;
  try {
    const param = ref<SendMessageReq>({
      order_id: Number(orderId.value),
      message: text.value
    });
    // 工单主状态 1-Draft 2-Published 3-Assigned 4-Work Done 5-Approved 6-Paid 7-Cancelled 9-Routed
    // 状态为 3-Assigned 4-Work Done 5-Approved 6-Paid 则只单独发送消息
    if (isHide.value) {
      param.value.provider_id = providerId.value;
    } else if (select.value) {
      param.value.provider_id = Number(select.value);
    }
    await sendMessage(param.value);
    notifySuccess("Be sent successfully");
    reloadMessage();
  } catch (e) {
    console.error(e);
    notifyError("Be sent failure!");
  }
  loading.value = false;
};

const handleChange = (value: string, option) => {
  let lenght = value.length;
  selectArr.value = [];
  select.value = null;

  if (lenght > 0) {
    selectArr.value[0] = value[lenght - 1];
    select.value = option[lenght - 1].id;
  }
  selectOpen.value = false;
};
const selectFocus = () => {
  selectOpen.value = true;
};
const selectBlur = () => {
  selectOpen.value = false;
};
// 获取评论数据
const getWorkOrderMessageList = async () => {
  const params = ref<GetMessageListReq>({
    order_id: orderId.value
  });
  try {
    const res = await getMessageList(params.value);
    await setNewMessages();
    comments.value = res.data;
    console.log("comments:", comments);
  } catch (e) {
    console.error(e);
  }
};
const reloadMessage = () => {
  getWorkOrderMessageList();
};
const getProvider = async () => {
  try {
    const params = ref<GetProviderListReq>({
      order_id: orderId.value,
      type: GetProviderListTypeEnum.PENDING_ASSIGNMENT
    });
    const res = await getProviderList(params.value);
    providerList.value = res.data;
  } catch (e) {
    console.log(e);
  }
};
onMounted(() => {
  getWorkOrderMessageList();
  // 处于 发布状态 工单主状态 2-Published 才发起请求
  if (workStatus.value == 2) {
    getProvider();
  }
});
</script>

<style lang="less" scoped>
.border-red {
  border-color: red;
}
</style>
