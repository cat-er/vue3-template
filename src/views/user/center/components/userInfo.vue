<template>
  <div class="user-info">
    <a-spin :spinning="pageLoading || userInfoLoading">
      <a-row :gutter="48">
        <!-- 左 -->
        <a-col :span="12">
          <a-form layout="vertical" name="basic" ref="formRef" :rules="rules" :model="formData">
            <a-row>
              <a-col :span="24">
                <h2 class="margin-bottom-16">User Info</h2>
              </a-col>
              <a-col :span="24">
                <a-form-item label="First name" name="first_name">
                  <a-input v-no-chinese v-model:value="formData.first_name" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Last name" name="last_name">
                  <a-input v-no-chinese v-model:value="formData.last_name" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Phone number" name="phone">
                  <a-input v-no-chinese v-model:value="formData.phone" />
                </a-form-item>
              </a-col>
              <a-col class="flex action" :span="24">
                <a-space>
                  <a-button type="primary" @click="submitHandle">Save</a-button>
                  <a-button @click="reset">Reset</a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <!-- 右 -->
        <a-col :span="12">
          <a-row>
            <a-col :span="24">
              <div class="avatar">
                <!-- <a-spin :spinning="false">

                </a-spin> -->
                <a-avatar :size="128" :src="formData.avatar">
                  <template #icon><UserOutlined /></template>
                </a-avatar>

                <div class="upload">
                  <uploadFile
                    :accept="[FileTypeEnum.PHOTO]"
                    @uploading="uploadingHandle"
                    @upload-done="uploadDoneHandle"
                    @upload-error="uploadErrorHandle"
                  />
                </div>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import { editUserInfo } from "@/api/api/user/index";
import type { EditUserInfo } from "@/api/api/user/types";
import uploadFile from "@/components/uploadFile/uploadFile.vue";
import { FileTypeEnum } from "@/types/enum";
import type { UploadChangeParam } from "ant-design-vue";
import { notifySuccess } from "@/utils/notify";
import type { Rule } from "ant-design-vue/es/form";

const formData = ref<EditUserInfo>({
  first_name: "",
  last_name: "",
  phone: "",
  avatar: ""
});

const rules: Record<string, Rule[]> = {
  first_name: [{ required: true, trigger: "change" }],
  last_name: [{ required: true, trigger: "change" }],
  phone: [{ required: true, trigger: "change" }]
};

const { userInfo, userInfoLoading } = storeToRefs(useUserStore());
const { setUserInfo } = useUserStore();

// 初始赋值
const init = () => {
  if (!userInfo.value) return;
  const { first_name, last_name, phone, avatar } = userInfo.value;
  formData.value.first_name = first_name;
  formData.value.last_name = last_name;
  formData.value.phone = phone;
  formData.value.avatar = avatar;
};

// 重置表单
const reset = () => {
  for (const key in formData.value) {
    if (Object.prototype.hasOwnProperty.call(formData.value, key)) {
      formData.value[key as keyof EditUserInfo] = "";
    }
  }
};

// 页面loading
const pageLoading = ref(false);

// 头像上传相关
const uploadingHandle = () => {
  pageLoading.value = true;
};

const uploadDoneHandle = (file: UploadChangeParam) => {
  formData.value.avatar = file.file.response.data.link;
  pageLoading.value = false;
};

const uploadErrorHandle = (file: UploadChangeParam) => {
  pageLoading.value = false;
};

// 表单保存
const editUserInfoAsync = async () => {
  try {
    pageLoading.value = true;
    const res = await editUserInfo(formData.value);
    if (res) {
      notifySuccess("Save successfully!");
      setUserInfo();
    }
  } catch (error) {
    console.error(error);
  } finally {
    pageLoading.value = false;
  }
};

const formRef = ref();
const submitHandle = async () => {
  try {
    const res = await formRef.value.validate();
    if (res) {
      editUserInfoAsync();
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  init();
});

watch(
  () => userInfo.value,
  () => {
    init();
  }
);
</script>
