<template>
  <div class="customer"></div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
type Props = {
  //
};
type State = {};

export default defineComponent({
  name: "Login",
  props: {},
  setup() {
    const state = reactive<State>({});
    return {
      state
    };
  }
});
</script>

<style scoped lang="postcss">
.customer {
}
</style>
