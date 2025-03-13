import * as fs from "fs";
import Components from "unplugin-vue-components/vite";
import { createPlugin } from "vite-plugin-autogeneration-import-file";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";

const { autoImport, resolver } = createPlugin();

function pathResolve(dir: string) {
  //路径转化
  return resolve(__dirname, ".", dir);
}

export default () => {
  return (
    autoImport([
      // 自动生成
      {
        // auto import components
        pattern: ["*.{vue,ts}", "**/index.{vue,ts}"], //监听的文件规则当前规则为 监听文件夹下的后缀为vue/ts子文件和 文件名为index.vue和index.ts的子孙文件
        dir: pathResolve("src/components"), //监听的文件夹
        toFile: pathResolve("types/components.d.ts"), //生成的文件
        template: fs.readFileSync(pathResolve("./template/components.d.ts"), "utf-8"), //文件生成模板
        codeTemplates: [
          //代码模板
          {
            key: "//code",
            template: '{{name}}: typeof import("{{path}}")["default"];\n    '
          },
          {
            key: "//typeCode",
            template:
              'type {{name}}Instance = InstanceType<typeof import("{{path}}")["default"]>;\n  '
          }
        ],
        name: "_{{name}}" //组件名命名规则支持字符串模板和函数
      }
    ]),
    Components({
      // 忽略掉'unplugin-vue-components'的组件引入
      dirs: [],
      // ui库解析器
      resolvers: [resolver([0])], //应用vite-plugin-autogeneration-import-file插件的第0组规则进行组件引入
      //禁止生成component.d.ts
      dts: false
    })
  );
};
