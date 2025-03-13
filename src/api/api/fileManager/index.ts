/**
 * 文件管理
 */

import request from "@/api/request";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/onsite/fn`;

import type { DelFileReq, EditFileReq, FileListReq, FileListRes, FileList } from "./types";

/**
 * 添加文件
 */
export const addFile = (data: FormData) => {
  return request.post(`${baseUrl}/addFile`, data);
};

/**
 * 删除文件
 */
export const delFile = (data: DelFileReq) => {
  return request.delete(`${baseUrl}/delFile`, {
    data
  });
};

/**
 * 编辑文件
 */
export const editFile = (data: EditFileReq) => {
  return request.put(`${baseUrl}/editFile`, data);
};

/**
 * 获取文件列表
 */
export const getFileList = (params: FileListReq) => {
  return request.get<FileListRes>(`${baseUrl}/fileList`, {
    params
  });
};

/**
 * 获取文件列表(不分页)
 */
export const fileListNoPage = (params: FileListReq) => {
  return request.get<FileList[]>(`${baseUrl}/fileListNoPage`, {
    params
  });
};
