import type { Page } from "@/api/types";
import type { FileList } from "../fileManager/types";

export interface GetWorkTypesRes {
  id: number; //类型id
  industry_id: number; //行业id
  industry: string; //行业名称
  name: string; //类型名称
}

export interface GetServiceTypesReq {
  work_type_id: number | undefined; //工单类型id
}

export interface GetServiceTypesRes {
  id: number; //服务ID
  text: string; //服务名称
}

export interface GetQualificationsRes {
  certifications: GetQualificationsResItem;
  equipments: GetQualificationsResItem;
  insurances: GetQualificationsResItem;
  backgroundCheck: GetQualificationsResItem;
  drugTest: GetQualificationsResItem;
  covid19: GetQualificationsResItem;
  licenses: GetQualificationsResItem;
}

export interface GetQualificationsResItem {
  metadata: Metadata;
  results: GetQualificationsResItemResult[];
}

export interface Metadata {
  total: number;
}

export interface GetQualificationsResItemResult {
  category: number;
  dynamicTermId?: number;
  id: number;
  name: string;
  sourceId: number;
}

export interface QueryTimezoneReq {
  zip: string; //邮编
  state_code: string; //州代码
  country_code: string; //国家代码
}

export interface QueryTimezoneRes {
  time_zone_id: number; //时区ID
  name: string; //时区名称
  offset: number; //utc偏移量
  short: string; //时区简称
  category: string; //区域
}

export interface AddressVerificationReq {
  address1: string;
  address2?: string;
  city: string;
  state: string; //州编码
  country: string;
  zip: string;
}

export interface Overview {
  title: string | undefined;
  allow_counter_offers: boolean; //是否允许工程师还价
  require_gps: boolean; //是否需要工程师在check in和check out时请求GPS定位
  printable: boolean; //是否允许工程师打印文档信息
}

export interface ServiceDescription {
  description_html: string;
  confidential_html?: string | undefined;
}

export interface WorkCategories {
  work_type_id: number | undefined;
  service_types?: ServiceType[];
}

// 创建工单
export interface AddWorkOrderReq extends Overview, ServiceDescription, WorkCategories {
  location: Location;
  schedule: Schedule;
  pay: Pay;
  contacts?: Contact[];
  tasks: Task[];
  qualifications?: GetQualificationsRes;
  client_documents?: ClientDocuments[];
  is_draft: boolean;
}

export interface ClientDocuments {
  attachment_id: number;
  show_before_assignment: boolean;
  notes: string;
}

export interface ServiceType {
  id: number;
}

export interface Location {
  mode: "custom";
  display_name: string;
  address1: string;
  address2?: string | undefined;
  city: string;
  state: string;
  zip: string;
  country: string;
  type_id: LocationEnum;
}

/**
 * 地址类型
 */
export enum LocationEnum {
  COMMERCIAL = 1,
  GOVERNMENTAL,
  RESIDENTIAL,
  EDUCATIONAL,
  OTHER
}

export interface Schedule {
  mode: "exact"; //时间形式：exact/hours/between
  start_local: string; //开始时间(当地时间)
  end_local?: string; //结束时间(当地时间)，当mode=hours/between时必填
  time_zone_id?: number | undefined; //时区ID
}

export enum PayTypeEnum {
  FIXED = "fixed",
  HOURLY = "hourly",
  DEVICE = "device",
  BLENDED = "blended"
}

export interface Pay {
  type: PayTypeEnum;
  base: Base;
  hours?: number | undefined;
  additional?: Base;
}

export interface Base {
  amount: number | undefined;
  units: number | undefined;
}

/**
 * 联系人类型
 */
export enum ContactRoleEnum {
  LOCATION_CONTACT = "Location Contact",
  PROJECT_MANAGER = "Project manager",
  RESOURCE_COORDINATOR = "Resource coordinator",
  EMERGENCY_CONTACT = "Emergency contact",
  TECHNICAL_HELP = "Technical help",
  CHECK = "Check-in / Check-out"
}

export interface Contact {
  role: ContactRoleEnum;
  name: string;
  phone: string;
  ext?: string;
  email?: string;
  notes?: string;
}

/**
 * task分组
 */
export enum TaskGroupIdEnum {
  PREP = "prep",
  ONSITE = "onsite",
  POST = "post"
}

/**
 * task类型
 */
export enum TaskTypeIdEnum {
  SET_ETA = 1,
  ENTER_CLOSE_OUT_NOTES = 2,
  CHECK_IN = 3,
  CHECK_OUT = 4,
  UPLOAD_A_FILE = 5,
  UPLOAD_OR_TAKE_A_PICTURE = 6,
  FILL_OUT_CUSTOM_FIELD = 7,
  CALL_PHONE_NUMBER = 8,
  SEND_AN_EMAIL = 9,
  UNIQUE_CUSTOM_TASK = 10,
  COLLECT_A_SIGNATURE = 11,
  ENTER_SHIPMENT_TRACKING = 12,
  DOWNLOAD_FILE = 13
}

export interface Task {
  group_id: TaskGroupIdEnum;
  type_id: TaskTypeIdEnum;
  label: string;
  alerts?: Alert[];
  attachment_id?: number;
}

export interface Alert {
  email: string;
}

export interface DelWorkOrderReq {
  ids: number[];
  cancel_reason: DelWorkOrderEnum;
}

/**
 *工单删除原因
 * 客户取消=58
 * 等待重新安排=59
 * 工作范围改变=60
 * 站点未就绪/已转走=61
 * 以上所列所有要求=45
 * 技能/经验不足=46
 * 没有请求供应商=47
 * 供应商缺乏历史订单=51
 * 内部完成=3
 * 其它地方完成=4
 * 创建错误=52
 */
export enum DelWorkOrderEnum {
  CUSTOMER_CANCELLED = 58,
  PENDING_RESCHEDULE = 59,
  SCOPE_OF_WORK_CHANGED = 60,
  SITE_NOT_READY = 61,
  ALL = 45,
  LACK_OF_SKILLS = 46,
  NO_REQUESTING_PROVIDERS = 47,
  REQUESTING_PROVIDERS_LACK_WORK_ORDER_HISTORY = 51,
  COMPLETED_INTERNALLY = 3,
  COMPLETED_ELSEWHERE = 4,
  CREATION_ERROR = 52
}

export interface GetWorkOrderDetailReq {
  order_id: number;
}

/**
 * 工单详情
 */

export enum WorkOrderDetailStatusEnum {
  DRAFT = 1,
  PUBLISHED,
  ASSIGNED,
  WORK_DONE,
  APPROVED,
  PAID,
  CANCELLED,
  ROUTED = 9
}

export interface GetWorkOrderDetailRes {
  id: number;
  order_id: number;
  company_id: number;
  title: string;
  work_type_id: number;
  service_type_ids: number[];
  manager_id: number;
  client_id: number;
  pay: Pay;
  status: WorkOrderDetailStatusEnum;
  status_name: string;
  status_display: string;
  sub_status: string;
  allow_counter_offers: boolean;
  require_gps: boolean;
  printable: boolean;
  description_html: string;
  confidential_html: string;
  qualifications: Qualifications;
  created_local: string;
  published_local: string;
  routed_local: string;
  assigned_local: string;
  workdone_local: string;
  approved_local: string;
  canceled_local: string;
  provider_id: string | number;
  check_in_local: string;
  check_out_local: string;
  time_logs: TimeLogs;
  service_type_names: string[];
  qualifications_show: QualificationsShow[];
  attachments_list: AttachmentsList[];
  contacts_list: ContactsList[];
  location_info: LocationInfo;
  messages_list: any[];
  providers_info: any;
  schedule_info: ScheduleInfo;
  tasks_list: TasksList[];
  work_types_info: WorkTypesInfo;
  time_zone_info?: TimeZoneInfo;
  set_start_time_info: SetStartTimeInfo;
  provider_counter?: string | number;
  requests?: string | number;
  routes?: string | number;
}

export interface SetStartTimeInfo {
  set_start_time_local: string;
  hour_estimate: number;
  full_name: string;
  completed_at_local: string;
}

export interface TimeLogs {
  hours: number;
  devices?: number;
  results: TimeLogsResult[];
}

export interface TimeLogsResult {
  id: number;
  devices: number;
  in: TimeLogsResultIn;
  out: TimeLogsResultOut;
  time_zone: TimeLogsTimeZone;
  verified: boolean;
  edited: boolean;
  was_late: boolean;
  status: string;
  hours: number;
  logged_by: LoggedBy;
  actions: any[];
  first_check_in: boolean;
  timeliness?: Timeliness;
}

export interface Timeliness {
  on_time: boolean;
  was_early: boolean;
}

export interface LoggedBy {
  id: number;
  first_name: string;
  last_name: string;
  created: Created;
  out: TimeLogsResultOut;
}

export interface TimeLogsTimeZone {
  offset: number;
  id: number;
  name: string;
  short: string;
}

export interface TimeLogsResultIn {
  created: Created;
  coords: Coords;
  verified: boolean;
  distance: number;
  actions: any[];
  requires_verification: boolean;
}

export interface TimeLogsResultOut {
  created: Created;
  coords: Coords;
  verified: boolean;
  distance: number;
  distance_from_in: number;
  actions: any[];
  requires_verification: boolean;
}

export interface Created {
  utc: string;
  local: Local;
}

export interface Local {
  date: string;
  time: string;
}

export interface Coords {
  latitude: number;
  longitude: number;
}

export interface QualificationsShow {
  type: string;
  qualification: string;
  verification: string;
}

export interface WorkTypesInfo {
  id: number;
  work_type_id: number;
  name: string;
  industry_id: number;
  industry: string;
  created_at: string;
  updated_at: string;
}

export interface AttachmentsList {
  id: number;
  order_id: number;
  task_id: number;
  attachment_id: number;
  created_at: string;
  updated_at: string;
  fn_attachments_info: FileList;
}
export interface ContactsList {
  id: number;
  order_id: number;
  role: string;
  name: string;
  email: any;
  phone: string;
  ext: any;
  notes: any;
  created_at: string;
  updated_at: string;
}

export interface MessagesList {
  id: number;
  order_id: number;
  msg_id: number;
  parent_id: number;
  message: string;
  shared_text: string;
  from: MessagesListFrom;
  to: MessagesListTo;
  role: string;
  read: number;
  created_at_utc: string;
  created_at_local: string;
  created_at: string;
  updated_at: string;
}

export interface MessagesListFrom {
  id: number;
  name: string;
  thumbnail: string;
  hideWoManager: boolean;
  msgLink: string;
  role: string;
}

export interface MessagesListTo {
  id: number;
  name: string;
  thumbnail: string;
  role: string;
}

// 工单详情Task状态
export enum TasksListStatusEnum {
  COMPLETE = "complete",
  INCOMPLETE = "incomplete"
}
export interface TasksList {
  id: number;
  order_id: number;
  type_id: number;
  group_id: TaskGroupIdEnum;
  label: string;
  alerts: any[];
  description: string;
  email: string;
  phone: string;
  order: number;
  status: TasksListStatusEnum;
  author_id: number;
  completed_at_local?: string;
  download_file: string;
  full_name: string;
  closing_notes: string;
}

export interface Qualifications {
  certifications: number[];
  covid19: number[];
  equipments: number[];
  insurances: number[];
  licenses: number[];
  backgroundCheck: number[];
  drugTest: number[];
}

export interface PublishWorkOrderReq {
  ids: number[];
}
export interface copyWorkOrderReq {
  source_id: number;
}

export interface RouteProviderReq {
  order_id: number; //工单ID
  provider_id: number; //工程师ID
}

export interface GetIncompleteReasonsRes {
  id: number; //原因ID
  label: string; //原因名称
}

export interface MarkIncompleteReq {
  order_id: number; //工单ID
  reason_id: number; //原因ID
  reason?: string; //原因
}

export interface SendMessageReq {
  order_id: number; //工单ID
  message: string; //消息内容
  provider_id?: number; //工程师ID，当发给指定工程师时必填
  msg_id?: number; //回复消息ID，当回复指定消息时必填
}

export interface GetMessageListReq {
  order_id: number;
}
//消息列表
export interface MessageListRes extends MessagesList {
  messages: MessagesList[];
}

/**
 * 英里选项
 */
export enum GetProviderListReqMilesEnum {
  MILES_10 = 10,
  MILES_20 = 20,
  MILES_30 = 30,
  MILES_60 = 60,
  MILES_90 = 90,
  MILES_120 = 120,
  MILES_250 = 250
}

/**
 * 排序字段选项
 */
export enum ProviderSortEnum {
  RANKING_SCORE = "ranking_score",
  DISTANCE_IN_MILES = "distance_in_miles"
}
export interface GetProviderListReq extends Page {
  order_id: number;
  keyword?: string | undefined;
  type: GetProviderListTypeEnum | undefined;
  name?: string | undefined;
  distance_in_miles?: GetProviderListReqMilesEnum | number | undefined;
  sort?: ProviderSortEnum | number;
}

/**
 * 获取工单下关联的工程师列表 用户类型
 * 所有供应商=1
 * 路由=2
 * 引脚分配=3
 * 已分配=4
 */
export enum GetProviderListTypeEnum {
  ALL_PROVIDERS = 1,
  ROUTES,
  PENDING_ASSIGNMENT,
  ASSIGNED
}

export interface CheckProviderQualificationsRes {
  type: string;
  qualification: string;
  status: boolean;
  order: number;
}

/**
 * 获取工单列表，列表类型Type
 */
export enum GetWorkOrderListReqTypeEnum {
  IN_FLIGHT = 1,
  DRAFT,
  PUBLISHED_ROUTED,
  ASSIGNED,
  DONE,
  APPROVED,
  ISSUE,
  ALL
}

export interface GetWorkOrderListReq extends Page {
  keyword?: string;
  type: GetWorkOrderListReqTypeEnum;
}

//
export interface GetWorkOrderListRes {
  id: number;
  order_id: number;
  title: string;
  pay: Pay;
  status: number;
  status_name: string;
  status_display: string;
  sub_status: string;
  provider_id: number;
  messages_count: number;
  total_tasks: number;
  completed_tasks: number;
  check_in: string;
  check_out: string;
  check_in_local: string;
  check_out_local: string;
  location_info: LocationInfo;
  providers_info: ProvidersInfo;
  schedule_info: ScheduleInfo;
  time_zone_info?: TimeZoneInfo;
  provider_counter?: string | number;
  requests?: string | number;
  routes?: string | number;
  approve_days?: string | number;
  hours_logged?: string | number;
}
export interface LocationInfo {
  id: number;
  order_id: number;
  display_name: string;
  mode: string;
  address1: string;
  address2: any;
  city: string;
  state: string;
  zip: string;
  country: string;
  longitude: string;
  latitude: string;
  type_id: number;
  map_url: string;
  map_href: string;
  created_at: string;
  updated_at: string;
}

export interface ProvidersInfo {
  provider_id: number;
  full_name: string;
  thumbnail_url: string;
  first_name: string;
  last_name: string;
  zip: string;
  phone_number: string;
  phone_number_ext: string;
}

export interface ScheduleInfo {
  id: number;
  order_id: number;
  mode: string;
  start_utc: string;
  start_local: string;
  end_utc: any;
  end_local: any;
  time_zone_id: number;
  status_id: number;
  company_id: number;
  today_tomorrow: string;
  created_at: string;
  updated_at: string;
  set_start_time_local?: string;
  hour_estimate?: number;
}

export interface GetWorkOrderListCountsReq {
  keyword?: string;
}

export interface GetWorkOrderListCountsRes {
  in_flight_count: string;
  draft_count: string;
  published_routed_count: string;
  assigned_count: string;
  done_count: string;
}

export interface GetFNWorkOrderFileListReq {
  order_id: string;
}

//获取工单Deliverables信息
export interface GetFNWorkOrderFileListRes {
  id: number;
  name: string;
  type: string;
  results: FNWorkOrderFileListResult[];
  file_count: number;
}

export interface FNWorkOrderFileListResult {
  id: number;
  author: FNWorkOrderFileListAuthor;
  reviewer: Reviewer;
  file: FNWorkOrderFileListFile;
  created: FNWorkOrderFileListCreated;
  notes: string;
  status: string;
  status_description: string;
  reviewed: FNWorkOrderFileListReviewed;
  folder_id: number;
  workorder_id: number;
}

export interface FNWorkOrderFileListAuthor {
  id: number;
  first_name: string;
  last_name: string;
  thumbnail: string;
  phone: string;
}

export interface Reviewer {
  id: number;
  first_name: string;
  last_name: string;
}

export interface FNWorkOrderFileListFile {
  name: string;
  mime: string;
  size_bytes: number;
  link: string;
  description: string;
  type: string;
  icon: string;
  size: number;
}

export interface FNWorkOrderFileListCreated {
  utc: string;
  local: FNWorkOrderFileListLocal;
}

export interface FNWorkOrderFileListLocal {
  date: string;
  time: string;
}

export interface FNWorkOrderFileListReviewed {
  utc: string;
  local: FNWorkOrderFileListLocal;
}

// UpdateDeliverablesFileReq status
export enum DeliverablesFileStatusEnum {
  APPROVED = "approved",
  DENIED = "denied",
  PENDING = "pending"
}
export interface UpdateDeliverablesFileReq {
  folder_id: number;
  attachment_id: number;
  status: DeliverablesFileStatusEnum;
  status_description: string;
  notes: string;
}

// 工程师列表

// 处理pay信息
export interface GetFnWorkOrderPayReq {
  order_id: number;
}

export interface GetFnWorkOrderPayRes {
  work_order_id: number;
  type: PayTypeEnum;
  base: Base;
  additional: Base;
  hours: number;
  reported_hours: number;
  number_of_devices: number;
  minimum_payment: number;
  labor_sum: number;
  fees_cancellation_pending: boolean;
  passive_cancellation_amount: number;
  fee_cancellation_queued: string;
  fee_cancellation_charged: string;
  expenses: FnWorkOrderPayExpenses;
  discounts: FnWorkOrderPayDiscounts;
  increases: Increases;
  max_pay: number;
  total: number;
  max_pay_limit: number;
  calculated_total: CalculatedTotal;
}

export interface CalculatedTotal {
  total: Total;
}

export interface Total {
  min: number;
  max: number;
}

export interface Increases {
  minimum: number;
  all: number;
  pay_change: PayChange;
}

export interface PayChange {
  id: number;
  description: string;
  status: string;
  status_description: string;
  pay: Pay;
  created: Created;
  author: FnWorkOrderPayAuthor;
}

export interface FnWorkOrderPayDiscounts {
  results: FnWorkOrderPayResult[];
  all: number;
}

export interface FnWorkOrderPayExpenses {
  results: FnWorkOrderPayResult[];
  charged: number;
}

export enum FnWorkOrderPayResultStatusEnum {
  NEW = "new",
  APPROVED = "approved",
  DISAPPROVED = "disapproved"
}
export interface FnWorkOrderPayResult {
  company_id: number;
  id: number;
  status: FnWorkOrderPayResultStatusEnum;
  description: string;
  status_description: string;
  amount: number;
  quantity: number;
  author: FnWorkOrderPayAuthor;
  category: FnWorkOrderPayCategory;
  added: FnWorkOrderPayAdded;
  approved: FnWorkOrderPayAdded;
  receipt?: Receipt;
  actions: string[];
}

export interface FnWorkOrderPayAuthor {
  id: number;
  first_name: string;
  last_name: string;
  is_provider: number;
}

export interface FnWorkOrderPayCategory {
  id: number;
  label: string;
  type: string;
  uid: number;
  company_expense_id: number;
  amount: number;
}

export interface FnWorkOrderPayAdded {
  utc: string;
  local: Local;
}

export interface Receipt {
  id: number;
  name: string;
  type: string;
  size: number;
  link: string;
  thumbnail: string;
  slot_id: number;
  icon: string;
}

export interface GetExpenseCategoryRes {
  uid: number;
  id: number;
  company_expense_id: number;
  label: string;
  description: string;
  type: string;
  actions: any[];
}

export interface AddExpenseReq {
  order_id: number;
  category_id: number;
  category_uid: number;
  description: string;
  amount: number;
}

/**
 * 审核Expense请求 status
 */
export enum ExamineExpenseStatusEnum {
  APPROVED = "approved",
  DISAPPROVED = "disapproved"
}
export interface ExamineExpenseRes {
  order_id: number;
  status: ExamineExpenseStatusEnum;
  status_description?: string | undefined;
}

export interface BatchExamineExpenseReq {
  status: ExamineExpenseStatusEnum;
  status_description: string;
}

/**
 * 审核工程师支付格式变化请求
 */
export enum ExamineRequestedPayChangeEnum {
  ACCEPTED = "accepted",
  DENIED = "denied"
}

export interface ExamineRequestedPayChangeReq {
  order_id: number;
  status: ExamineRequestedPayChangeEnum;
  status_description: string;
}

export interface EditMessageReadReq {
  msg_ids: number[];
  read: number;
}

//工程师列表
export interface GetProviderListRes {
  id: number;
  order_id: number;
  provider_id: number;
  type: number;
  counter: Counter;
  sent_at: number;
  routed_at: number;
  expires_at: number;
  block_ratio: number;
  commitment: number;
  average_rating: string;
  timeliness: number;
  work_completed: number;
  general_tasks: number;
  distance_in_miles: string;
  navigation_miles?: string;
  ranking_audit: any;
  ranking_score: number;
  created_at: string;
  updated_at: string;
  current_score_max: number;
  countered_score_max: number;
  counter_pay_text: string;
  counter_expenses_text: string;
  counter_schedule_text: string;
  is_expire: boolean;
  expire_text: string;
  google_maps_directions_url: string;
  provider_info: ProviderInfo;
  work_type_tasks: number;
}

export interface Counter {
  id: number;
  counter: boolean;
  active: boolean;
  notes: string;
  counter_notes: string;
  pay: CounterPay;
  created: Created;
  schedule: CounterSchedule;
  technician: Technician;
  actions: string[];
  expenses: Expense[];
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  quantity: number;
  category: ExpenseCategory;
}

export interface ExpenseCategory {
  id: number;
  type: string;
  uid: number;
  label: string;
  company_expense_id: number;
  amount: number;
}

export interface Technician {
  id: number;
  first_name: string;
  last_name: string;
  thumbnail: string;
}

export interface CounterSchedule {
  service_window: ServiceWindow;
}

export interface ServiceWindow {
  mode: string;
  start: Start;
  end: Start;
}

export interface Start {
  utc: string;
  local: Local;
}

export interface CounterPay {
  type: string;
  base: Base;
  additional: Base;
  range: CounterPayRange;
}

export interface CounterPayRange {
  min: number;
  max: number;
}

export interface ProviderInfo {
  id: number;
  provider_id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  w2: number;
  thumbnail_url: string;
  zip: string;
  phone_number: string;
  phone_number_ext: string;
  last_updated: number;
  created: number;
  last_login: number;
  passed_background_check: number;
  passed_drug_test: number;
  has_ein: boolean;
  city: string;
  state: string;
  country: string;
  longitude: string;
  latitude: string;
  block_ratio: number;
  commitment: number;
  average_rating: string;
  timeliness: number;
  work_completed: number;
  general_tasks: number;
  cancellation_rate: number | null;
  field_experience: string;
  service_company_id: number;
  service_company_name: string;
  service_company_provider_count: number;
  service_company_thumbnail_url: string;
  created_at: string;
  updated_at: string;
  head: string;
  active_log: string;
  last_login_days: number;
  background_check: string;
  is_background_check: boolean;
  drug_test: string;
  is_drug_test: boolean;
  is_sc: boolean;
}

//获取还价对比文本
export interface GetCounterOfferRes {
  id: number;
  order_id: number;
  provider_id: number;
  type: number;
  sent_at: number;
  routed_at: number;
  expires_at: number;
  block_ratio: number;
  commitment: number;
  average_rating: string;
  timeliness: number;
  work_completed: number;
  segmentation: string;
  general_tasks: number;
  distance_in_miles: string;
  ranking_audit: string;
  ranking_score: number;
  created_at: string;
  updated_at: string;
  current_pay: CounteredPay;
  countered_pay: CounteredPay;
  current_score_max: number;
  countered_score_max: number;
  countered_schedule: CounteredSchedule;
  current_schedule: CurrentSchedule;
  expenses: Expense[];
  technician: Technician;
  counter_notes: string;
}

export interface CurrentPay {
  type: string;
  base: Base;
}

export interface CounteredPay {
  type: string;
  base: Base;
  additional: Base;
  range: CounterPayRange;
}

export interface CounteredSchedule {
  mode: string;
  start_local: string;
  end_local: string;
}

export interface CurrentSchedule {
  mode: string;
  start_local: string;
  end_local: any;
  time_zone_id: number;
  time_zone_info: TimeZoneInfo;
}

export interface TimeZoneInfo {
  id: number;
  time_zone_id: number;
  name: string;
  offset: number;
  short: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface GetWorkOrdersProvidersMapReq {
  order_id: string;
  provider_id: string;
  map_url: string;
  updated_at: string;
  created_at: string;
  id: number;
}
export interface updateCustomLocationReq {
  location: Location;
}
export interface batchUpdateContactsReq {
  id?: number;
  role: string;
  name: string;
  phone: string;
  ext?: string;
  email?: string;
  notes?: string;
  isCreate?: boolean;
}

export interface GetWorkOrderProviderTypeCountRes {
  routes_count: string;
  pending_count: string;
  assigned_count: string;
}

export interface GetApproveFeeRes {
  expenses_count: number;
  pay_change: boolean;
  is_error: boolean;
}

export enum AddTemplateScheduleSpecificTimeEnum {
  SAME_DAY = 1,
  NEXT_DAY = 2,
  NEXT_BUSINESS_DAY = 3,
  NEXT_MONDAY = 4,
  NEXT_TUESDAY = 5,
  NEXT_WEDNESDAY = 6,
  NEXT_THURSDAY = 7,
  NEXT_FRIDAY = 8,
  NEXT_SATURDAY = 9,
  NEXT_SUNDAY = 10
}

// 创建模板Schedule
export interface AddTemplateSchedule {
  mode: "exact" | "hours" | "between";
  relative_time: AddTemplateScheduleSpecificTimeEnum | undefined;
  specific_time: string | undefined;
}

// 创建模板
export interface AddTemplateReq extends ServiceDescription, WorkCategories {
  allow_counter_offers: boolean; //是否允许工程师还价
  require_gps: boolean; //是否需要工程师在check in和check out时请求GPS定位
  printable: boolean; //是否允许工程师打印文档信息
  schedule: AddTemplateSchedule;
  pay: Pay;
  contacts?: Contact[];
  tasks: Task[];
  qualifications?: GetQualificationsRes;
  client_documents?: ClientDocuments[];
  name: string; //模板名称
}

// 获取工单模板列表状态
export enum GetTemplateListReqStatusEnum {
  OPEN = 1,
  CLOSE = 2
}

// 获取工单模板列表
export interface GetTemplateListReq extends Page {
  keyword?: string | undefined;
  status?: GetTemplateListReqStatusEnum | string;
}

export interface GetTemplateListRes {
  id: number;
  company_id: number;
  creator: number;
  name: string;
  status: number;
  work_order_count: number;
  user_info: GetTemplateListResUserInfo;
  update_time: string;
}

export interface GetTemplateListResUserInfo {
  id: number;
  first_name: string;
  last_name: string;
}

// 模板详情
export interface GetTemplateDetailsRes {
  id: number;
  company_id: number;
  creator: number;
  name: string;
  status: number;
  title: string;
  work_type_id: number;
  service_type_ids: number[];
  printable: boolean;
  allow_counter_offers: boolean;
  require_gps: boolean;
  pay: Pay;
  schedule: TemplateDetailsSchedule;
  description_html: string;
  confidential_html: string | null;
  qualifications: Qualifications;
  contacts: Contact[];
  client_documents: TemplateDetailsClientDocuments[];
  tasks: TemplateDetailsTask[];
  update_time: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateDetailsSchedule {
  mode: string;
  relative_time: number;
  specific_time: string;
  start_time_utc: string;
  start_time_central: string;
  start_time_utc_date: string;
  start_time_central_date: string;
}

export interface TemplateDetailsClientDocuments extends ClientDocuments {
  filename: string;
  link: string;
}

export interface TemplateDetailsTask extends Task {
  file_name?: string;
  link?: string;
}

/**
 * WORK_ORDER=1 工单ID搜索 PROVIDER=2 工程师ID搜索
 */
export enum TopSearchReqTypeEnum {
  WORK_ORDER = 1,
  PROVIDER = 2
}
export interface TopSearchReq {
  id: string;
  type: TopSearchReqTypeEnum;
}
