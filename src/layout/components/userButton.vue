<template>
  <a-dropdown :trigger="['click']">
    <a-button type="text" size="large" shape="circle">
      <template #icon>
        <UserOutlined></UserOutlined>
      </template>
    </a-button>
    <template #overlay>
      <a-menu>
        <template v-for="(item, index) in dropdownList" :key="index">
          <a-menu-item @click="item.handle" v-if="item.available">
            <template v-if="item.available">
              <icon class="margin-right-16">
                <template #component>
                  <component :is="item.icon" />
                </template>
              </icon>
              <b>{{ item.label }}</b>
            </template>
          </a-menu-item>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Icon, {
  UserOutlined,
  LogoutOutlined,
  ShopOutlined,
  ProfileOutlined
} from "@ant-design/icons-vue";
import { useUserStore } from "@/stores";
import { showConfirmModal } from "@/utils/modal";
import { toHome, toCompanyDetails } from "@/utils/auth";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const { logOut } = useUserStore();
const { userInfo } = storeToRefs(useUserStore());
const storeAvailable = ref<boolean>(!!userInfo.value?.brands_info.store_available);

// 下拉列表
const router = useRouter();

const logOutHandle = () => {
  showConfirmModal(logOut, "Confirm Logout?");
};

const toStoreService = () => {
  toHome();
};

const toUserCenter = () => {
  router.push({
    name: "userCenter"
  });
};

const toCompanyDetailsHandle = () => {
  toCompanyDetails();
};

const dropdownList = ref([
  {
    label: "Store Service",
    icon: ShopOutlined,
    handle: toStoreService,
    available: computed(() => {
      return storeAvailable.value;
    })
  },
  { label: "User Center", icon: UserOutlined, handle: toUserCenter, available: true },
  {
    label: "Company Detail",
    icon: ProfileOutlined,
    handle: toCompanyDetailsHandle,
    available: true
  },
  { label: "Log Out", icon: LogoutOutlined, handle: logOutHandle, available: true }
]);

watch(
  () => userInfo.value?.brands_info.store_available,
  () => {
    storeAvailable.value = !!userInfo.value?.brands_info.store_available;
  }
);
</script>
