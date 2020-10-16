import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    meta: {
      title: "登陆",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/homepage",
    name: "Homepage",
    meta: {
      title: "主页",
    },
    component: () =>
      import(/* webpackChunkName: "homepage" */ "../views/HomePage.vue"),
  },
  {
    path: "/todo",
    name: "Todo",
    meta: {
      title: "Todo",
    },
    component: () => import(/* webpackChunkName: "todo" */ "../views/Todo.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
