export interface Emits {
  (e: "popoverOpenChange", value: boolean): void;
  (e: "addFilterControl", value: FilterFieldListRender): void;
  (e: "removeFilterControl", value: string | number): void;
}

export interface GetFilterApiUrlReq {
  keyword: string;
}

export interface GetFilterApiUrlRes {
  label: string;
  value: number | string;
}

// 工单类型(二进制存储)
export enum GetFilterFieldListCategoryEnum {
  IN_FLIGHT = 1,
  DRAFT = 2,
  PUBLISHED_ROUTED = 4,
  ASSIGNED = 8,
  DONE = 16,
  APPROVED = 32,
  ALL = 64
}

export interface GetFilterFieldListReq {
  category: GetFilterFieldListCategoryEnum;
}

// 过滤器控件类型
export enum FilterTypeEnum {
  TEXT = 1,
  MULTI_SELECT = 2,
  TYPEAHEAD = 3,
  ADVANCED_DATE_RANGE = 4,
  NUMBER = 5,
  BOOLEAN = 6
}

// 选项列表获取方式
export enum LoadOptionsEnum {
  API_URL = 0,
  OPTION = 1,
  OTHER = 2
}

// 过滤器列表分组
export enum GetFilterFieldListGroupEnum {
  OTHER = 1,
  TIME = 2,
  LOCATION = 3
}

export interface GetFilterFieldListRes {
  id: number;
  name: string;
  type: FilterTypeEnum;
  category: GetFilterFieldListCategoryEnum;
  group: GetFilterFieldListGroupEnum;
  load_options: LoadOptionsEnum;
  param_transfer: string;
  options?: GetFilterFieldListResOption[] | null;
  api_url: string;
  example: string;
  created_at: string;
  updated_at: string;
}

export interface RenderGetFilterFieldListRes {
  [key: number]: GetFilterFieldListRes[];
}

export interface GetFilterFieldListResOption {
  label: string;
  value: string | number;
}

export interface AddFilterGroupReq {
  name: string;
  value: any;
}

export interface EditFilterGroupReq extends AddFilterGroupReq {}

export interface DelFilterGroupReq {
  ids: number[];
}

export enum FilterDateLabelEnum {
  YESTERDAY = 1,
  TODAY = 2,
  LAST_WEEK = 3,
  THIS_WEEK = 4,
  LAST_2_WEEKS = 5,
  LAST_MONTH = 6,
  THIS_MONTH = 7,
  CUSTOM = 8
}

// 用于渲染
export interface FilterFieldListRender extends GetFilterFieldListRes {
  value: any;
}

export enum SaveTypeEnum {
  SAVE = 1,
  UPDATE = 2
}

export interface GetFilterGroupRes {
  id: number;
  value: any;
  name: string;
  creator: number | string;
  created_at: string;
  updated_at: string;
  field_info: GetFilterFieldListRes[];
}
