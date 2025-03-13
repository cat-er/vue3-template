<template>
  <div class="flex filter-bar-foot">
    <!-- 英里数筛选 -->
    <div class="flex">
      <a-popover
        v-if="currentProviderType === GetProviderListTypeEnum.ALL_PROVIDERS"
        placement="bottom"
        trigger="click"
        v-model:open="milesIsOpen"
        @openChange="(e) => (milesIsOpen = e)"
      >
        <template #content>
          <div class="flex-column">
            <div class="text-center font-size-10">
              {{ t("miles_label") }}
            </div>
            <div class="divider"></div>
            <a-radio-group class="flex-column" v-model:value="internalMiles" @change="mailChange">
              <a-radio
                class="margin-bottom-8"
                v-for="item in milesRadioGroup"
                :key="item.value"
                :value="item.value"
              >
                {{ item.value }} {{ t("miles") }}
              </a-radio>
            </a-radio-group>
            <div class="divider"></div>
            <div class="flex">
              <a-input
                v-no-chinese
                v-model:value.number="internalMiles"
                :maxlength="4"
                :placeholder="t('custom_miles')"
              />
              <a-button class="margin-left-8" type="primary" @click="mailChange">
                {{ t("confirm") }}
              </a-button>
            </div>
          </div>
        </template>
        <div class="flex foot-miles line-height-1 pointer">
          {{ t("providers_within") }}
          <b class="margin-left-8 margin-right-8">{{ internalMiles }} {{ t("miles") }}</b>
          <DownOutlined v-show="!milesIsOpen" />
          <UpOutlined v-show="milesIsOpen" />
        </div>
      </a-popover>

      <div class="margin-left-16">
        <b>{{ providerTotal }}</b>
        Providers
      </div>
    </div>

    <div class="flex">
      <!-- 排序 -->
      <a-popover
        placement="bottom"
        trigger="click"
        v-model:open="sortByIsOpen"
        @openChange="(e) => (sortByIsOpen = e)"
      >
        <template #content>
          <a-radio-group class="flex-column" v-model:value="currentSort" @change="sortChange">
            <a-radio class="margin-bottom-8" :value="ProviderSortEnum.RANKING_SCORE">
              {{ t("best_match") }}
            </a-radio>
            <a-radio class="margin-bottom-8" :value="ProviderSortEnum.DISTANCE_IN_MILES">
              {{ t("distance") }}
            </a-radio>
          </a-radio-group>
        </template>
        <div class="flex foot-sort line-height-1 pointer">
          {{ t("sort_by") }}
          <b class="margin-left-8 margin-right-8">
            {{ currentSort === ProviderSortEnum.RANKING_SCORE ? t("best_match") : t("distance") }}
          </b>
          <DownOutlined v-show="!sortByIsOpen" />
          <UpOutlined v-show="sortByIsOpen" />
        </div>
      </a-popover>

      <!-- 全选 -->
      <!-- <a-popover placement="bottom" trigger="click">
        <template #content>
          <a-radio-group class="flex-column" v-model:value="selectAllIsOpen">
            <a-radio value="all">
              {{ t("select_all") }}
            </a-radio>
          </a-radio-group>
        </template>
        <a-button type="primary" class="margin-left-8">
          <template #icon>
            <EllipsisOutlined :rotate="90" />
          </template>
        </a-button>
      </a-popover> -->

      <!-- 全选数量 -->
      <!-- <a-button type="primary" class="margin-left-8">
        <template #default>
          123
          {{ t("providers_selected") }}
          <DownOutlined v-show="!sortByIsOpen" />
          <UpOutlined v-show="sortByIsOpen" />
        </a-button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { t } from "@/locale";
import { GetProviderListReqMilesEnum, ProviderSortEnum } from "@/api/api/workOrder/types";
import { DownOutlined, UpOutlined, EllipsisOutlined } from "@ant-design/icons-vue";
import { useWorkOrderProvidersList } from "@/stores";
import { storeToRefs } from "pinia";
import { GetProviderListTypeEnum } from "@/api/api/workOrder/types";

const { currentProviderType, providerTotal } = storeToRefs(useWorkOrderProvidersList());

interface Emits {
  (e: "milesChoose", value: GetProviderListReqMilesEnum | number | undefined): void;
  (e: "sortChoose", value: ProviderSortEnum): void;
  (e: "update:modelValue", value: GetProviderListReqMilesEnum | number | undefined): void;
}

const emits = defineEmits<Emits>();

const props = defineProps<{
  modelValue: GetProviderListReqMilesEnum | number | undefined;
}>();

const milesIsOpen = ref(false);

const milesRadioGroup = ref([
  { value: GetProviderListReqMilesEnum.MILES_10 },
  { value: GetProviderListReqMilesEnum.MILES_20 },
  { value: GetProviderListReqMilesEnum.MILES_30 },
  { value: GetProviderListReqMilesEnum.MILES_60 },
  { value: GetProviderListReqMilesEnum.MILES_90 },
  { value: GetProviderListReqMilesEnum.MILES_120 },
  { value: GetProviderListReqMilesEnum.MILES_250 }
]);

const internalMiles = ref<GetProviderListReqMilesEnum | number | undefined>(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    internalMiles.value = newVal;
  }
);

watch(internalMiles, (newVal) => {
  emits("update:modelValue", newVal);
});

const mailChange = () => {
  milesIsOpen.value = false;
  emits("milesChoose", internalMiles.value);
};

const sortByIsOpen = ref(false);

const currentSort = ref<ProviderSortEnum>(ProviderSortEnum.RANKING_SCORE);

const sortChange = () => {
  sortByIsOpen.value = false;
  emits("sortChoose", currentSort.value);
};

const selectAllIsOpen = ref(false);
</script>
