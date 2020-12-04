<template>
  <div class="customer">
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
            </div>
            <div class="right" @click="followCust(item)">
              <van-icon
                :name="item.isFollow == 1 ? 'star' : 'star-o'"
                class="cust_star"
                :style="{
                  color: item.isFollow == 1 ? '#8D939E' : '#4E80EF'
                }"
              />
              <span
                :style="{
                  color: item.isFollow == 1 ? '#8D939E' : '#4E80EF'
                }"
                >{{ item.isFollow == 1 ? "取消关注" : "关注" }}</span
              >
            </div>
          </div>
          <div class="content">
            <div class="info">
              <p>性别:</p>
              <span>{{ item.gender }}</span>
            </div>
            <div class="info">
              <p>地址:</p>
              <span
                >{{ item.province }}{{ item.city }}{{ item.area
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
import { followCustomer, getCustomerListById, setCustomer } from "@/services";
import { defineComponent, onMounted, reactive } from "vue";
type Props = {
  //
};
type State = {
  userId: string;
  list: Array<unknown>;
  custList: Array<unknown>;
  custCount: number;
  loading: boolean;
  finished: boolean;
  refreshing: boolean;
};

export default defineComponent({
  name: "Login",
  props: {},
  setup() {
    const state = reactive<State>({
      userId: localStorage.getItem("rym_user_id") as string,
      list: [{}],
      custList: [],
      custCount: 0,
      loading: false,
      finished: false,
      refreshing: false
    });
    function onLoad() {
      getCustomerListById(state.userId, state.custList.length).then(
        (res: any) => {
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
          console.log("res[0] :>> ", res[0]);
          state.custCount = res[1];
          if (state.custList.length >= state.custCount) {
            state.finished = true;
          }
        }
      );
    }
    function onRefresh() {
      state.finished = false;
      state.loading = true;
      state.custList = [];
      onLoad();
    }
    function followCust(item: any) {
      followCustomer(item.id, !item.isFollow).then(res => {
        item.isFollow = !item.isFollow;
      });
    }
    return {
      state,
      onLoad,
      onRefresh,
      followCust
    };
  }
});
</script>

<style scoped lang="postcss">
.customer {
  min-height: 100vh;
  background: #f3f6fc;
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
        font-size: 14px;
        display: flex;
        align-items: center;
        & span {
          margin-left: 4px;
        }
      }
    }
    & .content {
      & .info {
        display: flex;
        font-size: 14px;
        align-items: start;
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
