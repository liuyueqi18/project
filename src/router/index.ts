import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    name: "",
    meta: {
      title: "主页"
    },
    component: () => import(/* webpackChunkName: "" */ "../views/HomePage.vue")
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登陆"
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/homepage",
    name: "Homepage",
    meta: {
      title: "主页"
    },
    component: () =>
      import(/* webpackChunkName: "homepage" */ "../views/HomePage.vue")
  },
  {
    path: "/customer",
    name: "Customer",
    meta: {
      title: "Todo"
    },
    component: () =>
      import(/* webpackChunkName: "customer" */ "../views/Customer.vue")
  },
  {
    path: "/user",
    name: "User",
    meta: {
      title: "个人中心"
    },
    component: () => import(/* webpackChunkName: "user" */ "../views/User.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
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

export default router;
