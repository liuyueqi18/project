<template>
  <div id="app">
    <SignOut></SignOut>
    <router-view />
  </div>
</template>

<script lang="ts">
type State = {};
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";
import SignOut from "@/components/SignOut.vue";

export default defineComponent({
  name: "App",
  components: {
    SignOut,
  },
  setup() {
    const router = useRouter();
    const state = reactive<State>({});

    return {
      state,
    };
  },
});
</script>

<style lang="scss"></style>
