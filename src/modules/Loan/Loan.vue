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
        <van-field
          v-model="loanForm.firstDate"
          type="text"
          label="首次还款时间"
          placeholder="请输入"
          input-align="right"
          readonly
          @click="openTimeModal"
        >
        </van-field>
      </van-cell-group>
      <van-row gutter="20" style="padding:16px">
        <van-col span="12">
          <van-button block plain type="primary" @click="handlerYear"
            >清空房贷年限计算</van-button
          >
        </van-col>
        <van-col span="12">
          <van-button type="primary" block @click="handlerLoan"
            >房贷金额计算</van-button
          >
        </van-col>
      </van-row>
    </div>
    <div
      class="tabel-box"
      ref="tabelRef"
      v-if="loanForm.mode === '2' && state.mouthArray.length"
    >
      <table>
        <thead>
          <tr>
            <th>期数</th>
            <th>每月还款</th>
            <th>偿还利息</th>
            <th>偿还本金</th>
            <th>剩余本金</th>
            <th>已还本金</th>
            <th>已还利息</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in state.mouthArray" :key="i" :ref="`trRef${i}`">
            <td>第{{ i + 1 }}期 {{ item.dateMouth }}</td>
            <td>{{ state.mortgageLoan }}</td>
            <td>{{ item.monthInterest }}</td>
            <td>{{ item.monthPrincipal }}</td>
            <td>{{ item.surplusTotal }}</td>
            <td>{{ item.beforePrincipalTotal }}</td>
            <td>{{ item.beforeInterestTotal }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="tabel-box"
      ref="tabelRef"
      v-if="loanForm.mode === '1' && state.mouthArray.length"
    >
      <table>
        <thead>
          <tr>
            <th>期数</th>
            <th>每月还款</th>
            <th>偿还利息</th>
            <th>偿还本金</th>
            <th>剩余本金</th>
            <th>已还本金</th>
            <th>已还利息</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in state.mouthArray" :key="i" :ref="`trRef${i}`">
            <td>第{{ i + 1 }}期 {{ item.dateMouth }}</td>
            <td>{{ item.mouthFixedBasisMortgage }}</td>
            <td>{{ item.monthInterest }}</td>
            <td>{{ item.monthPrincipal }}</td>
            <td>{{ item.surplusTotal }}</td>
            <td>{{ item.beforePrincipalTotal }}</td>
            <td>{{ item.beforeInterestTotal }}</td>
          </tr>
        </tbody>
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
    <van-popup
      v-model:show="isShowMyComponent"
      round
      position="bottom"
      @close="close"
    >
      <div class="month-content">
        <p class="end-month-title" v-if="payState.endMonth !== 0">
          按照目前薪资和利率, 您将{{ payState.endMonth }}个月后可以结清贷款
        </p>
        <van-cell-group inset>
          <van-field
            v-model="payState.monthMoney"
            input-align="right"
            type="digit"
            label="月可支配收入"
            right-icon="question-o"
            left-icon="question-o"
            @click-left-icon="e => handlerIcon(e, 'left')"
            @click-right-icon="e => handlerIcon(e, 'right')"
          />
        </van-cell-group>
        <p class="end-month-remark">点击问号查看关于本功能的介绍</p>
        <div style="height:20px"></div>
        <van-button type="primary" block @click="handlerMonth">计算</van-button>
      </div>
    </van-popup>
    <van-popup v-model:show="timeState.isShow" position="bottom">
      <van-datetime-picker
        v-model="timeState.date"
        type="year-month"
        title="选择年月"
        @confirm="confirmDate"
        @cancel="cancelDate"
    /></van-popup>
  </div>
</template>
<script lang="ts">
import dayjs from "dayjs";
import { Dialog, Toast } from "vant";
import { defineComponent, nextTick, reactive, ref, watch } from "vue";
import { FixedBasisMortgage, FixedPaymentMortgage, setPageTrack } from "./api";
export default defineComponent({
  setup() {
    type ResultT = ReturnType<typeof FixedPaymentMortgage> extends Promise<
      infer T
    >
      ? T
      : never;

    type ReturnCitySN = { cip: string; cid: string; cname: string };
    const timeState = reactive<{
      isShow: boolean;
      date: Date | string | null;
    }>({
      isShow: false,
      date: null
    });
    const loanForm = reactive({
      money: "",
      mode: "1",
      year: "",
      rate: "",
      firstDate: ""
    });
    const state = ref<ResultT>({
      mortgageLoan: 0,
      grossInterest: 0,
      totalRepayment: 0,
      mouthArray: []
    });
    const payState = reactive({
      endMonth: 0,
      nowMoney: 0,
      monthMoney: 0
    });
    const isShowMyComponent = ref(false);
    const tabelRef = ref<Element | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    watch(loanForm, (o, n) => {
      state.value = {
        mortgageLoan: 0,
        grossInterest: 0,
        totalRepayment: 0,
        mouthArray: []
      };
    });
    const browser = {
      versions: (function() {
        const u = navigator.userAgent;
        return {
          //移动终端浏览器版本信息
          trident: u.indexOf("Trident") > -1, //IE内核
          presto: u.indexOf("Presto") > -1, //opera内核
          webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
          gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或uc浏览器
          iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf("iPad") > -1, //是否iPad
          webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部
        };
      })(),
      language: navigator.language.toLowerCase()
    };

    function handlerLoan() {
      if (
        !loanForm.money ||
        !loanForm.year ||
        !loanForm.rate ||
        !loanForm.firstDate
      ) {
        Toast("请填写完成计算");
        return;
      }
      if (loanForm.mode === "2") {
        FixedPaymentMortgage(
          Number(loanForm.money) * 10000,
          Number(loanForm.year),
          Number(loanForm.rate) / 100,
          loanForm.firstDate
        ).then(res => {
          state.value = res;
        });
      } else if (loanForm.mode === "1") {
        FixedBasisMortgage(
          Number(loanForm.money) * 10000,
          Number(loanForm.year),
          Number(loanForm.rate) / 100,
          loanForm.firstDate
        ).then(res => {
          state.value = res;
        });
      }

      const returnCitySN = ((window as unknown) as {
        returnCitySN: ReturnCitySN;
      }).returnCitySN;

      const params = {
        time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        money: `${Number(loanForm.money)}万`,
        year: `${Number(loanForm.year)}年`,
        rate: `${Number(loanForm.rate)}%`,
        mode: loanForm.mode === "1" ? "本金" : "本息",
        firstDate: loanForm.firstDate,
        cip: returnCitySN?.cip ?? "",
        cid: returnCitySN?.cid ?? "",
        cname: returnCitySN?.cname ?? "",
        navigator: `语言版本:${browser.language};是否为移动终端:${browser.versions.mobile};ios终端:${browser.versions.ios};android终端:${browser.versions.android};是否为iPhone:${browser.versions.iPhone};是否为iPad:${browser.versions.iPad};${navigator.userAgent}`
      };
      setPageTrack(params);
    }
    const arrowTopStyle = ref();
    const arrowBottomStyle = ref();
    let scrollToptimer: number | undefined;
    let scrollButtomtimer: number | undefined;

    const isDc = ref(false); // easy 防抖
    const handlerMove = (type: string) => {
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
        nextTick(() => {
          tabelRef.value?.scrollTo(0, 0);
        });
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
        nextTick(() => {
          tabelRef.value?.scrollTo(0, state.value.mouthArray.length * 150);
        });
      }
      isDc.value = false;
    };

    const handlerYear = () => {
      if (!state.value.mouthArray?.length) {
        Toast("请先将贷款信息补充完整");
        return;
      }
      isShowMyComponent.value = true;
    };
    const handlerMonth = () => {
      payState.nowMoney = 0;
      payState.endMonth = 0;
      for (let index = 0; index < state.value.mouthArray.length; index++) {
        payState.nowMoney = Number(
          Number(payState.nowMoney) +
            Number(payState.monthMoney) -
            Number(state.value.mouthArray[index].monthInterest) -
            Number(state.value.mouthArray[index].monthPrincipal)
        );
        if (state.value.mouthArray[index].surplusTotal <= payState.nowMoney) {
          payState.endMonth = index;
          break;
        }
      }
      Dialog.alert({
        message: `按照目前薪资和利率, 您将${payState.endMonth}个月后可以结清贷款`
      });
    };
    const handlerIcon = (e: Event, type?: string) => {
      if (type === "left") {
        Dialog.alert({
          title: "月可支配收入",
          message:
            "指的是你每个月除去花销剩下的钱(含本月房贷) \n 例如: 小明本月收入20000月整, 本月吃喝玩乐花费2000元整, 房贷5000元整。可支配收入就是18000元。"
        });
      } else {
        Dialog.alert({
          message:
            "前路漫漫, 我只是计算了按目前的薪资和利率走下去, 你最早可以还完款的时间。\n 但我相信诸君前途无量, 一定可以在未来的日子里大展宏图, 早日结清贷款, 过上自己想要的生活。\n 加油, 共勉!"
        });
      }
    };
    const close = () => {
      payState.endMonth = 0;
      payState.nowMoney = 0;
    };

    const openTimeModal = () => {
      timeState.isShow = true;
      timeState.date = loanForm.firstDate || dayjs().toDate();
    };
    const confirmDate = (e: string) => {
      loanForm.firstDate = dayjs(e).format("YYYY-MM");
      timeState.isShow = false;
    };
    const cancelDate = () => {
      timeState.isShow = false;
    };

    return {
      loanForm,
      state,
      tabelRef,
      handlerLoan,
      handlerYear,
      handlerMove,
      arrowTopStyle,
      arrowBottomStyle,

      timeState,
      openTimeModal,
      confirmDate,
      cancelDate,

      isShowMyComponent,
      payState,
      handlerMonth,
      handlerIcon,
      close
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
    display: flex;
  }
  & .tabel-box {
    width: 343px;
    overflow: auto;
    height: 85vh;
    margin: 0 auto;
    border: 1px solid #f5f5f5;
    & td {
      border: 1px solid #f5f5f5;
      width: 90px;
      height: 30px;
      text-align: center;
    }
    & th {
      border: 1px solid #f5f5f5;
      width: 90px;
      height: 30px;
      text-align: center;
    }
    & th {
      background-color: #edf2fd;
    }
    & table {
      table-layout: fixed;
      width: 343px;
      border-collapse: collapse;
      border-spacing: 0;
    }
    & td:first-child {
      position: sticky;
      left: 0;
      z-index: 1;
      background-color: #edf2fd;
      width: 110px;
    }
    & th:first-child {
      position: sticky;
      left: 0;
      z-index: 1;
      background-color: #edf2fd;
      width: 110px;
    }
    & thead tr th {
      position: sticky;
      top: 0;
    }
    & th:first-child {
      z-index: 2;
      background-color: #edf2fd;
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
  & .month-content {
    padding: 20px 16px 5vh 16px;
    & .end-month-title {
      padding-bottom: 10px;
    }
    & .end-month-remark {
      padding-top: 8px;
    }
  }
}
</style>
