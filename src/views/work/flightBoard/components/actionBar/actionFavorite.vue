<template>
  <div class="action-favorite flex">
    <popover v-model:model-value="popoverVisible">
      <template #content>
        <a-spin :spinning="filterGroupLoading">
          <div class="filter-body">
            <div v-if="checkFilterGroupList">
              <div class="padding-16 action-favorite-title">
                <b>Saved Filters</b>
              </div>
              <div class="flex-column action-favorite-list">
                <div
                  class="item flex pointer full"
                  v-for="item in filterGroupList"
                  :key="item.id"
                  :data-filter-group-is-checked="item.id === currentChoosedFilterGroupId"
                  @click="createFilterByGroup(item)"
                >
                  <div class="title word-wrap">{{ item.name }}</div>
                  <a-popconfirm
                    title="Confirm deletion?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="delFilterGroupHandle(item.id)"
                  >
                    <a-button
                      type="primary"
                      shape="circle"
                      size="small"
                      danger
                      :icon="h(DeleteOutlined)"
                      @click="(e: Event) => e.stopPropagation()"
                    />
                  </a-popconfirm>
                </div>
              </div>
            </div>

            <div v-else class="font-color-minor action-favorite-text">
              Filters you add can be saved here. Quickly launch them anytime to speed up your
              workflow.
            </div>
          </div>
        </a-spin>
      </template>
      <a-button
        v-if="currentChoosedFilterGroupId"
        size="large"
        type="text"
        :icon="h(CaretDownOutlined)"
      >
        {{ currentChoosedFilterGroupName }}
        <span v-if="!checkFilterGroupIsEdited">*</span>
      </a-button>

      <a-button v-else size="large" shape="circle" type="text">
        <template #icon>
          <BookMark />
        </template>
      </a-button>
    </popover>
  </div>
</template>

<script setup lang="ts">
import { h, ref, onMounted } from "vue";
import popover from "./actionFilterComponents/components/popover.vue";
import { CaretDownOutlined } from "@ant-design/icons-vue";
import { delFilterGroup } from "@/api/api/filter";
import { useWorkOrderFilterStore } from "@/stores";
import { storeToRefs } from "pinia";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { GetFilterGroupRes } from "@/api/api/filter/type";
import BookMark from "@/assets/icons/BookMark.vue";

const {
  filterGroupList,
  checkFilterGroupList,
  filterGroupLoading,
  currentChoosedFilterGroupId,
  currentChoosedFilterGroupName,
  checkFilterGroupIsEdited
} = storeToRefs(useWorkOrderFilterStore());
const { getFilterGroupAsync, delFilterGroupById, setFilterGroupLoading, setLocalFiltersByGroup } =
  useWorkOrderFilterStore();

const popoverVisible = ref(false);
// 删除过滤器组
const delFilterGroupHandle = (id: number) => {
  delFilterGroupAsync(id);
};

const delFilterGroupAsync = async (id: number) => {
  try {
    setFilterGroupLoading(true);
    const res = await delFilterGroup({ ids: [id] });
    if (res) {
      delFilterGroupById(id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setFilterGroupLoading(false);
  }
};

const createFilterByGroup = (data: GetFilterGroupRes) => {
  setLocalFiltersByGroup(data);
  popoverVisible.value = false;
};

onMounted(() => {
  getFilterGroupAsync();
});
</script>

<style scoped lang="less">
.action-favorite-title {
  border-bottom: 1px solid var(--color-border-minor);
}

.action-favorite-list {
  padding: var(--padding-base) 0;
  .item {
    padding: var(--padding-base) calc(var(--padding-base) * 2);
    justify-content: space-between;
    align-items: center;

    .title {
      width: 80%;
    }
  }

  .item[data-filter-group-is-checked="true"] {
    background-color: var(--color-background-content);
  }

  .item:hover {
    background-color: var(--color-hover);
  }
}

.action-favorite-text {
  padding: calc(var(--padding-base) * 2);
}
</style>
