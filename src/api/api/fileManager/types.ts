import type { Page, PageRes } from "@/api/types";

export interface AddFileReq {
  file: any;
}

export interface DelFileReq {
  file_ids: object;
}

export interface EditFileReq {
  file_id: number;
  description: string; //描述
}

export interface FileListReq extends Page {
  keyword?: string; //关键字
}

export interface FileListRes extends PageRes {
  data: FileList[];
}
export interface FileList {
  id: number;
  folder_id: number;
  file_id: number;
  attachment_id?: number;
  filename: string;
  mime: string;
  link: string;
  author_id: number;
  show_before_assignment: boolean;
  created_at: string;
  updated_at: string;
  company_id: number;
  description: string | null;
}
