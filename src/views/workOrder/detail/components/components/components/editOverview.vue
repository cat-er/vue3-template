<template>
  <div>
    <a-modal :open="isOpen" wrap-class-name="modal-action" :footer="null" :closable="false">
      <a-card :title="t('edit_overview')" class="modal-card width-700">
        <template #extra><close-outlined @click="onClose" /></template>
        <div>
          <a-form
            :model="formData"
            name="location"
            layout="vertical"
            :wrapper-col="{ span: 24 }"
            :rules="rules"
          >
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item name="title" v-bind="validateInfos.title">
                  <template #label>
                    {{ t("work_order_title") }}
                  </template>
                  <a-input v-model:value="formData.title" />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <!--占位-->
              </a-col>
              <a-col :span="24">
                <a-form-item name="export" v-bind="validateInfos.export">
                  <template #label>
                    {{ t("work_order_options") }}
                  </template>
                  <a-checkbox-group
                    v-model:value="checkedList"
                    style="width: 100%"
                    @change="checkedChange"
                  >
                    <a-col :span="24">
                      <a-checkbox value="export">Allow export button</a-checkbox>
                    </a-col>
                    <a-col :span="24">
                      <a-checkbox value="counter">Allow counter offers</a-checkbox>
                    </a-col>
                    <a-col :span="24">
                      <a-checkbox value="gps" :class="statusNum == 2 ? '' : 'hide'">
                        Require GPS during check in and check out
                      </a-checkbox>
                    </a-col>
                  </a-checkbox-group>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <template #actions>
          <a-space>
            <a-button @click="onClose" :disabled="disabled">{{ t("cancel") }}</a-button>
            <a-button @click="resetFields" class="hide">{{ t("reset") }}</a-button>
            <a-button type="primary" @click="onSubmit" :loading="loading">
              {{ t("save") }}
            </a-button>
          </a-space>
        </template>
      </a-card>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { t } from "@/locale";
import { notifyError, notifySuccess } from "@/utils/notify";
import { updateOverview } from "@/api/api/workOrder";
import type { Overview } from "@/api/api/workOrder/types";
import { onMounted, ref } from "vue";
import { type Rule, useForm } from "ant-design-vue/es/form";

const disabled = ref<boolean>(false);
const loading = ref<boolean>(false);
const isOpen = ref<boolean>(false);

const checkedList = ref([]);
// 数据接收
const order_id = ref<string>("");
const statusNum = ref<number>(0);
const emits = defineEmits(["reloadPage"]);

const show = (workOrderDetail) => {
  // 表单初始化
  formData.value.title = workOrderDetail.title;
  formData.value.export = workOrderDetail.printable;
  formData.value.counter = workOrderDetail.allow_counter_offers;
  formData.value.gps = workOrderDetail.require_gps;

  order_id.value = workOrderDetail.id;
  statusNum.value = workOrderDetail.status;

  isOpen.value = true;
  // 选项初始化
  checkedComputed();
};
const onSubmit = () => {
  // 暂时取消操作描述
  validate()
    .then(() => {
      onFinish();
    })
    .catch((err) => {
      console.log("error", err);
    });
};

const onFinish = async () => {
  const param = ref<Overview>({
    title: formData.value.title, //标题
    allow_counter_offers: formData.value.counter, //是否允许工程师还价
    require_gps: formData.value.gps, //是否需要工程师在check in和check out时请求GPS定位
    printable: formData.value.export //是否允许工程师打印文档信息
  });
  disabled.value = true;
  loading.value = true;
  try {
    let res = await updateOverview(order_id.value, param.value);
    if (res) {
      notifySuccess("successfully");
      reloads();
      onClose();
    } else {
      notifyError("failure");
    }
  } catch (e) {
    console.log(e);
  }
  disabled.value = false;
  loading.value = false;
};
const reloads = () => {
  emits("reloadPage");
};
const onClose = () => {
  isOpen.value = false;
};
const checkedChange = () => {
  formData.value.export = checkedList.value.includes("export");
  formData.value.counter = checkedList.value.includes("counter");
  formData.value.gps = checkedList.value.includes("gps");
  console.log("checkedChange:", formData.value);
};
interface formInterface {
  title: string;
  export: boolean;
  counter: boolean;
  gps: boolean;
}
const formData = ref<formInterface>({
  title: "",
  export: false,
  counter: false,
  gps: false
});

const rules: Record<string, Rule[]> = {
  title: [
    { required: true, trigger: ["blur"], message: "Work order title is required" },
    {
      pattern: /^[^\u4E00-\u9FFF]*$/,
      message: "English inputs only",
      trigger: ["change", "blur"]
    }
  ]
};

const { resetFields, validate, validateInfos } = useForm(formData, rules, {});
defineExpose({
  show
});
// 多选框初始化
const checkedComputed = () => {
  checkedList.value.length = 0;
  if (formData.value.export) checkedList.value.push("export");
  if (formData.value.counter) checkedList.value.push("counter");
  if (formData.value.gps) checkedList.value.push("gps");
};
onMounted(() => {
  checkedComputed();
});
</script>

<style scoped lang="less"></style>
