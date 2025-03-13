/**
 * 信息
 */

import request from "@/api/request";
import axios from "axios";
import type { MessageRes, MessageReq, MessageEdit } from "@/api/api/message/type";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/onsite/fn`;

/**
 * 获取文件列表
 */
export const getMessageList = (params: MessageReq) => {
  return axios.request<MessageRes>({
    url: `${baseUrl}/getMessageList`,
    method: "get",
    params: params,
    withCredentials: true
  });
};
export const getMessageListNoPage = (params: MessageReq) => {
  return request.get(`${baseUrl}/getMessageList`, { params });
};
/**
 * 获取文件列表
 */
export const editMessageRead = (params: MessageEdit) => {
  return request.post(`${baseUrl}/editMessageRead`, params);
};
