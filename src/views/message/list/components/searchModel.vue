<template>
  <a-row :gutter="20" class="margin-bottom-16 message-search">
    <a-col :span="21">
      <a-row class="margin-bottom-16">
        <a-col :span="9">
          <a-space :size="30">
            <span class="lh-32">
              {{ t("search") }}
            </span>

            <a-input
              v-model:value="searchData.keyword"
              :placeholder="t('search')"
              class="width-314"
            />
          </a-space>
        </a-col>
        <a-col :span="9">
          <a-space :size="30">
            <span class="lh-32">
              {{ t("date_send") }}
            </span>
            <a-range-picker @change="timeChange" v-model:value="clearText" class="width-314" />
          </a-space>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="9">
          <a-space :size="30">
            <span class="lh-32">
              {{ t("status") }}
            </span>
            <a-select
              v-model:value="statusSelect"
              class="width-314"
              :options="statusOptions"
            ></a-select>
          </a-space>
        </a-col>
        <a-col :span="9">
          <a-space :size="30">
            <span class="lh-32">
              {{ t("from_to") }}
            </span>
            <a-select
              v-model:value="roleSelect"
              :options="roleOptions"
              class="width-314"
            ></a-select>
          </a-space>
        </a-col>
      </a-row>
    </a-col>
    <a-col :span="3" class="border-left">
      <a-row>
        <a-col :span="24" class="margin-bottom-16 center">
          <a-button type="primary" @click="onSearch" class="dark-color width-100">
            <template #icon><SearchOutlined /></template>
            {{ t("search") }}
          </a-button>
        </a-col>
        <a-col :span="24" class="center">
          <a-button @click="reset" class="width-100">
            <template #icon><sync-outlined /></template>
            {{ t("reset") }}
          </a-button>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { Dayjs } from "dayjs";
``;
import { ref } from "vue";
import type { SelectProps } from "ant-design-vue";
import type { MessageReq } from "@/api/api/message/type";

const clearText = ref<[Dayjs, Dayjs]>();
const searchData = ref<MessageReq>({
  page: 1,
  keyword: "",
  read: null,
  role: "",
  start: null,
  end: null
});
const statusOptions = ref<SelectProps["options"]>([
  {
    value: 0,
    label: t("select_all")
  },
  {
    value: 1,
    label: "Read"
  },
  {
    value: 2,
    label: "Unread"
  }
]);
const roleOptions = ref<SelectProps["options"]>([
  {
    value: "0",
    label: t("select_all")
  },
  {
    value: "Admin",
    label: "From"
  },
  {
    value: "Provider",
    label: "To"
  }
]);
const statusSelect = ref<number>(0);
const roleSelect = ref<string>("0");
const checked = ref<boolean>(true);
const emits = defineEmits(["onSearch"]);
const onSearch = () => {
  searchData.value.role = roleSelect.value === "0" ? null : roleSelect.value;
  if (statusSelect.value === 0) {
    searchData.value.read = null;
  } else {
    searchData.value.read = statusSelect.value == 2 ? 0 : 1;
  }

  searchData.value.keyword = searchData.value.keyword === "" ? "" : searchData.value.keyword;

  emits("onSearch", searchData.value);
};
const reset = () => {
  searchData.value.keyword = "";
  searchData.value.read = null;
  searchData.value.role = null;
  searchData.value.start = null;
  searchData.value.end = null;

  statusSelect.value = 0;
  roleSelect.value = "0";
  checked.value = true;
  clearText.value = [] as any;
  onSearch();
};
const timeChange = (date: [Dayjs, Dayjs] | [string, string], dateString: [string, string]) => {
  searchData.value.start = dateString[0] ? dateString[0] + " 00:00:00" : null;
  searchData.value.end = dateString[1] ? dateString[1] + " 23:59:59" : null;
};
</script>

<style scoped lang="less">
.margin-bottom-16 {
  margin-bottom: 16px;
}
.message-search {
  .width-314 {
    width: 314px;
  }
  .width-100 {
    width: 100px;
  }
  .lh-32 {
    line-height: 32px;
    width: 75px;
    display: inline-block;
  }
  .center {
    text-align: center;
  }
  .border-left {
    border-left: 1px #ccc solid;
  }
}
</style>
