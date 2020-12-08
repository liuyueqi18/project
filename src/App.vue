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
  color: #333;
  height: 100% !important;
}
</style>
