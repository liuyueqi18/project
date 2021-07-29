import {
  createRouter,
  createWebHashHistory,
  RouteLocationNormalized,
  RouteRecordRaw
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "",
    meta: {
      title: "主页"
    },
    component: () =>
      import(/* webpackChunkName: "" */ "../modules/HomePage.vue")
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登陆"
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../modules/Login.vue")
  },
  {
    path: "/homepage",
    name: "Homepage",
    meta: {
      title: "主页"
    },
    component: () =>
      import(/* webpackChunkName: "homepage" */ "../modules/HomePage.vue")
  },
  {
    path: "/customer",
    name: "Customer",
    meta: {
      title: "客户列表"
    },
    component: () =>
      import(
        /* webpackChunkName: "customer" */ "../modules/Customer/Customer.vue"
      )
  },
  {
    path: "/customerinfopage",
    name: "CustomerInfoPage",
    meta: {
      title: "客户信息"
    },
    component: () =>
      import(
        /* webpackChunkName: "customerinfopage" */ "../modules/Customer/CustomerInfoPage.vue"
      )
  },
  {
    path: "/githubmodel",
    name: "GithubModel",
    meta: {
      title: "github"
    },
    component: () =>
      import(
        /* webpackChunkName: "githubmodel" */ "../modules/GithubModel/GithubModel.vue"
      )
  },
  {
    path: "/weather",
    name: "Weather",
    meta: {
      title: "天气"
    },
    component: () =>
      import(/* webpackChunkName: "weather" */ "../modules/Weather/Weather.vue")
  },
  {
    path: "/draw",
    name: "Draw",
    meta: {
      title: "画板"
    },
    component: () =>
      import(/* webpackChunkName: "draw" */ "../modules/Draw/Draw.vue")
  },
  {
    path: "/picturepuzzle",
    name: "PicturePuzzle",
    meta: {
      title: "拼图游戏"
    },
    component: () =>
      import(
        /* webpackChunkName: "loan" */ "../modules/PicturePuzzle/PicturePuzzle.vue"
      )
  },
  {
    path: "/loan",
    name: "Loan",
    meta: {
      title: "贷款计算"
    },
    component: () =>
      import(/* webpackChunkName: "loan" */ "../modules/Loan/Loan.vue")
  },
  {
    path: "/user",
    name: "User",
    meta: {
      title: "个人中心"
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../modules/User/User.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
    const routerList: Array<string> = ["Draw", "Loan"];
    (document as Document).title = to.meta.title || "任意门";
    if (routerList.indexOf(to?.name as string) >= 0) {
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
  }
);

export default router;
