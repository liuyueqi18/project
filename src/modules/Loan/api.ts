import AV from "leancloud-storage";
import { Toast } from "vant";

AV.init({
  appId: "Q8A65T5W8qkMkbWI17g7vAu0-gzGzoHsz",
  appKey: "JXUCxIYpDrIF87LVpYlK9egD",
  serverURL: "https://server.lyq168.cn"
});

// 等额本息, Fixed-Payment Mortgage
// 等额本金, Fixed-Basis Mortgage
//
type MortgageType = {
  mortgageLoan?: number; // 月供金额
  grossInterest: number; // 产生利息
  totalRepayment: number; // 总金额
  mouthArray: mouthType;
};
// 月供详情
type mouthType = {
  mouthFixedBasisMortgage?: number; // 月供
  monthPrincipal: number; // 本金
  beforePrincipalTotal: number; // 已还本金
  monthInterest: number; // 利息
  beforeInterestTotal: number; // 已还利息
  surplusTotal: number; // 剩余本金
}[];
/**
 * 获取四舍五入保留两位
 * @param num
 * @returns
 */
export function getInteger(num: number) {
  return Math.round(num * 100) / 100;
}
/**
 * 获取等额本息接口
 * @param money 金额
 * @param year 年数
 * @param rate 利率
 * @returns
 */
export function FixedPaymentMortgage(
  money: number,
  year: number,
  rate: number
) {
  return new Promise<MortgageType>(resolve => {
    const mouth = year * 12;
    const mouthRate = rate / 12;
    const mortgageLoan = getInteger(
      (money * mouthRate * Math.pow(1 + mouthRate, mouth)) /
        (Math.pow(1 + mouthRate, mouth) - 1)
    );
    const grossInterest = getInteger(mouth * mortgageLoan - money);
    const totalRepayment = getInteger(grossInterest + money);
    const mouthArray: mouthType = [];
    let beforeInterestTotal = 0;
    let beforePrincipalTotal = 0;
    let surplusTotal = 0;
    for (let i = 1; i <= mouth; i++) {
      const monthInterest =
        (money *
          mouthRate *
          (Math.pow(1 + mouthRate, mouth) - Math.pow(1 + mouthRate, i - 1))) /
        (Math.pow(1 + mouthRate, mouth) - 1);
      const monthPrincipal =
        (money * mouthRate * Math.pow(1 + mouthRate, i - 1)) /
        (Math.pow(1 + mouthRate, mouth) - 1);
      beforePrincipalTotal = beforePrincipalTotal + monthPrincipal;
      beforeInterestTotal = beforeInterestTotal + monthInterest;
      surplusTotal = money - beforeInterestTotal;
      mouthArray.push({
        monthPrincipal: getInteger(monthPrincipal),
        monthInterest: getInteger(monthInterest),
        beforeInterestTotal: getInteger(beforeInterestTotal),
        beforePrincipalTotal: getInteger(beforePrincipalTotal),
        surplusTotal: getInteger(surplusTotal)
      });
    }
    resolve({ mortgageLoan, grossInterest, totalRepayment, mouthArray });
  });
}

/**
 * 获取等额本息接口
 * @param money 金额
 * @param year 年数
 * @param rate 利率
 * @returns
 */
export function FixedBasisMortgage(money: number, year: number, rate: number) {
  return new Promise<MortgageType>(resolve => {
    const mouth = year * 12;
    const mouthRate = rate / 12;
    // 本金
    const eMPrincipal = money / mouth;
    // 首月月供
    // const eMInterest = eMPrincipal + money * mouthRate;
    // 每月月供递减额=每月应还本金×月利率=贷款本金÷还款月数×月利率
    // const eMReduce = eMPrincipal * mouthRate;
    const grossInterest = getInteger(
      ((eMPrincipal + money * mouthRate + (money / mouth) * (1 + mouthRate)) /
        2) *
        mouth -
        money
    ); // 产生利息
    const totalRepayment = getInteger(money + grossInterest); // 总金额
    const mouthArray: mouthType = [];
    let beforeInterestTotal = 0;
    let beforePrincipalTotal = 0;
    let surplusTotal = 0;
    let mouthFixedBasisMortgage = 0;
    for (let i = 1; i <= mouth; i++) {
      const monthPrincipal = eMPrincipal;
      const monthInterest = eMPrincipal * (mouth - i + 1) * mouthRate;
      beforeInterestTotal = beforeInterestTotal + monthInterest;
      surplusTotal = money - eMPrincipal * i;
      beforePrincipalTotal = money - surplusTotal;
      mouthFixedBasisMortgage = monthPrincipal + monthInterest;
      mouthArray.push({
        monthPrincipal: getInteger(monthPrincipal),
        monthInterest: getInteger(monthInterest),
        beforeInterestTotal: getInteger(beforeInterestTotal),
        beforePrincipalTotal: getInteger(beforePrincipalTotal),
        surplusTotal: getInteger(surplusTotal),
        mouthFixedBasisMortgage: getInteger(mouthFixedBasisMortgage)
      });
    }
    resolve({ grossInterest, totalRepayment, mouthArray });
  });
}

type TrackVO = {
  time: string;
  year: string;
  money: string;
  rate: string;
  mode: string;
};
/**
 * track
 * @param params
 * @returns
 */
export function setPageTrack(params: TrackVO) {
  return new Promise((resolve, reject) => {
    const Track = AV.Object.extend("Track");
    const track = new Track();
    for (const i in params) {
      track.set(i, params[i as keyof TrackVO]);
    }
    track
      .save()
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
        Toast(error.rawMessage);
      });
  });
}
