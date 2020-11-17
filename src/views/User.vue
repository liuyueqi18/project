<template>
  <div class="user_page">
    <div style="height:15px;"></div>
    <van-cell-group>
      <van-field
        v-model="state.userInfo.username"
        label="用户名"
        placeholder="请输入用户名"
        input-align="right"
        required
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="state.userInfo.email"
        label="邮箱"
        placeholder="请输入邮箱"
        input-align="right"
        required
        :rules="[{ required: true, message: '请输入邮箱' }]"
      >
        <template
          #button
          v-if="!state.userInfo.emailVerified && state.userInfo.email"
        >
          <van-button size="small" type="primary" @click="checkEmail()"
            >验证</van-button
          >
        </template></van-field
      >
      <van-field
        v-model="state.userInfo.birthTime"
        label="出生日期"
        placeholder="请选择出生日期"
        input-align="right"
        readonly
        @click="handleOpenDateDialog('birthTimeType')"
      />
      <van-field
        v-model="state.userInfo.genderName"
        label="性别"
        placeholder="请选择性别"
        input-align="right"
        readonly
        @click="handleOpenSelectDialog('genderType')"
      />
      <van-field
        v-if="state.userInfo.emailVerified"
        label="修改密码"
        input-align="right"
        readonly
        @click="editPassword()"
      />
    </van-cell-group>
    <div style="height:15px;"></div>
    <div class="btn_style">
      <van-button type="primary" @click="setUserInfo()" block>保 存</van-button>
    </div>
    <div class="user_toast">
      1.邮箱验证通过后可以通过邮箱登录<br />
      2.邮箱未通过验证时会有验证按钮<br />
      3.邮箱验证通过以后才可以更改密码<br />
    </div>
    <div>
      <van-popup
        v-model:show="state.isShowSelectDialog"
        position="bottom"
        style="{ max-height: 50% }"
      >
        <van-picker
          show-toolbar
          :value-key="state.valueKey"
          :columns="state.selectList"
          @confirm="handleChooseSelectValue"
          @cancel="handleCloseSelectDialog"
          :default-index="state.defaultIndex || 0"
        />
      </van-popup>
      <van-popup
        v-model:show="state.isShowDateDialog"
        :key="state.dateType"
        position="bottom"
        style="{ max-height: 50% }"
      >
        <van-datetime-picker
          :min-date="state.minDate"
          v-model="state.dialogDate"
          title="选择年月日"
          type="date"
          @confirm="handleChooseDateValue"
          @cancel="handleCloseDateDialog"
        />
      </van-popup>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { defineComponent, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Dialog, Toast } from "vant";
import store from "../store";
import {
  emailVerify,
  getUserInfoApi,
  resetPassword,
  setUserInfoApi,
} from "@/services";
import { CheckEmail, CheckUserName } from "@/utils";
type State = {
  userId: string;
  userInfo: {
    username: string;
    email: string;
    emailVerified: boolean;
    birthTime: string;
    genderCode: number | null;
    genderName: string | null;
  };

  isShowSelectDialog: boolean;
  defaultIndex: number;
  selectType: string;
  selectList: Array<any>;
  valueKey: string;

  isShowDateDialog: boolean;
  dialogDate: any;
  dateType: string;
  minDate: any;

  genderList: Array<{ value: number; label: string }>;
};

export default defineComponent({
  name: "User",
  props: {},
  setup() {
    const router = useRouter();
    const state = reactive<State>({
      userId: localStorage.getItem("rym_user_id") as string,
      userInfo: {
        username: "",
        email: "",
        emailVerified: true,
        birthTime: "",
        genderCode: null,
        genderName: null,
      },
      isShowSelectDialog: false, // 是否展示弹窗
      defaultIndex: 0, // 默认下标
      selectType: "", // 选择框的字段/类型
      selectList: [], // 选择的列表
      valueKey: "", // value-key

      isShowDateDialog: false, // 是否展示日期弹窗
      dialogDate: "", // 时间选择框默认的时间
      dateType: "default", // 选择选择的字段
      minDate: new Date("1960/01/01"),
      genderList: store.state.genderList,
    });
    function getUserInfo() {
      getUserInfoApi(state.userId).then((res: any) => {
        state.userInfo.username = res.attributes.username;
        state.userInfo.email = res.attributes.email;
        state.userInfo.emailVerified = res.attributes.emailVerified;
        state.userInfo.birthTime = res.attributes.birthTime;
        state.userInfo.genderCode = res.attributes.gender;
        state.genderList.forEach((item) => {
          if (item.value === state.userInfo.genderCode) {
            state.userInfo.genderName = item.label;
          }
        });
      });
    }
    function setUserInfo() {
      if (!CheckUserName(state.userInfo.username)) {
        Toast("请输入2-10位中文名字");
        return;
      }
      const param = {
        username: state.userInfo.username,
        email: state.userInfo.email,
        birthTime: state.userInfo.birthTime,
        gender: state.userInfo.genderCode,
      };
      setUserInfoApi(state.userId, param).then((res) => {
        Toast("保存成功");
        getUserInfo();
      });
    }
    function checkEmail() {
      if (!CheckEmail(state.userInfo.email)) {
        Toast("请输入正确格式邮箱");
        return;
      }
      Dialog.confirm({
        title: "验证邮箱",
        message: `是否确认向${state.userInfo.email}发送邮件验证`,
      })
        .then(() => {
          emailVerify(state.userInfo.email).then(() => {
            Toast("已发送");
          });
        })
        .catch(() => {
          Toast("取消验证");
        });
    }
    function editPassword() {
      resetPassword(state.userInfo.email).then(() => {
        setTimeout(() => {
          localStorage.clear();
          router.push({ name: "Login" });
        }, 2000);
      });
    }
    onMounted(() => {
      getUserInfo();
    });
    function handleOpenSelectDialog(type: string) {
      state.selectType = type;
      switch (type) {
        case "genderType":
          state.selectList = state.genderList;
          state.valueKey = "label";
          break;
      }
      state.isShowSelectDialog = true;
    }
    function handleCloseSelectDialog() {
      state.isShowSelectDialog = false;
    }
    function handleChooseSelectValue(value: any) {
      switch (state.selectType) {
        case "genderType":
          state.userInfo.genderName = value.label;
          state.userInfo.genderCode = value.value;
          break;
      }
      state.isShowSelectDialog = false;
    }
    function handleOpenDateDialog(type: string) {
      state.dateType = type;
      switch (type) {
        case "birthTimeType":
          state.dialogDate = dayjs(state.userInfo.birthTime).toDate();
          break;
      }
      state.isShowDateDialog = true;
    }
    function handleCloseDateDialog() {
      state.isShowDateDialog = false;
    }
    function handleChooseDateValue(value: string) {
      switch (state.dateType) {
        case "birthTimeType":
          state.userInfo.birthTime = dayjs(value).format("YYYY-MM-DD");
          break;
      }
      state.isShowDateDialog = false;
    }
    return {
      state,
      setUserInfo,
      checkEmail,
      editPassword,
      handleOpenSelectDialog,
      handleCloseSelectDialog,
      handleChooseSelectValue,
      handleOpenDateDialog,
      handleCloseDateDialog,
      handleChooseDateValue,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="postcss">
.user_page {
  background: #f7f8fa;
  min-height: 100vh;
  & >>> .van-cell__title {
    color: #333;
  }
  & .btn_style {
    padding: 16px 8px;
  }
  & .user_toast {
    width: 100%;
    color: #999;
    padding: 0px 8px;
    box-sizing: border-box;
    font-size: 12px;
  }
}
</style>
