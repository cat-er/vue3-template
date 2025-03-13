<template>
  <div class="work-order">
    <TitleBar :sticky="true">
      <template #title>{{ title }}</template>
      <template #action>
        <a-button
          size="large"
          type="primary"
          class="margin-left-8"
          :disabled="hasTitle"
          @click="handlePublish"
        >
          {{ btnText }}
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
import { ref, computed, onUnmounted, onMounted } from "vue";
import { t } from "@/locale";
import actionList from "./actionList.vue";
import formList from "./formList.vue";
import { useWorkOrderaTemplateCreateStore, usePageLoadingStore } from "@/stores";
import { storeToRefs } from "pinia";
import { addTemplate, updateTemplate, getTemplateDetails } from "@/api/api/workOrder/index";
import { notifySuccess } from "@/utils/notify";
import { useRouter, useRoute } from "vue-router";

const { allData, isCreateTemplate, currentTemplateId } = storeToRefs(
  useWorkOrderaTemplateCreateStore()
);
const { setTemplateId, setCurrentTemplateData, setIsCreateTemplate } =
  useWorkOrderaTemplateCreateStore();

const hasTitle = computed(() => {
  if (!allData.value) return;
  if (!allData.value.name) return true;
  return false;
});

const route = useRoute();

const title = computed(() => {
  return isCreateTemplate.value ? "Create Template" : "Edit Template";
});

const btnText = computed(() => {
  return isCreateTemplate.value ? "Create Work Order Template" : "Save";
});

const handlePublish = () => {
  console.log("allData.value", allData.value);

  submit();
};

const router = useRouter();

const { changeLoading } = usePageLoadingStore();
const submit = async () => {
  try {
    changeLoading(true);
    if (!allData.value) return;

    const res = isCreateTemplate.value
      ? await addTemplate(allData.value)
      : currentTemplateId.value && (await updateTemplate(allData.value, currentTemplateId.value));

    if (res) {
      notifySuccess(t("submitted_successfully"));
      router.push({ name: "templates" });
    }
  } catch (error) {
    console.error(error);
  } finally {
    changeLoading(false);
  }
};

// 获取模板详情
const getTemplateDetailsAsync = async () => {
  try {
    changeLoading(true);
    if (!currentTemplateId.value) return;
    const res = await getTemplateDetails({
      template_id: currentTemplateId.value
    });
    if (res) {
      console.log("当前模板详情", res);

      setCurrentTemplateData(res);
    }
  } catch (error) {
    console.error(error);
  } finally {
    changeLoading(false);
  }
};

onMounted(() => {
  setTemplateId(Number(route.query.template_id));
  if (route.query.template_id) {
    setIsCreateTemplate(false);
  }
  if (!isCreateTemplate.value) {
    getTemplateDetailsAsync();
  }
});

onUnmounted(() => {
  setTemplateId(undefined);
  setIsCreateTemplate(true);
});
</script>
