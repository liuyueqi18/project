<template>
  <div class="sign_out">
    <div class="sign_button" @click="showUserDialog">
      <van-icon name="user-circle-o" class="sign_icon" />
    </div>
    <transition name="van-slide-down">
      <van-overlay
        :show="state.isShowUserDialog"
        @click="state.isShowUserDialog = false"
      >
        <div class="user_dialog" @click.stop>
          <div class="user_select" @click="goUserPage()">用户</div>
          <div class="user_select" @click="signOut()">退出</div>
        </div>
      </van-overlay>
    </transition>
  </div>
</template>

<script lang="ts">
type State = {
  userInfo: any;
  isShowUserDialog: boolean;
};
import { defineComponent, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Dialog, Toast } from "vant";
export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive<State>({
      userInfo: JSON.parse(localStorage.getItem("userInfo" as any) as any),
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
    return {
      state,
      showUserDialog,
      signOut,
      goUserPage
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="postcss">
.sign_out {
  & .sign_button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    color: #fff;
    display: flex;
    bottom: 30px;
    right: 30px;
    background: #1989fa;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    position: fixed;
    bottom: 30px;
    right: 30px;
  }
  & .user_dialog {
    position: fixed;
    bottom: 100px;
    right: 30px;
    & .user_select {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #1989fa;
      line-height: 60px;
      text-align: center;
      color: #fff;
      margin-top: 10px;
    }
  }
}
</style>
