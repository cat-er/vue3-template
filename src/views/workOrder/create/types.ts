/**
 * 创建工单选项列表唯一key
 */
export enum WorkOrderListKey {
  OVERVIEW,
  SERVICE_DESCRIPTION,
  WORK_CATEGORIES,
  QUALIFICATION,
  LOCATION,
  SCHEDULE,
  CONTACTS,
  CLIENT_DOCUMENTS,
  TASKS,
  PAY
}

/**
 * 创建工单表单项校验状态
 */
export enum ValidateFormStatus {
  UNVALIDATED, //未校验
  ERROR, //失败
  SUCCESS //成功
}

export interface ActionListType {
  label: string;
  key: number;
  status: ValidateFormStatus;
}

// 表单抛出类型
export interface OutPutForm<T> {
  status: ValidateFormStatus;
  type: WorkOrderListKey;
  formData: T;
}
