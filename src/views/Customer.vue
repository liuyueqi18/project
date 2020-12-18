<template>
  <div class="customer">
    <van-sticky>
      <div>
        <form action="/">
          <van-search
            v-model="searchValue"
            @search="globalSearch"
            show-action
            placeholder="请输入搜索关键词"
          >
            <template #action>
              <div class="search-right">
                <div @click="globalSearch">搜索</div>
                <!-- <div>筛选</div> -->
              </div>
            </template></van-search
          >
        </form>
      </div>
    </van-sticky>
    <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="cust_info" v-for="(item, i) in state.custList" :key="i">
          <div class="top">
            <div class="left">
              <div class="name">{{ item.custName }}</div>
              <div class="phone">{{ item.phone }}</div>
              <div v-if="item.gender">
                <svg class="icon" aria-hidden="true" v-if="item.gender === '1'">
                  <use style="color:#4E80EF" xlink:href="#icon-nv"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="item.gender === '2'">
                  <use style="color:#4E80EF" xlink:href="#icon-nan"></use>
                </svg>
              </div>
            </div>
            <div class="right">
              <van-icon
                :name="item.isFollow ? 'star' : 'star-o'"
                class="cust_star"
                :style="{
                  color: item.isFollow ? '#4E80EF' : '#8D939E'
                }"
                @click="followCust(item)"
              />
              <van-popover
                v-model:show="item.showPopover"
                :actions="item.actions"
                @select="(e, ei) => onSelect(e, ei, item, i)"
                theme="dark"
                placement="left-start"
              >
                <template #reference>
                  <van-icon name="setting-o" style="color:#4E80EF" />
                </template>
              </van-popover>
            </div>
          </div>
          <div class="content">
            <div class="info">
              <p>电话:</p>
              <span>{{ item.custPhone }}</span>
            </div>
            <div class="info">
              <p>地址:</p>
              <span
                >{{ item.provinceName }}{{ item.cityName }}{{ item.areaName
                }}{{ item.address }}</span
              >
            </div>
            <div class="info">
              <p>备注:</p>
              <span>{{ item.remark }}</span>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script lang="ts">
import { delCustomer, followCustomer, getCustomerListById } from "@/services";
import { Dialog } from "vant";
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { CustomerBO } from "./types";
type Props = {
  //
};
type State = {
  userId: string;
  custList: Array<CustomerBO>;
  custCount: number;
  loading: boolean;
  finished: boolean;
  refreshing: boolean;
};

export default defineComponent({
  name: "Login",
  props: {},
  setup() {
    const router = useRouter();
    const state = reactive<State>({
      userId: localStorage.getItem("rym_user_id") as string,
      custList: [],
      custCount: 0,
      loading: false,
      finished: false,
      refreshing: false
    });
    const searchValue = ref("");

    function onLoad() {
      getCustomerListById(state.userId, state.custList.length, {
        globalValue: searchValue.value
      }).then(res => {
        if (res[0].length === 0) {
          state.finished = true;
          return;
        }
        if (state.refreshing) {
          state.custList = [];
          state.refreshing = false;
        }
        state.loading = false;
        state.custList = state.custList.concat(res[0]);
        state.custList = state.custList.map(item => {
          return {
            ...item,
            actions: [
              { text: item.custName, disabled: true },
              { text: "编辑", key: "edit" },
              { text: "删除", key: "del", className: "delete_popover" }
            ]
          };
        });
        state.custCount = res[1];
        if (state.custList.length >= state.custCount) {
          state.finished = true;
        }
      });
    }
    function onRefresh() {
      state.finished = false;
      state.loading = true;
      state.custList = [];
      onLoad();
    }
    function followCust(item: CustomerBO) {
      followCustomer(item.id, !item.isFollow).then(() => {
        item.isFollow = !item.isFollow;
      });
    }
    function onSelect(
      e: { key: string },
      ei: number,
      item: CustomerBO,
      i: number
    ) {
      if (e.key === "edit") {
        router.push({
          name: "CustomerInfoPage",
          query: {
            type: "edit",
            id: item.id
          }
        });
      } else if (e.key === "del") {
        Dialog.confirm({
          title: "删除",
          message: "是否删除"
        })
          .then(() => {
            delCustomer(item.id).then(() => {
              state.custList.splice(i, 1);
            });
          })
          .catch(() => {
            //
          });
      }
    }

    function globalSearch() {
      onRefresh();
    }

    return {
      state,
      onLoad,
      onRefresh,
      followCust,
      onSelect,
      searchValue,
      globalSearch
    };
  }
});
</script>

<style scoped lang="postcss">
.customer {
  min-height: 100vh;
  background: #f3f6fc;
  & .search-right {
    display: flex;
    align-items: center;
    color: #4e80ef;
    & div {
      margin-left: 5px;
    }
  }
  & .cust_info {
    margin: 8px;
    padding: 10px 16px;
    background: #fff;
    border-radius: 8px;
    & .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 8px;
      margin-bottom: 8px;
      border-bottom: 1px solid #f3f6fc;
      & .left {
        display: flex;
        align-items: center;
        font-size: 14px;
        & .name {
          margin-right: 8px;
        }
        & .phone {
          font-size: 14px;
          color: #8d939e;
        }
      }
      & .right {
        font-size: 17px;
        display: flex;
        height: 16px;
        align-items: center;
        & .cust_star {
          margin-right: 5px;
        }
        & >>> .van-popover__wrapper {
          height: 15px;
        }
      }
    }
    & .content {
      & .info {
        display: flex;
        font-size: 14px;
        align-items: flex-start;
        margin-bottom: 1px;
        & p {
          color: #4d5464;
          min-width: 40px;
        }
        & span {
          color: #8d939e;
        }
      }
    }
  }
}
</style>
<style>
.delete_popover {
  color: #ee0a24;
}
</style>
