<template>
  <div class="loan-class">
    <div class="top-content">
      <van-cell-group>
        <van-field
          v-model="loanForm.money"
          label="金额"
          placeholder="请输入"
          input-align="right"
          type="digit"
        >
          <template #extra>
            &nbsp; &nbsp;万
          </template>
        </van-field>
        <van-field name="radio" input-align="right" label="方式">
          <template #input>
            <van-radio-group v-model="loanForm.mode" direction="horizontal">
              <van-radio name="1">本金</van-radio>
              <van-radio name="2">本息</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-model="loanForm.year"
          type="digit"
          label="贷款年数"
          placeholder="请输入"
          input-align="right"
        >
          <template #extra>
            &nbsp; &nbsp;年
          </template></van-field
        >
        <van-field
          v-model="loanForm.rate"
          type="number"
          label="利率"
          placeholder="请输入"
          input-align="right"
        >
          <template #extra>
            &nbsp; &nbsp;%
          </template></van-field
        >
      </van-cell-group>
      <div class="btn">
        <van-button type="primary" block @click="handlerLoan">计算</van-button>
      </div>
    </div>
    <div class="tabel-box" v-if="loanForm.mode === '1'">
      <table class="table" border="1">
        <tr>
          <th>期数</th>
          <th>每月还款</th>
          <th>偿还利息</th>
          <th>偿还本金</th>
          <th>剩余本金</th>
          <th>已还本金</th>
          <th>已还利息</th>
        </tr>
        <tr v-for="(item, i) in state.mouthArray" :key="i">
          <td>第{{ i + 1 }}期</td>
          <td>{{ state.mortgageLoan }}</td>
          <td>{{ item.monthInterest }}</td>
          <td>{{ item.monthPrincipal }}</td>
          <td>{{ item.surplusTotal }}</td>
          <td>{{ item.beforePrincipalTotal }}</td>
          <td>{{ item.beforeInterestTotal }}</td>
        </tr>
      </table>
    </div>
    <div class="tabel-box">
      <table class="table" border="1" v-if="loanForm.mode === '2'">
        <tr>
          <th>期数</th>
          <th>每月还款</th>
          <th>偿还利息</th>
          <th>偿还本金</th>
          <th>剩余本金</th>
          <th>已还本金</th>
          <th>已还利息</th>
        </tr>
        <tr v-for="(item, i) in state.mouthArray" :key="i">
          <td>第{{ i + 1 }}期</td>
          <td>{{ item.mouthFixedBasisMortgage }}</td>
          <td>{{ item.monthInterest }}</td>
          <td>{{ item.monthPrincipal }}</td>
          <td>{{ item.surplusTotal }}</td>
          <td>{{ item.beforePrincipalTotal }}</td>
          <td>{{ item.beforeInterestTotal }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { FixedBasisMortgage, FixedPaymentMortgage } from "./api";
export default defineComponent({
  setup() {
    type ResultT = ReturnType<typeof FixedPaymentMortgage> extends Promise<
      infer T
    >
      ? T
      : never;
    const loanForm = reactive({
      money: "50",
      mode: "1",
      year: "10",
      rate: "5.19"
    });
    const state = ref<ResultT>({
      mortgageLoan: 0,
      grossInterest: 0,
      totalRepayment: 0,
      mouthArray: []
    });

    function handlerLoan() {
      if (loanForm.mode === "1") {
        FixedPaymentMortgage(
          Number(loanForm.money) * 10000,
          Number(loanForm.year),
          Number(loanForm.rate) / 100
        ).then(res => {
          state.value = res;
        });
      } else if (loanForm.mode === "2") {
        FixedBasisMortgage(
          Number(loanForm.money) * 10000,
          Number(loanForm.year),
          Number(loanForm.rate) / 100
        ).then(res => {
          state.value = res;
        });
      }
    }
    return {
      loanForm,
      state,
      handlerLoan
    };
  }
});
</script>

<style lang="postcss" scoped>
.loan-class {
  & .top-content {
    background: #fff;
  }
  & .btn {
    padding: 16px;
  }
  & .tabel-box {
    font-size: 14px;
    box-sizing: border-box;
    max-width: 343px;
    overflow: scroll;
    margin: 0 auto;
    & .table {
      width: 100%;
      & .tabel-tr {
        width: 100%;
        & .name {
          text-align: left;
        }
        & .value {
          text-align: right;
        }
        & .tabel-th {
          border: 1px solid #e4e7ed;
          padding: 6px 12px;
          width: 50%;
        }
        & .title {
          text-align: left;
          background: #e4e7ed;
        }
      }
    }
  }
}
</style>
