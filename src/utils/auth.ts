/**
 * 用户信息相关方法
 */

import Constant from "@/types/constant";
import { UserInfo, UserTypeEnum, OnsiteAvailableEnum } from "@/api/api/user/types";
import { clearAllCookies } from "@/utils/cookie";
import { useWorkOrderFilterStore } from "@/stores";
import flightBoardConstant from "@/views/work/flightBoard/constant";
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";

// 将userInfo存入localStorage
export const setUserToStorage = (userInfo: UserInfo) => {
  const info = JSON.stringify(userInfo);
  localStorage.setItem(Constant.USER_INFO, info);
};

// 从localStorage中获取用户信息
export const getUserInfoFromStorage = (): UserInfo | null => {
  const info = localStorage.getItem(Constant.USER_INFO);
  return info ? JSON.parse(info) : null;
};

// 验证是否合法
export const isvalidatePass = async () => {
  const { setUserInfo } = useUserStore();
  const { userInfo } = storeToRefs(useUserStore());
  if (!userInfo.value) {
    await setUserInfo();
  }
  const info = getUserInfoFromStorage();
  if (!info?.user_type || !info?.brands_info) return;
  const userType = info?.user_type;
  const onsiteAvailable = info?.brands_info.onsite_available;
  return userType === UserTypeEnum.BRAND && onsiteAvailable === OnsiteAvailableEnum.YES;
};

// 清除localStorage用户信息 清除cookie 清除本地工单过滤器 清除缓存的工单列表类型
export const clearValidation = () => {
  const { removeAllLocalFilters } = useWorkOrderFilterStore();

  localStorage.removeItem(Constant.USER_INFO);
  clearAllCookies();
  removeAllLocalFilters();
  sessionStorage.removeItem(flightBoardConstant.LOCAL_WORK_TYPE);
};

// 跳转ec/home
export const toHome = () => {
  window.location.href = Constant.HOME_PAGE;
};

// 跳转ec/login
export const toLogin = () => {
  window.location.href = Constant.LOGIN_PAGE;
};

// 跳转/ec/company/details
export const toCompanyDetails = () => {
  window.location.href = Constant.COMPANY_DETAILS_PAGE;
};

// 跳转403
export const toForbidden = () => {
  window.location.href = Constant.FORBIDDEN_PAGE;
};
