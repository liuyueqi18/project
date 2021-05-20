<template>
  <div class="home_page">
    <div
      class="clild"
      v-for="(item, i) in state.childList"
      :key="i"
      @click="goChildPage(item)"
    >
      <div>{{ item.name }}</div>
    </div>
  </div>
</template>

<script lang="ts">
type childListType = {
  name: string;
  nameUrl: string;
};
type State = {
  childList: Array<childListType>;
};
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "HomePage",
  props: {},
  setup() {
    const router = useRouter();
    const state = reactive<State>({
      childList: [
        {
          name: "客户",
          nameUrl: "Customer"
        },
        {
          name: "GIT",
          nameUrl: "GithubModel"
        },
        {
          name: "天气",
          nameUrl: "Weather"
        },
        {
          name: "画板",
          nameUrl: "Draw"
        },
        {
          name: "贷款计算",
          nameUrl: "Loan"
        }
      ]
    });
    function goChildPage(item: childListType) {
      router.push({ name: item.nameUrl });
    }
    return {
      state,
      goChildPage
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/style/main.scss";
.home_page {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  font-size: 13px;
  .clild {
    width: 25vw;
    height: 25vw;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    & div {
      background: #7f8daa;
      width: 20vw;
      height: 20vw;
      line-height: 20vw;
      border-radius: 50%;
      text-align: center;
    }
  }
}
</style>
