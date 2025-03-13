import {
  type OutPutForm,
  ValidateFormStatus,
  WorkOrderListKey
} from "@/views/workOrder/create/types";
import { useWorkOrderCreateStore } from "@/stores";

/**
 * 数据提交
 * @param status
 * @param type
 * @param data
 */
export const useOutPutState = (status: boolean, type: WorkOrderListKey, data: any) => {
  const workOrderCreateStore = useWorkOrderCreateStore();
  const { setAllData } = workOrderCreateStore;

  const _status = status ? ValidateFormStatus.SUCCESS : ValidateFormStatus.ERROR;

  const outPutForm: OutPutForm<any> = {
    status: _status,
    type,
    formData: data
  };

  setAllData(outPutForm);
};
