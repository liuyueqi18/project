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
        <div class="git-list" v-for="(item, i) in state.list" :key="i">
          <div class="git-info">
            <span>{{ item.full_name }}</span>
            <div class="git-btm">
              <div class="git-btm-info">
                <van-icon name="star-o" />
                <span> {{ item.stargazers_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <div class="btm">
      <span>共计{{ state.total }}条结果</span>
      <van-popover
        v-model:show="showPopover"
        placement="left-end"
        theme="dark"
        :actions="actions"
        @select="onSelect"
      >
        <template #reference>
          <span>{{ param.sortText }}</span>
        </template>
      </van-popover>
    </div>
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
import { defineComponent, reactive, ref } from "vue";
// import { requestGit } from "@/services/gitservices";
import { getGitSearchList } from "@/services/gitApi";
import { GithubBO, GitSearchType, sortList } from "./types";
export default defineComponent({
  setup() {
    const param = reactive<GitSearchType>({
      q: "javascript",
      // eslint-disable-next-line
      per_page: 50,
      page: 1,
      sort: sortList[0].type,
      sortText: sortList[0].text,
      order: sortList[0].order
    });
    const state = reactive<State>({
      list: [],
      total: 0,
      loading: false,
      finished: false,
      refreshing: false
    });
    const showPopover = ref(false);
    const actions = sortList;
    function onLoad() {
      getGitSearchList(param).then(res => {
        if (state.refreshing) {
          state.list = [];
          state.refreshing = false;
        }
        if (res.list.length === 0) {
          state.finished = true;
          return;
        }
        state.total = res.total;
        state.loading = false;
        param.page++;
        state.list = state.list.concat(res.list);
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
    const onSelect = (value: { text: string; type: string; order: string }) => {
      param.sort = value.type;
      param.sortText = value.text;
      param.order = value.order;
      onRefresh();
    };

    return {
      param,
      state,
      showPopover,
      actions,
      onSelect,
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
  margin-bottom: 44px;
  & .git-list {
    margin: 10px 16px 0 16px;
    padding: 8px 16px;
    background: #fff;
    border-radius: 8px;
    & .git-info {
      & .git-btm {
        display: flex;
        padding-top: 4px;
        align-items: center;
        color: #8d939e;
        font-size: 12px;
        & .git-btm-info {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  & .btm {
    position: fixed;
    bottom: 0;
    height: 44px;
    width: 100%;
    background: #fff;
    padding: 0 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & span {
      color: #8d939e;
      font-size: 12px;
    }
  }
}
</style>
