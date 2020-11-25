<template>
  <div class="login">
    <div class="content">
      <img src="../assets/logo.png" class="logo" />
      <van-form>
        <van-field
          v-model="state.username"
          name="username"
          label="用户/邮箱"
          placeholder="用户/邮箱"
          :rules="[{ required: true, message: '请填写用户名或邮箱' }]"
          key="username"
        />
        <van-field
          v-if="!state.isLogin"
          v-model="state.email"
          name="email"
          label="邮箱"
          placeholder="邮箱"
          :rules="[{ required: true, message: '请填写邮箱' }]"
          key="email"
        />
        <van-field
          v-model="state.password"
          :type="state.passwordType"
          name="password"
          label="密码"
          placeholder="密码"
          :right-icon="state.rightIcon"
          @click-right-icon="handlePasswordIcon"
          :rules="[{ required: true, message: '请填写密码' }]"
          key="password"
        />
        <div class="button">
          <van-button
            v-if="state.isLogin"
            type="primary"
            block
            @click="handleLogin"
          >
            登录
          </van-button>
          <van-button
            v-if="!state.isLogin"
            type="primary"
            block
            @click="handleRegister"
          >
            注册
          </van-button>
          <div class="tag_box">
            <span
              class="tag"
              @click="state.isLogin = false"
              v-if="state.isLogin"
            >
              立即注册
            </span>
            <span class="tag" @click="handlerReset()" v-if="state.isLogin">
              重置密码
            </span>
            <span
              class="tag"
              @click="state.isLogin = true"
              v-if="!state.isLogin"
            >
              返回登录
            </span>
          </div>
        </div>
      </van-form>
      <van-overlay :show="state.isShowOverlay">
        <div class="overlay_loading">
          <van-loading type="spinner" size="30" vertical>登录中...</van-loading>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { Dialog, Toast } from "vant";
import { useRouter } from "vue-router";
import { resetPassword, userLogin, userRegister } from "@/services/index";
import { CheckEmail, CheckPassWord, CheckUserName } from "@/utils/index";
type Props = {
  //
};
type State = {
  username: string;
  password: string;
  email: string;
  passwordType: string;
  rightIcon: string;
  isLogin: boolean;
  isShowOverlay: boolean;
};
export default defineComponent({
  name: "Login",
  props: {},
  setup() {
    console.log("process :>> ", process.env);
    const router = useRouter();
    const state = reactive<State>({
      username: "",
      email: "",
      password: "",
      passwordType: "password", // 是否展示密码明文
      rightIcon: "closed-eye", // 密码右边的icon
      isLogin: true, // 是否显示登录 false则是注册
      isShowOverlay: false, // 遮罩
    });
    function handlePasswordIcon() {
      state.rightIcon =
        state.rightIcon === "closed-eye" ? "eye-o" : "closed-eye";
      state.passwordType = state.rightIcon === "closed-eye" ? "password" : "";
    }
    function handleLogin() {
      if (!CheckUserName(state.username) && !CheckEmail(state.username)) {
        Toast("请输入2-10位中文名字或者邮箱");
        return;
      }
      console.log("Boolean :>> ", Boolean(state.password));
      if (!CheckPassWord(state.password)) {
        Toast("请输入密码");
        return;
      }
      state.isShowOverlay = true;
      userLogin(state.username, state.password)
        .then((user: any) => {
          localStorage.setItem("rym_user_id", user.id);
          localStorage.setItem("userInfo", JSON.stringify(user));
          router.push({
            name: "Homepage",
          });
        })
        .catch((error: any) => {
          state.isShowOverlay = false;
        });
    }
    function handleRegister() {
      if (!CheckUserName(state.username)) {
        Toast("请输入2-10位中文名字");
        return;
      }
      if (!CheckEmail(state.email)) {
        Toast("请输入合法邮箱");
        return;
      }
      if (!CheckPassWord(state.password)) {
        Toast("请输入密码");
        return;
      }
      state.isShowOverlay = true;
      userRegister(state.username, state.email, state.password)
        .then((user: any) => {
          localStorage.setItem("rym_user_id", user.id);
          localStorage.setItem("userInfo", JSON.stringify(user));
          router.push({
            name: "Homepage",
          });
        })
        .catch((error: any) => {
          state.isShowOverlay = false;
        });
    }
    function handlerReset() {
      if (!CheckEmail(state.username)) {
        Toast("用户名请输入绑定邮箱");
        return;
      }
      Dialog.confirm({
        title: `重置密码`,
        message: `是否确定向${state.username}邮箱发送重置密码`,
      })
        .then(() => {
          resetPassword(state.username).then(() => {
            localStorage.clear();
          });
        })
        .catch(() => {
          // on cancel
        });
    }
    return {
      state,
      handlePasswordIcon,
      handleLogin,
      handleRegister,
      handlerReset,
    };
  },
});
</script>

<style scoped lang="postcss">
.login {
  & .content {
    padding: 0 16px;
    margin-top: 100px;
    & .logo {
      margin: 0 auto;
      display: block;
      width: 80px;
      margin-bottom: 30px;
    }
    & .button {
      padding: 16px;
      & .tag_box {
        display: flex;
        justify-content: flex-end;
        & .tag {
          color: #1989fa;
          margin: 4px 0;
          font-size: 12px;
          margin-left: 10px;
        }
      }
    }
  }
  & .overlay_loading {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
