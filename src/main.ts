import "./assets/style/index.less";

import { createApp } from "vue";
import pinia from "@/stores";
import App from "./App.vue";
import router from "./router";
import i18n from "@/locale/index";
import Antd from "ant-design-vue";
import directives from "@/directive";

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(Antd);
app.use(i18n);
app.use(directives);

app.mount("#app");
