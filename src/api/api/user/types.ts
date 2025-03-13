//用户信息

/**
 * 用户类型
 * 1: BRAND 品牌方, 2 SERVICE 服务商, 3 ADMIN 管理员
 */
export enum UserTypeEnum {
  BRAND = 1,
  SERVICE = 2,
  ADMIN = 3
}

export interface UserInfo {
  id: number;
  company_id: number;
  status: number;
  user_type: UserTypeEnum;
  master_account: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  area_code: string;
  company: string;
  timezone: string;
  comments: string | null;
  created_at: string;
  updated_at: string;
  position: string;
  active: number;
  company_info: CompanyInfo;
  brands_info: BrandsInfo;
  shops: any[];
  messages_count?: number;
  avatar: string;
}

export interface CompanyInfo {
  id: number;
  name: string;
  business_type: number;
  w9_on_file: string;
  sign_w9: boolean;
  website: string;
  phone_number: string;
  contact_email: string;
  billing_address_id: number;
}

/**
 * 是否开通上门服务
 * 1 YES 开启，0 NO 未开启
 */
export enum OnsiteAvailableEnum {
  YES = 1,
  NO = 0
}

/**
 * 是否开通门店服务
 * 1 YES 开启，0 NO 未开启
 */
export enum StoreAvailableEnum {
  YES = 1,
  NO = 0
}

export interface BrandsInfo {
  id: number;
  company_id: number;
  name: string;
  fulfillment_available: number;
  locator_available: number;
  live_data_available: number;
  scheduler_available: number;
  events_available: number;
  warranty_available: number;
  preferred_market_retailer_available: number;
  onsite_available: OnsiteAvailableEnum;
  store_available: StoreAvailableEnum;
}

export interface EditUserInfo {
  first_name: string;
  last_name: string;
  avatar: string;
  phone: string;
}
