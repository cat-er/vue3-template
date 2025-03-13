/**
 * 根据过滤器类型和动态的key生成参数
 */
import { FilterTypeEnum, FilterDateLabelEnum } from "@/api/api/filter/type";
export const useFilterParams = (type: FilterTypeEnum, key: string) => {
  let params: any = {};
  switch (type) {
    case FilterTypeEnum.TEXT:
      params[key] = "";
      break;
    case FilterTypeEnum.MULTI_SELECT:
      params[key] = [];
      break;
    case FilterTypeEnum.TYPEAHEAD:
      params[key] = [];
      break;
    case FilterTypeEnum.ADVANCED_DATE_RANGE:
      params[key] = { label: FilterDateLabelEnum.CUSTOM, start_date: "", end_date: "" };
      break;
    case FilterTypeEnum.NUMBER:
      params[key] = "";
      break;
    case FilterTypeEnum.BOOLEAN:
      params[key] = "";
      break;
  }

  return {
    params
  };
};
