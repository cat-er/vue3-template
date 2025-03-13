<template>
  <div>
    <a-modal v-model:open="modal" width="45%" :title="title">
      <a-spin :spinning="modalLoading">
        <div>
          <a-alert
            class="margin-bottom-16 margin-top-16"
            :description="alertDesc"
            :type="alertType"
            show-icon
          >
            <template #message>
              <b>
                {{ alertMsg }}
              </b>
            </template>
          </a-alert>
          <a-table
            v-if="qualificationsList.length > 0"
            :dataSource="qualificationsList"
            :columns="columns"
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'status'">
                <a-tag v-if="record.status" class="tag margin-0" color="green">Passed</a-tag>
                <a-tag v-else class="tag margin-0" color="red">Missing</a-tag>
              </template>
            </template>
          </a-table>
        </div>
      </a-spin>

      <template #footer>
        <a-button @click="hide">Cancel</a-button>
        <a-button type="primary" :disabled="modalLoading" @click="confirmHandle">
          {{ btnLabel }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { checkProviderQualifications } from "@/api/api/workOrder/index";
import { CheckProviderQualificationsRes } from "@/api/api/workOrder/types";
import { TableColumnProps } from "ant-design-vue";

interface Props {
  orderId?: number;
  providerId?: number;
}

const props = defineProps<Props>();

const modal = ref<boolean>(false);

const btnLabel = ref<string>();
const show = (label: string) => {
  btnLabel.value = label;
  modal.value = true;
  checkProviderQualificationsAsync();
};

const hide = () => {
  modal.value = false;
};

// 检查工程师资质
const qualificationsList = ref<CheckProviderQualificationsRes[]>([]);
const title = ref<string>("Missing Qualifications");
const alertType = ref<"warning" | "error" | "success" | "info" | undefined>("warning");
const alertDesc = ref<string>("Consider these provider qualifications when routing or assigning.");
const alertMsg = ref<string>(
  "The following qualifications have been designated as necessary for work order assignment"
);

const modalLoading = ref<boolean>(false);
const checkProviderQualificationsAsync = async () => {
  if (!props.orderId || !props.providerId) return;
  try {
    modalLoading.value = true;
    const res = await checkProviderQualifications({
      order_id: props.orderId,
      provider_id: props.providerId
    });
    if (res) {
      qualificationsList.value = res;
      if (res.length === 0) {
        title.value = "Ignore Qualifications";
        alertType.value = "info";
        alertMsg.value = "This work order does not specify any qualifications";
        alertDesc.value = "There is no need to check the provider's qualifications.";
      } else if (!qualificationsList.value.some((item) => item.status === false)) {
        title.value = "Passed Qualifications";
        alertType.value = "success";
        alertDesc.value =
          "This provider fully meets all the qualifications required by the work order.";
      }
      console.log("资质", res);
    }
  } catch (error) {
    console.error(error);
  } finally {
    modalLoading.value = false;
  }
};

interface Emits {
  (e: "routeConfirm"): void;
  (e: "assignConfirm"): void;
}

const emits = defineEmits<Emits>();
const confirmHandle = () => {
  if (btnLabel.value === "Route") {
    emits("routeConfirm");
  } else {
    emits("assignConfirm");
  }
  hide();
};

defineExpose({
  show
});

const columns = ref<TableColumnProps[]>([
  {
    title: "Type",
    dataIndex: "type"
  },
  {
    title: "Qualification",
    dataIndex: "qualification"
  },
  {
    title: "Status",
    dataIndex: "status",
    width: 150,
    align: "center"
  }
]);
</script>
