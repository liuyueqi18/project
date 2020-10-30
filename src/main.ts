import { createApp } from "vue";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import "vant/lib/index.css";
import "@/style/main.scss";

import AV from "leancloud-storage";
AV.init({
  appId: "Q8A65T5W8qkMkbWI17g7vAu0-gzGzoHsz",
  appKey: "JXUCxIYpDrIF87LVpYlK9egD",
  serverURL: "https://q8a65t5w.lc-cn-n1-shared.com",
});

createApp(App)
  .use(store)
  .use(router)
  .use(Vant)
  .use(AV as any)
  .mount("#app");
