export interface Page {
  limit?: number;
  page?: number;
}

export interface PageRes {
  links: PageResLinks;
  meta: PageResMeta;
}

export interface PageResLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string;
}

export interface PageResMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PageResMetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PageResMetaLink {
  url?: string;
  label: string;
  active: boolean;
}

export interface HttpData {
  code: number | string;
  message: string;
  data: any;
}

export interface PagingData<T> extends PageRes {
  code: number;
  message: string;
  data: T;
}
