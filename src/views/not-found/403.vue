<template>
  <div class="container">
    <a-result
      status="403"
      title="403"
      :sub-title="
        'Sorry, you are not authorized to access this page. Redirecting in ' +
        countdown +
        ' seconds...'
      "
    >
      <template #extra>
        <a-button type="primary" @click="toHome">Back Home ({{ countdown }})</a-button>
      </template>
    </a-result>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { toHome } from "@/utils/auth";

const countdown = ref<number>(10); // Set countdown time to 10 seconds

let interval: number | undefined;

onMounted(() => {
  interval = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      toHome();
    }
  }, 1000);
});

onBeforeUnmount(() => {
  if (interval !== undefined) {
    window.clearInterval(interval);
  }
});
</script>

<style scoped>
html,
body,
#app,
.container {
  height: 100%;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.ant-result {
  flex-direction: column;
}
</style>
