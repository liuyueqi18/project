import { createApp } from "vue";
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

router.beforeEach((to, from, next) => {
  const routerList: Array<string> = [];
  (document as any).title = to.meta.title || "任意门";
  if (routerList.indexOf(to.name as any) >= 0) {
    next();
    return;
  } else {
    if (to.name === "Login") {
      next();
      return;
    }
    if (localStorage.getItem("rym_user_id")) {
      next();
    } else {
      next({ name: "Login" });
    }
  }
});

createApp(App)
  .use(store)
  .use(router)
  .use(Vant)
  .use(AV as any)
  .mount("#app");
