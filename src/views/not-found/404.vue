<template>
  <div class="container">
    <a-result
      status="404"
      title="404"
      :sub-title="
        'Sorry, the page you visited does not exist. Redirecting in ' + countdown + ' seconds...'
      "
    >
      <template #extra>
        <a-button type="primary" @click="goHome">Back Home ({{ countdown }})</a-button>
      </template>
    </a-result>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const countdown = ref<number>(10); // Set countdown time to 10 seconds

const goHome = () => {
  router.push("/");
};

let interval: number | undefined;

onMounted(() => {
  interval = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      goHome();
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
