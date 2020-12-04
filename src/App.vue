<template>
  <div id="app">
    <!-- <SignOut v-if="isShowSignOut"></SignOut> -->
    <router-view />
  </div>
</template>

<script lang="ts">
type State = {};
import { defineComponent, reactive, computed } from "vue";
import { useRoute } from "vue-router";
// import SignOut from "@/components/SignOut.vue";

export default defineComponent({
  name: "App",
  components: {
    // SignOut
  },
  setup() {
    const route = useRoute();
    const state = reactive<State>({});
    const isShowSignOut = computed(() => {
      return route.name !== "Login";
    });
    return {
      state,
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
