<template>
  <div>
    <a-popover placement="top" title="Provider Criteria" :overlayStyle="{ maxWidth: '450px' }">
      <template #content>
        <div class="flex-column">
          <a-tag
            :color="color(generalTasksRate)"
            :class="colorClass(generalTasksRate)"
            class="flex flex-space-center tag rate-item margin-top-8"
          >
            <template #icon>
              <div class="flex">
                <SmileOutlined v-if="generalTasksRate === 1" />
                <MehOutlined v-else-if="generalTasksRate === 2" />
                <FrownOutlined v-else-if="generalTasksRate === 3" />
                <StopOutlined v-else />
                <span class="margin-left-8">General Tasks</span>
              </div>
            </template>
            <div v-if="generalTasksRate === 4" class="margin-left-8">Not Enough Data</div>
            <div v-else>{{ rateData.general_tasks }}</div>
          </a-tag>

          <a-tag
            :color="color(marketplaceRate)"
            :class="colorClass(marketplaceRate)"
            class="flex flex-space-center tag rate-item margin-top-8"
          >
            <template #icon>
              <div class="flex">
                <SmileOutlined v-if="marketplaceRate === 1" />
                <MehOutlined v-else-if="marketplaceRate === 2" />
                <FrownOutlined v-else-if="marketplaceRate === 3" />
                <StopOutlined v-else />
                <span class="margin-left-8">Marketplace Rating</span>
              </div>
            </template>
            <div v-if="marketplaceRate === 4" class="margin-left-8">Not Enough Data</div>
            <div v-else>{{ rateData.average_rating }}</div>
          </a-tag>

          <a-tag
            :color="color(timelinessRate)"
            :class="colorClass(timelinessRate)"
            class="flex flex-space-center tag rate-item margin-top-8"
          >
            <template #icon>
              <div class="flex">
                <SmileOutlined v-if="timelinessRate === 1" />
                <MehOutlined v-else-if="timelinessRate === 2" />
                <FrownOutlined v-else-if="timelinessRate === 3" />
                <StopOutlined v-else />
                <span class="margin-left-8">Timeliness</span>
              </div>
            </template>
            <div v-if="timelinessRate === 4" class="margin-left-8">Not Enough Data</div>
            <div v-else>{{ rateData.timeliness }}%</div>
          </a-tag>

          <a-tag
            :color="color(cancellationRate)"
            :class="colorClass(cancellationRate)"
            class="flex flex-space-center tag rate-item margin-top-8"
          >
            <template #icon>
              <div class="flex">
                <SmileOutlined v-if="cancellationRate === 1" />
                <MehOutlined v-else-if="cancellationRate === 2" />
                <FrownOutlined v-else-if="cancellationRate === 3" />
                <StopOutlined v-else />
                <span class="margin-left-8">Cancellation Rate</span>
              </div>
            </template>
            <div v-if="cancellationRate === 4" class="margin-left-8">Not Enough Data</div>
            <div v-else>{{ rateData.cancellation_rate }}%</div>
          </a-tag>

          <a-tag
            :color="color(blockRate)"
            :class="colorClass(blockRate)"
            class="flex flex-space-center tag rate-item margin-top-8"
          >
            <template #icon>
              <div class="flex">
                <SmileOutlined v-if="blockRate === 1" />
                <MehOutlined v-else-if="blockRate === 2" />
                <FrownOutlined v-else-if="blockRate === 3" />
                <StopOutlined v-else />
                <span class="margin-left-8">Block Rate</span>
              </div>
            </template>
            <div v-if="blockRate === 4" class="margin-left-8">Not Enough Data</div>
            <div v-else>{{ rateData.block_ratio }}%</div>
          </a-tag>

          <a-tag
            :color="color(lastLoginRate)"
            :class="colorClass(lastLoginRate)"
            class="flex flex-space-center tag rate-item margin-top-8"
          >
            <template #icon>
              <div class="flex">
                <SmileOutlined v-if="lastLoginRate === 1" />
                <MehOutlined v-else-if="lastLoginRate === 2" />
                <FrownOutlined v-else-if="lastLoginRate === 3" />
                <StopOutlined v-else />
                <span class="margin-left-8">Last Login</span>
              </div>
            </template>
            <div v-if="lastLoginRate === 4" class="margin-left-8">Not Enough Data</div>
            <div v-else>{{ rateData.last_login_days }} Days</div>
          </a-tag>

          <div class="divider"></div>
          <div v-if="!isAllNA" class="font-size-10">
            Categories reflect Field Nation's recommendations for overall experience and quality.
          </div>
          <div v-else class="font-size-10">
            This provider does not have enough information to provide insight into their experience
            or quality.
          </div>
        </div>
      </template>
      <div v-if="!isAllNA">
        <a-tag v-if="count1 !== 0" color="green">
          <template #icon>
            <SmileOutlined />
          </template>
          {{ count1 }}
        </a-tag>
        <a-tag v-if="count2 !== 0" color="blue">
          <template #icon>
            <MehOutlined />
          </template>
          {{ count2 }}
        </a-tag>
        <a-tag v-if="count3 !== 0" color="red">
          <template #icon>
            <FrownOutlined />
          </template>
          {{ count3 }}
        </a-tag>
      </div>
      <a-tag v-else color="#8c8c8c">N/A</a-tag>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ProviderInfo } from "@/api/api/workOrder/types";
import { SmileOutlined, MehOutlined, FrownOutlined, StopOutlined } from "@ant-design/icons-vue";

interface Props {
  rateData: ProviderInfo;
}

const { rateData } = defineProps<Props>();

// 1优秀 2中 3差 4无数据
const generalTasksRate = computed(() => {
  const { general_tasks } = rateData;
  if (general_tasks >= 50) {
    return 1;
  } else if (general_tasks >= 6 && general_tasks <= 49) {
    return 2;
  } else if (general_tasks <= 5 && general_tasks > 0) {
    return 3;
  } else {
    return 4;
  }
});

const marketplaceRate = computed(() => {
  const { average_rating } = rateData;
  if (Number(average_rating) >= 4.9) {
    return 1;
  } else if (Number(average_rating) >= 4.7 && Number(average_rating) <= 4.8) {
    return 2;
  } else if (Number(average_rating) <= 4.6 && Number(average_rating) > 0) {
    return 3;
  } else {
    return 4;
  }
});

const timelinessRate = computed(() => {
  const { timeliness } = rateData;
  if (timeliness >= 90) {
    return 1;
  } else if (timeliness >= 85 && timeliness <= 89) {
    return 2;
  } else if (timeliness <= 84 && timeliness > 0) {
    return 3;
  } else {
    return 4;
  }
});

const cancellationRate = computed(() => {
  const { cancellation_rate } = rateData;
  if (cancellation_rate === null) {
    return 4;
  } else if (cancellation_rate <= 10) {
    return 1;
  } else if (cancellation_rate > 10 && cancellation_rate <= 15) {
    return 2;
  } else {
    return 3;
  }
});

const blockRate = computed(() => {
  const { block_ratio } = rateData;
  if (block_ratio === null) {
    return 4;
  } else if (block_ratio <= 2) {
    return 1;
  } else if (block_ratio >= 3 && block_ratio <= 5) {
    return 2;
  } else {
    return 3;
  }
});

const lastLoginRate = computed(() => {
  const { last_login_days } = rateData;
  if (last_login_days === null) {
    return 4;
  } else if (last_login_days <= 7) {
    return 1;
  } else if (last_login_days >= 8 && last_login_days <= 29) {
    return 2;
  } else {
    return 3;
  }
});

const color = (rate: number) => {
  if (rate === 1) {
    return "green";
  } else if (rate === 2) {
    return "blue";
  } else if (rate === 3) {
    return "red";
  } else {
    return "#8c8c8c";
  }
};

const colorClass = (rate: number) => {
  if (rate === 1) {
    return "color-green";
  } else if (rate === 2) {
    return "color-blue";
  } else if (rate === 3) {
    return "color-red";
  } else {
    return "color-gray";
  }
};

const isAllNA = computed(
  () =>
    generalTasksRate.value === 4 &&
    marketplaceRate.value === 4 &&
    timelinessRate.value === 4 &&
    cancellationRate.value === 4 &&
    blockRate.value === 4 &&
    lastLoginRate.value === 4
);

const rates = [
  generalTasksRate,
  marketplaceRate,
  timelinessRate,
  cancellationRate,
  blockRate,
  lastLoginRate
];

const countRates = (target: number) =>
  rates.reduce((count, rate) => (rate.value === target ? count + 1 : count), 0);

const count1 = computed(() => countRates(1));
const count2 = computed(() => countRates(2));
const count3 = computed(() => countRates(3));
</script>
