import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { t } from "@/locale";
import { notifyError, notifyWarning } from "@/utils/notify";
import type { HttpData } from "./types";
import { toForbidden, toLogin, clearValidation } from "@/utils/auth";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";
import { refreshBrowser } from "@/utils/window";

const instance: AxiosInstance = axios.create({
  timeout: 30000,
  withCredentials: true
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);

// 响应处理
const errorCodeHandle = (res: HttpData) => {
  const code = Number(res.code);
  const codeList = [30002, 30006, 30008];
  if (codeList.includes(code)) {
    notifyWarning(`${res.message}`);
  } else if (code === 30001) {
    Modal.warning({
      icon: createVNode(ExclamationCircleOutlined),
      title: "Warning",
      content: `${res.message}`,
      okText: "Got it",
      keyboard: false,

      onOk() {
        refreshBrowser();
      }
    });
  }
};

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    errorCodeHandle(res);
    if (res.code === 200) {
      return res.links ? res : res.data;
    }
  },
  (error: AxiosError) => {
    console.log("error", error);

    if (error.code === "ECONNABORTED") {
      // 处理网络超时错误
      notifyError(t("axios_timeout"));
    } else if (error.response?.status === 403) {
      // 处理403
      toForbidden();
    } else if (error.response?.status === 401) {
      // 处理token失效
      toLogin();
      clearValidation();
      notifyError(t("network_error"));
    } else {
      // 处理其他错误
      notifyError(t("network_error"));
    }
    return Promise.reject(error);
  }
);

export default instance;
