<template>
  <div class="add-filter flex">
    <popover v-model:modelValue="popoverVisible" @openChange="popoverOpenChange">
      <a-button type="text" size="large" :icon="h(PlusOutlined)">Add Filter</a-button>

      <template #content>
        <a-spin :spinning="getFilterFieldListLoading">
          <popoverSearch v-model:modelValue="searchValue" />
          <div class="add-filter-list filter-body">
            <div v-for="(itemList, itemKey) in filterFieldGroupList" :key="itemKey">
              <b
                v-for="item in itemList"
                :key="item.id"
                class="add-filter-item pointer"
                @click="addFilter(item)"
              >
                {{ item.name }}
              </b>
            </div>
          </div>
        </a-spin>
      </template>
    </popover>
  </div>
</template>

<script setup lang="ts">
import { h, ref, computed, onMounted } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { getFilterFieldList } from "@/api/api/filter/index";
import popover from "./components/popover.vue";
import popoverSearch from "./components/popoverSearch.vue";
import { useWorkOrderFilterStore } from "@/stores";
import { storeToRefs } from "pinia";
import { GetFilterFieldListGroupEnum, GetFilterFieldListRes } from "@/api/api/filter/type";

// 获取过滤字段列表
const { renderFiltersList, resderWorkOrderFilterList } = storeToRefs(useWorkOrderFilterStore());
const { setWorkOrderFilterList, setTempFilter } = useWorkOrderFilterStore();

// 查询字段
const searchValue = ref("");

// 对数据根据searchValue查询后分组
const filterFieldGroupList = computed(() => {
  return resderWorkOrderFilterList.value.reduce(
    (groupedData, item) => {
      // 将 item.name 和 searchValue 都转换为小写进行比较
      if (
        item.name.toLowerCase().includes(searchValue.value.toLowerCase()) &&
        !renderFiltersList.value.some((renderItem) => renderItem.id === item.id) // 过滤掉已有的对象
      ) {
        const group = item.group;

        // 如果该分组不存在，则初始化一个空数组
        if (!groupedData[group]) {
          groupedData[group] = [];
        }

        // 将符合条件的项添加到对应的分组数组中
        groupedData[group].push(item);
      }

      return groupedData;
    },
    {} as Record<GetFilterFieldListGroupEnum, GetFilterFieldListRes[]>
  );
});

const getFilterFieldListLoading = ref(false);
const getFilterFieldListAsync = async () => {
  try {
    getFilterFieldListLoading.value = true;
    const res = await getFilterFieldList();
    if (res) {
      setWorkOrderFilterList(res);
    }
  } catch (error) {
    console.error(error);
  } finally {
    getFilterFieldListLoading.value = false;
  }
};

// 弹出框是否显示
const popoverVisible = ref(false);
// 弹窗关闭时清除搜索字段
const popoverOpenChange = () => {
  if (!popoverVisible.value) {
    searchValue.value = "";
  }
};

// 添加过滤器
const addFilter = (item: GetFilterFieldListRes) => {
  setTempFilter(item);
  popoverVisible.value = false;
};

onMounted(() => {
  getFilterFieldListAsync();
});
</script>

<style lang="less">
.add-filter-list {
  .add-filter-item {
    display: block;
    padding: var(--padding-base);
    word-break: break-word;
  }

  .add-filter-item:hover {
    background-color: var(--color-background-content);
  }
}

.add-filter-list > :not(:last-child) {
  border-bottom: 1px solid var(--color-border-minor);
}
</style>
