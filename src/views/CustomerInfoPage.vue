<template>
  <div class="customer_info">
    <van-cell-group>
      <van-field
        v-model="custInfo.custName"
        label="姓名"
        input-align="right"
        placeholder="请输入用户名"
        clearable
        required
      />
      <van-field
        @click="openAddress()"
        readonly
        label="地址"
        input-align="right"
        clearable
      >
        <template #input>
          <span
            >{{ custInfo.provinceName }}{{ custInfo.cityName
            }}{{ custInfo.areaName }}</span
          >
        </template></van-field
      >
    </van-cell-group>
    <div class="submit_btn">
      <van-button type="primary" block @click="submit">保 存</van-button>
    </div>
    <van-popup v-model:show="isShowAreaDialog" position="bottom">
      <van-area title="地址" :area-list="areaList" @confirm="handlerArea" />
    </van-popup>
  </div>
</template>

<script lang="ts">
type State = {};
import { defineComponent, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import area from "@/utils/area.js";
import { CustomerVO, UserInfoBO } from "./types";
import { setCustomer } from "@/services";
import router from "@/router";
import { Toast } from "vant";

export default defineComponent({
  setup() {
    const areaList = area;
    const state = reactive<State>({});
    const custInfo = reactive<CustomerVO>({
      userId: "",
      custName: "",
      provinceName: "",
      provinceCode: "",
      cityName: "",
      cityCode: "",
      areaName: "",
      areaCode: ""
    });
    const userInfo = JSON.parse(
      localStorage.getItem("userInfo") as string
    ) as UserInfoBO;

    custInfo.userId = userInfo.objectId;

    const isShowAreaDialog = ref(false);
    const route = useRoute();

    if (route.query.type === "add") {
      document.title = "新增客户";
    } else if (route.query.type === "edit") {
      document.title = "编辑客户";
    }

    function openAddress() {
      isShowAreaDialog.value = true;
    }

    function handlerArea(list: { code: string; name: string }[]) {
      custInfo.provinceName = list[0].name;
      custInfo.provinceCode = list[0].code;
      custInfo.cityName = list[1].name;
      custInfo.cityCode = list[1].code;
      custInfo.areaName = list[2] ? list[2].name : "";
      custInfo.areaCode = list[2] ? list[2].code : "";
      isShowAreaDialog.value = false;
    }

    function submit() {
      if (route.query.type === "add") {
        setCustomer(custInfo).then(() => {
          setTimeout(() => {
            Toast("成功");
            router.go(-1);
          }, 500);
        });
      } else if (route.query.type === "edit") {
        //
      }
    }
    return {
      state,
      custInfo,
      areaList,
      isShowAreaDialog,
      openAddress,
      handlerArea,
      submit
    };
  }
});
</script>
<style scoped lang="postcss">
.customer_info {
  & .submit_btn {
    padding: 16px 16px;
  }
}
</style>
