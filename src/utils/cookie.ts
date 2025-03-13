import Cookies from "js-cookie";

/**
 * 清除所有 cookies
 */
export const clearAllCookies = () => {
  const cookies = Cookies.get();
  for (const cookieName in cookies) {
    if (cookies.hasOwnProperty(cookieName)) {
      Cookies.remove(cookieName, { path: "" });
    }
  }
};
