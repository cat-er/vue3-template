<template>
  <div class="layout flex">
    <div class="layout-menu flex">
      <div class="layout-action flex">
        <div class="layout-action-item flex logo-width" @click="toFlightBoard">
          <img :src="logo" alt="" />
        </div>

        <!--创建按钮 下拉菜单-->
        <a-dropdown :trigger="['click']">
          <div class="layout-action-item flex">
            <a-button type="text" size="large" shape="circle" :icon="h(PlusOutlined)" />
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="item in dropDownList" :key="item.value" @click="to(item.value)">
                {{ item.label }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <!-- 搜索按钮 -->
        <div class="layout-action-item flex">
          <a-button
            @click="searchHandle"
            type="text"
            size="large"
            shape="circle"
            :icon="h(SearchOutlined)"
          />
        </div>
      </div>

      <!-- 菜单栏 -->
      <actionBar v-show="currentActionType === ActionTypeEnum.MENU" />
      <!-- 全局搜索框 -->
      <globalSearch
        v-show="currentActionType === ActionTypeEnum.SEARCH"
        ref="globalSearchRef"
        @searchBlur="chooseCurrentActionType(ActionTypeEnum.MENU)"
      />

      <div class="layout-action flex">
        <!-- 信息 -->
        <div class="layout-action-item flex">
          <messageBar></messageBar>
        </div>
        <div class="layout-action-item flex">
          <userButton />
        </div>
      </div>
    </div>

    <div class="layout-content">
      <RouterView :key="routeKey"></RouterView>
    </div>

    <pageLoading v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { h, ref, nextTick, computed } from "vue";
import { RouterView, useRouter, useRoute } from "vue-router";
import { PlusOutlined, BellOutlined, SearchOutlined } from "@ant-design/icons-vue";
import logo from "/public/logo.svg";
import actionBar from "./components/actionBar.vue";
import pageLoading from "./components/pageLoading.vue";
import { usePageLoadingStore } from "@/stores";
import { storeToRefs } from "pinia";
import userButton from "./components/userButton.vue";
import messageBar from "./components/messageBar.vue";
import globalSearch from "./components/globalSearch.vue";

const route = useRoute();
const routeKey = computed(() => {
  return route.fullPath;
});

// 全局loading
const { isLoading } = storeToRefs(usePageLoadingStore());

const dropDownList = ref([
  {
    label: "Work Order",
    value: "workOrdersCreate"
  },
  {
    label: "Template",
    value: "templateCreate"
  }
]);

const router = useRouter();
const to = (value: string) => {
  router.push({ name: value });
};

const toFlightBoard = () => {
  router.push({ name: "flightBoard" });
};

// 搜索按钮逻辑
enum ActionTypeEnum {
  MENU = "menu",
  SEARCH = "search"
}

const currentActionType = ref<ActionTypeEnum>(ActionTypeEnum.MENU);

const chooseCurrentActionType = (value: ActionTypeEnum) => {
  currentActionType.value = value;
};

const globalSearchRef = ref();
const searchHandle = () => {
  chooseCurrentActionType(ActionTypeEnum.SEARCH);
  nextTick(() => {
    globalSearchRef.value.searchFocus();
  });
};
</script>
