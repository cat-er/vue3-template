import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { WorkOrderTemlateListKey } from "@/views/template/create/types";
import type { AddTemplateReq, GetTemplateDetailsRes } from "@/api/api/workOrder/types";

/**
 * 工单模板相关
 */
export const useWorkOrderaTemplateCreateStore = defineStore("workOrderTemplateCreateStore", () => {
  // 当前选中的form
  const currentChooseForm = ref<WorkOrderTemlateListKey>();
  const setCurrentChooseForm = (value: WorkOrderTemlateListKey) => {
    currentChooseForm.value = value;
  };

  //表单数据汇总
  const allData = ref<AddTemplateReq>();
  const setAllData = (formValue: any) => {
    allData.value = { ...allData.value, ...formValue.formData };
  };

  // 当前选中的模板ID
  const currentTemplateId = ref<number>();
  const setTemplateId = (value: number | undefined) => {
    currentTemplateId.value = value;
  };

  // 当前模板数据
  const currentTemplateData = ref<GetTemplateDetailsRes>();
  const setCurrentTemplateData = (value: GetTemplateDetailsRes) => {
    currentTemplateData.value = value;
  };

  // 创建模板or编辑模板
  const isCreateTemplate = ref<boolean>(true);
  const setIsCreateTemplate = (value: boolean) => {
    isCreateTemplate.value = value;
  };

  return {
    allData,
    currentChooseForm,
    currentTemplateId,
    currentTemplateData,
    isCreateTemplate,
    setAllData,
    setCurrentChooseForm,
    setTemplateId,
    setCurrentTemplateData,
    setIsCreateTemplate
  };
});
