import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { GetWorkOrderListReq, GetWorkOrderListRes } from "@/api/api/workOrder/types";
import { getWorkOrderList } from "@/api/api/workOrder";
import type { PagingData } from "@/api/types";
import { GetWorkOrderListReqTypeEnum } from "@/api/api/workOrder/types";
import {
  GetFilterFieldListRes,
  FilterFieldListRender,
  FilterTypeEnum,
  GetFilterApiUrlRes,
  GetFilterGroupRes,
  RenderGetFilterFieldListRes
} from "@/api/api/filter/type";
import Constant from "@/views/work/flightBoard/constant";
import { getFilterGroup } from "@/api/api/filter";
import _ from "lodash";

export const useWorkFlightBoardStore = defineStore("workFlightBoardStore", () => {
  //当前选中的type
  const currentType = ref(GetWorkOrderListReqTypeEnum.PUBLISHED_ROUTED);
  const setCurrentType = (value: GetWorkOrderListReqTypeEnum) => {
    currentType.value = value;
  };

  // 响应
  const workOrderListData = ref<PagingData<GetWorkOrderListRes[]>>();

  // 用于table加载等
  const workOrderListLoading = ref<boolean>(false);
  const setWorkOrderListLoading = (value: boolean) => {
    workOrderListLoading.value = value;
  };

  // 工单列表
  const workOrderList = computed(() => {
    return workOrderListData.value?.data;
  });

  // 数据总数total
  const workOrderListTotal = computed(() => {
    return workOrderListData.value?.meta.total;
  });

  // 列表请求
  const getWorkOrderListAsync = async (params: GetWorkOrderListReq) => {
    try {
      setWorkOrderListLoading(true);
      const res = await getWorkOrderList(params);
      if (!res) return;
      workOrderListData.value = res;
    } catch (error) {
      console.error(error);
    } finally {
      setWorkOrderListLoading(false);
    }
  };

  // 全局搜索相关
  const globalSearchValue = ref("");
  const setGlobalSearchValue = (value: string) => {
    globalSearchValue.value = value;
  };

  return {
    workOrderListData,
    workOrderList,
    workOrderListLoading,
    workOrderListTotal,
    globalSearchValue,
    currentType,
    getWorkOrderListAsync,
    setGlobalSearchValue,
    setCurrentType,
    setWorkOrderListLoading
  };
});

/**
 * 批量操作
 */
export const useTableRowSelectionDataStore = defineStore("TableRowSelectionDataStore", () => {
  // 当前选中的form
  type Key = number;
  const rowSelectionData = ref<Key[]>([]);

  const setRowSelectionData = (value: Key[]) => {
    rowSelectionData.value = value;
  };
  const rowReset = () => {
    rowSelectionData.value.length = 0;
  };

  return {
    rowSelectionData,
    setRowSelectionData,
    rowReset
  };
});

/**
 * 工单列表过滤相关
 */
export const useWorkOrderFilterStore = defineStore("workOrderFilterStore", () => {
  const workFlightBoardStore = useWorkFlightBoardStore();

  // 获取到的所有过滤器选项列表
  const workOrderFilterList = ref<RenderGetFilterFieldListRes>({});

  const setWorkOrderFilterList = (data: RenderGetFilterFieldListRes) => {
    workOrderFilterList.value = data;
  };

  const resderWorkOrderFilterList = computed(() => {
    return workOrderFilterList.value[workFlightBoardStore.currentType];
  });

  // 临时在操作的过滤器
  const tempFilter = ref<GetFilterFieldListRes | undefined>(undefined);
  const setTempFilter = (data: GetFilterFieldListRes | undefined) => {
    tempFilter.value = data;
  };

  // 响应式的过滤器组
  const renderFiltersList = ref<FilterFieldListRender[]>([]);

  // 只展示获取到的过滤器列表中存在的过滤器(用于渲染)
  const renderFiltersListComputed = computed(() => {
    return renderFiltersList.value.filter((item) => {
      if (!resderWorkOrderFilterList.value) return;
      return resderWorkOrderFilterList.value.some((filterItem) => filterItem.id === item.id);
    });
  });

  // 请求参数(根据renderFiltersListComputed)
  const filtersParams = computed(() => {
    return renderFiltersListComputed.value.reduce(
      (acc, item) => {
        acc[item.param_transfer] = item.value;
        return acc;
      },
      {} as Record<string, any>
    ); // 指定返回的对象类型
  });

  // 检查请求参数是否存在
  const checkParams = computed(() => {
    return (
      !filtersParams.value ||
      (filtersParams.value &&
        typeof filtersParams.value === "object" &&
        Object.keys(filtersParams.value).length === 0)
    );
  });
  // 更新响应式过滤器组(只根据本地数据来更新)
  const updateRenderFiltersList = () => {
    renderFiltersList.value = getLocalFilters();
    console.log("更新", renderFiltersList.value);
  };

  // 获取存在本地的过滤器数组
  const getLocalFilters = (): FilterFieldListRender[] => {
    const filters = localStorage.getItem(Constant.LOCAL_FILTERS) ?? "[]";
    return JSON.parse(filters);
  };

  // 设置本地的过滤器数组
  // 单个创建
  const setLocalFilters = (data: FilterFieldListRender) => {
    const localFilters = getLocalFilters();
    // 如果本地没有数据，则直接添加
    if (Array.isArray(localFilters) && !localFilters.length) {
      localStorage.setItem(Constant.LOCAL_FILTERS, JSON.stringify([data]));
    } else {
      // 如果本地有数据，则先判断是否已经存在，如果存在则更新，不存在则添加
      const index = localFilters.findIndex((item) => item.id === data.id);
      index !== -1 ? localFilters.splice(index, 1, data) : localFilters.push(data);
      localStorage.setItem(Constant.LOCAL_FILTERS, JSON.stringify(localFilters));
    }
    updateRenderFiltersList();
  };

  // 根据id移除过滤器
  const removeLocalFilterById = (id: number | string) => {
    const localFilters = getLocalFilters();
    const newLocalFilters = localFilters.filter((item) => item.id !== id);
    localStorage.setItem(Constant.LOCAL_FILTERS, JSON.stringify(newLocalFilters));
    updateRenderFiltersList();
  };

  // 清除所有的本地过滤器
  const removeAllLocalFilters = () => {
    localStorage.removeItem(Constant.LOCAL_FILTERS);
    updateRenderFiltersList();
  };

  // 过滤器组相关---------------------------------------------------------------------------------------------------------

  // 过滤器组列表
  const filterGroupList = ref<GetFilterGroupRes[]>([]);
  const setFilterGroupList = (data: GetFilterGroupRes[]) => {
    filterGroupList.value = data;
  };

  // loading
  const filterGroupLoading = ref<boolean>(false);
  const setFilterGroupLoading = (value: boolean) => {
    filterGroupLoading.value = value;
  };

  // 当前选中的过滤器组id
  const currentChoosedFilterGroupId = ref<number | string>("");
  const setCurrentChoosedFilterGroupId = (value: number | string) => {
    currentChoosedFilterGroupId.value = value;
  };

  // 选中的过滤器组对应的name
  const currentChoosedFilterGroupName = computed(() => {
    return filterGroupList.value.find((item) => item.id === currentChoosedFilterGroupId.value)
      ?.name;
  });

  // 选中的过滤器组对应的value
  const currentChoosedFilterGroupValue = computed(() => {
    return filterGroupList.value.find((item) => item.id === currentChoosedFilterGroupId.value)
      ?.value;
  });

  // 获取过滤器组列表
  const getFilterGroupAsync = async () => {
    try {
      setFilterGroupLoading(true);
      const res = await getFilterGroup();
      if (res) {
        setFilterGroupList(res);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFilterGroupLoading(false);
    }
  };
  // 通过保存的过滤器组创建
  const setLocalFiltersByGroup = (data: GetFilterGroupRes) => {
    // 格式化成FilterFieldListRender
    const { field_info, value } = data;
    const newFilterList: FilterFieldListRender[] = field_info.map((item) => {
      return {
        ...item,
        value: value[item.param_transfer]
      };
    });
    if (Array.isArray(newFilterList)) {
      localStorage.setItem(Constant.LOCAL_FILTERS, JSON.stringify(newFilterList));
      setCurrentChoosedFilterGroupId(data.id);
      updateRenderFiltersList();
    }
  };

  // 过滤器组是否为空
  const checkFilterGroupList = computed(() => {
    return filterGroupList.value?.length > 0;
  });

  // 根据id删除本地的过滤器组
  const delFilterGroupById = (id: number) => {
    filterGroupList.value = filterGroupList.value.filter((item) => item.id !== id);
    setCurrentChoosedFilterGroupId("");
  };

  // 判断当前选中的过滤器组是否被编辑--通过对比过滤器组中的value与filtersParams是否一致
  const checkFilterGroupIsEdited = computed(() => {
    return _.isEqual(currentChoosedFilterGroupValue.value, filtersParams.value);
  });

  return {
    workOrderFilterList,
    renderFiltersList,
    tempFilter,
    filtersParams,
    checkParams,
    filterGroupList,
    checkFilterGroupList,
    filterGroupLoading,
    currentChoosedFilterGroupId,
    currentChoosedFilterGroupName,
    checkFilterGroupIsEdited,
    renderFiltersListComputed,
    resderWorkOrderFilterList,
    setWorkOrderFilterList,
    setTempFilter,
    setLocalFilters,
    updateRenderFiltersList,
    removeLocalFilterById,
    removeAllLocalFilters,
    setFilterGroupList,
    delFilterGroupById,
    getFilterGroupAsync,
    setFilterGroupLoading,
    setLocalFiltersByGroup,
    setCurrentChoosedFilterGroupId
  };
});
