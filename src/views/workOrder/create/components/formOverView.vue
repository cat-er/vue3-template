<template>
  <a-card class="box-shadow" :title="t('overview')">
    <a-form
      ref="formRef"
      :model="formData"
      name="overview"
      layout="vertical"
      :wrapper-col="{ span: 24 }"
      :rules="rules"
    >
      <a-form-item label="Template">
        <a-spin :spinning="templateListLoading">
          <a-select
            v-model:value="templateSelect"
            showSearch
            optionFilterProp="key"
            @change="templateChoose"
          >
            <a-select-option v-for="item in templateList" :key="item.name" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-spin>
      </a-form-item>

      <a-form-item :label="t('work_order_title')" name="title">
        <a-input v-no-chinese v-model:value="formData.title" />
        <div class="form-note">
          {{ t("work_order_title_tip") }}
        </div>
      </a-form-item>

      <span>{{ t("work_order_options") }}</span>
      <a-form-item label="" name="printable" class="overview-checkbox">
        <a-checkbox v-model:checked="formData.printable">
          {{ t("allow_export_button") }}
        </a-checkbox>
      </a-form-item>

      <a-form-item label="" name="allow_counter_offers" class="overview-checkbox">
        <a-checkbox v-model:checked="formData.allow_counter_offers">
          {{ t("allow_counter_offers") }}
        </a-checkbox>
      </a-form-item>

      <a-form-item label="" name="require_gps" class="overview-checkbox">
        <a-checkbox v-model:checked="formData.require_gps">
          {{ t("require_gps") }}
        </a-checkbox>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { ref, onMounted, watch } from "vue";
import {
  Overview,
  GetTemplateListRes,
  GetTemplateListReqStatusEnum,
  GetTemplateDetailsRes
} from "@/api/api/workOrder/types";
import type { Rule } from "ant-design-vue/es/form";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { useOutPutState } from "../hooks";
import { getTemplateListNoPage } from "@/api/api/workOrder/index";
import { useWorkOrderaTemplateCreateStore } from "@/stores";
import type { SelectValue } from "ant-design-vue/es/select/index.d.ts";
import { storeToRefs } from "pinia";

const formData = ref<Overview>({
  title: undefined,
  allow_counter_offers: true,
  require_gps: true,
  printable: false
});

const rules: Record<string, Rule[]> = {
  title: [{ required: true, trigger: ["blur"] }],
  allow_counter_offers: [{ required: true, trigger: ["change"] }],
  require_gps: [{ required: true, trigger: ["change"] }],
  printable: [{ required: true, trigger: ["change"] }]
};

// 获取所有模板选项
const { setTemplateId } = useWorkOrderaTemplateCreateStore();
const templateChoose = (value: SelectValue) => {
  setTemplateId(value as number);
};

const templateList = ref<GetTemplateListRes[]>();
const templateListLoading = ref(false);
const getTemplateListNoPageAsync = async () => {
  try {
    templateListLoading.value = true;
    const res = await getTemplateListNoPage();
    if (res) {
      // 过滤未激活的模板
      templateList.value = res.filter((item) => item.status === GetTemplateListReqStatusEnum.OPEN);
      if (currentTemplateId.value) {
        templateSelect.value = currentTemplateId.value;
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    templateListLoading.value = false;
  }
};

// 下拉框选择的模板
const templateSelect = ref<number>();

// 数据回显
const temDataEcho = (data: GetTemplateDetailsRes) => {
  for (const key in formData.value) {
    if (Object.prototype.hasOwnProperty.call(formData.value, key)) {
      (formData.value as any)[key] = (data as any)[key];
    }
  }
};

// 模板数据回显
const { currentTemplateData, currentTemplateId } = storeToRefs(useWorkOrderaTemplateCreateStore());
watch(
  () => currentTemplateData.value,
  () => {
    if (!currentTemplateData.value) return;
    temDataEcho(currentTemplateData.value);
  }
);

// 校验
const formRef = ref();
const formValidate = async () => {
  try {
    await formRef.value.validate();
    useOutPutState(true, WorkOrderListKey.OVERVIEW, {
      ...formData.value,
      template_id: templateSelect.value
    });
  } catch (err) {
    useOutPutState(false, WorkOrderListKey.OVERVIEW, {
      ...formData.value,
      template_id: templateSelect.value
    });
  }
};

watch(
  () => formData.value,
  () => {
    formValidate();
  },
  { deep: true }
);

onMounted(() => {
  formValidate();
  getTemplateListNoPageAsync();
});
</script>

<style scoped>
.overview-checkbox {
  margin-bottom: 0;
}
</style>
