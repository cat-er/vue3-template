<template>
  <div id="amount-balance">
    <a-card :title="t('deposit')" :headStyle="{ 'border-bottom': '0px solid #ddd' }">
      <template #extra>
        <a-button @click="back">Back</a-button>
      </template>
      <a-row class="margin-bottom-16">
        <a-col :span="24">
          <a-space :size="10" class="margin-bottom-16">
            <span>
              {{ t("order_number") }}
            </span>
            <a-input v-model:value="param.keyword" :placeholder="t('enter_order_number')" />
            <span>
              {{ t("create_time") }}
            </span>
            <a-range-picker @change="timeChange" v-model:value="timeValue" />
            <span>
              {{ t("status") }}
            </span>
            <a-select
              :value="select"
              style="width: 120px"
              :options="options"
              @change="handleChange"
            ></a-select>
            <a-button type="primary" @click="onSearch" class="dark-color">
              {{ t("search") }}
            </a-button>
            <a-button @click="reset">
              {{ t("reset") }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="24">
          <a-divider></a-divider>
        </a-col>
        <a-col :span="24" class="margin-bottom-16">
          <a-button type="primary" @click="showDeposit">
            {{ t("deposit") }}
          </a-button>
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
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'sort'">
                  {{ (pagination.current - 1) * pagination.pageSize + 1 + index }}
                </template>
                <template v-else-if="column.key === 'applied'">
                  {{ record.recharge_mcode }} {{ record.recharge_score }}
                </template>
                <template v-else-if="column.key === 'status'">
                  <template v-if="record.fee_details_info">
                    <template v-if="record.fee_details_info.status == 1">
                      <a-badge status="processing" :text="t('pedding')" />
                    </template>
                    <template v-else-if="record.fee_details_info.status == 2">
                      <a-badge status="success" :text="t('approved')" />
                    </template>
                    <template v-else>
                      <a-badge status="error" :text="t('rejected')" />
                    </template>
                  </template>
                </template>
                <template v-else-if="column.key === 'notes'">
                  {{
                    record.fee_details_info && record.fee_details_info.note
                      ? record.fee_details_info.note
                      : ""
                  }}
                </template>

                <template v-else-if="column.key === 'method'">
                  {{
                    record.pay_method_info && record.pay_method_info.name
                      ? record.pay_method_info.name
                      : ""
                  }}
                </template>
                <template v-else-if="column.key === 'time'">
                  <span>{{ t("submited_time") }}:{{ record.created_at }}</span>
                  <br />
                  <span>
                    {{ t("audit_time") }}:{{
                      record.fee_details_info && record.fee_details_info.audit_at
                        ? record.fee_details_info.audit_at
                        : ""
                    }}
                  </span>
                </template>
                <template v-else-if="column.key === 'operation'">
                  <a @click="showDetails(record)">{{ t("details") }}</a>
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
        <a-col>
          <detailsDrawer
            ref="DTDrawer"
            v-if="detailsInfo.open"
            :details="detailsInfo.details"
            :open="detailsInfo.open"
            @cancels="cancels"
          ></detailsDrawer>
          <depositDrawer
            ref="DPDrawer"
            v-if="detailsInfo.depositOpen"
            :deposit-open="detailsInfo.depositOpen"
            :deposit-options="detailsInfo.depositOptions"
            :detailsInfo="detailsInfo"
            @cancels="cancels"
          ></depositDrawer>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import "@/assets/style/views/amount/balance.less";

import { onMounted, reactive, ref } from "vue";
import type { SelectProps } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import { columns } from "./columns";
import detailsDrawer from "./components/detailsDrawer.vue";
import depositDrawer from "./components/depositDrawer.vue";
import { getPayMethodList, getRechargeList } from "@/api/api/amount";
import type { PageObject } from "@/views/amount/types/amount.ts";
import type { AmountListReq, RechargeListRes, PayMethodsOptions } from "@/api/api/amount/types.ts";
import i18n from "@/locale";
import type { SelectValue, DefaultOptionType } from "ant-design-vue/es/select/index.d.ts";

const { t } = i18n.global;

import { useRoute } from "vue-router";
import router from "@/router";
const route = useRoute();

const timeValue = ref<[string, string] | [Dayjs, Dayjs] | undefined>();
// 初始化
const loading = ref<boolean>(false);

const options = reactive([
  {
    value: 0,
    label: t("select_all"),
    default: true
  },
  {
    value: 1,
    label: t("pedding")
  },
  {
    value: 2,
    label: t("approved")
  },
  {
    value: 3,
    label: t("rejected")
  }
]);
const select = ref<number>(options[0].value);
// 定义描述对属性

const data = ref<RechargeListRes[]>([]);
const detailsInfo = reactive<{
  open: boolean;
  depositOpen: boolean;
  depositOptions: PayMethodsOptions[];
  details: RechargeListRes;
}>({
  open: false,
  depositOpen: false,
  depositOptions: [],
  details: {} as any
});
// 接口参数
const param = reactive<AmountListReq>({
  keyword: route.query.keyword ? route.query.keyword.toString() : "",
  page: 1,
  status: null,
  start: null,
  end: null
});

// 分页
const pagination = reactive<PageObject>({
  total: 0,
  current: 1,
  pageSize: 10,
  page: 1
});
const handleChange = (value: SelectValue) => {
  select.value = Number(value);
  param.status = Number(value);
  if (Number(value) === 0) {
    param.status = null;
  }
};
const querydata = async () => {
  loading.value = true;
  param.page = pagination.page;
  try {
    const response = await getRechargeList(param);
    data.value = response.data.data ? response.data.data : [];
    const meta = response.data.meta ? response.data.meta : [];
    pagination.total = meta.total ? meta.total : 0;
    pagination.current = meta.current_page ? meta.current_page : 1;
    loading.value = false;
  } catch {
    loading.value = false;
  }
};

const showDetails = (record: any) => {
  detailsInfo.open = true;
  detailsInfo.details = record;
};
const showDeposit = () => {
  detailsInfo.depositOpen = true;
};

// 搜索框搜索
const onSearch = () => {
  pagination.page = 1;
  querydata();
};

// 重置搜索框
const reset = () => {
  param.keyword = "";
  param.start = null;
  param.end = null;
  param.status = null;
  select.value = options[0].value;
  timeValue.value = undefined;
  onSearch();
};
// 时间组件
const timeChange = (value: [string, string] | [Dayjs, Dayjs], dateString: [string, string]) => {
  param.start = dateString[0] ? dateString[0] + " 00:00:00" : null;
  param.end = dateString[1] ? dateString[1] + " 23:59:59" : null;
};
const onChange = (page: number) => {
  pagination.page = page;
  querydata();
};
const cancels = (num: any) => {
  detailsInfo.open = false;
  detailsInfo.depositOpen = false;
  if (num === 1) {
    onSearch();
  }
};
const getPayMethods = async () => {
  try {
    detailsInfo.depositOptions = await getPayMethodList();
  } catch {
    detailsInfo.depositOptions = [];
  }
};

const back = () => {
  router.back();
};
// 页面加载后获取列表数据
onMounted(() => {
  querydata();
  getPayMethods();
});
</script>

<style scoped></style>
