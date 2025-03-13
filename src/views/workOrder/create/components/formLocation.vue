<template>
  <a-card :title="t('location')" class="box-shadow">
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
            :label="t('display_name')"
            :tooltip="t('display_name_tip')"
            name="display_name"
          >
            <a-input v-no-chinese v-model:value="formData.display_name" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('location_type')" name="type_id">
            <a-select v-model:value="formData.type_id">
              <a-select-option v-for="(item, index) in typeIdList" :key="index" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('country')" name="country">
            <a-select v-model:value="formData.country" :disabled="true">
              <a-select-option value="US">United States of America</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <!--占位-->
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('address_line1')" name="address1">
            <a-input v-no-chinese v-model:value="formData.address1"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('address_line2')" name="address2">
            <a-input v-no-chinese v-model:value="formData.address2"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('city')" name="city">
            <a-input v-no-chinese v-model:value="formData.city" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="t('state')" name="state">
            <a-select
              :placeholder="t('select_placeholder')"
              showSearch
              optionFilterProp="label"
              v-model:value="formData.state"
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
          <a-form-item
            :label="t('zip_code')"
            name="zip"
            :validate-status="isValidZip"
            :help="isValidZipHelp"
          >
            <a-input v-no-chinese v-model:value="formData.zip" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { t } from "@/locale";
import { onMounted, ref, watch } from "vue";
import { Location, LocationEnum } from "@/api/api/workOrder/types";
import type { Rule } from "ant-design-vue/es/form";
import { queryTimezone } from "@/api/api/workOrder";
import { usStates, useWorkOrderCreateStore } from "@/stores";
import { useOutPutState } from "../hooks";
import { WorkOrderListKey } from "@/views/workOrder/create/types";
import { debounce } from "lodash";

const workOrderCreateStore = useWorkOrderCreateStore();

const formData = ref<Location>({
  display_name: "",
  city: "",
  address1: "",
  address2: "",
  state: "",
  zip: "",
  country: "US",
  type_id: LocationEnum.COMMERCIAL,
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
const isValidZip = ref<string>("error");
const isValidZipHelp = ref<string>(t("required_fields"));

const rules: Record<string, Rule[]> = {
  display_name: [{ required: true, trigger: ["blur"] }],
  city: [{ required: true, trigger: ["blur"] }],
  address1: [{ required: true, trigger: ["blur"] }],
  state: [{ required: true, trigger: ["blur"] }],
  zip: [{ required: true, trigger: ["blur"] }],
  country: [{ required: true, trigger: ["blur"] }],
  type_id: [{ required: true, trigger: ["blur"] }]
};

// 根据地址拿到邮编

const { setTimeZone } = workOrderCreateStore;
const getTimeZone = async () => {
  try {
    isValidZip.value = "validating";
    isValidZipHelp.value = t("waiting_for_validation");
    const res = await queryTimezone({
      zip: formData.value.zip,
      state_code: formData.value.state,
      country_code: formData.value.country
    });
    if (res) {
      isValidZip.value = "success";
      isValidZipHelp.value = "";
      setTimeZone(res);
      useOutPutState(true, WorkOrderListKey.LOCATION, {
        location: formData.value
      });
    } else {
      isValidZip.value = "error";
      isValidZipHelp.value = t("invalid_address_information");
      useOutPutState(false, WorkOrderListKey.LOCATION, {
        location: formData.value
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// 校验
const formRef = ref();
const formValidate = async () => {
  try {
    await formRef.value.validate();
    await getTimeZone();
  } catch (err) {
    useOutPutState(false, WorkOrderListKey.LOCATION, {
      location: formData.value
    });
  }
};

// 包装后的防抖函数
const debouncedFormValidate = debounce(formValidate, 2000);
watch(
  () => formData.value,
  () => {
    debouncedFormValidate();
  },
  { deep: true }
);

onMounted(() => {
  formValidate();
});
</script>
