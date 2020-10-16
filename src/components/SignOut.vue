<template>
  <div class="sign_out">
    <div class="sign_button">
      <van-icon name="user-circle-o" />
    </div>
  </div>
</template>

<script lang="ts">
type State = {};
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();
    const state = reactive<State>({});

    return {
      state,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/style/main.scss";
.sign_out {
  .sign_button {
    background: $Bg;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    text-align: center;
    line-height: 10vw;
    color: #fff;
    display: flex;
    bottom: 30px;
    right: 30px;
  }
}
</style>
