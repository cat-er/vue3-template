import { notification } from "ant-design-vue";

// 全局ant配置
const setGlobalAntConf = () => {
  notification.config({
    duration: 3
  });
};

export default setGlobalAntConf;
