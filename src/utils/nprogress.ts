import NProgress from "nprogress";

//全局进度条的配置
NProgress.configure({
  easing: "ease",
  minimum: 0.1, // 进度条的最小值
  speed: 500, // 进度条增长的速度（毫秒）
  trickle: true, // 是否自动递增进度条
  trickleSpeed: 250, // 自动递增的速度（毫秒）
  showSpinner: false, // 隐藏右上角的加载动画
  parent: "body" // 进度条的容器，默认为 'body'
});

// 打开进度条
export const NProgressStart = () => {
  NProgress.start();
};

// 关闭进度条
export const NProgressClose = () => {
  NProgress.done();
};
