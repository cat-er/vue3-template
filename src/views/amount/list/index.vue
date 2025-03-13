<template>
  <div class="amount-list">
    <div>
      <a-row class="margin-bottom-16">
        <a-col :span="24">
          <a-card :title="t('account_balance')">
            <template #extra>
              <a-button type="primary" @click="toDeposit">Deposit</a-button>
            </template>
            <a-row>
              <a-col :span="6">{{ t("current_balance") }}</a-col>
              <a-col :span="6">{{ t("pedding") }}</a-col>
              <a-col :span="6">{{ t("available") }}</a-col>
              <a-col :span="6"></a-col>
            </a-row>
            <a-row>
              <a-col :span="6">
                {{ amountList.symbol }} {{ formatedPriceInt(amountList.score) }}
              </a-col>
              <a-col :span="6">
                {{ amountList.symbol }} {{ formatedPriceInt(amountList.pedding) }}
              </a-col>
              <a-col :span="6">
                {{ amountList.symbol }} {{ formatedPriceInt(amountList.available) }}
              </a-col>
              <a-col :span="6"></a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>
      <a-row class="margin-bottom-16 amount-content">
        <a-col :span="24">
          <div class="card-container">
            <a-tabs v-model:activeKey="activeKey" type="card" @change="tabsChange">
              <a-tab-pane key="2" tab="Completed"></a-tab-pane>
              <a-tab-pane key="1" tab="Pending"></a-tab-pane>
            </a-tabs>
          </div>
        </a-col>
        <a-col :span="24">
          <a-space :size="10" class="margin-bottom-16">
            <span>
              {{ t("search") }}
            </span>
            <a-input v-model:value="keyword" :placeholder="t('search')" />
            <span>
              {{ t("transaction_date") }}
            </span>
            <a-range-picker @change="timeChange" v-model:value="clearText" />
            <span>
              {{ t("transaction_type") }}
            </span>
            <a-select v-model:value="select" style="width: 120px" :options="options"></a-select>
            <a-button type="primary" @click="onSearch">
              {{ t("search") }}
            </a-button>
            <a-button @click="reset">
              {{ t("reset") }}
            </a-button>
            <a-button @click="onExport">
              {{ t("export") }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="24">
          <div>
            <a-table
              :columns="columns"
              :data-source="data"
              :row-key="(record) => record.file_id"
              :pagination="false"
              :loading="loading"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'description'">
                  <span :title="record.description">{{ record.description }}</span>
                </template>
                <template v-if="column.key === 'created_at'">
                  {{ record.created_utc }}
                </template>
                <template v-if="column.key === 'type'">
                  {{ feeType(record.type) }}
                </template>
                <template v-if="column.key === 'score'">
                  <!-- {{ record.compute_type === 1 ? "-" : "+" }}${{ record.score }} -->
                  {{ formatScore(record) }}
                </template>
                <template v-if="column.key === 'order_no'">
                  <a @click="getHrefUrl(record.order_no)">
                    {{ record.order_no }}
                  </a>
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
import "@/assets/style/views/amount/index.less";

import { reactive, ref, onMounted } from "vue";
import type { SelectProps } from "ant-design-vue";
import { columns } from "./columns";

import type { AmountRes, PageObject } from "@/views/amount/types/amount.ts";
import { t } from "@/locale";
import { formatedPriceInt, getAmountList, getBalance } from "@/api/api/amount";
import { AmountListReq, type AmountListRes } from "@/api/api/amount/types";
import { Dayjs } from "dayjs";
import { useRouter } from "vue-router";
const router = useRouter();

// 初始化
const keyword = ref<string>("");
const clearText = ref<[string, string] | [Dayjs, Dayjs] | undefined>();
const loading = ref<boolean>(true);

const options = ref<SelectProps["options"]>([
  {
    value: 0,
    label: "Please Select"
  },
  {
    value: 1,
    label: "Payment"
  },
  {
    value: 2,
    label: "Deposit"
  },
  {
    value: 3,
    label: "Fulfillment"
  },
  {
    value: 4,
    label: "Warranties"
  },
  {
    value: 5,
    label: "Subscribe"
  }
]);
const select = ref<number>(0);
// 定义描述对属性

const data = ref<AmountListRes[]>([]);

const activeKey = ref<string>("2");

// 分页
const pagination = reactive<PageObject>({
  total: 0,
  current: 1,
  pageSize: 10,
  page: 1
});
const amountList = reactive<AmountRes>({
  score: 0.0,
  pedding: 0.0,
  available: 0.0,
  symbol: "$"
});
const searchData = reactive<AmountListReq>({
  page: 1,
  keyword: "",
  type: null,
  status: 0,
  start: null,
  end: null
});
const tabsChange = () => {
  data.value = [];
  querydata();
};
const querydata = async () => {
  loading.value = true;
  searchData.type = null;
  if (select.value > 0) {
    searchData.type = select.value;
  }
  searchData.page = pagination.page;
  searchData.keyword = keyword.value;
  searchData.status = Number(activeKey.value);
  try {
    const response = await getAmountList(searchData);
    data.value = response.data.data ? response.data.data : [];
    const meta = response.data.meta ? response.data.meta : [];
    pagination.total = meta.total ? meta.total : 0;
    pagination.current = meta.current_page ? meta.current_page : 1;
  } catch {
    data.value = [];
  }
  loading.value = false;
};
/**
 * 获取用户使用额度信息
 * */
const getUserBalance = async () => {
  try {
    const res = await getBalance();
    amountList.score = res.score;
    amountList.pedding = res.pending;
    amountList.available = res.available_score;
  } catch {
    console.log("");
  }
};

// 费用导出
const onExport = () => {
  // 基础 URL
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/onsite/fn/exportsFeeDetailsList`;

  // 初始化 URL 参数数组
  let params = [];

  // 只在值不为空时拼接参数
  if (keyword.value) {
    params.push(`keyword=${keyword.value}`);
  }

  if (select.value) {
    params.push(`type=${select.value}`);
  }

  if (searchData.start) {
    params.push(`start=${searchData.start}`);
  }

  if (searchData.end) {
    params.push(`end=${searchData.end}`);
  }

  // 如果有参数，拼接参数部分
  let downloadUrl = baseUrl + (params.length ? "?" + params.join("&") : "");

  console.log(downloadUrl);

  // 打开新窗口下载
  window.open(downloadUrl, "_blank", "");
};

// 搜索框搜索
const onSearch = () => {
  pagination.page = 1;
  querydata();
};
const reset = () => {
  keyword.value = "";
  select.value = 0;
  clearText.value = [] as any;

  searchData.type = null;
  searchData.keyword = "";
  searchData.end = null;
  searchData.start = null;
  onSearch();
};
// 时间组件
const timeChange = (date: [string, string] | [Dayjs, Dayjs], dateString: [string, string]) => {
  searchData.start = dateString[0] ? dateString[0] + " 00:00:00" : null;
  searchData.end = dateString[1] ? dateString[1] + " 23:59:59" : null;
};
const onChange = (page: number) => {
  pagination.page = page;
  querydata();
};
// 点击跳转
const getHrefUrl = (order: string) => {
  let reg = /^pay\d+$/;
  if (reg.test(order)) {
    router.push({
      name: "amountBalance",
      query: { keyword: order }
    });
  } else {
    router.push({ name: "workOrdersDetail", query: { orderId: order } });
    console.log(order + ` is a number`);
    // router.push("./onsite/workOrders/detail?orderId=" + order);
    router.push({ name: "workOrdersDetail", query: { orderId: order } });
  }
};

// 类型 1上门服务费（Payment） 2充值 (Depoist)3安装费(Fulfillment ) 4维修费(Warranties) 5订阅费(Subscribe)
const feeType = (type: number) => {
  const list = ["Payment", "Deposit", "Fulfillment", "Warranties", "Subscribe"];
  return list[type - 1];
};

const formatScore = (item: any) => {
  const handling = Number(item.handling);
  const score = Number(item.score);
  return `$${handling + score}`;
};

const toDeposit = () => {
  router.push({ name: "amountBalance" });
};

// 页面加载后获取列表数据
onMounted(() => {
  querydata();
  getUserBalance();
});
</script>

<style scoped></style>
