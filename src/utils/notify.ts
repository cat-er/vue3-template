import { notification } from "ant-design-vue";
import { t } from "@/locale";

/**
 * 简单的封装常用的通知框
 * @param desc
 */

export const notifySuccess = (desc: string) => {
  return notification.success({
    message: t("success"),
    description: desc
  });
};

export const notifyError = (desc: string) => {
  return notification.error({
    message: t("error"),
    description: desc
  });
};

export const notifyWarning = (desc: string) => {
  return notification.warning({
    message: t("warning"),
    description: desc
  });
};

export const notifyInfo = (desc: string) => {
  return notification.info({
    message: t("info"),
    description: desc
  });
};
