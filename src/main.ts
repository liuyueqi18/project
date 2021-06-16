import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import "vant/lib/index.css";
import "@/style/main.scss";
import VConsole from "vconsole";

if (process.env.VUE_APP_TITLE === "test") {
  new VConsole();
}

createApp(App)
  .use(store)
  .use(router)
  .use(Vant)
  .mount("#app");
