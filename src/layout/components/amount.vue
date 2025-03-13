<template>
  <div class="action-bar-amount flex">
    <!--下拉菜单-->
    <a-dropdown :trigger="['hover']">
      <div class="layout-action-item flex">
        <DollarCircleOutlined />
        <span class="amount">
          <a href="/onsite/amount/list" target="_blank">{{ formatedPriceString(score) }}</a>
        </span>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item v-for="item in dropDownList" :key="item.value" @click="to(item.path)">
            {{ item.label }}
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { DollarCircleOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, watch } from "vue";
import { t } from "@/locale";
import { useRouter } from "vue-router";
import { formatedPriceString, getBalance } from "@/api/api/amount";
import { useCompanyBalanceStore } from "@/stores/app/workOrder";
import { storeToRefs } from "pinia";

const { setCompanyBalance } = useCompanyBalanceStore();
const { companyBalance } = storeToRefs(useCompanyBalanceStore());

const dropDownList = ref([
  {
    label: t("transaction"),
    value: "amountList",
    path: "/onsite/amount/list"
  },
  {
    label: t("deposit"),
    value: "amountBalance",
    path: "/onsite/amount/balance"
  }
]);
const score = ref<string>("0.00");
//路由跳转
const router = useRouter();
const to = (path: string) => {
  // router.push({ name: value });
  window.open(path);
};
/**
 * 获取用户使用额度信息
 * */
const getUserBalance = async () => {
  try {
    const res = await getBalance();
    if (res) {
      score.value = res.available_score.toString();
      setCompanyBalance(res);
    }
  } catch (err) {
    console.error(err);
  }
};
watch(
  () => companyBalance.value?.available_score,
  () => {
    score.value = companyBalance.value?.available_score.toString() || "0.00";
  }
);
onMounted(() => {
  getUserBalance();
});
</script>

<style scoped></style>
