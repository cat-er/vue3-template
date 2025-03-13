<template>
  <a-spin :spinning="false">
    <div v-if="domDisabled" class="content-providers">
      <segmented v-model:current-type="currentType" />

      <div class="providers-box flex">
        <providers />
        <providersDetail />
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { GetProviderListTypeEnum } from "@/api/api/workOrder/types";
import segmented from "./providers/segmented.vue";
import providers from "./providers/providers.vue";
import providersDetail from "./providers/providersDetail.vue";
// import { useWorkOrderProvidersList } from "@/stores";
// import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

const currentType = ref<GetProviderListTypeEnum>();

// const { providerIsLoading } = storeToRefs(useWorkOrderProvidersList());

const route = useRoute();
const childType = computed(() => {
  return route.query.childType;
});

// 判断是否快速跳转
const domDisabled = ref(false);
const init = () => {
  domDisabled.value = false;
  if (childType.value) {
    currentType.value = Number(childType.value);
  } else {
    currentType.value = GetProviderListTypeEnum.ALL_PROVIDERS;
  }
  domDisabled.value = true;
};

onMounted(() => {
  init();
});
</script>
