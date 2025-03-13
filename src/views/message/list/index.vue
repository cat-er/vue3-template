<template>
  <div class="message-list">
    <div>
      <TitleBar>
        <template #title>
          <a-space>
            <message-two-tone />
            <span>
              {{ t("message") }}
            </span>
          </a-space>
        </template>
      </TitleBar>

      <a-row class="margin-bottom-16 msg-content">
        <a-col :span="24">
          <search-model v-model:value="keyword" @onSearch="onSearch" />
        </a-col>
        <a-divider></a-divider>
        <a-col :span="24" class="margin-bottom-16">
          <a-space>
            <a-button type="primary" @click="markMessage(1)" class="width-115">
              {{ t("mark_read") }}
            </a-button>
            <a-button type="primary" @click="markMessage(0)" class="width-115">
              {{ t("mark_unread") }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="24">
          <div>
            <a-table
              :columns="columns"
              :data-source="data"
              :row-key="(record) => record.id"
              :pagination="false"
              :loading="loading"
              :rowSelection="rowSelection"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'role'">
                  <a-tag :color="record.role == 'Admin' ? 'blue' : 'green'">
                    {{ record.role == "Admin" ? "From" : "To" }}
                  </a-tag>
                </template>
                <template v-if="column.key === 'provider'">
                  <span :class="record.read === 0 ? 'font-bold' : ''">
                    <template v-if="record.role == 'Admin'">
                      {{ record.from.name ? record.from.name : "" }}
                    </template>
                    <template v-else>
                      {{ record.to.name ? record.to.name : "" }}
                    </template>
                  </span>
                </template>
                <template v-if="column.key === 'message'">
                  <div class="text">
                    <a
                      :class="record.read === 0 ? 'font-bold' : ''"
                      @click="toWorkOrdersDetail(record.order_id, record.id, record.read)"
                      :title="record.order_id + ` - ` + record.message"
                    >
                      {{ record.order_id }} - {{ record.message }}
                    </a>
                  </div>
                </template>
                <template v-if="column.key === 'created_at_utc'">
                  <span :class="record.read === 0 ? 'font-bold' : ''">
                    {{ record.created_at_utc }}
                  </span>
                </template>
              </template>
              <template #footer>
                <a-row>
                  <a-col :span="24" class="text-right">
                    <a-space>
                      <a-pagination
                        :total="pagination.total"
                        :current="pagination.current"
                        :show-total="(total) => `Page ${pagination.current} of ${total}`"
                        @change="onChange"
                        :pageSize="pagination.pageSize"
                        show-quick-jumper
                        show-size-changer
                      ></a-pagination>
                    </a-space>
                  </a-col>
                </a-row>
              </template>
            </a-table>
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col></a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/style/views/message/index.less";

import { reactive, ref, onMounted, computed } from "vue";
import { MessageTwoTone } from "@ant-design/icons-vue";
import { columns } from "./columns";

import type { PageObject } from "@/views/amount/types/amount.ts";
import { t } from "@/locale";
import { type AmountListRes } from "@/api/api/amount/types";
import SearchModel from "./components/searchModel.vue";
import type { MessageEdit, MessageReq } from "@/api/api/message/type";
import { editMessageRead, getMessageList } from "@/api/api/message";
import { notifyError, notifySuccess, notifyWarning } from "@/utils/notify";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores";
import { DetailContentSegmentedEnum } from "@/views/workOrder/detail/types";
const { setUserInfo } = useUserStore();
const router = useRouter();
// 初始化
const keyword = ref<string>("");
const loading = ref<boolean>(true);

const data = ref<AmountListRes[]>([]);

// 分页
const pagination = reactive<PageObject>({
  total: 0,
  current: 1,
  pageSize: 30,
  page: 1
});

const searchData = ref<MessageReq>({
  limit: pagination.pageSize,
  page: 1,
  keyword: "",
  read: null,
  role: null,
  start: null,
  end: null
});
const querydata = async () => {
  loading.value = true;
  searchData.value.page = pagination.page;
  searchData.value.limit = pagination.pageSize;

  try {
    const response = await getMessageList(searchData.value);
    data.value = response.data.data ? response.data.data : [];
    const meta = response.data.meta ? response.data.meta : [];
    pagination.total = meta.total ? meta.total : 0;
    pagination.current = meta.current_page ? meta.current_page : 1;
    loading.value = false;
  } catch {
    loading.value = false;
  }
};
const rowSelection = computed(() => {
  return {
    selectedRowKeys: state.selectedRowKeys,
    onChange: onSelectChange
  };
});

type Key = string | number;
const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [],
  loading: false
});
const onSelectChange = (selectedRowKeys: Key[]) => {
  console.log(selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
};
// 搜索框搜索
const onSearch = (search) => {
  searchData.value = search;
  pagination.page = 1;
  querydata();
};
const hasSelected = computed(() => state.selectedRowKeys.length > 0);
const markMessage = async (num) => {
  if (!hasSelected.value) {
    return notifyWarning(t("select_column_delete"));
  }
  // ajax request after empty completing

  const param = ref<MessageEdit>({
    msg_ids: state.selectedRowKeys,
    read: num
  });
  try {
    let res = await editMessageRead(param.value);
    if (res) {
      notifySuccess(t("change_success"));
      // 重载用户信息
      await setUserInfo();
    }
    //重新加载列表内容
    await querydata();
  } catch {
    notifyError("change_fail");
  }
};
const onChange = (page, pageSize) => {
  pagination.page = page;
  pagination.pageSize = pageSize;
  querydata();
};
// 页面加载后获取列表数据
onMounted(() => {
  querydata();
});

// 跳转工单详情

const toWorkOrdersDetail = (orderId: number, id: number, read: number) => {
  if (read == 0) {
    const param = ref<MessageEdit>({
      msg_ids: [id],
      read: 1
    });
    editMessageRead(param.value);
    console.log("param:", param.value);
    setUserInfo();
  }
  router.push({
    name: "workOrdersDetail",
    query: {
      orderId: orderId,
      type: DetailContentSegmentedEnum.MESSAGES
    }
  });
};
</script>

<style scoped></style>
