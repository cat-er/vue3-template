import { defineStore } from "pinia";
import { ref } from "vue";


// 全局loading
export const usePageLoadingStore = defineStore("pageLoadingStore", () => {
  const isLoading = ref<boolean>(false);

  const changeLoading = (value: boolean) => {
    isLoading.value = value;
  };

  return {
    isLoading,
    changeLoading
  };
});
