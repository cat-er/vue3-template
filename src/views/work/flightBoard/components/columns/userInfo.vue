<!-- src/components/UserInfo.vue -->
<template>
  <div class="user-info">
    <a-avatar size="large" :src="userInfo.thumbnail_url" />
    <div class="user-details">
      <div class="user-name">{{ userInfo.full_name }}</div>
      <div class="user-phone" v-if="userInfo.phone_number">
        {{ phoneFormat(userInfo.phone_number ? userInfo.phone_number : "") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import phoneFormat from "@/utils/phoneFormat";

interface UserInfo {
  thumbnail_url: string;
  full_name: string;
  phone_number: string;
}

interface Props {
  userInfo: UserInfo;
}

const props = defineProps<Props>();
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
}

.user-details {
  margin-left: 10px;
}

.user-name {
  font-size: 14px;
  color: #2b54b6;
  cursor: pointer;
}

.user-name:hover {
  text-decoration: underline;
}

.user-phone {
  font-size: 12px;
  color: #2b54b6;
}
</style>
