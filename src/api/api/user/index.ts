/**
 * 用户管理
 */

import request from "@/api/request";

const baseUrlBee = `${import.meta.env.VITE_API_BASE_URL}/bee`;

const baseUrlFn = `${import.meta.env.VITE_API_BASE_URL}/onsite/fn`;

import { UserInfo, EditUserInfo } from "./types";
/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request.get<UserInfo>(`${baseUrlBee}/userInfo`);
};

/**
 * 编辑用户信息
 * @param data
 * @returns
 */
export const editUserInfo = (data: EditUserInfo) => {
  return request.put(`${baseUrlFn}/editUserInfo`, data);
};
