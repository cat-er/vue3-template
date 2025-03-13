<template>
  <div class="action-box-white">
    <a-segmented
      block
      :options="options"
      :disabled="providerIsLoading"
      v-model:value="localCurrentType"
      @change="segmentedChange"
    >
      <template #label="{ payload = {} }">
        {{ payload.num }}
        <b>{{ payload.label }}</b>
      </template>
    </a-segmented>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, onMounted, computed } from "vue";
import { t } from "@/locale";
import { GetProviderListTypeEnum } from "@/api/api/workOrder/types";
import { useWorkOrderProvidersList, useWorkOrderDetailStore } from "@/stores";
import { storeToRefs } from "pinia";

const { setCurrentProviderType, setCurrentProvider, setProviderTypeCount } =
  useWorkOrderProvidersList();

const { providerTypeCount, providerIsLoading } = storeToRefs(useWorkOrderProvidersList());

const { workOrderId } = storeToRefs(useWorkOrderDetailStore());

interface Props {
  currentType: GetProviderListTypeEnum | undefined;
}

const props = defineProps<Props>();

const options = computed(() => {
  return [
    {
      value: GetProviderListTypeEnum.ALL_PROVIDERS,
      payload: {
        num: undefined,
        label: t("all_providers")
      }
    },
    {
      value: GetProviderListTypeEnum.ROUTES,
      payload: {
        num: providerTypeCount.value?.routes_count,
        label: t("routes")
      }
    },
    {
      value: GetProviderListTypeEnum.PENDING_ASSIGNMENT,
      payload: {
        num: providerTypeCount.value?.pending_count,
        label: t("pending_assignment")
      }
    },
    {
      value: GetProviderListTypeEnum.ASSIGNED,
      payload: {
        num: providerTypeCount.value?.assigned_count,
        label: t("assigned")
      }
    }
  ];
});

const localCurrentType = ref<GetProviderListTypeEnum | undefined>(props.currentType);

const segmentedChange = (e: string | number) => {
  setCurrentProviderType(e as GetProviderListTypeEnum);
  setCurrentProvider(undefined);
};

watch(
  () => props.currentType,
  (newVal) => {
    localCurrentType.value = newVal;
  }
);

interface Emits {
  (event: "update:currentType", value: GetProviderListTypeEnum | undefined): void;
}

const emit = defineEmits<Emits>();

watch(localCurrentType, (newVal) => {
  emit("update:currentType", newVal);
  setCurrentProviderType(localCurrentType.value);
});

onMounted(() => {
  setCurrentProviderType(localCurrentType.value);
  if (!workOrderId.value) return;
  setProviderTypeCount(workOrderId.value);
});
</script>
