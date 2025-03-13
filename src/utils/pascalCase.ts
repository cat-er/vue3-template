import _ from "lodash";

const formatPascalCase = (str: string) => {
  // 将字符串格式化为大驼峰（PascalCase）
  const pascalCase = _.startCase(_.camelCase(str)).replace(/ /g, "");

  // 将字符串格式化为带空格的大驼峰格式
  const spacedPascalCase = _.startCase(_.camelCase(str));

  return {
    pascalCase, // 大驼峰格式
    spacedPascalCase // 带空格的大驼峰格式
  };
};

export default formatPascalCase;
