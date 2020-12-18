<template>
  <div class="search">
    <div>
      <van-field
        v-model="searchInfo.custName"
        label="文本"
        placeholder="输入框内容右对齐"
        input-align="right"
      />
    </div>
    <div class="btn-btm">
      <div class="btn close" @click="close">清 空</div>
      <div class="btn submit" @click="submit">确 定</div>
    </div>
  </div>
</template>
<script lang="ts">
import { CustomerQueryVO } from "@/views/Customer/types";
import { defineComponent, reactive } from "vue";

export default defineComponent({
  setup() {
    const searchInfo = reactive<CustomerQueryVO>({
      custName: ""
    });
    function close() {
      //
    }
    function submit() {
      //
    }
    return {
      searchInfo,
      close,
      submit
    };
  }
});
</script>
<style scoped lang="postcss">
.search {
  width: 100%;
  & .btn-btm {
    position: fixed;
    height: 44px;
    display: flex;
    width: 100%;
    align-items: center;
    bottom: 0;
    border-top: 1px solid #f3f6fc;
    & .btn {
      line-height: 44px;
      width: 50%;
      text-align: center;
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
