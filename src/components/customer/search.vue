<template>
  <div class="search">
    <div>
      <van-field
        v-model="searchInfo.custName"
        label="姓名"
        placeholder="请输入姓名"
        input-align="right"
      />
      <van-field
        v-model="searchInfo.custPhone"
        label="电话"
        placeholder="请输入电话"
        input-align="right"
      />
      <van-field name="radio" label="性别" input-align="right">
        <template #input>
          <van-radio-group v-model="searchInfo.gender" direction="horizontal">
            <van-radio name="1" @click="handlerRadio('1')">男</van-radio>
            <van-radio name="2" @click="handlerRadio('2')">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </div>
    <div class="btn-btm">
      <div class="btn close" @click="close">清 空</div>
      <div class="btn submit" @click="submit">确 定</div>
    </div>
  </div>
</template>
<script lang="ts">
import { CustomerQueryVO } from "@/modules/Customer/types";
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  emits: ["clearSearch", "submitSearch"],
  setup(props, ctx) {
    const searchInfo = reactive<CustomerQueryVO>({
      custName: "",
      custPhone: "",
      gender: ""
    });

    let oldType = "";

    function close() {
      searchInfo.custName = "";
      searchInfo.custPhone = "";
      searchInfo.gender = "";
      oldType = "";
      ctx.emit("clearSearch");
    }

    function submit() {
      ctx.emit("submitSearch", searchInfo);
    }

    function handlerRadio(type: string) {
      if (oldType === type) {
        oldType = "";
        searchInfo.gender = "";
      } else {
        oldType = type;
        searchInfo.gender = type;
      }
    }
    return {
      searchInfo,
      close,
      submit,
      handlerRadio
    };
  }
});
</script>
<style scoped lang="postcss">
.search {
  @apply w-full;
  & .btn-btm {
    @apply fixed flex w-full items-center bottom-0;
    height: 44px;
    border-top: 1px solid #f3f6fc;
    & .btn {
      @apply w-1/2 text-center;
      line-height: 44px;
    }
    & .submit {
      background: #4e80ef;
      color: #fff;
    }
    & .close {
      background: #fff;
      color: #4e80ef;
    }
  }
}
</style>
