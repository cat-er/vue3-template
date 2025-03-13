<template>
  <div class="order-detail-tab action-box-white flex-column">
    <a-segmented block v-model:value="currentTab" :options="options" @change="changeHandle">
      <template #label="{ payload = {} }">
        <div class="segmented flex">
          <icon class="font-size-16 margin-right-8">
            <template #component>
              <component :is="payload.icon" />
            </template>
          </icon>
          <b>{{ payload.label }}</b>
        </div>
      </template>
    </a-segmented>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import Icon, { UserOutlined, FileTextOutlined, MessageOutlined } from "@ant-design/icons-vue";
import { t } from "@/locale";
import { DetailContentSegmentedEnum } from "../types";
import { useRoute } from "vue-router";

const options = ref([
  {
    value: DetailContentSegmentedEnum.DETAILS,
    payload: {
      icon: FileTextOutlined,
      label: t("details")
    }
  },
  {
    value: DetailContentSegmentedEnum.PROVIDERS,
    payload: {
      icon: UserOutlined,
      label: t("providers")
    }
  },
  {
    value: DetailContentSegmentedEnum.MESSAGES,
    payload: {
      icon: MessageOutlined,
      label: t("messages")
    }
  }
  // {
  //   value: DetailContentSegmentedEnum.HISTORY,
  //   payload: {
  //     icon: HourglassOutlined,
  //     label: t("history")
  //   }
  // }
]);
const currentTab = ref<number>(DetailContentSegmentedEnum.DETAILS);

interface Emits {
  (e: "segmentedChange", value: DetailContentSegmentedEnum): void;
}

const emits = defineEmits<Emits>();

const changeHandle = () => {
  emits("segmentedChange", currentTab.value);
};

const route = useRoute();
const typeComputed = computed(() => {
  return route.query.type;
});

const init = () => {
  if (!typeComputed.value) return;
  currentTab.value = Number(typeComputed.value);
  emits("segmentedChange", currentTab.value);
};

onMounted(() => {
  init();
});
</script>
