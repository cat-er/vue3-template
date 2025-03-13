<template>
  <div class="work-order">
    <TitleBar :sticky="true">
      <template #title>
        {{ t("new_work_order") }}
      </template>
      <template #action>
        <a-button :disabled="!isOver" size="large" @click="handleDraft">
          {{ t("save_as_draft") }}
        </a-button>
        <a-button
          :disabled="!isOver"
          size="large"
          type="primary"
          class="margin-left-8"
          @click="handlePublish"
        >
          {{ t("publish") }}
        </a-button>
      </template>
    </TitleBar>

    <div class="work-order-content flex">
      <div class="content-action">
        <action-list />
      </div>
      <div class="content-form">
        <form-list />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, onUnmounted } from "vue";
import { t } from "@/locale";
import actionList from "./actionList.vue";
import formList from "./formList.vue";
import {
  useWorkOrderCreateStore,
  usePageLoadingStore,
  useWorkOrderaTemplateCreateStore,
  useCompanyBalanceStore
} from "@/stores";
import { storeToRefs } from "pinia";
import { addWorkOrder, getTemplateDetails } from "@/api/api/workOrder";
import { notifySuccess } from "@/utils/notify";
import { useRouter } from "vue-router";
import { getBalance } from "@/api/api/amount";

const { isOver, allData } = storeToRefs(useWorkOrderCreateStore());

const { setAllDataIsDraft } = useWorkOrderCreateStore();
const { setCompanyBalance } = useCompanyBalanceStore();

const handleDraft = () => {
  setAllDataIsDraft(true);
  submit();
};

const handlePublish = () => {
  setAllDataIsDraft(false);
  submit();
};

const router = useRouter();

const { changeLoading } = usePageLoadingStore();
const submit = async () => {
  try {
    changeLoading(true);
    const res = await addWorkOrder(allData.value);

    if (res) {
      const res_bl = await getBalance();
      if (res_bl) {
        setCompanyBalance(res_bl);
      }
      notifySuccess(t("submitted_successfully"));
      router.push({
        name: "workOrdersDetail",
        query: {
          orderId: res.id
        }
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    changeLoading(false);
  }
};

// 获取模板数据
const { setCurrentTemplateData, setTemplateId } = useWorkOrderaTemplateCreateStore();
const { currentTemplateId } = storeToRefs(useWorkOrderaTemplateCreateStore());

const getTemplateDetailsAsync = async () => {
  try {
    if (currentTemplateId.value === undefined || currentTemplateId.value === null) return;
    changeLoading(true);
    const res = await getTemplateDetails({ template_id: currentTemplateId.value });
    if (res) {
      console.log("模板详情", res);
      setCurrentTemplateData(res);
    }
  } catch (error) {
    console.error(error);
  } finally {
    changeLoading(false);
  }
};
watch(
  () => currentTemplateId.value,
  () => {
    getTemplateDetailsAsync();
  }
);

onMounted(() => {
  if (currentTemplateId.value) {
    getTemplateDetailsAsync();
  }
});

onUnmounted(() => {
  setTemplateId(undefined);
});
</script>
