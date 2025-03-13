<template>
  <div class="message-action-bar">
    <!--下拉菜单-->
    <a-dropdown :trigger="['click']">
      <div class="layout-action-item">
        <a-badge :count="count" :offset="[-5, 6]">
          <a-button type="text" size="large" shape="circle">
            <MailOutlined></MailOutlined>
          </a-button>
        </a-badge>
      </div>

      <template #overlay>
        <div class="message-action-bar-clear">
          <a-list :data-source="newMessages.slice(0, 5)" v-if="newMessages.length > 0">
            <template #renderItem="{ item }">
              <a-list-item @click="toWorkOrdersDetail(item.order_id)" class="cursor">
                <a-list-item-meta>
                  <template #title>
                    <div>
                      <span>
                        {{ item.from.name ? item.from.name : "" }}
                      </span>
                      <span class="gray">&nbsp; · WO {{ item.order_id }}</span>
                      <span class="right">{{ messageTimeFormat(item.created_at_utc) }}</span>
                    </div>
                  </template>
                  <template #avatar>
                    <a-avatar :src="item.from.thumbnail ? item.from.thumbnail : ''" />
                  </template>
                  <template #description>
                    <div class="desc-wrapper">
                      {{ item.message }}
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
            <template #loadMore>
              <div class="view-more">
                <a @click="to('messageList')">View all Messages</a>
              </div>
            </template>
          </a-list>
        </div>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { MailOutlined } from "@ant-design/icons-vue";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useNewMessagesStore, useUserStore } from "@/stores";
import dayjs from "dayjs";

const { newMessages } = storeToRefs(useNewMessagesStore());
const { setNewMessages } = useNewMessagesStore();
const { userInfo } = storeToRefs(useUserStore());

//路由跳转
const router = useRouter();

const to = (value: string) => {
  router.push({ name: value });
};
const count = computed(() => {
  return userInfo.value?.messages_count ? userInfo.value?.messages_count : 0;
});
const messageTimeFormat = (dateStr: string) => {
  // 日期格式化
  const date = dayjs(dateStr).format("YYYY-MM-DD");
  // 当前时间
  const now = new Date();
  // 当天日期
  const currentDate = dayjs(now).format("YYYY-MM-DD");
  // 判断是否属于当天
  if (date === currentDate) {
    return dayjs(dateStr, "YYYY-MM-DD HH:mm:ss").format("h:mm A");
  }
  // 判断是否属于昨天
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
  if (date === yesterday) {
    return "YESTERDAY " + dayjs(dateStr, "YYYY-MM-DD HH:mm:ss").format("h:mm A");
  } else {
    return dayjs(dateStr, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD h:mm A");
  }
};

// 跳转工单详情
const toWorkOrdersDetail = (orderId: number) => {
  window.location.href = "/onsite/workOrders/detail?orderId=" + orderId + "&type=3";
};

onMounted(() => {
  setNewMessages();
});
</script>

<style scoped lang="less">
.message-action-bar-clear {
  width: 560px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  .right {
    float: right;
    clear: both;
    color: #666;
  }
  .desc-wrapper {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .view-more {
    text-align: center;
    height: 45px;
    line-height: 45px;
  }
  .gray {
    color: #aaa;
  }
  .cursor {
    cursor: pointer;
  }
}
</style>
