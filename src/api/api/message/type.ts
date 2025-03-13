import type { Page } from "@/api/types";
/*
 * 信息请求数据
 * */
export interface MessageReq extends Page {
  keyword?: string; //关键字
  read?: number | null; //状态
  role?: string | null; //状态
  start?: string | null; //开始时间
  end?: string | null; //结束时间
}
/*
 * 信息整体响应结构
 * */
export interface MessageRes {
  code: number;
  data: MessageList[];
  links: MessageLinks;
  meta: MessageMeta;
}
/*
 * 信息响应结构
 * */
export interface MessageList {
  id: number;
  order_id: number;
  msg_id: number;
  parent_id: number;
  message: string;
  from: object;
  to: object;
  role: string;
  read: number;
  created_at_utc: string;
  created_at_local: string;
  created_at: string;
  updated_at: string;
}
export interface MessageLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string;
}
export interface MessageMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: object;
  per_page: number;
  to: number;
  total: number;
}
/*
 * 信息编辑
 * */
export interface MessageEdit {
  msg_ids: object;
  read: number;
}
