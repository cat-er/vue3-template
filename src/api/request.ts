import type { AxiosRequestConfig } from "axios";
import interceptor from "./interceptor";

export default {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return interceptor.get(url, config);
  },

  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return interceptor.post(url, data, config);
  },

  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return interceptor.put(url, data, config);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return interceptor.delete(url, config);
  }
};
