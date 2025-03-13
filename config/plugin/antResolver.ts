import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

/**
 * 按需加载
 */
export default () => {
  return Components({
    dirs: ["src/components"],
    extensions: ["vue"],
    // 变换目标的滤波器
    include: [/.vue$/, /.vue?vue/],
    exclude: [/[\/]node_modules[\/]/, /[\/].git[\/]/, /[\/].nuxt[\/]/],
    resolvers: [
      AntDesignVueResolver({
        importStyle: "less",
        resolveIcons: true
      })
    ]
  });
};
