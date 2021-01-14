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
            <span class="title" @click="goHtmlUrl(item.htmlUrl)">{{
              item.fullName
            }}</span>
            <div class="git-content">
              <span>{{ item.description }}</span>
              <span>created {{ item.createdAt }}</span>
              <span>update {{ item.updatedAt }}</span>
            </div>
            <div class="git-btm">
              <div class="git-btm-info" v-if="item.language">
                <svg class="icon" aria-hidden="true">
                  <use
                    style="color:#8d939e"
                    xlink:href="#icon-script-language"
                  ></use>
                </svg>
                <span> {{ item.language }}</span>
              </div>
              <div class="git-btm-info">
                <van-icon name="star-o" />
                <span> {{ item.stargazersCount }}</span>
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
import { defineComponent, reactive, ref } from "vue";
import { getOrderList } from "@/services/git/api";
import { GitSearchType, sortList } from "./types";

/** 对于已经定义好的接口可以使用这种方式 对于未定义好的接口 可写两个Item类型先行开发 */

type Response = ReturnType<typeof getOrderList> extends Promise<infer T>
  ? T
  : never;

type State = {
  list: Response["list"];
  total: Response["total"];
  loading: boolean;
  finished: boolean;
  refreshing: boolean;
};

export default defineComponent({
  setup() {
    const param = reactive<GitSearchType>({
      q: "Vue",
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
      getOrderList(param).then(res => {
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

    const goHtmlUrl = (url: string) => {
      // window.location.href = url;
      window.open(url);
    };

    return {
      param,
      state,
      showPopover,
      actions,
      onSelect,
      onSearch,
      onRefresh,
      onLoad,
      goHtmlUrl
    };
  }
});
</script>
<style scoped lang="postcss">
.github-model {
  @apply min-h-screen;
  background: #f3f6fc;
  margin-bottom: 44px;
  & .git-list {
    @apply bg-white;
    margin: 10px 16px 0 16px;
    padding: 8px 16px;
    border-radius: 8px;
    & .git-info {
      & .title {
        @apply block;
        color: #0366d6;
        padding-bottom: 4px;
      }
      & .git-content {
        color: #8d939e;
        font-size: 12px;
        padding-bottom: 4px;
        & span {
          @apply block;
        }
      }
      & .git-btm {
        @apply flex items-center;
        color: #8d939e;
        font-size: 12px;
        & .git-btm-info {
          margin-right: 6px;
          @apply flex items-center;
          & .icon {
            color: #8d939e;
            font-size: 10px;
            width: 12px;
            height: 12px;
          }
          & span {
            margin-left: 3px;
          }
        }
      }
    }
  }
  & .btm {
    @apply fixed bottom-0 w-full bg-white box-border flex items-center justify-between;
    height: 44px;
    padding: 0 16px;
    & span {
      color: #8d939e;
      font-size: 12px;
    }
  }
}
</style>
