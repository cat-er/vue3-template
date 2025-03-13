<template>
  <div>
    <a-modal :open="isOpen" wrap-class-name="approve-action" :footer="null" :closable="false">
      <a-card :title="t('edit_location')" class="approve-card width-700">
        <template #extra><close-outlined @click="onClose" /></template>
        <div>
          <a-form
            ref="formRef"
            :model="formData"
            name="location"
            layout="vertical"
            :wrapper-col="{ span: 24 }"
            :rules="rules"
          >
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item
                  :tooltip="t('display_name_tip')"
                  name="display_name"
                  v-bind="validateInfos.display_name"
                >
                  <template #label>
                    {{ t("display_name") }}
                  </template>
                  <a-input v-model:value="formData.display_name" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="type_id" v-bind="validateInfos.type_id">
                  <template #label>
                    {{ t("location_type") }}
                  </template>
                  <a-select v-model:value="formData.type_id">
                    <a-select-option
                      v-for="(item, index) in typeIdList"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="country" v-bind="validateInfos.country">
                  <template #label>
                    {{ t("country") }}
                  </template>
                  <a-select v-model:value="formData.country" :disabled="true">
                    <a-select-option value="US">United States of America</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <!--占位-->
              </a-col>
              <a-col :span="12">
                <a-form-item name="address1" v-bind="validateInfos.address1">
                  <template #label>
                    {{ t("address_line1") }}
                  </template>
                  <a-input v-no-chinese v-model:value="formData.address1"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="address2">
                  <template #label>
                    {{ t("address_line2") }}
                  </template>
                  <a-input v-no-chinese v-model:value="formData.address2"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="city" v-bind="validateInfos.city">
                  <template #label>
                    {{ t("city") }}
                  </template>
                  <a-input v-no-chinese v-model:value="formData.city" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item name="state" v-bind="validateInfos.state">
                  <template #label>
                    {{ t("state") }}
                  </template>
                  <a-select
                    :placeholder="t('select_placeholder')"
                    showSearch
                    optionFilterProp="label"
                    v-model:value="formData.state"
                    @change="onChange"
                  >
                    <a-select-option
                      v-for="(item, index) in usStates"
                      :key="index"
                      :value="item.value"
                      :label="item.label"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item name="zip" :validate-status="isValidZip" v-bind="validateInfos.zip">
                  <template #label>
                    {{ t("zip_code") }}
                  </template>
                  <a-input v-no-chinese v-model:value="zipValue" @blur="formValidate" />
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
              {{ t("submit") }}
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
import { updateCustomLocation } from "@/api/api/workOrder";
import type { LocationInfo, updateCustomLocationReq } from "@/api/api/workOrder/types";
import { ref } from "vue";
import { Location, LocationEnum } from "@/api/api/workOrder/types";
import { type Rule, useForm } from "ant-design-vue/es/form";
import { queryTimezone } from "@/api/api/workOrder";
import { usStates } from "@/stores";

const disabled = ref<boolean>(false);
const loading = ref<boolean>(false);

const formRef = ref();
// 数据接收
interface Props {
  isOpen: boolean;
  order_id: number;
  locationInfo: LocationInfo;
}
const { isOpen, order_id, locationInfo } = defineProps<Props>();
const emits = defineEmits(["cancels", "reloadPage"]);

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
  const param = ref<updateCustomLocationReq>({
    location: formData.value
  });
  disabled.value = true;
  loading.value = true;
  try {
    let res = await updateCustomLocation(order_id.toString(), param.value);
    if (res) {
      notifySuccess("successfully");
      reloads();
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
  emits("cancels");
};

const zipValue = ref<string>(locationInfo.zip ? locationInfo.zip : "");
const formData = ref<Location>({
  display_name: locationInfo.display_name ? locationInfo.display_name : "",
  city: locationInfo.city ? locationInfo.city : "",
  address1: locationInfo.address1 ? locationInfo.address1 : "",
  address2: locationInfo.address2 ? locationInfo.address2 : "",
  state: locationInfo.state ? locationInfo.state : "",
  zip: locationInfo.zip ? locationInfo.zip : "",
  country: "US",
  type_id: locationInfo.type_id ? locationInfo.type_id : LocationEnum.COMMERCIAL,
  mode: "custom"
});

interface TypeIdList {
  label: string;
  value: LocationEnum;
}

const typeIdList = ref<TypeIdList[]>([
  { label: "Commercial", value: LocationEnum.COMMERCIAL },
  { label: "Governmental", value: LocationEnum.GOVERNMENTAL },
  { label: "Residential", value: LocationEnum.RESIDENTIAL },
  { label: "Educational", value: LocationEnum.EDUCATIONAL },
  { label: "Other", value: LocationEnum.OTHER }
]);

// 校验邮编
const isValidZip = ref<string>("");
const isValidZipHelp = ref<string>("");

const rules: Record<string, Rule[]> = {
  display_name: [{ required: true, trigger: ["blur"], message: "Please enter Display name" }],
  city: [{ required: true, trigger: ["blur"], message: "Please enter City" }],
  address1: [{ required: true, trigger: ["blur"], message: "Please enter Address Line 1" }],
  state: [{ required: true, trigger: ["blur"], message: "Please select a State" }],
  zip: [{ required: true, trigger: ["blur"], message: "Please enter Zip Code" }],
  country: [{ required: true, trigger: ["blur"], message: "Please select a Country" }],
  type_id: [{ required: true, trigger: ["blur"], message: "Please select a Location type" }]
};
const { resetFields, validate, validateInfos } = useForm(formData, rules, {
  onValidate: (...args) => console.log(...args)
});

const getTimeZone = async () => {
  try {
    isValidZip.value = "validating";
    isValidZipHelp.value = t("waiting_for_validation");
    rules.zip[0].message = isValidZipHelp.value;
    const res = await queryTimezone({
      zip: zipValue.value,
      state_code: formData.value.state,
      country_code: formData.value.country
    });
    if (res) {
      isValidZip.value = "success";
      isValidZipHelp.value = "";
      formData.value.zip = zipValue.value;
    } else {
      isValidZip.value = "error";
      isValidZipHelp.value = t("invalid_address_information");
      rules.zip[0].message = isValidZipHelp.value;
    }
  } catch (err) {
    console.error(err);
  }
};

// 校验
const onChange = (value: any) => {
  formData.value.state = value;
  formValidate();
};
const formValidate = () => {
  rules.zip[0].message = "Please enter Zip Code";
  formData.value.zip = "";
  if (formData.value.state && zipValue.value) {
    getTimeZone();
  }
};

// onMounted(() => {
//   formValidate();
// });
</script>

<style scoped lang="less">
.width-700 {
  width: 700px !important;
}
</style>
