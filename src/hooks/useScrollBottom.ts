import { ref, onMounted, onUnmounted } from "vue";

export default function useScrollBottom() {
  const isBottom = ref(false);

  const checkScrollBottom = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

    if (scrollTop + clientHeight >= scrollHeight - 1) {
      // 减去1以防止浮点数误差
      isBottom.value = true;
    } else {
      isBottom.value = false;
    }
  };

  onMounted(() => {
    window.addEventListener("scroll", checkScrollBottom);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", checkScrollBottom);
  });

  return {
    isBottom
  };
}
