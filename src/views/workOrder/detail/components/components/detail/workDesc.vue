<template>
  <a-card class="detail-card">
    <template #title>
      <span class="work-card-title">{{ t("service_description") }}</span>
      <a-button shape="circle" @click="edit" class="right-top" v-if="editWorkDescIsShow">
        <EditOutlined></EditOutlined>
      </a-button>
    </template>
    <div v-html="workOrderDetail?.description_html"></div>
  </a-card>
  <a-card class="detail-card" v-if="workOrderDetail?.confidential_html">
    <template #title>
      <span class="work-card-title">{{ t("confidential_information") }}</span>
      <a-button shape="circle" @click="edit" class="right-top" v-if="editWorkDescIsShow">
        <EditOutlined></EditOutlined>
      </a-button>
    </template>
    <div v-html="workOrderDetail?.confidential_html"></div>
  </a-card>
  <div>
    <editWorkDesc
      ref="editWorkDescRef"
      v-if="editWorkDescIsShow"
      @reloadPage="reloadPage"
    ></editWorkDesc>
  </div>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { useWorkOrderDetailStore } from "@/stores";
import { storeToRefs } from "pinia";
import { EditOutlined } from "@ant-design/icons-vue";
import editWorkDesc from "./components/editWorkDesc.vue";
import { computed, ref } from "vue";

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());
const editWorkDescRef = ref();
const { setWorkOrderDetail } = useWorkOrderDetailStore();
const edit = () => {
  editWorkDescRef.value.show(workOrderDetail.value, workOrderDetail.value?.id);
};
// 重新更新订单信息
const reloadPage = () => {
  setWorkOrderDetail(Number(workOrderDetail.value?.id));
};
const editWorkDescIsShow = computed(() => {
  return (
    workOrderDetail.value?.status != 4 &&
    workOrderDetail.value?.status != 5 &&
    workOrderDetail.value?.status != 6 &&
    workOrderDetail.value?.status != 7
  );
});
</script>
<style lang="less" scoped>
.detail-card {
  .right-top {
    float: right;
    clear: both;
  }
}
</style>
