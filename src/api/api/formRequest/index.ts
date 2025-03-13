import type { Rule } from "ant-design-vue/es/form";

export const getRulerDefault = (): Rule[] => {
  const obj: Rule[] = [{ required: true, trigger: ["blur"] }];
  obj.push({
    pattern: getRulerAscii(),
    message: "Only English characters are allowed!",
    trigger: ["blur"]
  });
  return obj;
};
export const getRulerCustomer = (obj: Rule[]): Rule[] => {
  obj.push({
    pattern: getRulerAscii(),
    message: "Only English characters are allowed!",
    trigger: ["blur"]
  });
  return obj;
};

export const getRulerAscii = () => {
  return /^[\x00-\x7F]+$/;
};
