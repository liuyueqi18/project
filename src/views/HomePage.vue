<template>
  <div class="home_page">
    <div
      class="clild"
      v-for="(item, i) in state.childList"
      :key="i"
      @click="goChildPage(item)"
    >
      {{ item.name }}
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
  @extend %flex_start;
  padding: 20px 16px;
  .clild {
    background: #eee;
    width: 80px;
    height: 80px;
    line-height: 80px;
    margin-right: 10px;
    border-radius: 50%;
    text-align: center;
  }
}
</style>
