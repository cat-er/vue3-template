<template>
  <div>
    <a-list item-layout="vertical" size="middle" :data-source="listData">
      <template #renderItem>
        <a-list-item key="item.title">
          <a-skeleton active avatar :paragraph="{ rows: 3 }" />
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script setup lang="ts">
interface Props {
  num: number;
}
const { num } = defineProps<Props>();
interface DataItem {
  key: number;
}
const listData: DataItem[] = [];
for (let i = 0, nums = num > 1 ? num : 1; i < nums; i++) {
  listData.push({
    key: i
  });
}
</script>
<style scoped lang="less">
.skeleton-demo {
  border: 1px solid #f4f4f4;
}
</style>
