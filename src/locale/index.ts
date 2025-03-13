import { createI18n } from "vue-i18n";
import Constant from "@/types/constant";
import { LocaleKey, LocaleLabel } from "@/types/enum";
import cn from "./zh-CN/index";
import en from "./en-US/index";

export const LOCALE_OPTIONS = [
  { label: LocaleLabel.Cn, value: LocaleKey.Cn },
  { label: LocaleLabel.En, value: LocaleKey.En }
];
const defaultLocale = localStorage.getItem(Constant.LOCAL_KEY) || LocaleKey.En;
console.log("i18n当前语言：", defaultLocale);

const messages = {
  "en-US": en,
  "zh-CN": cn
};

const i18n = createI18n({
  locale: defaultLocale,
  globalInjection: true,
  fallbackLocale: LocaleKey.En,
  legacy: false,
  allowComposition: true,
  messages
});

// 导出t方法
const { t } = i18n.global;
export { t };

export default i18n;
