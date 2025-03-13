<template>
  <a-card :title="t('qualification')" class="form-qualification box-shadow">
    <div class="margin-bottom-8 form-label">
      {{ t("work_order_qualifications_label") }}
    </div>

    <qualificationsSelect
      v-for="item in qualificationsItemList"
      :key="item.id"
      :item-id="item.id"
      :qualifications-key="qualificationsKeyList"
      :qualifications-list="qualificationsList"
      :echo-index="item.echoIndex"
      @removeItem="handleRemoveItem"
      @changeDisabled="handleChangeDisabled"
      @outPutHandle="handleOutPut"
    ></qualificationsSelect>

    <a-button
      class="qualification-add"
      :icon="h(PlusOutlined)"
      type="primary"
      :loading="addLoading"
      @click="addQualificationsItem"
    >
      {{ t("add_qualifications") }}
    </a-button>
  </a-card>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { h, onMounted, ref, watch } from "vue";
import {
  Qualifications,
  GetQualificationsRes,
  GetTemplateDetailsRes
} from "@/api/api/workOrder/types";
import { PlusOutlined } from "@ant-design/icons-vue";
import qualificationsSelect from "./components/formWorkOrderQualifications/qualificationsSelect.vue";
import { getQualifications } from "@/api/api/workOrder";
import { ResultList } from "./components/formWorkOrderQualifications/qualificationsSelect.vue";
import uuid from "@/utils/uuid";
import { useOutPutState } from "../hooks";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { storeToRefs } from "pinia";
import { useWorkOrderaTemplateCreateStore } from "@/stores";

const formData = ref<Qualifications>({
  certifications: [],
  covid19: [],
  equipments: [],
  insurances: [],
  licenses: [],
  backgroundCheck: [],
  drugTest: []
});

export interface QualificationsKeyList {
  label: string;
  disabled: boolean;
}

// 资格key list
const qualificationsKeyList = ref<QualificationsKeyList[]>([]);
const getQualificationsKeyList = (list: GetQualificationsRes) => {
  const arr = Object.keys(list);
  arr.forEach((item) => {
    const newObj: QualificationsKeyList = {
      label: item,
      disabled: false
    };
    qualificationsKeyList.value.push(newObj);
  });
};

// 初始时获取数据 将按钮置为loading
const addLoading = ref<boolean>(false);
const qualificationsList = ref<GetQualificationsRes>({} as GetQualificationsRes);
const getQualificationsList = async () => {
  try {
    addLoading.value = true;
    qualificationsList.value = await getQualifications();
    getQualificationsKeyList(qualificationsList.value);
  } catch (err) {
    console.error(err);
  } finally {
    addLoading.value = false;
  }
};

// 列表组件相关 移除
interface QualificationsItemList {
  id: string;
  echoIndex?: number;
}

const qualificationsItemList = ref<QualificationsItemList[]>([]);
const addQualificationsItem = () => {
  const item: QualificationsItemList = { id: uuid() };
  qualificationsItemList.value.push(item);
};

const handleRemoveItem = (id: string, label: string) => {
  // 更新 qualificationsItemList
  qualificationsItemList.value = qualificationsItemList.value.filter((item) => id !== item.id);
  // 切换禁用状态
  removeChangeDisabled(id, label);

  // 确保 formData 中有对应的项才进行清空
  if (label in formData.value) {
    formData.value[label as keyof Qualifications] = [];
  }
};

// 切换禁用数据
const currentChooseKeySet = ref<{ label: string; id: string }[]>([]);
// 移除时切换禁用状态的逻辑
const removeChangeDisabled = (id: string, value: string) => {
  const item = qualificationsKeyList.value.find((item) => item.label === value);
  if (item) {
    item.disabled = !item.disabled;
  }

  const index = currentChooseKeySet.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    currentChooseKeySet.value.splice(index, 1);
  }
};

// 选项点击时 切换禁用状态
const handleChangeDisabled = (value: string, id: string) => {
  const index = currentChooseKeySet.value.findIndex((item) => item.id === id);

  if (index === -1) {
    currentChooseKeySet.value.push({ label: value, id });
  } else {
    currentChooseKeySet.value[index].label = value;
  }

  qualificationsKeyList.value.forEach((item) => {
    item.disabled = currentChooseKeySet.value.some((chosen) => chosen.label === item.label);
  });
};

// 数据汇总
const handleOutPut = (state: ResultList) => {
  if (!state.label) return;
  formData.value[state.label as keyof Qualifications] = state.list;

  useOutPutState(true, WorkOrderListKey.QUALIFICATION, {
    qualifications: formData.value
  });
};

// 模板数据回显
const { currentTemplateData } = storeToRefs(useWorkOrderaTemplateCreateStore());

const echoAddQualificationsItem = (index: number) => {
  const item: QualificationsItemList = { id: uuid(), echoIndex: index };
  qualificationsItemList.value.push(item);
};
const temDataEcho = () => {
  qualificationsItemList.value = [];
  currentChooseKeySet.value = [];
  qualificationsKeyList.value.forEach((item) => (item.disabled = false));
  let index = 0; // 初始化下标
  for (const key in currentTemplateData.value?.qualifications) {
    if (!Object.prototype.hasOwnProperty.call(currentTemplateData.value?.qualifications, key))
      continue;
    if (!currentTemplateData.value) return;
    const qualificationKey = key as keyof typeof currentTemplateData.value.qualifications;

    if (currentTemplateData.value?.qualifications[qualificationKey].length > 0) {
      echoAddQualificationsItem(index);
    }
    index++; // 递增下标
  }
};

onMounted(async () => {
  await getQualificationsList();
  useOutPutState(true, WorkOrderListKey.QUALIFICATION, {
    qualifications: formData.value
  });

  // 确保数据已加载后再进行回显
  if (currentTemplateData.value) {
    temDataEcho();
  }

  watch(
    () => currentTemplateData.value,
    (newData) => {
      if (newData) {
        temDataEcho();
      }
    }
  );
});
</script>
