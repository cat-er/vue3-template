import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { WorkOrderListKey, OutPutForm } from "@/views/workOrder/create/types";
import { ValidateFormStatus } from "@/views/workOrder/create/types";
import type {
  QueryTimezoneRes,
  AddWorkOrderReq,
  GetWorkOrderDetailRes,
  GetFnWorkOrderPayRes,
  GetProviderListRes,
  GetWorkOrderProviderTypeCountRes,
  GetApproveFeeRes
} from "@/api/api/workOrder/types";
import { GetProviderListTypeEnum } from "@/api/api/workOrder/types";

import type { BalanceRes } from "@/api/api/amount/types";

import type { PagingData } from "@/api/types";
import { getWorkOrderDetail, getWorkOrderProviderTypeCount } from "@/api/api/workOrder";
/**
 * 创建工单
 */
export const useWorkOrderCreateStore = defineStore("workOrderCreateStore", () => {
  // 当前选中的form
  const currentChooseForm = ref<WorkOrderListKey>();
  const setCurrentChooseForm = (value: WorkOrderListKey | undefined) => {
    currentChooseForm.value = value;
  };

  // 状态列表 下标对应表单顺序
  const formStatusList = ref<ValidateFormStatus[]>([
    ValidateFormStatus.UNVALIDATED,
    ValidateFormStatus.UNVALIDATED,
    ValidateFormStatus.UNVALIDATED,
    ValidateFormStatus.UNVALIDATED,
    ValidateFormStatus.UNVALIDATED,
    ValidateFormStatus.UNVALIDATED,
    ValidateFormStatus.UNVALIDATED,
    ValidateFormStatus.UNVALIDATED,
    ValidateFormStatus.UNVALIDATED,
    ValidateFormStatus.UNVALIDATED
  ]);
  const isOver = computed(() => {
    return formStatusList.value.every((item) => item === ValidateFormStatus.SUCCESS);
  });

  // 根据地址获取的时区
  const timeZone = ref<QueryTimezoneRes>();
  const setTimeZone = (value: QueryTimezoneRes) => {
    timeZone.value = value;
  };

  //表单数据汇总
  const allData = ref<AddWorkOrderReq>({} as AddWorkOrderReq);
  const setAllData = (formValue: OutPutForm<any>) => {
    formStatusList.value[formValue.type] = formValue.status;
    allData.value = { ...allData.value, ...formValue.formData };
  };

  const setAllDataIsDraft = (isDraft: boolean) => {
    allData.value.is_draft = isDraft;
  };

  return {
    currentChooseForm,
    timeZone,
    formStatusList,
    isOver,
    allData,
    setCurrentChooseForm,
    setTimeZone,
    setAllData,
    setAllDataIsDraft
  };
});

/**
 * 工单详情
 */
export const useWorkOrderDetailStore = defineStore("workOrderDetailStore", () => {
  const workOrderDetail = ref<GetWorkOrderDetailRes>();

  // 工单状态
  const workOrderStatus = computed(() => {
    return workOrderDetail.value?.status;
  });

  // 工单ID
  const workOrderId = computed(() => {
    return workOrderDetail.value?.id;
  });

  const setWorkOrderDetail = async (id: number) => {
    try {
      const res = await getWorkOrderDetail({ order_id: id });
      if (res) {
        workOrderDetail.value = res;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    workOrderDetail,
    workOrderStatus,
    workOrderId,
    setWorkOrderDetail
  };
});

/**
 * 工单详情-工程师列表
 */
export const useWorkOrderProvidersList = defineStore("workOrderProvidersList", () => {
  // 工程师接口数据
  const workOrderProviders = ref<PagingData<GetProviderListRes[]>>();

  // 工程师列表数据
  const workOrderProvidersList = computed(() => {
    return workOrderProviders.value?.data;
  });

  // 数量
  const providerTotal = computed(() => {
    return workOrderProviders.value?.meta.total;
  });

  const setWorkOrderProviders = (data: PagingData<GetProviderListRes[]>) => {
    workOrderProviders.value = data;
  };

  // loading
  const providerIsLoading = ref<boolean>(false);
  const setProviderIsLoading = (value: boolean) => {
    providerIsLoading.value = value;
  };

  // 当前选择的type
  const currentProviderType = ref<GetProviderListTypeEnum>();
  const setCurrentProviderType = (value: GetProviderListTypeEnum | undefined) => {
    currentProviderType.value = value;
  };

  // 当前选择的工程师
  const currentProvider = ref<GetProviderListRes>();
  const setCurrentProvider = (value: GetProviderListRes | undefined) => {
    currentProvider.value = value;
  };

  // 通过id清除工程师
  const delProvider = (id: number) => {
    if (!workOrderProviders.value) return;
    workOrderProviders.value.data = workOrderProviders.value?.data.filter((item) => {
      return item.provider_id !== id;
    });
  };

  // 获取工单下不同类型的工程师数量
  const providerTypeCount = ref<GetWorkOrderProviderTypeCountRes>();
  const setProviderTypeCount = async (id: number) => {
    try {
      const res = await getWorkOrderProviderTypeCount({ order_id: id });
      if (res) {
        providerTypeCount.value = res;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    workOrderProviders,
    workOrderProvidersList,
    currentProviderType,
    providerTotal,
    providerIsLoading,
    currentProvider,
    providerTypeCount,
    setCurrentProviderType,
    setWorkOrderProviders,
    setProviderIsLoading,
    setCurrentProvider,
    delProvider,
    setProviderTypeCount
  };
});

//支付详情
export const useFnWorkOrderPayStore = defineStore("FnWorkOrderPay", () => {
  const fnWorkOrderPay = ref<GetFnWorkOrderPayRes>();
  const setFnWorkOrderPay = (detail: GetFnWorkOrderPayRes) => {
    fnWorkOrderPay.value = detail;
    setApproveFee();
  };

  // 批准按钮点击时是否展示异常提示框
  const approveFee = ref<GetApproveFeeRes>({
    is_error: false,
    pay_change: false,
    expenses_count: 0
  });
  const setApproveFee = () => {
    if (
      fnWorkOrderPay.value?.increases &&
      fnWorkOrderPay.value?.increases.pay_change &&
      fnWorkOrderPay.value?.increases.pay_change.id
    ) {
      approveFee.value.is_error = true;
      approveFee.value.pay_change = true;
    }
    if (fnWorkOrderPay.value?.expenses && fnWorkOrderPay.value?.expenses.results) {
      approveFee.value.expenses_count = fnWorkOrderPay.value?.expenses.results.filter(
        (item) => item.status === "new"
      ).length;
      approveFee.value.is_error = approveFee.value.expenses_count > 0 || approveFee.value.is_error;
    }
  };

  return {
    setFnWorkOrderPay,
    fnWorkOrderPay,
    setApproveFee,
    approveFee
  };
});
// 用户余额
export const useCompanyBalanceStore = defineStore("companyBalance", () => {
  const companyBalance = ref<BalanceRes>();
  const setCompanyBalance = (detail: BalanceRes) => {
    companyBalance.value = detail;
  };

  return {
    setCompanyBalance,
    companyBalance
  };
});
