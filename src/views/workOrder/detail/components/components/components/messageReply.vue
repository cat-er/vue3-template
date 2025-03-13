<template>
  <div class="message-reply">
    <a-comment>
      <template #author>
        <a class="color-black">
          {{ item.from.name ? item.from.name : "&nbsp;" }}
        </a>
      </template>
      <template #avatar>
        <a-row>
          <a-col :span="24">
            <template v-if="item.from">
              <a-avatar
                :src="item.from.thumbnail ? item.from.thumbnail : ''"
                alt="message.from.name ? message.from.name : ''"
              />
            </template>
            <template v-else>
              <a-avatar>
                <template #icon><UserOutlined /></template>
              </a-avatar>
            </template>
          </a-col>
          <a-col :span="24">
            <a key="comment-basic-reply-to" @click="replyTo" :class="disabled ? 'hide' : ''">
              Reply
            </a>
          </a-col>
        </a-row>
      </template>
      <template #content>
        <div class="message-bubble">
          <div class="nipple nipple-size-sm nipple-position-left"></div>
          <div class="message-bubble-inner">
            <div class="margin-bottom-0 pre-message">{{ item.message }}</div>
          </div>
          <div class="message-problem message-fixed">
            <a-row class="">
              <a-col :span="24">Shared with {{ item.shared_text }}</a-col>
            </a-row>
          </div>
        </div>
        <div class="reply-text" :class="reply ? '' : 'hide'">
          <a-row class="margin-bottom-16">
            <a-col :span="24" class="margin-bottom-16">
              <a-textarea
                v-no-chinese
                v-model:value="text"
                placeholder="Please enter sending information"
                :rows="5"
                @change="validateAscii"
                :class="error ? 'border-red' : ''"
              />
              <p v-if="error" style="color: red">{{ errorDescription }}</p>
            </a-col>
            <a-col :span="24" class="right">
              <a-button class="margin-right-8" @click="cancel" :disabled="cancelDisabled">
                {{ t("cancel") }}
              </a-button>
              <a-button type="primary" class="send-botton" @click="submitReply" :loading="loading">
                {{ t("reply_to_message") }}
              </a-button>
            </a-col>
          </a-row>
        </div>
        <messageReplyChird
          v-for="(message, index) in item.messages"
          :key="index"
          :message="message"
        />
      </template>
      <template #datetime>
        <span class="color-black">
          <clock-circle-outlined />
          {{ formatTimeLocal(item.created_at_local) }} ({{ zone }})
        </span>
      </template>
    </a-comment>
  </div>
</template>
<script setup lang="ts">
import { t } from "@/locale";
import { ref } from "vue";
import messageReplyChird from "./messageReplyChird.vue";
import { ClockCircleOutlined } from "@ant-design/icons-vue";
import type { MessageListRes, SendMessageReq } from "@/api/api/workOrder/types";
import { notifyError, notifySuccess } from "@/utils/notify";
import { formatTimeLocal, sendMessage } from "@/api/api/workOrder";
import { storeToRefs } from "pinia";
import { useWorkOrderDetailStore } from "@/stores";
const cancelDisabled = ref<boolean>(false);
const loading = ref<boolean>(false);

const { item, disabled } = defineProps<{
  item: MessageListRes;
  disabled: boolean;
}>();
const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());

const order_id = ref<number>(Number(workOrderDetail.value?.id));

const zone = ref<string>(
  workOrderDetail.value?.time_zone_info?.short ? workOrderDetail.value.time_zone_info.short : ""
);

const text = ref<string>("");
const reply = ref<boolean>(false);
const error = ref<boolean>(false);

const errorDescription = ref<string>("Only English characters are allowed");
const validateAscii = () => {
  errorDescription.value = "Only English characters are allowed!";
  error.value = false;
  if (text.value != "") {
    // 正则表达式匹配ASCII字符
    let asciiRegex = /^[\x00-\x7F]+$/;
    error.value = !asciiRegex.test(text.value);
  }
  return error.value;
};
const replyTo = () => {
  reply.value = true;
};
const emits = defineEmits(["reloadMessage"]);
const submitReply = async () => {
  if (validateAscii()) {
    return;
  }
  if (!text.value) {
    error.value = true;
    errorDescription.value = "Please enter sending information!";
    return;
  }
  cancelDisabled.value = true;
  loading.value = true;
  const param = ref<SendMessageReq>({
    order_id: Number(order_id.value),
    message: text.value,
    msg_id: item.msg_id
  });
  try {
    await sendMessage(param.value);
    notifySuccess("Be sent successfully");
    reply.value = false;
    emits("reloadMessage");
  } catch (e) {
    console.error(e);
    notifyError("Be sent failure!");
  }
  cancelDisabled.value = true;
  loading.value = true;
};
const cancel = () => {
  reply.value = false;
};
</script>

<script lang="ts"></script>

<style scoped lang="less">
.color-black {
  color: #1c1c1e;
}
.pre-message {
  max-height: 150px;
  overflow-y: scroll;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.border-red {
  border-color: red;
}
</style>
