<template>
  <a-card :title="t('work_categories')" class="box-shadow">
    <a-form
      ref="formRef"
      :model="formData"
      name="workCategories"
      layout="vertical"
      :wrapper-col="{ span: 24 }"
      :rules="rules"
    >
      <a-form-item name="work_type_id" :label="t('type_of_work')">
        <a-spin :spinning="workTypeLoading">
          <a-select
            :placeholder="t('select_placeholder')"
            showSearch
            optionFilterProp="label"
            v-model:value="formData.work_type_id"
            @select="workTypeSelect"
          >
            <a-select-opt-group
              v-for="item in formatWorkTypeList"
              :key="item.label"
              :label="item.label"
            >
              <a-select-option
                v-for="_item in item.list"
                :key="_item.id"
                :value="_item.id"
                :label="_item.name"
              >
                {{ _item.name }}
              </a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-spin>
      </a-form-item>

      <a-form-item name="service_types" :label="t('service_types')">
        <a-spin :spinning="serviceTypeLoading">
          <a-select
            mode="multiple"
            allowClear
            :placeholder="t('select_placeholder')"
            v-model:value="tempServiceTypesList"
            @change="serviceTypeSelect"
          >
            <a-select-option v-for="item in serviceTypeList" :key="item.id" :value="item.id">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-spin>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { ref, onMounted, watch, computed } from "vue";
import type {
  WorkCategories,
  GetWorkTypesRes,
  GetServiceTypesRes,
  ServiceType,
  GetTemplateDetailsRes
} from "@/api/api/workOrder/types";
import type { Rule } from "ant-design-vue/es/form";
import { getWorkTypes, getServiceTypes } from "@/api/api/workOrder";
import { useOutPutState } from "../hooks";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { useWorkOrderaTemplateCreateStore } from "@/stores";
import { storeToRefs } from "pinia";

// 临时存储
const tempServiceTypesList = ref<number[]>([]);
const tempServiceTypesListComputed = computed<ServiceType[]>(() => {
  return tempServiceTypesList.value.map((number) => ({ id: number }));
});

const formData = ref<WorkCategories>({
  work_type_id: undefined,
  service_types: tempServiceTypesListComputed.value
});

const rules: Record<string, Rule[]> = {
  // work_type_id: [{ required: true, trigger: ["change", "blur"] }],
  // service_types: [{ required: true, trigger: ["change", "blur"] }]
};

// workType相关
const workTypeLoading = ref<boolean>(false);
const workTypeList = ref<GetWorkTypesRes[]>();

interface FormatWorkTypeList {
  label: string;
  list: GetWorkTypesRes[];
}

// 需要格式化分组
const formatWorkTypeList = ref<FormatWorkTypeList[]>([]);
const format = (list: GetWorkTypesRes[]) => {
  const labelList: string[] = [];
  list.forEach((item) => {
    if (!labelList.includes(item.industry)) {
      labelList.push(item.industry);
      const obj: FormatWorkTypeList = {
        label: item.industry,
        list: []
      };
      formatWorkTypeList.value.push(obj);
    }
    formatWorkTypeList.value.forEach((_item) => {
      if (_item.label === item.industry) {
        _item.list.push(item);
      }
    });
  });
};

const getWorkTypesList = async () => {
  try {
    workTypeLoading.value = true;
    const res = await getWorkTypes();
    if (Array.isArray(res)) {
      workTypeList.value = res;
      format(workTypeList.value);
    }
  } catch (err) {
    console.error(err);
  } finally {
    workTypeLoading.value = false;
  }
};

// service type相关
const serviceTypeLoading = ref<boolean>(false);
const serviceTypeList = ref<GetServiceTypesRes[]>([]);
const getServiceTypeList = async (id: number) => {
  try {
    serviceTypeLoading.value = true;
    workTypeLoading.value = true;
    const res = await getServiceTypes({
      work_type_id: id
    });
    if (Array.isArray(res)) {
      serviceTypeList.value = res;
    }
  } catch (err) {
    console.error(err);
  } finally {
    serviceTypeLoading.value = false;
    workTypeLoading.value = false;
  }
};

const workTypeSelect = (value: any) => {
  tempServiceTypesList.value = [];
  getServiceTypeList(value);
};

const serviceTypeSelect = () => {
  formData.value.service_types = tempServiceTypesListComputed.value;
};

// 校验
const formRef = ref();
// const formValidate = async () => {
//   try {
//     await formRef.value.validate();
//     useOutPutState(true, WorkOrderListKey.WORK_CATEGORIES, formData.value);
//   } catch (err) {
//     useOutPutState(false, WorkOrderListKey.WORK_CATEGORIES, formData.value);
//   }
// };

// 数据回显
const { currentTemplateData, isCreateTemplate } = storeToRefs(useWorkOrderaTemplateCreateStore());
const temDataEcho = (data: GetTemplateDetailsRes) => {
  if (isCreateTemplate.value) return;
  formData.value.work_type_id = undefined;
  tempServiceTypesList.value = [];
  formData.value.work_type_id = data.work_type_id;

  if (!data.work_type_id) return;
  getServiceTypeList(data.work_type_id);
  if ("service_type_ids" in data && data.service_type_ids) {
    tempServiceTypesList.value = data.service_type_ids;
    serviceTypeSelect();
  }
};

watch(
  () => currentTemplateData.value,
  () => {
    if (!currentTemplateData.value) return;
    temDataEcho(currentTemplateData.value);
  }
);

watch(
  () => formData.value,
  () => {
    useOutPutState(WorkOrderListKey.WORK_CATEGORIES, formData.value);
  },
  { deep: true }
);

onMounted(() => {
  getWorkTypesList();
  useOutPutState(WorkOrderListKey.WORK_CATEGORIES, formData.value);
});
</script>
