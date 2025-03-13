<template>
  <a-modal v-model:open="open" :maskClosable="false" :afterClose="hide" title="Save Filters">
    <div class="margin-bottom-16">
      <a-radio-group v-model:value="currentSaveType" @change="typeChange">
        <a-radio :value="SaveTypeEnum.SAVE">Create new saved filter</a-radio>
        <a-radio :value="SaveTypeEnum.UPDATE">Update existing saved filter</a-radio>
      </a-radio-group>
    </div>
    <div v-if="currentSaveType === SaveTypeEnum.SAVE">
      <span>Saved filter name</span>
      <a-input v-model:value="filterName" />
      <span class="font-color-minor">Short description only visible to you</span>
    </div>

    <div v-else>
      <span>Saved Filters</span>
      <a-select class="full" v-model:value="filterId" show-search optionFilterProp="label">
        <a-select-option
          v-for="item in filterGroupList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
    </div>

    <template #footer>
      <loadButton type="primary" :disabled="submitDisabled" @click="submit">Save</loadButton>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import loadButton from "@/components/loadButton/loadButton.vue";
import { SaveTypeEnum, AddFilterGroupReq } from "@/api/api/filter/type";
import { addFilterGroup, editFilterGroup } from "@/api/api/filter";
import { useWorkOrderFilterStore } from "@/stores";
import { storeToRefs } from "pinia";
import { notifySuccess } from "@/utils/notify";

const open = ref<boolean>(false);

// 关闭时清除缓存数据
const clear = (isHide: boolean) => {
  filterName.value = "";
  filterId.value = "";
  if (isHide) currentSaveType.value = SaveTypeEnum.SAVE;
};

const show = () => {
  open.value = true;
  filterId.value = currentChoosedFilterGroupId.value;
};

const hide = () => {
  open.value = false;
  clear(true);
};

const currentSaveType = ref<SaveTypeEnum>(SaveTypeEnum.SAVE);
const typeChange = () => {
  // clear(false);
};

const { filtersParams, filterGroupList, currentChoosedFilterGroupId } =
  storeToRefs(useWorkOrderFilterStore());

const filterName = ref("");
const filterId = ref<string | number>("");
const submitData = ref<AddFilterGroupReq>({
  name: "",
  value: ""
});

const submitDisabled = computed(() => {
  if (currentSaveType.value === SaveTypeEnum.SAVE) {
    return !filterName.value;
  }
  return !filterId.value;
});

const format = () => {
  submitData.value.value = filtersParams.value;
  if (currentSaveType.value === SaveTypeEnum.SAVE) submitData.value.name = filterName.value;
};

interface Emits {
  (e: "saveIsDone"): void;
}
const emits = defineEmits<Emits>();

// 保存为新的过滤器组 或更新
const submit = async (loading: (value: boolean) => void) => {
  loading(true);
  try {
    format();

    const res =
      currentSaveType.value === SaveTypeEnum.SAVE
        ? await addFilterGroup(submitData.value)
        : await editFilterGroup(submitData.value, filterId.value);

    if (res) {
      hide();
      emits("saveIsDone");
      notifySuccess("Operate successfully!");
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading(false);
  }
};

defineExpose({
  show,
  hide
});
</script>
