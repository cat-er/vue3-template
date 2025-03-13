<template>
  <div>
    <a-card class="detail-card">
      <template #title>
        <span class="work-card-title">Location</span>
      </template>
      <template #extra>
        <a-button
          shape="circle"
          @click="editLocation"
          v-if="
            workOrderDetail?.status && workOrderDetail?.status >= 1 && workOrderDetail?.status <= 3
          "
        >
          <template #icon>
            <EditOutlined></EditOutlined>
          </template>
        </a-button>
      </template>
      <div class="info">
        <div class="name">{{ locationInfo?.display_name }}</div>
        <a :href="google_map_point_url" target="_blank">
          {{ locationInfo?.address1 }} {{ locationInfo?.address2 }}
          <br />
          {{ locationInfo?.city }}, {{ locationInfo?.state }} {{ locationInfo?.zip }}
          {{ locationInfo?.country }}
        </a>
        <div class="type" v-if="locationInfo?.type_id === 1">Commercial</div>
        <div class="type" v-if="locationInfo?.type_id === 2">Governmental</div>
        <div class="type" v-if="locationInfo?.type_id === 3">Residential</div>
        <div class="type" v-if="locationInfo?.type_id === 4">Educational</div>
        <div class="type" v-if="locationInfo?.type_id === 5">Other</div>
      </div>
      <div class="map-container" v-if="locationInfo?.map_url">
        <a :href="locationInfo?.map_href" target="_blank">
          <img :src="locationInfo?.map_url" alt="Map" class="map-image" />
        </a>
      </div>
      <div>
        <edit-form-location
          v-if="isOpen"
          :isOpen="isOpen"
          :order_id="Number(workOrderDetail?.id)"
          :locationInfo="locationInfo"
          @cancels="cancels"
          @reloadPage="reloadPage"
        ></edit-form-location>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { usePageLoadingStore, useWorkOrderDetailStore } from "@/stores";
import { onMounted, ref, watch } from "vue";
import type { LocationInfo } from "@/api/api/workOrder/types";
import { EditOutlined } from "@ant-design/icons-vue";
import EditFormLocation from "./components/editFormLocation.vue";
import { toNumber } from "lodash";

const { setWorkOrderDetail } = useWorkOrderDetailStore();
const { changeLoading } = usePageLoadingStore();

const { workOrderDetail } = storeToRefs(useWorkOrderDetailStore());
const isOpen = ref<boolean>(false);
const locationInfo = ref<LocationInfo>({} as LocationInfo);
const google_map_point_url = ref<string>("");
const updateStatus = ref<boolean>(false);
watch(
  () => workOrderDetail.value?.id,
  () => {
    console.log("watch updateStatus", updateStatus.value);
    getLocationInfo();
  }
);
watch(
  () => updateStatus.value,
  () => {
    console.log("watch updateStatus", updateStatus.value);
    getLocationInfo();
  }
);

const getLocationInfo = () => {
  if (workOrderDetail.value?.location_info) {
    locationInfo.value = workOrderDetail.value?.location_info as LocationInfo;
    let addr = `${locationInfo.value.address1} ${locationInfo.value.city} ${locationInfo.value.state} ${locationInfo.value.zip}`;
    if (locationInfo.value.address2)
      addr = `${locationInfo.value.address1} ${locationInfo.value.address2} ${locationInfo.value.city} ${locationInfo.value.state} ${locationInfo.value.zip}`;
    addr = addr.replace(/ /g, "+");
    google_map_point_url.value = locationInfo.value.map_href
      ? locationInfo.value.map_href
      : "https://www.google.com/maps/search/" + addr;
  }
};

const editLocation = () => {
  isOpen.value = true;
};
const cancels = () => {
  isOpen.value = false;
};
const reloadPage = async () => {
  // window.location.reload();
  cancels();
  try {
    updateStatus.value = false;
    changeLoading(true);
    let id = toNumber(workOrderDetail.value?.id);
    await setWorkOrderDetail(id);
    updateStatus.value = true;
  } catch (error) {
    console.error(error);
  } finally {
    changeLoading(false);
  }
};

const getFNWorkOrderDataAsync = async () => {
  if (!workOrderDetail.value?.id) return;
  try {
    getLocationInfo();
  } catch (error) {
    console.error(error);
  }
};
onMounted(() => {
  getFNWorkOrderDataAsync();
});
</script>

<style scoped>
.info {
  margin-bottom: 16px;
}

.name {
  font-weight: bold;
  margin-bottom: 8px;
}

.type {
  font-size: 12px;
  color: #888;
}

.map-container {
  position: relative;
  padding-bottom: 56.25%;
  /* Aspect ratio 16:9 */
  height: 0;
  overflow: hidden;
}

.map-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
