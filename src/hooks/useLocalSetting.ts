import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { LocaleKey } from "@/types/enum";
import Constant from "@/types/constant";

// 语言切换
export default function useLocale() {
  const i18 = useI18n();
  const currentLocale = computed(() => {
    return i18.locale.value as LocaleKey;
  });
  const changeLocale = (value: LocaleKey) => {
    if (i18.locale.value === value) return;
    i18.locale.value = value;
    localStorage.setItem(Constant.LOCAL_KEY, value);
  };
  return {
    currentLocale,
    changeLocale
  };
}
