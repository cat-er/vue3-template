<template>
  <a-modal v-model:open="modal" :maskClosable="false" :destroyOnClose="true" width="40%">
    <template #title>
      <h2>{{ title }}</h2>
      <div class="divider"></div>
    </template>
    <a-spin :spinning="modalLoading">
      <div class="flex-column">
        <b class="margin-bottom-8">
          Please review all the counter offer information before accepting and assigning.
        </b>
        <p class="margin-bottom-8">
          Provider proposes change in schedule, change in pay, additional expenses
        </p>
        <a-descriptions layout="vertical" :column="2" bordered class="margin-bottom-8">
          <a-descriptions-item v-if="offerData?.countered_pay">
            <template #label>
              <b>Countered Pay</b>
            </template>
            <div v-if="type === PayTypeEnum.FIXED" class="flex flex-space-center">
              <span>Fixed</span>
              <span>${{ offerData?.countered_pay.base.amount }}</span>
            </div>
            <div v-if="type === PayTypeEnum.HOURLY" class="flex-column">
              <div class="flex flex-space-center">
                <span>Hourly</span>
                <span>${{ offerData?.countered_pay.base.amount }}</span>
              </div>
              <div class="flex flex-space-center">
                <span>Max hrs</span>
                <span>${{ offerData?.countered_pay.base.units }}</span>
              </div>
            </div>
            <div v-if="type === PayTypeEnum.DEVICE" class="flex-column">
              <div class="flex flex-space-center">
                <span>Per device</span>
                <span>${{ offerData?.countered_pay.base.amount }}</span>
              </div>
              <div class="flex flex-space-center">
                <span>Max devices</span>
                <span>${{ offerData?.countered_pay.base.units }}</span>
              </div>
            </div>
            <div v-if="type === PayTypeEnum.BLENDED" class="flex-column">
              <div class="flex flex-space-center">
                <span>First {{ offerData?.countered_pay.base.units }} hour</span>
                <span>${{ offerData?.countered_pay.base.amount }}</span>
              </div>
              <div class="flex flex-space-center">
                <span>Up to {{ offerData?.countered_pay.additional.units }} addt'l hourl</span>
                <span>${{ offerData?.countered_pay.additional.amount }}</span>
              </div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item v-if="offerData?.countered_pay">
            <template #label>
              <b>Current Pay</b>
            </template>
            <div v-if="type === PayTypeEnum.FIXED" class="flex flex-space-center">
              <span>Fixed</span>
              <span>${{ offerData?.current_pay.base.amount }}</span>
            </div>
            <div v-if="type === PayTypeEnum.HOURLY" class="flex-column">
              <div class="flex flex-space-center">
                <span>Hourly</span>
                <span>${{ offerData?.current_pay.base.amount }}</span>
              </div>
              <div class="flex flex-space-center">
                <span>Max hrs</span>
                <span>${{ offerData?.current_pay.base.units }}</span>
              </div>
            </div>
            <div v-if="type === PayTypeEnum.DEVICE" class="flex-column">
              <div class="flex flex-space-center">
                <span>Per device</span>
                <span>${{ offerData?.current_pay.base.amount }}</span>
              </div>
              <div class="flex flex-space-center">
                <span>Max devices</span>
                <span>${{ offerData?.current_pay.base.units }}</span>
              </div>
            </div>
            <div v-if="type === PayTypeEnum.BLENDED" class="flex-column">
              <div class="flex flex-space-center">
                <span>First {{ offerData?.current_pay.base.units }} hour</span>
                <span>${{ offerData?.current_pay.base.amount }}</span>
              </div>
              <div class="flex flex-space-center">
                <span>Up to {{ offerData?.current_pay.additional.units }} addt'l hourl</span>
                <span>${{ offerData?.current_pay.additional.amount }}</span>
              </div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item v-if="offerData?.countered_score_max">
            <template #label>
              <b>Max</b>
            </template>
            ${{ offerData?.countered_score_max.toFixed(2) }}
          </a-descriptions-item>

          <a-descriptions-item v-if="offerData?.countered_score_max">
            <template #label>
              <b>Max</b>
            </template>
            ${{ offerData?.current_score_max.toFixed(2) }}
          </a-descriptions-item>

          <a-descriptions-item v-if="offerData?.countered_schedule.start_local">
            <template #label>
              <b>Countered schedule</b>
            </template>
            <span>{{ timeFormat(offerData?.countered_schedule.start_local) }}</span>
            <ArrowRightOutlined
              v-if="offerData?.countered_schedule.end_local"
              class="margin-left-8 margin-right-8"
            />
            <span v-if="offerData?.countered_schedule.end_local">
              {{ timeFormat(offerData?.countered_schedule.end_local) }}
            </span>
          </a-descriptions-item>

          <a-descriptions-item v-if="offerData?.countered_schedule.start_local">
            <template #label>
              <b>Current schedule</b>
            </template>
            <span>
              {{ timeFormat(offerData?.current_schedule.start_local) }}
              ({{ offerData?.current_schedule.time_zone_info.short }})
            </span>
            <ArrowRightOutlined
              v-if="offerData?.current_schedule.end_local"
              class="margin-left-8 margin-right-8"
            />
            <span v-if="offerData?.current_schedule.end_local">
              {{ timeFormat(offerData?.current_schedule.end_local) }} ({{
                offerData?.current_schedule.time_zone_info.short
              }})
            </span>
          </a-descriptions-item>

          <a-descriptions-item v-if="offerData?.expenses.length">
            <template #label>
              <b>Requested expenses</b>
            </template>
            <ul>
              <li v-for="(item, index) in offerData?.expenses" :key="index">
                Description:
                <b>{{ item.description }}</b>
                for ${{ item.amount }}
              </li>
            </ul>
          </a-descriptions-item>
        </a-descriptions>
      </div>

      <template v-if="offerData?.counter_notes">
        <p class="margin-bottom-8">Provider counter offer explanation:</p>
        <div class="action-box margin-bottom-8">
          <b>{{ offerData?.counter_notes }}</b>
        </div>
      </template>
      <!-- <p class="color-red margin-bottom-8">Expires: 29 minutes from now</p> -->
      <p class="margin-bottom-8">
        Accept and Assign will update the work order to reflect the new offer and will assign this
        provider.
      </p>
      <a-checkbox v-model:checked="isUnderstand">
        I understand that I am updating the work order and assigning the provider
      </a-checkbox>
    </a-spin>

    <template #footer>
      <a-button @click="hide">Close</a-button>
      <!-- <loadButton @click="DeclineHandle">Decline</loadButton> -->
      <loadButton type="primary" :disabled="!isUnderstand" @click="assignAsync">
        Accept & Assign
      </loadButton>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue";
import { useWorkOrderProvidersList } from "@/stores";
import { getCounterOffer } from "@/api/api/workOrder";
import { GetCounterOfferRes, PayTypeEnum } from "@/api/api/workOrder/types";
import { ArrowRightOutlined } from "@ant-design/icons-vue";
import timeFormat from "@/utils/timeFormat";
import { assignProvider } from "@/api/api/workOrder";
import { notifySuccess } from "@/utils/notify";
import loadButton from "@/components/loadButton/loadButton.vue";

interface Props {
  orderId: number | undefined;
  providerId: number | undefined;
}

const props = defineProps<Props>();

const { delProvider } = useWorkOrderProvidersList();

const loading = ref<boolean>(false);
const modal = ref<boolean>(false);

const show = () => {
  modal.value = true;
  getCounterOfferAsync();
};
const hide = () => {
  modal.value = false;
};

const isUnderstand = ref(false);

const offerData = ref<GetCounterOfferRes>();
const modalLoading = ref(false);
const getCounterOfferAsync = async () => {
  try {
    modalLoading.value = true;
    if (!props.orderId || !props.providerId) return;
    const res = await getCounterOffer({ order_id: props.orderId, provider_id: props.providerId });
    console.log("res", res);
    if (res) {
      offerData.value = res;
    }
  } catch (error) {
    console.error(error);
  } finally {
    modalLoading.value = false;
  }
};

const title = computed(() => {
  return `Counter offer from ${offerData.value?.technician.first_name} ${offerData.value?.technician.last_name}`;
});

const type = computed(() => {
  return offerData.value?.countered_pay.type;
});

// 分配工程师
const assignAsync = async (loading: (value: boolean) => void) => {
  try {
    loading(true);
    if (!props.orderId || !props.providerId) return;
    const res = await assignProvider({ order_id: props.orderId, provider_id: props.providerId });
    if (res) {
      notifySuccess("Success");
      hide();
      delProvider(props.providerId);
      setInterval(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading(false);
  }
};

const DeclineHandleAsync = (loading: (value: boolean) => void) => {
  try {
    loading(true);
  } catch (error) {
    console.error(error);
  } finally {
    loading(false);
  }
};

defineExpose({
  show
});
</script>
