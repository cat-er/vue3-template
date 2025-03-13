/**
 * 创建工单 模板 选项列表唯一key
 */
export enum WorkOrderTemlateListKey {
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

export interface ActionListTemlateType {
  label: string;
  key: number;
}
