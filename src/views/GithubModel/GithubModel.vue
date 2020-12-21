<template>
  <div class="github-model">
    <van-sticky>
      <van-search
        v-model="param.q"
        placeholder="请输入搜索关键词"
        @search="onSearch"
      />
    </van-sticky>
    <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="cust_info" v-for="(item, i) in state.list" :key="i">
          <div>{{ item.full_name }}</div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script lang="ts">
type State = {
  list: GithubBO[];
  total: number;
  loading: boolean;
  finished: boolean;
  refreshing: boolean;
};
import { defineComponent, reactive } from "vue";
import { requestGit } from "@/services/gitservices";
import { GithubBO, GithubSearchType } from "./types";
export default defineComponent({
  setup() {
    const param = reactive({
      q: "javascript",
      // eslint-disable-next-line
      per_page: 10,
      page: 1
    });
    const state = reactive<State>({
      list: [],
      total: 0,
      loading: false,
      finished: false,
      refreshing: false
    });
    function onLoad() {
      requestGit
        .get(`search/repositories`, { params: param })
        .then((res: any) => {
          if (state.refreshing) {
            state.list = [];
            state.refreshing = false;
          }
          if (res.items.length === 0) {
            state.finished = true;
            return;
          }
          state.total = res.total_count;
          param.page++;
          state.loading = false;
          state.list = state.list.concat(res.items);
          if (state.list.length >= state.total) {
            state.finished = true;
          }
        });
    }
    function onRefresh() {
      state.finished = false;
      state.loading = true;
      state.list = [];
      param.page = 1;
      onLoad();
    }
    function onSearch(value: string) {
      param.q = value;
      onRefresh();
    }

    return {
      param,
      state,
      onSearch,
      onRefresh,
      onLoad
    };
  }
});
</script>
<style scoped lang="postcss">
.github-model {
  min-height: 100vh;
  background: #f3f6fc;
}
</style>
