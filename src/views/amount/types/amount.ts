export interface PageObject {
  current: number;
  total: number;
  pageSize: number;
  page: number;
}
export interface AmountRes {
  score?: number;
  current?: number;
  pedding: number;
  available: number;
  symbol: string;
}

/**
 * 银行信息
 * */
export interface bankRes {
  account_name: string;
  account_number: string;
  bank_address: string;
  bank_name: string;
  swift_code: string;
  routing: string;
}
