import type { Page } from "@/api/types";
/**
 * 消费/充值 列表数据获取请求
 *
 * */
export interface AmountListReq extends Page {
  keyword?: string; //关键字
  status?: number | null; //状态
  type?: number | null; //类型
  start?: string | null; //开始时间
  end?: string | null; //结束时间
}
/**
 * 消费响应接口
 *
 * */
export interface AmountListRes {
  id: number;
  company_id: number;
  type: number;
  compute_type: number;
  order_no: string;
  score: number;
  mcode: string;
  status: number;
  created_at: string;
  note: string;
}
/**
 * 用户充值列表数据响应
 *
 * */
export interface RechargeListRes {
  company_id: number;
  order_no: string;
  pay_method_id: number;
  score: string | number | null;
  mcode: string;
  exchange_rate: string;
  confirmation_no: string;
  pay_from_account: string;
  file_path: string;
  recharge_score: string;
  recharge_mcode: string;
  fee_details_info: FeeDetailsInfo;
  pay_method_info: PayMethodInfo;
  company_info: CompanyInfo;
}

export interface FeeDetailsInfo {
  status: number;
  note: string;
  audit_at: string;
  created_utc: string;
}

export interface PayMethodInfo {
  name: string;
}

export interface CompanyInfo {
  id: number;
  name: string;
  account_type: number;
}

/**
 * 用户余额信息
 *
 * */
export interface BalanceRes {
  id: number;
  score: number;
  pending: number;
  available_score: number;
  mcode: string;
}
/**
 * 用户充值
 *
 * */
export interface BalanceReq {
  pay_method_id: number;
  recharge_score: number;
  recharge_mcode: string;
  confirmation_no: string;
  pay_from_account: string;
  file_path: string;
}
export interface PayMethodsOptions {
  id: number;
  name: string;
  info?: PayMethodsOptionsInfo;
  mcode?: string;
}

export interface PayMethodsOptionsInfo {
  bank_name: string;
  bank_address: string;
  routing: string;
  swift_code: string;
  account_name: string;
  account_number: string;
}
