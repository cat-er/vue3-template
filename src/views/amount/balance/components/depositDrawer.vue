<template>
  <a-drawer
    :title="t('deposit')"
    :open="depositOpen"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form :ref="formRef" :model="modelRef" layout="vertical">
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item name="pay_method_id" v-bind="validateInfos.pay_method_id">
            <template #label>
              {{ t("pay_method") }}
            </template>
            <a-select
              v-if="depositOptions"
              v-model:value="modelRef.pay_method_id"
              :placeholder="t('select_payment_method')"
              :options="
                depositOptions.map((option) => ({
                  value: option.id,
                  label: option.name,
                  info: option.info,
                  mcode: option.mcode
                }))
              "
              @change="onChange"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="recharge_score" v-bind="validateInfos.recharge_score">
            <template #label>
              {{ t("applied_amount") }}
            </template>
            <a-input
              v-model:value="modelRef.recharge_score"
              :placeholder="t('enter_amount_requested')"
              :addon-after="modelRef.recharge_mcode"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="confirmation_no">
            <template #label>
              {{ t("validation_trading_code") }}
            </template>
            <a-input
              v-model:value="modelRef.confirmation_no"
              placeholder="Please enter Validation Code"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="pay_from_account" v-bind="validateInfos.pay_from_account">
            <template #label>
              {{ t("pay_account") }}
            </template>
            <a-input
              v-model:value="modelRef.pay_from_account"
              :placeholder="t('enter_payment_account')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="file_path">
            <template #label>
              {{ t("bank_receipt") }}
            </template>
            <a-upload-dragger
              :fileList="fileList"
              :multiple="false"
              :maxCount="1"
              :beforeUpload="beforeUpload"
              @remove="remove"
              @change="handleChange"
            >
              <p class="ant-upload-drag-icon">
                <inbox-outlined></inbox-outlined>
              </p>
              <p class="ant-upload-text">{{ t("drag_file_upload") }}</p>
            </a-upload-dragger>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider />
      <a-row>
        <a-col v-if="bankInfo.bank_name">
          <a-descriptions title="Recipient Bank Account Information">
            <a-descriptions-item :span="3" v-if="bankInfo.bank_name">
              <template #label>
                <!-- {{ t("bank_name") }} -->
                Bank Name
              </template>
              {{ bankInfo.bank_name }}
              <CopyTwoTone
                :rotate="180"
                style="font-size: 12px"
                @click="copyToClipboard(bankInfo.bank_name)"
              />
            </a-descriptions-item>
            <a-descriptions-item :span="3" v-if="bankInfo.routing">
              <template #label>
                <!-- {{ t("domestic_wire_transfer_number") }} -->
                Routing Number
              </template>
              {{ bankInfo.routing }}
              <CopyTwoTone
                :rotate="180"
                style="font-size: 12px"
                @click="copyToClipboard(bankInfo.routing)"
              />
            </a-descriptions-item>
            <a-descriptions-item :span="3" v-if="bankInfo.swift_code">
              <template #label>
                <!-- {{ t("international_wire_transfer_code") }} -->
                Swift Code
              </template>
              {{ bankInfo.swift_code }}
              <CopyTwoTone
                :rotate="180"
                style="font-size: 12px"
                @click="copyToClipboard(bankInfo.swift_code)"
              />
            </a-descriptions-item>
            <a-descriptions-item :span="3" v-if="bankInfo.account_name">
              <template #label>
                <!-- {{ t("account_name") }} -->
                Account Name
              </template>
              {{ bankInfo.account_name }}
              <CopyTwoTone
                :rotate="180"
                style="font-size: 12px"
                @click="copyToClipboard(bankInfo.account_name)"
              />
            </a-descriptions-item>
            <a-descriptions-item :span="3" v-if="bankInfo.account_number">
              <template #label>
                <!-- {{ t("account_number") }} -->
                Account Number
              </template>
              {{ bankInfo.account_number }}
              <CopyTwoTone
                :rotate="180"
                style="font-size: 12px"
                @click="copyToClipboard(bankInfo.account_number)"
              />
            </a-descriptions-item>
            <a-descriptions-item :span="3" v-if="bankInfo.bank_address">
              <template #label>
                <!-- {{ t("bank_address") }} -->
                Address
              </template>
              {{ bankInfo.bank_address }}
              <CopyTwoTone
                :rotate="180"
                style="font-size: 12px"
                @click="copyToClipboard(bankInfo.bank_address)"
              />
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
      </a-row>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose" :disabled="disabled">Cancel</a-button>
        <a-button @click="resetFields" style="display: none">reset</a-button>
        <a-button type="primary" @click="onSubmit" :loading="loading">Submit</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>
<script setup lang="ts">
import { InboxOutlined, CopyTwoTone } from "@ant-design/icons-vue";
import { reactive, ref } from "vue";
// import type { Rule } from "ant-design-vue/es/form";
import i18n from "@/locale";
import type { UploadProps } from "ant-design-vue";
import { notifyError, notifySuccess } from "@/utils/notify";
import { depositAddFile, depositBalance } from "@/api/api/amount";
import type { bankRes } from "@/views/amount/types/amount";
import type { BalanceReq, PayMethodsOptions } from "@/api/api/amount/types";
import { Form } from "ant-design-vue";
import type { SelectValue, DefaultOptionType } from "ant-design-vue/es/select/index.d.ts";

const useForm = Form.useForm;

const disabled = ref<boolean>(false);
const loading = ref<boolean>(false);
interface Props {
  depositOpen: boolean;
  depositOptions: PayMethodsOptions[];
}

const { depositOpen, depositOptions } = defineProps<Props>();

const { t } = i18n.global;
const formRef = ref<string>("formRef");
const modelRef = reactive<BalanceReq>({
  pay_method_id: 0,
  recharge_score: 0,
  recharge_mcode: "USD",
  confirmation_no: "",
  pay_from_account: "",
  file_path: ""
});

const rulesRef = reactive({
  pay_method_id: [{ required: true, message: t("select_payment_method") }],
  recharge_score: [{ required: true, message: t("enter_amount_requested") }],
  pay_from_account: [{ required: true, message: t("enter_payment_account") }]
});
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef, {
  onValidate: (...args) => console.log(...args)
});
const fileList = ref<UploadProps["fileList"]>([]);

const bankInfo = ref<bankRes>({} as any);
const handleUpload = async () => {
  const formData = new FormData();
  if (!fileList.value) return;
  const file = fileList.value[0];
  formData.append("file", file as any);
  try {
    modelRef.file_path = await depositAddFile(formData);
  } catch {
    modelRef.file_path = "";
  }
};

const beforeUpload = (file: File) => {
  fileList.value = [file as any];
  return false;
};
const remove = () => {
  fileList.value = [];
  modelRef.file_path = "";
};

//
const handleChange = () => {
  handleUpload();
};
//支付方式切换
const onChange = (value: SelectValue, option: DefaultOptionType) => {
  modelRef.recharge_mcode = option.mcode ? option.mcode : "USD";
  bankInfo.value = option.info;
};

const emits = defineEmits(["cancels"]);
const onClose = () => {
  emits("cancels", 0);
};

const onSubmit = () => {
  validate()
    .then(() => {
      onFinish();
    })
    .catch((err) => {
      console.log("error", err);
    });
};

const onFinish = async () => {
  loading.value = true;
  disabled.value = true;
  try {
    let res = await depositBalance(modelRef);
    if (res) {
      notifySuccess("Deposit successful");
    }
    emits("cancels", 1);
  } catch {
    notifyError("Deposit failure");
  }
  loading.value = false;
  disabled.value = false;
};
//复制
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    notifySuccess(t("copy_successfully"));
  } catch (err) {
    notifySuccess(t("copy_failure"));
  }
};
</script>
