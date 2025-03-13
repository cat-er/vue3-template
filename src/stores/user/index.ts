import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { clearValidation, toLogin, setUserToStorage } from "@/utils/auth";
import { type UserInfo, UserTypeEnum, OnsiteAvailableEnum } from "@/api/api/user/types";
import { getUserInfo } from "@/api/api/user";
import { notifyError } from "@/utils/notify";
import type { MessageList } from "@/api/api/message/type";
import { getMessageListNoPage } from "@/api/api/message";

/**
 * 用户信息相关store
 */
export const useUserStore = defineStore("userStore", () => {
  const userInfo = ref<UserInfo | null>(null);

  // 用户类型
  const userType = computed(() => {
    return userInfo.value?.user_type ?? null;
  });

  // 用户name
  const userName = computed(() => {
    return `${userInfo.value?.first_name} ${userInfo.value?.last_name}`;
  });

  const userInfoLoading = ref<boolean>(false);

  const setUserInfo = async () => {
    try {
      userInfoLoading.value = true;
      const res = await getUserInfo();
      if (!res) return;
      if (
        res.user_type !== UserTypeEnum.BRAND ||
        res.brands_info.onsite_available !== OnsiteAvailableEnum.YES
      ) {
        notifyError("This service is not enabled!");
      }
      userInfo.value = res;
      setUserToStorage(res);
    } catch (error) {
      console.error(error);
    } finally {
      userInfoLoading.value = false;
    }
  };

  const clearUserInfo = () => {
    userInfo.value = null;
  };

  const logOut = () => {
    clearUserInfo();
    clearValidation();
    toLogin();
  };

  return {
    userInfo,
    userType,
    userInfoLoading,
    userName,
    setUserInfo,
    logOut,
    clearUserInfo
  };
});

// 用户最新消息
export const useNewMessagesStore = defineStore("NewMessages", () => {
  const newMessages = ref<MessageList[]>([]);
  const setNewMessages = async () => {
    const res = await getMessageListNoPage({ page: 1, limit: 10 });
    newMessages.value = res.data ? res.data : [];
  };

  return {
    newMessages,
    setNewMessages
  };
});
