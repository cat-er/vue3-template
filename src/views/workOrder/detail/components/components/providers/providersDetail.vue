<template>
  <div
    class="providers-detail action-box-white flex"
    :class="{ 'providers-detail-hide': detailHide }"
  >
    <div v-if="!detailHide && !currentProvider" class="detail-no-click flex-column full">
      <UserOutlined class="color-gray icon" />
      <span class="color-gray">Click on a provider to see details</span>
    </div>
    <div v-if="!detailHide && currentProvider" class="flex-column detail full">
      <!-- <div class="detail-head flex">
        <a-button type="primary">Route</a-button>
      </div>

      <div class="divider"></div> -->

      <div class="detail-content flex-column">
        <div class="info flex">
          <a-avatar :size="48" :src="info?.thumbnail_url">
            {{ info?.head }}
          </a-avatar>
          <div class="msg flex-column">
            <b>
              {{ info?.full_name }}
            </b>
            <div class="flex state line-height-1 pointer">
              <span class="margin-right-8">{{ state }}</span>
              <CarFilled class="color-blue margin-left-8 margin-right-8" />
              <a @click="toGoogleMap">
                {{
                  Number(
                    currentProvider.navigation_miles
                      ? currentProvider.navigation_miles
                      : currentProvider.distance_in_miles
                  ).toFixed(1)
                }}
                mi
              </a>
            </div>
          </div>
        </div>

        <div v-if="phoneIsShow && info?.phone_number" class="flex margin-top-8">
          <PhoneOutlined class="margin-right-8" />
          <span v-if="info?.phone_number_ext" class="margin-right-8">
            ({{ info?.phone_number_ext }})
          </span>
          <span>{{ phoneFormat(info.phone_number) }}</span>
        </div>

        <div v-if="mapUrl" class="map margin-top-16 margin-bottom-16">
          <a-spin :spinning="mapLoading">
            <img :src="mapUrl" alt="" />
          </a-spin>
        </div>

        <div class="bio">
          <h3 class="color-blue margin-bottom-8">Bio</h3>
          <div v-html="info?.field_experience"></div>
          <div v-if="info?.service_company_name">
            <div class="margin-top-16 margin-bottom-16 font-color-minor">SERVICE COMPANY</div>
            <div class="info flex">
              <a-avatar :size="48" shape="square" :src="info?.service_company_thumbnail_url">
                {{ info?.service_company_name.charAt(0) }}
              </a-avatar>
              <div class="msg flex-column">
                <b>
                  {{ info?.service_company_name }}
                </b>
                <div>{{ info?.service_company_provider_count }} Provider</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";
import { useWorkOrderProvidersList, useWorkOrderDetailStore } from "@/stores";
import { storeToRefs } from "pinia";
import { ProviderInfo, GetProviderListTypeEnum } from "@/api/api/workOrder/types";
import { UserOutlined, CarFilled, PhoneOutlined } from "@ant-design/icons-vue";
import { getWorkOrdersProvidersMap } from "@/api/api/workOrder/index";
import phoneFormat from "@/utils/phoneFormat";

const { workOrderProvidersList, currentProvider, currentProviderType } = storeToRefs(
  useWorkOrderProvidersList()
);
const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());

const detailHide = computed(() => {
  return !workOrderProvidersList.value?.length;
});

const info = computed(() => {
  return currentProvider.value?.provider_info;
});

const phoneIsShow = computed(() => {
  return !!(
    currentProviderType.value &&
    currentProviderType.value >= GetProviderListTypeEnum.PENDING_ASSIGNMENT
  );
});

const state = computed(() => {
  const { city, state } = info.value as ProviderInfo;
  return `${city},${state}`;
});

const mapUrl = ref<string>();
const mapLoading = ref<boolean>(false);
const getMapAsync = async () => {
  try {
    mapLoading.value = true;
    if (!workOrderDetail.value?.id || !currentProvider.value?.provider_id) return;
    const res = await getWorkOrdersProvidersMap({
      order_id: Number(workOrderDetail.value?.id),
      provider_id: Number(currentProvider.value?.provider_id)
    });
    if (res) {
      mapUrl.value = res.map_url;
    }
  } catch (error) {
    console.error(error);
  } finally {
    mapLoading.value = false;
  }
};

// 跳转谷歌地图
const toGoogleMap = () => {
  if (!currentProvider.value?.google_maps_directions_url) return;
  window.open(currentProvider.value?.google_maps_directions_url.toString());
};

watch(
  () => info.value,
  () => {
    getMapAsync();
  }
);
</script>
