<template>
  <div>
    <a-modal v-model:open="modal" width="45%" title="Expense Details">
      <a-descriptions bordered :column="1">
        <a-descriptions-item
          v-for="(item, index) in descriptionsData"
          :key="index"
          :label="item.label"
        >
          {{ item.value }}
        </a-descriptions-item>
        <a-descriptions-item
          key="Attachment"
          label="Attachment"
          v-if="expenses && expenses.receipt?.name"
        >
          {{ expenses.receipt?.name }}
          <a-button type="link" :href="expenses.receipt?.link" download>
            <DownloadOutlined />
            Download File
          </a-button>
        </a-descriptions-item>
      </a-descriptions>
      <template #footer>
        <a-button @click="hide">Cancel</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { FnWorkOrderPayResult, FnWorkOrderPayResultStatusEnum } from "@/api/api/workOrder/types";
import { DownloadOutlined } from "@ant-design/icons-vue";

const modal = ref<boolean>(false);

const expenses = ref<FnWorkOrderPayResult>();

const show = (expensesValue: FnWorkOrderPayResult) => {
  modal.value = true;
  expenses.value = expensesValue;
};

const hide = () => {
  modal.value = false;
};

const author = computed(() => {
  if (!expenses.value) return "";
  const { author } = expenses.value;
  return `${author.first_name} ${author.last_name}`;
});

const time = computed(() => {
  if (!expenses.value) return "";
  const { added } = expenses.value;
  return added.local.date;
});

const category = computed(() => {
  if (!expenses.value) return "";
  const { category } = expenses.value;
  return category.label;
});

const quantity = computed(() => {
  if (!expenses.value) return "";
  const { quantity } = expenses.value;
  return quantity;
});

const amount = computed(() => {
  if (!expenses.value) return "";
  const { amount } = expenses.value;
  return `$${amount}`;
});

const desc = computed(() => {
  if (!expenses.value) return "";
  const { description } = expenses.value;
  return description;
});

const reason = computed(() => {
  if (!expenses.value) return "";
  const { status_description } = expenses.value;
  return status_description;
});

const attachment = computed(() => {
  if (!expenses.value) return "";
  // eslint-disable-next-line no-unsafe-optional-chaining
  const { attachment_name } = expenses.value && expenses.value.receipt?.name;
  return attachment_name;
});

const descriptionsData = computed(() => {
  const baseData = [
    // { label: "Author", value: author.value },
    { label: "Time", value: time.value },
    { label: "Category", value: category.value },
    { label: "Quantity", value: quantity.value },
    { label: "Amount", value: amount.value },
    { label: "Description", value: desc.value }
  ];

  if (expenses.value?.status === FnWorkOrderPayResultStatusEnum.DISAPPROVED) {
    return [...baseData, { label: "Reason", value: reason.value }];
  }

  return baseData;
});

interface Expose {
  show: (expensesValue: FnWorkOrderPayResult) => void;
}

defineExpose<Expose>({
  show
});
</script>
