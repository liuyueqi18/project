<template>
  <div class="login">
    <div class="content">
      <img src="../assets/logo.png" class="logo" />
      <van-form>
        <van-field
          v-model="state.username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
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
          <p
            class="remarks"
            @click="state.isLogin = false"
            v-if="state.isLogin"
          >
            立即注册
          </p>
          <p
            class="remarks"
            @click="state.isLogin = true"
            v-if="!state.isLogin"
          >
            返回登录
          </p>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script lang="ts">
import AV from "leancloud-storage";
AV.init({
  appId: "Q8A65T5W8qkMkbWI17g7vAu0-gzGzoHsz",
  appKey: "JXUCxIYpDrIF87LVpYlK9egD",
  serverURL: "https://q8a65t5w.lc-cn-n1-shared.com",
});
import { defineComponent, reactive } from "vue";
import { Toast } from "vant";
import { useRouter } from "vue-router";
type Props = {
  //
};
type State = {
  username: string;
  password: string;
  passwordType: string;
  rightIcon: string;
  isLogin: boolean;
};
export default defineComponent({
  name: "Login",
  props: {},
  setup() {
    const router = useRouter();
    const state = reactive<State>({
      username: "刘越奇",
      password: "liuyq123",
      passwordType: "password", // 是否展示密码明文
      rightIcon: "closed-eye", // 密码右边的icon
      isLogin: true, // 是否显示登录 false则是注册
    });
    function CheckPassWord(password: string) {
      const str = password;
      if (str == null || str.length < 8) {
        return false;
      }
      const reg1 = new RegExp(/^[0-9A-Za-z]+$/);
      if (!reg1.test(str)) {
        return false;
      }
      const reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
      if (reg.test(str)) {
        return true;
      } else {
        return false;
      }
    }
    function CheckUserName(username: string) {
      const str = username;
      if (!str || str.length > 4) {
        return false;
      }
      const reg1 = new RegExp(/[\u4e00-\u9fa5]/gm);
      if (reg1.test(str)) {
        return true;
      } else {
        return false;
      }
    }
    function handlePasswordIcon() {
      state.rightIcon =
        state.rightIcon === "closed-eye" ? "eye-o" : "closed-eye";
      state.passwordType = state.rightIcon === "closed-eye" ? "password" : "";
    }
    function handleLogin() {
      if (!CheckUserName(state.username)) {
        Toast("请输入2-4位中文名字");
        return;
      }
      if (!CheckPassWord(state.password)) {
        Toast("请输入字母加数字组合的密码，且长度不小于8位");
        return;
      }
      AV.User.logIn(state.username, state.password).then(
        (user: any) => {
          localStorage.setItem("rym_user_id", "klsasalsklaklclksancas");
          localStorage.setItem("userInfo", JSON.stringify(user));
          router.push({
            name: "Homepage",
          });
        },
        (error) => {
          Toast(error.rawMessage);
        }
      );
    }
    function handleRegister() {
      if (!CheckUserName(state.username)) {
        Toast("请输入2-4位中文名字");
        return;
      }
      if (!CheckPassWord(state.password)) {
        Toast("请输入字母加数字组合的密码，且长度不小于8位");
      }
      const user = new AV.User();
      user.setUsername(state.username);
      user.setPassword(state.password);
      user.signUp().then(
        (user: any) => {
          localStorage.setItem("rym_user_id", user.id);
          localStorage.setItem("userInfo", JSON.stringify(user));
          router.push({
            name: "Homepage",
          });
        },
        (error) => {
          try {
            Toast(error.rawMessage);
          } catch (error) {
            //
          }
        }
      );
    }
    return {
      state,
      handlePasswordIcon,
      handleLogin,
      handleRegister,
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
      & .remarks {
        color: #1989fa;
        margin: 4px 0;
        font-size: 12px;
        text-align: right;
      }
    }
  }
}
</style>
