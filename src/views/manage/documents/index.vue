<template>
  <div class="manage-documents">
    <TitleBar>
      <template #title>
        {{ t("documents") }}
      </template>
    </TitleBar>
    <div class="margin-bottom-16">
      <a-row>
        <a-col>
          <a-input-search
            v-no-chinese
            v-model:value="keyword"
            :placeholder="t('file_name')"
            size="large"
            style="width: 500px"
            @search="onSearch"
          >
            <template #enterButton>
              {{ t("search") }}
            </template>
          </a-input-search>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-row>
        <a-col :span="24">
          <div>
            <div class="margin-bottom-16">
              <a-row>
                <a-col :span="12">
                  <a-button size="large" type="primary" @click="showUpload">
                    {{ t("new_document") }}
                  </a-button>
                </a-col>
                <a-col :span="12" class="right">
                  <a-space>
                    <a-button size="large" @click="download">
                      {{ t("download") }}
                    </a-button>
                    <a-popconfirm
                      :title="t('confirm_file_delete')"
                      @confirm="onDelete"
                      :ok-text="t('confirm')"
                      :cancel-text="t('cancel')"
                    >
                      <a-button size="large" danger>
                        {{ t("delete") }}
                      </a-button>
                    </a-popconfirm>
                  </a-space>
                </a-col>
              </a-row>
            </div>
            <a-table
              :rowSelection="rowSelection"
              :columns="columns"
              :data-source="data"
              :row-key="(record) => record.file_id"
              :pagination="false"
              :loading="loading"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'operation'">
                  <a @click="onEdit(record)">{{ t("edit") }}</a>
                </template>
                <template v-if="column.key === 'description'">
                  <a-tooltip placement="topLeft" arrow-point-at-left>
                    <template #title>{{ record.description }}</template>
                    <div class="desc-wrapper">
                      {{ record.description }}
                    </div>
                  </a-tooltip>
                </template>
              </template>
              <template #footer>
                <a-row>
                  <a-col>
                    <a-pagination
                      :current="pagination.current"
                      show-quick-jumper
                      :total="pagination.total"
                      @change="onChange"
                      :pageSize="pagination.pageSize"
                    />
                  </a-col>
                </a-row>
              </template>
            </a-table>
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <manageUpload :open="open" @cancels="cancels" @reloadData="reloadData"></manageUpload>
          <description
            :descriptInfo="descriptInfo"
            @cancels="cancels"
            @reloadData="reloadData"
          ></description>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/style/views/manage.less";

import { computed, reactive, ref, onMounted } from "vue";
import { notifyError, notifySuccess, notifyWarning } from "@/utils/notify";
import { columns } from "./columns";
import manageUpload from "./upload.vue";
import description from "./description.vue";
import { delFile, getFileList } from "@/api/api/fileManager";
import { PageObject, DescriptInfoObject } from "@/views/manage/types/manage";
import type { DelFileReq, FileList } from "@/api/api/fileManager/types.ts";
import i18n from "@/locale";

const { t } = i18n.global;

// 初始化
const keyword = ref<string>("");
const open = ref<boolean>(false);
const loading = ref<boolean>(false);
// 定义描述对属性
const descriptInfo = ref<DescriptInfoObject>({
  name: "",
  id: 1,
  description: "",
  open: false
});

const data = ref<FileList[]>([] as any);
// 分页
const pagination = reactive<PageObject>({
  total: 0,
  current: 1,
  pageSize: 10,
  page: 1
});
const querydata = async () => {
  loading.value = true;
  try {
    const response = await getFileList({
      keyword: keyword.value,
      page: pagination.page,
      limit: pagination.pageSize
    });
    data.value = response.data ? response.data : [];
    pagination.total = response.meta.total ? response.meta.total : 0;
    pagination.current = response.meta.current_page ? response.meta.current_page : 1;
  } catch {
    data.value = [];
    pagination.total = 0;
    pagination.current = 1;
  }
  loading.value = false;
};

// 表单选中
type Key = string | number;
const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [],
  loading: false
});

const hasSelected = computed(() => state.selectedRowKeys.length > 0);

const rowSelection = computed(() => {
  return {
    selectedRowKeys: state.selectedRowKeys,
    onChange: onSelectChange
  };
});

const onDelete = async () => {
  if (!hasSelected.value) {
    return notifyWarning(t("select_column_delete"));
  }
  // ajax request after empty completing

  const param = ref<DelFileReq>({ file_ids: state.selectedRowKeys });
  try {
    await delFile(param.value);
    notifySuccess(t("delete_success"));
    //重新加载列表内容
    await querydata();
  } catch {
    notifyError(t("delete_fail"));
  }
};
const download = () => {
  if (!hasSelected.value) {
    return notifyWarning(t("select_column_delete"));
  }
  // 列表导出
  //获取选择中的rowKey值

  data.value.forEach((record) => {
    const fid = record.file_id;
    const link = record.link;
    const indexs = state.selectedRowKeys.indexOf(fid);
    if (indexs !== -1) {
      console.log("link:", link);
      window.open(link, "_blank");
    }
  });
};
const onEdit = (record: any) => {
  descriptInfo.value.open = true;
  descriptInfo.value.name = record.filename;
  descriptInfo.value.id = record.file_id;
  descriptInfo.value.description = record.description;
};

const onSelectChange = (selectedRowKeys: Key[]) => {
  state.selectedRowKeys = selectedRowKeys;
};
// 搜索框搜索
const onSearch = () => {
  pagination.page = 1;
  querydata();
};
const showUpload = () => {
  open.value = true;
};
const cancels = () => {
  open.value = false;
  descriptInfo.value.open = false;
};
const reloadData = () => {
  cancels();
  querydata();
};
const onChange = (page: number, pageSize) => {
  pagination.page = page;
  pagination.pageSize = pageSize;
  querydata();
};
// 页面加载后获取列表数据
onMounted(() => {
  querydata();
});
</script>

<style scoped></style>
