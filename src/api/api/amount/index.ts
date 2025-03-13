/**
 * 品牌端充值消费
 */

import request from "@/api/request";
import axios from "axios";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/onsite/fn`;

import type { AmountListReq, BalanceReq, BalanceRes, PayMethodsOptions } from "./types";
// import type { AddFileReq } from "@/api/api/fileManager/types";

/**
 * 获取消费列表
 */
// export const getAmountListNoPage = (params: AmountListReq) => {
//   return request.get<AmountListRes>(`${baseUrl}/feeDetailsList`, {
//     params
//   });
// };
/**
 * 获取消费列表(不分页)
 */
export const getAmountList = (params: AmountListReq) => {
  return axios.request({
    url: `${baseUrl}/feeDetailsList`,
    method: "get",
    params: params,
    withCredentials: true
  });
};
/**
 * 获取充值列表信息
 * */
export const getRechargeList = (params: AmountListReq) => {
  return axios.request({
    url: `${import.meta.env.VITE_API_BASE_URL}/bee/payLogList`,
    method: "get",
    params: params,
    withCredentials: true
  });
};

export const depositAddFile = (data: FormData) => {
  return request.post(`${import.meta.env.VITE_API_BASE_URL}/bee/noVerification/uploadFile`, data);
};
export const getBalance = () => {
  return request.get<BalanceRes>(`${baseUrl}/companyBalance`);
};
/**
 * 新增充值
 * */
export const depositBalance = (data: BalanceReq) => {
  return request.post(`${import.meta.env.VITE_API_BASE_URL}/onsite/fn/addPayLog`, data);
};
/**
 * 导出费用列表
 */
// export const exportsDetailsList = (params: AmountListReq) => {
//   return axios.request({
//     url: `${baseUrl}/exportsFeeDetailsList`,
//     method: 'get',
//     params: params,
//     withCredentials: true,
//   });
// };
/**
 * 支付方式
 * */
export const getPayMethodList = () => {
  return request.get<PayMethodsOptions[]>(`${baseUrl}/payMethodList`);
};
export const formatedPriceInt = (num: number | undefined) => {
  if (!num) return;
  const numStr = num.toString();
  return formatedPriceString(numStr);
};
export const formatedPriceString = (numStr: string) => {
  numStr = parseFloat(numStr).toFixed(2);
  const formattedValue = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedValue;
};
