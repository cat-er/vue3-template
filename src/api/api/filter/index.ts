/**
 * 过滤器接口
 */

import request from "@/api/request";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/onsite/fn`;

import {
  GetFilterApiUrlReq,
  GetFilterApiUrlRes,
  GetFilterFieldListReq,
  GetFilterFieldListRes,
  AddFilterGroupReq,
  EditFilterGroupReq,
  DelFilterGroupReq,
  GetFilterGroupRes,
  RenderGetFilterFieldListRes
} from "./type";

/**
 * 过滤器接口api_url
 */
// /onsite/fn/getTypeofWorkList
export const getFilterApiUrl = (apiUrl: string, params?: GetFilterApiUrlReq) => {
  return request.get<GetFilterApiUrlRes[]>(`${import.meta.env.VITE_API_BASE_URL}${apiUrl}`, {
    params
  });
};

/**
 * 获取过滤器字段列表
 */
export const getFilterFieldList = (params?: GetFilterFieldListReq) => {
  return request.get<RenderGetFilterFieldListRes>(`${baseUrl}/getFilterFieldList`, { params });
};

/**
 * 添加过滤器组
 */
export const addFilterGroup = (data: AddFilterGroupReq) => {
  return request.post(`${baseUrl}/addFilterGroup`, data);
};

/**
 * 编辑过滤器组
 */
export const editFilterGroup = (data: EditFilterGroupReq, filter_group_id: string | number) => {
  return request.put(`${baseUrl}/editFilterGroup/${filter_group_id}`, data);
};

/**
 * 删除过滤组
 */
export const delFilterGroup = (data: DelFilterGroupReq) => {
  return request.delete(`${baseUrl}/delFilterGroup`, {
    data
  });
};

/**
 * 获取过滤组列表
 */
export const getFilterGroup = () => {
  return request.get<GetFilterGroupRes[]>(`${baseUrl}/getFilterGroup`);
};
