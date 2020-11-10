import { createApp } from "vue";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import "vant/lib/index.css";
import "@/style/main.scss";

createApp(App)
  .use(store)
  .use(router)
  .use(Vant)
  .mount("#app");
