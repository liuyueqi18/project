<template>
  <div class="sign_out">
    <div
      class="sign_button"
      @click="showUserDialog"
      :style="{
        'box-shadow': state.isShowUserDialog ? '' : '2px 0px 10px 1px #325888'
      }"
    >
      <van-icon name="user-circle-o" class="sign_icon" />
    </div>
    <transition name="van-slide-down">
      <van-overlay
        :show="state.isShowUserDialog"
        @click="state.isShowUserDialog = false"
      >
        <div class="user_dialog" @click.stop>
          <div
            class="user_select"
            v-if="route.name === 'Customer'"
            @click="addCustomer()"
          >
            新增
          </div>
          <div class="user_select" @click="goUserPage()">用户</div>
          <div class="user_select" @click="signOut()">退出</div>
        </div>
      </van-overlay>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Dialog, Toast } from "vant";

type State = {
  isShowUserDialog: boolean;
};

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();

    const state = reactive<State>({
      isShowUserDialog: false
    });
    function showUserDialog() {
      state.isShowUserDialog = true;
    }
    function signOut() {
      Dialog.confirm({
        title: "是否退出",
        message: "",
        confirmButtonColor: "#666"
      })
        .then(() => {
          localStorage.clear();
          state.isShowUserDialog = false;
          router.push({ name: "Login" });
        })
        .catch(() => {
          state.isShowUserDialog = false;
        });
    }
    function goUserPage() {
      state.isShowUserDialog = false;
      if (route.name === "User") {
        Toast("当前就是用户页");
        return;
      }
      router.push({ name: "User" });
    }
    function addCustomer() {
      state.isShowUserDialog = false;
      router.push({
        name: "CustomerInfoPage",
        query: {
          type: "add"
        }
      });
    }
    return {
      state,
      showUserDialog,
      signOut,
      goUserPage,
      route,
      addCustomer
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="postcss">
.sign_out {
  & .sign_button {
    @apply text-center flex items-center justify-center fixed;
    background: #325888;
    color: #f3f6fc;
    width: 60px;
    height: 60px;
    bottom: 60px;
    right: 30px;
    font-size: 30px;
    line-height: 50px;
    border-radius: 50%;
    z-index: 9999;
  }
  & .user_dialog {
    @apply fixed;
    bottom: 130px;
    right: 30px;
    & .user_select {
      @apply text-center;
      background: #325888;
      color: #f3f6fc;
      width: 60px;
      height: 60px;
      margin-top: 10px;
      line-height: 60px;
      border-radius: 50%;
    }
  }
}
</style>
