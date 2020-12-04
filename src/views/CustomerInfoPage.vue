<template>
  <div></div>
</template>

<script lang="ts">
type State = {};
import { defineComponent, reactive } from "vue";
export default defineComponent({
  setup() {
    const state = reactive<State>({});
    return {
      state
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="postcss"></style>
