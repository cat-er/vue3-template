<template>
  <div class="qualification-select flex">
    <a-button
      type="text"
      shape="circle"
      size="small"
      danger
      :icon="h(DeleteOutlined)"
      @click="removeItem"
    />
    <div class="qualification-select-item select-item-left flex">
      <div class="form-label">{{ t("qualifications_type") }}</div>
      <a-select
        :placeholder="t('select_placeholder')"
        v-model:value="resultItem.label"
        @change="qualificationSelect"
      >
        <a-select-option
          v-for="(item, index) in qualificationsKey"
          :key="index"
          :value="item.label"
          :disabled="item.disabled"
        >
          {{ formatPascalCase(item.label).spacedPascalCase }}
        </a-select-option>
      </a-select>
    </div>

    <div class="qualification-select-item select-item-right flex">
      <div class="form-label">
        {{ resultItem.label ? resultItem.label : t("select_placeholder") }}
      </div>
      <a-select
        class="overflow"
        :mode="isMultiple ? 'multiple' : undefined"
        allowClear
        :disabled="resultItemDisabled"
        v-model:value="resultItem.list"
        showSearch
        optionFilterProp="key"
        @change="resultItemSelect"
      >
        <a-select-option v-for="(item, index) in resultItemList" :key="item.name" :value="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, computed, ref, watch } from "vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { t } from "@/locale";
import { QualificationsKeyList } from "@/views/workOrder/create/components/formWorkOrderQualifications.vue";
import { GetQualificationsRes, GetQualificationsResItemResult } from "@/api/api/workOrder/types";
import formatPascalCase from "@/utils/pascalCase";
import { storeToRefs } from "pinia";
import { useWorkOrderaTemplateCreateStore } from "@/stores";

interface Props {
  itemId: string;
  qualificationsKey: QualificationsKeyList[];
  qualificationsList: GetQualificationsRes;
  echoIndex?: number;
}

const props = defineProps<Props>();

export interface ResultList {
  label: string;
  list: number[];
}

interface Emits {
  (e: "removeItem", value: string, label: string): void;

  (e: "changeDisabled", value: string, id: string): void;

  (e: "outPutHandle", value: ResultList): void;
}

const emits = defineEmits<Emits>();

// 表单数据
const resultItem = ref<ResultList>({
  label: "",
  list: []
});

// 选择时清除
const qualificationSelect = (value: any) => {
  resultItem.value.list = [];
  emits("changeDisabled", value, props.itemId);
  emits("outPutHandle", resultItem.value);
};

// 右侧列表由左侧生成
const resultItemList = computed(() => {
  if (!resultItem.value.label) {
    return [];
  } else {
    return props.qualificationsList[resultItem.value.label as keyof GetQualificationsRes].results;
  }
});

// 右侧列表是否多选
const isMultipleLabelList = ["backgroundCheck", "drugTest"];
const isMultiple = computed(() => {
  return !isMultipleLabelList.includes(resultItem.value.label);
});

// 左侧未选择前禁用
const resultItemDisabled = computed(() => {
  return !resultItem.value.label;
});

// 抛出移除事件
const removeItem = () => {
  emits("removeItem", props.itemId, resultItem.value.label);
};

// 右侧列表点击事件 处理单选和多选 抛出数据
const resultItemSelect = (value: any) => {
  if (value === undefined) {
    resultItem.value.list = [];
  } else {
    resultItem.value.list = isMultiple.value ? resultItem.value.list : [value];
  }
  emits("outPutHandle", resultItem.value);
};

// 数据回显
const { currentTemplateData } = storeToRefs(useWorkOrderaTemplateCreateStore());

const temDataEcho = (echoIndex: number) => {
  if (!currentTemplateData.value) return;
  Object.entries(currentTemplateData.value.qualifications).forEach(([key, value], index) => {
    if (index === echoIndex) {
      qualificationSelect(key);
      resultItem.value.label = key;
      resultItem.value.list = value;
      emits("outPutHandle", resultItem.value);
    }
  });
};

watch(
  () => props.echoIndex,
  () => {
    if (props.echoIndex === undefined) return;
    temDataEcho(props.echoIndex);
  },
  { immediate: true }
);
</script>
