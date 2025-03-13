<template>
  <div>
    <titleBar>
      <template #title>Templates</template>
      <template #action>
        <a-button type="primary" size="large" @click="toAddTemplate">Add Template</a-button>
      </template>
    </titleBar>
    <div class="action-box-white">
      <a-row :gutter="16">
        <a-col :span="6">
          <div class="flex flex-space-center">
            <span class="margin-right-8">Search</span>
            <a-input-search
              v-model:value="params.keyword"
              placeholder="Search..."
              enter-button
              allowClear
              :disabled="tableLoading"
              @search="searchHandle"
            />
          </div>
        </a-col>
        <a-col :span="6">
          <div class="flex flex-space-center">
            <span class="margin-right-8">Status</span>
            <a-select
              class="full"
              v-model:value="params.status"
              :disabled="tableLoading"
              @change="statusChange"
            >
              <a-select-option v-for="item in statusList" :key="item.label" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
        </a-col>
      </a-row>

      <a-table
        class="margin-top-16"
        bordered
        :loading="tableLoading"
        :pagination="false"
        :dataSource="tableData"
        :columns="columns"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'author'">
            <span>{{ author(record.user_info) }}</span>
          </template>

          <template v-if="column.dataIndex === 'status'">
            <a-switch
              :checkedValue="GetTemplateListReqStatusEnum.OPEN"
              :unCheckedValue="GetTemplateListReqStatusEnum.CLOSE"
              :checked="record.status"
              @change="(checked) => statusSwitchHandle(checked, record.id)"
            />
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-space>
              <template #split>
                <a-divider type="vertical" />
              </template>
              <!-- 创建工单 -->
              <a
                v-if="record.status === GetTemplateListReqStatusEnum.OPEN"
                @click="createWorkOrder(record.id)"
              >
                Create Work Order
              </a>
              <span v-else class="font-color-minor">Create Work Order</span>
              <!-- 编辑模板 -->
              <a @click="toEditTemplate(record.id)">Edit</a>
            </a-space>
          </template>
        </template>
      </a-table>
      <pagination ref="paginationRef" :total="total" @page-change="pageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import titleBar from "@/components/titleBar/titleBar.vue";
import pagination from "@/components/pagination/pagination.vue";
import { getTemplateList, updateTemplateStatus } from "@/api/api/workOrder/index";
import {
  GetTemplateListReq,
  GetTemplateListReqStatusEnum,
  GetTemplateListRes,
  GetTemplateListResUserInfo
} from "@/api/api/workOrder/types";
import type { ColumnsType } from "ant-design-vue/es/table/interface";
import { useRouter } from "vue-router";
import { useWorkOrderaTemplateCreateStore } from "@/stores";

const tableLoading = ref(false);

const params = ref<GetTemplateListReq>({
  limit: 10,
  page: 1,
  keyword: "",
  status: GetTemplateListReqStatusEnum.OPEN
});

const paginationRef = ref();

// 重置分页器
const paginationReset = () => {
  params.value.page = 1;
  params.value.limit = 10;
  paginationRef.value.reset();
};
const pageChange = (page: number, size: number) => {
  params.value.limit = size;
  params.value.page = page;
  getTemplateListAsync();
};

const searchHandle = () => {
  paginationReset();
  getTemplateListAsync();
};

const statusChange = () => {
  paginationReset();
  getTemplateListAsync();
};

// 数据获取
const total = ref<number>(0);
const tableData = ref<GetTemplateListRes[]>();

const getTemplateListAsync = async () => {
  try {
    tableLoading.value = true;
    const res = await getTemplateList(params.value);
    if (res) {
      total.value = res.meta.total;
      tableData.value = res.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    tableLoading.value = false;
  }
};

const author = (info: GetTemplateListResUserInfo) => {
  return `${info.first_name} ${info.last_name}`;
};

// 状态更新

const updateParams = ref<{
  template_id: string | number | undefined;
  status: GetTemplateListReqStatusEnum | undefined;
}>({
  template_id: undefined,
  status: undefined
});

const statusSwitchHandle = (checked: string | number | boolean, id: number) => {
  updateParams.value.status = checked as GetTemplateListReqStatusEnum;
  updateParams.value.template_id = id;
  updateTemplateStatusAsync();
};

const updateTemplateStatusAsync = async () => {
  try {
    tableLoading.value = true;
    if (updateParams.value.status === undefined || updateParams.value.template_id === undefined)
      return;
    const res = await updateTemplateStatus(
      { status: updateParams.value.status },
      updateParams.value.template_id
    );
    if (res) {
      getTemplateListAsync();
      const index = tableData.value?.findIndex(
        (item) => item.id === updateParams.value.template_id
      );
      if (index !== -1 && index !== undefined && tableData.value) {
        tableData.value[index].status = updateParams.value.status;
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    tableLoading.value = false;
  }
};

// 跳转创建模板
const router = useRouter();
const toAddTemplate = () => {
  router.push({
    name: "templateCreate"
  });
};

// 通过模板创建工单
const { setTemplateId } = useWorkOrderaTemplateCreateStore();
const createWorkOrder = (template_id: number) => {
  setTemplateId(template_id);
  router.push({
    name: "workOrdersCreate"
  });
};

// 编辑模板
const toEditTemplate = (template_id: number) => {
  setTemplateId(template_id);
  router.push({
    name: "templateEdit",
    query: {
      template_id: template_id
    }
  });
};

onMounted(() => {
  getTemplateListAsync();
});

const statusList = [
  { label: "All", value: "" },
  { label: "On", value: GetTemplateListReqStatusEnum.OPEN },
  { label: "Off", value: GetTemplateListReqStatusEnum.CLOSE }
];

const columns: ColumnsType = [
  {
    title: "Name",
    dataIndex: "name"
  },
  {
    title: "Author",
    dataIndex: "author"
  },
  {
    title: "Work Orders",
    dataIndex: "work_order_count"
  },
  {
    title: "Date",
    dataIndex: "update_time"
  },
  {
    title: "Status",
    dataIndex: "status",
    align: "center",
    width: 100
  },
  {
    title: "Action",
    dataIndex: "action",
    align: "center",
    width: 250
  }
];
</script>
