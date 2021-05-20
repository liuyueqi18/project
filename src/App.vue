<template>
  <div id="app">
    <SignOut v-if="isShowSignOut"></SignOut>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import SignOut from "@/components/SignOut.vue";

export default defineComponent({
  name: "App",
  components: {
    SignOut
  },
  setup() {
    const router = useRouter();

    const showSignList = ["", "Homepage", "Customer"];
    const isShowSignOut = ref(false);

    router.beforeEach((to, from, next) => {
      if (showSignList.indexOf(to.name as string) > -1) {
        isShowSignOut.value = true;
      } else {
        isShowSignOut.value = false;
      }
      next();
    });

    return {
      isShowSignOut
    };
  }
});
</script>

<style>
body {
  color: #4d5464;
  height: 100% !important;
}
</style>
<style type="text/css">
.icon {
  width: 16px;
  height: 16px;
  font-size: 16px;
  display: block;
  fill: currentColor;
  /* 继承颜色 */
  overflow: hidden;
  color: #4d5464;
}
</style>
