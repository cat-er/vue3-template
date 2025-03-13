import {
  type OutPutForm,
  ValidateFormStatus,
  WorkOrderListKey
} from "@/views/workOrder/create/types";
import { useWorkOrderaTemplateCreateStore } from "@/stores";

export const useOutPutState = (type: WorkOrderListKey, data: any) => {
  const workOrderCreateStore = useWorkOrderaTemplateCreateStore();
  const { setAllData } = workOrderCreateStore;

  const outPutForm = {
    type,
    formData: data
  };

  setAllData(outPutForm);
};
