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
        v-model="custInfo.custPhone"
        label="电话"
        input-align="right"
        placeholder="请输入电话"
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
      <van-field name="radio" label="性别" input-align="right">
        <template #input>
          <van-radio-group v-model="custInfo.gender" direction="horizontal">
            <van-radio name="1">男</van-radio>
            <van-radio name="2">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        v-model="custInfo.remark"
        label="备注"
        rows="2"
        autosize
        type="textarea"
        input-align="right"
        placeholder="请输入备注"
        show-word-limit
      />
    </van-cell-group>
    <div class="submit_btn">
      <van-button type="primary" block @click="submit">保 存</van-button>
    </div>
    <van-popup v-model:show="isShowAreaDialog" position="bottom">
      <van-area
        title="地址"
        :area-list="areaList"
        @confirm="handlerArea"
        :value="(custInfo.provinceCode, custInfo.cityCode, custInfo.areaCode)"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
type State = {};
import { defineComponent, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import area from "@/utils/area.js";
import { editCustomer, getCustomerInfoById, setCustomer } from "@/services";
import router from "@/router";
import { Toast } from "vant";
import { UserInfoBO } from "../types";
import { CustomerVO } from "./types";
export default defineComponent({
  setup() {
    const areaList = area;
    const state = reactive<State>({});
    const custInfo = reactive<CustomerVO>({
      userId: "",
      custPhone: "",
      custName: "",
      provinceName: "",
      provinceCode: "",
      cityName: "",
      cityCode: "",
      areaName: "",
      areaCode: "",
      remark: "",
      gender: "1"
    });
    const userInfo = JSON.parse(
      localStorage.getItem("userInfo") as string
    ) as UserInfoBO;

    custInfo.userId = userInfo.objectId;

    const isShowAreaDialog = ref(false);
    const route = useRoute();

    function getCustomerInfo() {
      getCustomerInfoById(route.query.id as string).then((res: CustomerVO) => {
        custInfo.userId = res.userId;
        custInfo.custName = res.custName;
        custInfo.custPhone = res.custPhone;
        custInfo.provinceName = res.provinceName;
        custInfo.provinceCode = res.provinceCode;
        custInfo.cityName = res.cityName;
        custInfo.cityCode = res.cityCode;
        custInfo.areaName = res.areaName;
        custInfo.areaCode = res.areaCode;
        custInfo.remark = res.remark;
        custInfo.gender = res.gender;
      });
    }

    if (route.query.type === "add") {
      document.title = "新增客户";
      custInfo.userId = localStorage.getItem("rym_user_id")!;
    } else if (route.query.type === "edit") {
      document.title = "编辑客户";
      getCustomerInfo();
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
        editCustomer(route.query.id as string, custInfo).then(() => {
          setTimeout(() => {
            Toast("成功");
            router.go(-1);
          }, 500);
        });
      }
    }
    // setInterval(() => {
    //   setCustomer({
    //     userId: "5f8944b4a5451b51ab88d644",
    //     custPhone: "18981892182",
    //     custName: "hahah2",
    //     provinceName: "北京市",
    //     provinceCode: "110000",
    //     cityName: "北京市",
    //     cityCode: "110100",
    //     areaName: "东城区",
    //     areaCode: "110101",
    //     remark: "备注2",
    //     gender: "1"
    //   });
    // }, 500);

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
