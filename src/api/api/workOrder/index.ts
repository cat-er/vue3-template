/**
 * 工单管理
 */

import request from "@/api/request";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/onsite/fn`;

import type { PagingData } from "@/api/types";

import type {
  GetWorkTypesRes,
  GetServiceTypesReq,
  GetServiceTypesRes,
  GetQualificationsRes,
  QueryTimezoneReq,
  QueryTimezoneRes,
  AddressVerificationReq,
  AddWorkOrderReq,
  DelWorkOrderReq,
  GetWorkOrderDetailReq,
  GetWorkOrderDetailRes,
  PublishWorkOrderReq,
  RouteProviderReq,
  GetIncompleteReasonsRes,
  MarkIncompleteReq,
  SendMessageReq,
  GetMessageListReq,
  GetProviderListReq,
  CheckProviderQualificationsRes,
  GetWorkOrderListRes,
  GetWorkOrderListReq,
  GetWorkOrderListCountsReq,
  GetWorkOrderListCountsRes,
  GetFNWorkOrderFileListReq,
  GetFNWorkOrderFileListRes,
  UpdateDeliverablesFileReq,
  GetFnWorkOrderPayReq,
  GetFnWorkOrderPayRes,
  GetExpenseCategoryRes,
  AddExpenseReq,
  ExamineExpenseRes,
  BatchExamineExpenseReq,
  ExamineRequestedPayChangeReq,
  EditMessageReadReq,
  GetProviderListRes,
  GetCounterOfferRes,
  GetWorkOrdersProvidersMapReq,
  Pay,
  Schedule,
  GetWorkOrderProviderTypeCountRes,
  copyWorkOrderReq,
  updateCustomLocationReq,
  batchUpdateContactsReq,
  AddTemplateReq,
  GetTemplateListReq,
  GetTemplateListRes,
  GetTemplateListReqStatusEnum,
  GetTemplateDetailsRes,
  Overview,
  ServiceDescription,
  TopSearchReq
} from "./types";
import dayjs from "dayjs";

/**
 * 获取工单类型列表
 */
export const getWorkTypes = () => {
  return request.get<GetWorkTypesRes[]>(`${baseUrl}/getWorkTypes`);
};

/**
 * 获取服务类型列表
 */
export const getServiceTypes = (params: GetServiceTypesReq) => {
  return request.get<GetServiceTypesRes[]>(`${baseUrl}/getServiceTypes`, {
    params
  });
};

/**
 * 获取资格选项列表
 */
export const getQualifications = () => {
  return request.get<GetQualificationsRes>(`${baseUrl}/getQualifications`);
};

/**
 * 根据邮编获取时区信息
 */
export const queryTimezone = (params: QueryTimezoneReq) => {
  return request.get<QueryTimezoneRes>(`${baseUrl}/queryTimezone`, {
    params
  });
};

/**
 * 地址校验
 */
export const addressVerification = (data: AddressVerificationReq) => {
  return request.post(`${baseUrl}/addressVerification`, data);
};

/**
 * 创建工单
 */
export const addWorkOrder = (data: AddWorkOrderReq) => {
  return request.post<GetWorkOrderDetailRes>(`${baseUrl}/addWorkOrder`, data);
};

/**
 * 删除工单
 */
export const delWorkOrder = (data: DelWorkOrderReq) => {
  return request.delete(`${baseUrl}/delWorkOrder`, {
    data
  });
};

/**
 * 更新工单
 * @param id order_id
 * @param data
 */
export const updateWorkOrder = (id: string, data: AddWorkOrderReq) => {
  return request.put(`${baseUrl}/updateWorkOrder/${id}`, data);
};

/**
 * 获取工单列表
 */
export const getWorkOrderList = (data: GetWorkOrderListReq) => {
  return request.post<PagingData<GetWorkOrderListRes[]>>(`${baseUrl}/getWorkOrderList`, data);
};
/**
 * 获取工单列表总数
 */
export const getWorkOrderListCounts = (params: GetWorkOrderListCountsReq) => {
  return request.get<GetWorkOrderListCountsRes>(`${baseUrl}/getWorkOrderListCounts`, {
    params
  });
};

/**
 * 获取工单详情
 */
export const getWorkOrderDetail = (params: GetWorkOrderDetailReq) => {
  return request.get<GetWorkOrderDetailRes>(`${baseUrl}/getWorkOrderDetail`, {
    params
  });
};

/**
 *获取工单Deliverables信息
 * @param params
 * @returns
 */
export const getFNWorkOrderFileList = (params: GetFNWorkOrderFileListReq) => {
  return request.get<GetFNWorkOrderFileListRes[]>(`${baseUrl}/getFNWorkOrderFileList`, {
    params
  });
};

/**
 *处理Deliverables文件，包括：审核、回归审核、编辑备注
 * @param data
 * @param order_id
 * @returns
 */
export const updateDeliverablesFile = (data: UpdateDeliverablesFileReq, order_id: string) => {
  return request.put(`${baseUrl}/updateDeliverablesFile/${order_id}`, data);
};

/**
 * 处理pay信息
 * @param params
 * @returns
 */
export const getFnWorkOrderPay = (params: GetFnWorkOrderPayReq) => {
  return request.get<GetFnWorkOrderPayRes>(`${baseUrl}/getFnWorkOrderPay`, {
    params
  });
};

/**
 * 获取工单Expense的Category
 * @param params
 * @returns
 */
export const getExpenseCategory = (params: { order_id: string }) => {
  return request.get<GetExpenseCategoryRes[]>(`${baseUrl}/getExpenseCategory`, {
    params
  });
};

/**
 * 添加Expense
 * @param data
 * @returns
 */
export const addExpense = (data: AddExpenseReq) => {
  return request.post(`${baseUrl}/addExpense`, data);
};

/**
 * 审核Expense请求
 * @param data
 * @param expense_id
 * @returns
 */
export const examineExpense = (data: ExamineExpenseRes, expense_id: string) => {
  return request.put(`${baseUrl}/examineExpense/${expense_id}`, data);
};

/**
 * 批量审核Expense
 * @param data
 * @param order_id
 * @returns
 */
export const batchExamineExpense = (data: BatchExamineExpenseReq, order_id: string) => {
  return request.put(`${baseUrl}/batchExamineExpense/${order_id}`, data);
};

/**
 * 审核工程师支付格式变化请求
 * @param data
 * @param pay_change_requested_id
 * @returns
 */
export const examineRequestedPayChange = (
  data: ExamineRequestedPayChangeReq,
  pay_change_requested_id: string
) => {
  return request.put(`${baseUrl}/examineRequestedPayChange/${pay_change_requested_id}`, data);
};

/**
 * 发布工单
 */
export const publishWorkOrder = (data: PublishWorkOrderReq) => {
  return request.post(`${baseUrl}/publishWorkOrder`, data);
};

/**
 * 取消发布工单
 */
export const unPublishWorkOrder = (data: PublishWorkOrderReq) => {
  return request.delete(`${baseUrl}/unPublishWorkOrder`, {
    data
  });
};

/**
 * 路由工程师
 */
export const routeProvider = (data: RouteProviderReq) => {
  return request.post(`${baseUrl}/routeProvider`, data);
};

/**
 * 取消路由工程师
 */
export const unRouteProvider = (data: RouteProviderReq) => {
  return request.delete(`${baseUrl}/unRouteProvider`, {
    data
  });
};

/**
 * 分配工程师
 */
export const assignProvider = (data: RouteProviderReq) => {
  return request.post(`${baseUrl}/assignProvider`, data);
};

/**
 * 取消分配工程师
 */
export const unAssignProvider = (data: RouteProviderReq) => {
  return request.delete(`${baseUrl}/unAssignProvider`, {
    data
  });
};

/**
 * 批准工单（工程师完成后）
 */
export const approveWorkOrder = (data: GetWorkOrderDetailReq) => {
  return request.post(`${baseUrl}/approveWorkOrder`, data);
};

/**
 * 批量批准工单（工程师完成后）
 */
export const batchApproveWorkOrder = (data: PublishWorkOrderReq) => {
  return request.post(`${baseUrl}/batchApproveWorkOrder`, data);
};

/**
 * 获得不完整的原因列表
 */
export const getIncompleteReasons = () => {
  return request.get<GetIncompleteReasonsRes[]>(`${baseUrl}/getIncompleteReasons`);
};

/**
 * 标记不完整（工程师完成后）
 */
export const markIncomplete = (data: MarkIncompleteReq) => {
  return request.delete(`${baseUrl}/markIncomplete`, {
    data
  });
};

/**
 * 在工单下发送消息
 */
export const sendMessage = (data: SendMessageReq) => {
  return request.post(`${baseUrl}/sendMessage`, data);
};

/**
 * 获取工单下的消息列表
 */
export const getWorkOrderMessageList = (params: GetMessageListReq) => {
  return request.get(`${baseUrl}/getWorkOrderMessageList`, {
    params
  });
};

/**
 * 获取品牌端的消息列表
 * @param params
 * @returns
 */
export const getMessageList = (params: GetMessageListReq) => {
  return request.get(`${baseUrl}/getWorkOrderMessageList`, {
    params
  });
};

//修改消息是否已读未读
export const editMessageRead = (data: EditMessageReadReq) => {
  return request.post(`${baseUrl}/editMessageRead`, data);
};

/**
 * 获取工单下关联的工程师列表
 */
export const getProviderList = (params: GetProviderListReq) => {
  return request.get<PagingData<GetProviderListRes[]>>(`${baseUrl}/getProviderList`, {
    params
  });
};

/**
 * 检查工程师的资质
 */
export const checkProviderQualifications = (data: RouteProviderReq) => {
  return request.post<CheckProviderQualificationsRes[]>(
    `${baseUrl}/checkProviderQualifications`,
    data
  );
};

/**
 * 获取还价对比文本
 * @param params
 * @returns
 */
export const getCounterOffer = (params: RouteProviderReq) => {
  return request.get<GetCounterOfferRes>(`${baseUrl}/getCounterOffer`, {
    params
  });
};

export const formatTime = (dateString: string) => {
  const date = dayjs(dateString);
  return date.format("M/D/YYYY") + " at " + date.format("h:mm A");
};
export const formatTimeLocal = (dateString: string) => {
  const date = dayjs(dateString);
  return date.format("dddd, MMMM D, YYYY [at] h:mm A");
};

/**
 * 获取工程师与工单的距离图片
 * @param params
 * @returns
 */
export const getWorkOrdersProvidersMap = (params: RouteProviderReq) => {
  return request.get<GetWorkOrdersProvidersMapReq>(`${baseUrl}/getWorkOrdersProvidersMap`, {
    params
  });
};
//复制工单
export const copyWorkOrder = (data: copyWorkOrderReq) => {
  return request.post(`${baseUrl}/copyWorkOrder`, data);
};

export const updateCustomLocation = (order_id: string, data: updateCustomLocationReq) => {
  return request.put(`${baseUrl}/updateCustomLocation/${order_id}`, data);
};
// 批量编辑联系人
export const batchUpdateContacts = (order_id: any, data: batchUpdateContactsReq[]) => {
  return request.put(`${baseUrl}/batchUpdateContacts/${order_id}`, data);
};

/**
 * 更新支付信息
 * @param data
 * @param id
 * @returns
 */
export const updatePay = (data: Pay, id: number | string) => {
  return request.put(`${baseUrl}/updatePay/${id}`, { pay: data });
};

/**
 * 更新时间安排
 * @param data
 * @param id
 * @returns
 */
export const updateSchedule = (data: Schedule, id: number | string) => {
  return request.put(`${baseUrl}/updateSchedule/${id}`, {
    schedule: data
  });
};

/**
 * 获取工单不同类型的工程师总数
 * @param params
 * @returns
 */
export const getWorkOrderProviderTypeCount = (params: { order_id: number | string }) => {
  return request.get<GetWorkOrderProviderTypeCountRes>(`${baseUrl}/getWorkOrderProviderTypeCount`, {
    params
  });
};

/**
 * 创建模板
 * @param data
 * @returns
 */
export const addTemplate = (data: AddTemplateReq) => {
  return request.post(`${baseUrl}/addTemplate`, data);
};

// 更新模板(编辑模板)
export const updateTemplate = (data: AddTemplateReq, id: number) => {
  return request.put(`${baseUrl}/updateTemplate/${id}`, data);
};

/**
 * 获取模板详情
 * @param params
 * @returns
 */
export const getTemplateDetails = (params: { template_id: number }) => {
  return request.get<GetTemplateDetailsRes>(`${baseUrl}/getTemplateDetails`, {
    params
  });
};

/**
 * 获取工单模板列表
 * @param params
 * @returns
 */
export const getTemplateList = (params?: GetTemplateListReq) => {
  return request.get<PagingData<GetTemplateListRes[]>>(`${baseUrl}/getTemplateList`, {
    params
  });
};

/**
 * 获取工单模板列表不分页
 * @param params
 * @returns
 */
export const getTemplateListNoPage = (params?: GetTemplateListReq) => {
  return request.get<GetTemplateListRes[]>(`${baseUrl}/getTemplateListNoPage`, {
    params
  });
};

/**
 * 更新模板状态
 * @param data
 * @param id
 * @returns
 */
export const updateTemplateStatus = (
  data: { status: GetTemplateListReqStatusEnum },
  id: string | number
) => {
  return request.put<GetTemplateListRes[]>(`${baseUrl}/updateTemplateStatus/${id}`, data);
};

/**
 * 获取美国节假日
 * @param params
 * @returns
 */
export const getUsHolidays = (params: { year: string }) => {
  return request.get<string[]>(`${baseUrl}/getUsHolidays`, {
    params
  });
};
/**
 * 退回草稿
 */
export const revertToDraft = (data: PublishWorkOrderReq) => {
  return request.delete(`${baseUrl}/revertToDraft`, {
    data
  });
};
/**
 * 编辑overview
 * */
export const updateOverview = (order_id: string, data: Overview) => {
  return request.put(`${baseUrl}/updateOverview/${order_id}`, data);
};
/**
 *顶部搜索
 */
export const topSearch = (params: TopSearchReq) => {
  return request.get(`${baseUrl}/topSearch`, {
    params
  });
};
/**
 * 编辑 Service Description
 * */
export const updateServiceDescription = (order_id: number, data: ServiceDescription) => {
  return request.put(`${baseUrl}/updateServiceDescription/${order_id}`, data);
};
