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
    <div
      class="tabel-box"
      v-if="loanForm.mode === '2' && state.mouthArray.length"
    >
      <table class="table">
        <tr class="tabel-tr">
          <th class="tabel-th">期数</th>
          <th class="tabel-th">每月还款</th>
          <th class="tabel-th">偿还利息</th>
          <th class="tabel-th">偿还本金</th>
          <th class="tabel-th">剩余本金</th>
          <th class="tabel-th">已还本金</th>
          <th class="tabel-th">已还利息</th>
        </tr>
        <tr v-for="(item, i) in state.mouthArray" :key="i" class="tabel-tr">
          <td class="tabel-td">第{{ i + 1 }}期</td>
          <td class="tabel-td">{{ state.mortgageLoan }}</td>
          <td class="tabel-td">{{ item.monthInterest }}</td>
          <td class="tabel-td">{{ item.monthPrincipal }}</td>
          <td class="tabel-td">{{ item.surplusTotal }}</td>
          <td class="tabel-td">{{ item.beforePrincipalTotal }}</td>
          <td class="tabel-td">{{ item.beforeInterestTotal }}</td>
        </tr>
      </table>
    </div>
    <div class="tabel-box">
      <table
        class="table"
        v-if="loanForm.mode === '1' && state.mouthArray.length"
      >
        <tr class="tabel-tr">
          <th class="tabel-th">期数</th>
          <th class="tabel-th">每月还款</th>
          <th class="tabel-th">偿还利息</th>
          <th class="tabel-th">偿还本金</th>
          <th class="tabel-th">剩余本金</th>
          <th class="tabel-th">已还本金</th>
          <th class="tabel-th">已还利息</th>
        </tr>
        <tr v-for="(item, i) in state.mouthArray" :key="i" class="tabel-tr">
          <td class="tabel-td">第{{ i + 1 }}期</td>
          <td class="tabel-td">{{ item.mouthFixedBasisMortgage }}</td>
          <td class="tabel-td">{{ item.monthInterest }}</td>
          <td class="tabel-td">{{ item.monthPrincipal }}</td>
          <td class="tabel-td">{{ item.surplusTotal }}</td>
          <td class="tabel-td">{{ item.beforePrincipalTotal }}</td>
          <td class="tabel-td">{{ item.beforeInterestTotal }}</td>
        </tr>
      </table>
    </div>
    <div class="sticky">
      <div :class="arrowTopStyle">
        <svg class="icon " aria-hidden="true">
          <use
            style="color:#4E80EF;"
            xlink:href="#icon-zhidingmianxing"
            @click="handlerMove('top')"
          ></use>
        </svg>
      </div>
      <div :class="arrowBottomStyle">
        <svg
          class="icon bottom"
          aria-hidden="true"
          @click="handlerMove('bottom')"
        >
          <use style="color:#4E80EF;" xlink:href="#icon-zhidingmianxing"></use>
        </svg>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Toast } from "vant";
import { defineComponent, reactive, ref, watch } from "vue";
import { FixedBasisMortgage, FixedPaymentMortgage } from "./api";
export default defineComponent({
  setup() {
    type ResultT = ReturnType<typeof FixedPaymentMortgage> extends Promise<
      infer T
    >
      ? T
      : never;
    const loanForm = reactive({
      money: "",
      mode: "1",
      year: "",
      rate: ""
    });
    const state = ref<ResultT>({
      mortgageLoan: 0,
      grossInterest: 0,
      totalRepayment: 0,
      mouthArray: []
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    watch(loanForm, (o, n) => {
      state.value = {
        mortgageLoan: 0,
        grossInterest: 0,
        totalRepayment: 0,
        mouthArray: []
      };
    });

    function handlerLoan() {
      if (!loanForm.money || !loanForm.year || !loanForm.rate) {
        Toast("请填写完成计算");
        return;
      }
      if (loanForm.mode === "2") {
        FixedPaymentMortgage(
          Number(loanForm.money) * 10000,
          Number(loanForm.year),
          Number(loanForm.rate) / 100
        ).then(res => {
          state.value = res;
        });
      } else if (loanForm.mode === "1") {
        FixedBasisMortgage(
          Number(loanForm.money) * 10000,
          Number(loanForm.year),
          Number(loanForm.rate) / 100
        ).then(res => {
          state.value = res;
        });
      }
    }
    const arrowTopStyle = ref();
    const arrowBottomStyle = ref();
    let scrollToptimer: number | undefined;
    let scrollButtomtimer: number | undefined;
    const isDc = ref(false);
    function handlerMove(type: string) {
      isDc.value = true;
      if (isDc.value) {
        clearInterval(scrollToptimer);
        clearInterval(scrollButtomtimer);
      } else {
        return;
      }
      if (type === "top") {
        scrollToptimer = setInterval(function() {
          const top =
            document.body.scrollTop || document.documentElement.scrollTop;
          const speed = top / 4;
          if (document.body.scrollTop != 0) {
            document.body.scrollTop -= speed;
          } else {
            document.documentElement.scrollTop -= speed;
          }
          if (top == 0) {
            clearInterval(scrollToptimer);
          }
        }, 30);
        arrowTopStyle.value = "animate__animated animate__rubberBand";
        setTimeout(() => {
          arrowTopStyle.value = "";
        }, 1000);
      } else if (type === "bottom") {
        scrollButtomtimer = setInterval(function() {
          const top = document.documentElement.scrollTop;
          const speed = top / 4;
          if (speed === 0) {
            document.documentElement.scrollTop = 150;
          } else {
            document.documentElement.scrollTop =
              document.documentElement.scrollTop + speed;
          }
          if (top >= document.body.scrollHeight - window.screen.height) {
            clearInterval(scrollButtomtimer);
          }
        }, 50);
        arrowBottomStyle.value = "animate__animated animate__rubberBand";
        setTimeout(() => {
          arrowBottomStyle.value = "";
        }, 1000);
      }
      isDc.value = false;
    }
    // FixedBasisMortgage(Number(50) * 10000, Number(10), Number(5) / 100).then(
    //   res => {
    //     state.value = res;
    //   }
    // );
    return {
      loanForm,
      state,
      handlerLoan,
      handlerMove,
      arrowTopStyle,
      arrowBottomStyle
    };
  }
});
</script>

<style lang="postcss" scoped>
.loan-class {
  font-size: 12px;
  color: #4d5464;
  & .btn {
    padding: 16px;
  }
  & .tabel-box {
    white-space: nowrap;
    box-sizing: border-box;
    max-width: 343px;
    overflow: scroll;
    margin: 0 auto;
    border: none;
    & .table {
      width: 100%;
      border: none;
      border-collapse: collapse;
      border-spacing: 0;
      & .tabel-tr {
        width: 100%;
        & .tabel-th {
          background: rgba(78, 128, 239, 0.1);
          border: 1px solid #e4e7ed;
        }
        & td {
          padding: 4px;
          text-align: center;
          border: 1px solid #e4e7ed;
        }
      }
    }
  }
  & .sticky {
    position: fixed;
    bottom: 15vh;
    right: 10vw;
    opacity: 0.8;
    color: #1989fa;

    & .bottom {
      transform: rotate(180deg);
      margin-top: 30px;
    }
    & .icon {
      width: 35px;
      height: 35px;
    }
  }
}
</style>
