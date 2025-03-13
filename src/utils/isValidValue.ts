/**
 * 判断键值是否为空（false算有效值）
 * @param obj
 * @param key
 * @returns
 */

const isValidValue = (value: any): boolean => {
  return value !== null && value !== undefined && value !== "";
};

export default isValidValue;
