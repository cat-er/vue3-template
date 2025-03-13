import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";

/**
 * 确认操作modal弹窗
 * @param content
 * @param callback
 */
export const showConfirmModal = (callback: () => void, content?: string) => {
  Modal.confirm({
    title: "Please confirm",
    icon: createVNode(ExclamationCircleOutlined),
    content: content,
    onOk() {
      callback();
    }
  });
};
