import AV from "leancloud-storage";
import { Toast } from "vant";

AV.init({
  appId: "Q8A65T5W8qkMkbWI17g7vAu0-gzGzoHsz",
  appKey: "JXUCxIYpDrIF87LVpYlK9egD",
  serverURL: "https://server.lyq168.cn"
});

import { CustomerBO, CustomerVO } from "@/views/types";

/**
 * 登录
 * @export
 * @param {string} username
 * @param {string} password
 * @return {*}
 */
export function userLogin(username: string, password: string) {
  return new Promise((resolve, reject) => {
    AV.User.logIn(username, password)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
        Toast(error.rawMessage);
      });
  });
}

/**
 * 注册
 * @export
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @return {*}
 */
export function userRegister(
  username: string,
  email: string,
  password: string
) {
  const user = new AV.User();
  user.setUsername(username);
  user.setPassword(password);
  user.setEmail(email);
  return new Promise((resolve, reject) => {
    user
      .signUp()
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
        Toast(error.rawMessage);
      });
  });
}

/**
 * 获取用户信息
 * @export
 * @param {string} userId
 * @return {*}
 */
export function getUserInfoApi(userId: string) {
  const user = new AV.Query("User");
  return new Promise((resolve, reject) => {
    user
      .get(userId)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
        Toast(error.rawMessage);
      });
  });
}

interface UserInfoType {
  username: string;
  email: string;
  birthTime: string;
  gender: number | null;
}
/**
 * 保存用户信息
 * @export
 * @param {string} userId
 * @param {UserInfoType} data
 * @return {*}
 */
export function setUserInfoApi(userId: string, data: UserInfoType) {
  const user = AV.Object.createWithoutData("User", userId);
  for (const i in data) {
    user.set(i, data[i as keyof UserInfoType]);
  }
  return new Promise((resolve, reject) => {
    user
      .save()
      .then((res: any) => {
        resolve(res);
      })
      .catch((error: any) => {
        reject(error);
        Toast(error.rawMessage);
      });
  });
}

/**
 * 邮箱验证
 * @export
 * @param {string} email
 * @return {*}
 */
export function emailVerify(email: string) {
  return new Promise((resolve, reject) => {
    AV.User.requestEmailVerify(email)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
        Toast(error.rawMessage);
      });
  });
}

/**
 * 重置密码
 * @export
 * @param {string} email
 * @return {*}
 */
export function resetPassword(email: string) {
  return new Promise((resolve, reject) => {
    AV.User.requestPasswordReset(email)
      .then(res => {
        Toast("邮件已发送 请注意查收");
        resolve(res);
      })
      .catch(error => {
        reject(error);
        Toast(error.rawMessage);
      });
  });
}

/**
 * 客户列表查询
 * @export
 * @param {string} userId
 * @param {number} start
 * @param {{
 *     globalValue: string;
 *   }} CustomerQueryVO
 * @return {*}  {Promise<[CustomerBO[], number]>}
 */
export function getCustomerListById(
  userId: string,
  start: number,
  CustomerQueryVO: {
    globalValue: string;
  }
): Promise<[CustomerBO[], number]> {
  // 只查看自己的客户
  const CustomerUserVO = new AV.Query("Customer");
  CustomerUserVO.equalTo("userId", userId);
  // 全局查询条件
  const globalQueryV1 = new AV.Query("Customer");
  const globalQueryV2 = new AV.Query("Customer");
  const globalQueryV3 = new AV.Query("Customer");
  const globalQueryV4 = new AV.Query("Customer");
  const globalQueryV5 = new AV.Query("Customer");
  if (CustomerQueryVO.globalValue) {
    globalQueryV1.contains("custName", CustomerQueryVO.globalValue);
    globalQueryV2.contains("provinceName", CustomerQueryVO.globalValue);
    globalQueryV3.contains("cityName", CustomerQueryVO.globalValue);
    globalQueryV4.contains("areaName", CustomerQueryVO.globalValue);
    globalQueryV5.contains("remark", CustomerQueryVO.globalValue);
  }
  const globalQuery = AV.Query.or(
    globalQueryV1,
    globalQueryV2,
    globalQueryV3,
    globalQueryV4,
    globalQueryV5
  );
  const Query = AV.Query.and(CustomerUserVO, globalQuery);
  Query.limit(10);
  Query.skip(start);
  Query.descending("isFollow");
  Query.addDescending("updatedAt");
  const listPromise = new Promise<CustomerBO[]>((resolve, reject) => {
    Query.find()
      .then(res => {
        const list = res.map(item => {
          return {
            id: item.id as string,
            userId: item.get("userId"),
            custName: item.get("custName"),
            isFollow: item.get("isFollow"),
            provinceName: item.get("provinceName"),
            cityName: item.get("cityName"),
            areaName: item.get("areaName"),
            remark: item.get("remark"),
            gender: item.get("gender")
          };
        });
        resolve(list);
      })
      .catch(error => {
        reject(error);
        Toast(error.rawMessage);
      });
  });
  const countPromise = new Promise<number>((resolve, reject) => {
    Query.count()
      .then(count => {
        resolve(count);
      })
      .catch(error => {
        reject(error);
        Toast(error.rawMessage);
      });
  });
  return Promise.all([listPromise, countPromise]);
}

/**
 * 新增客户
 * @export
 * @param {CustomerVO} info
 * @return {*}
 */
export function setCustomer(info: CustomerVO) {
  return new Promise((resolve, reject) => {
    const Customer = AV.Object.extend("Customer");
    const customer = new Customer();
    for (const i in info) {
      customer.set(i, info[i as keyof CustomerVO]);
    }
    customer
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

/**
 * 删除客户
 * @export
 * @param {string} userId
 * @return {*}
 */
export function delCustomer(userId: string) {
  return new Promise((resolve, reject) => {
    const customer = AV.Object.createWithoutData("Customer", userId);
    customer
      .destroy()
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
        Toast(error.rawMessage);
      });
  });
}

/**
 * 获取客户详情
 * @export
 * @param {string} id
 * @return {*}
 */
export function getCustomerInfoById(id: string) {
  return new Promise<CustomerVO>((resolve, reject) => {
    const customerInfo = new AV.Query("Customer");
    customerInfo
      .get(id)
      .then(res => {
        console.log("getCustomerInfoById :>> ", res);
        resolve({
          userId: res.get("userId"),
          custName: res.get("custName"),
          provinceName: res.get("provinceName"),
          provinceCode: res.get("provinceCode"),
          cityName: res.get("cityName"),
          cityCode: res.get("cityCode"),
          areaName: res.get("areaName"),
          areaCode: res.get("areaCode"),
          remark: res.get("remark"),
          gender: res.get("gender")
        });
        // resolve(res as CustomerVO);
      })
      .catch(error => {
        reject(error);
        Toast(error.rawMessage);
      });
  });
}

/**
 * 保存
 * @export
 * @param {string} id
 * @param {CustomerVO} info
 * @return {*}
 */
export function editCustomer(id: string, info: CustomerVO) {
  return new Promise((resolve, reject) => {
    const CustomerInfo = AV.Object.createWithoutData("Customer", id);
    for (const i in info) {
      CustomerInfo.set(i, info[i as keyof CustomerVO]);
    }
    CustomerInfo.save()
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
        Toast(error.rawMessage);
      });
  });
}

/**
 * 关注/取关
 * @export
 * @param {string} custId
 * @param {boolean} isFollow
 * @return {*}
 */
export function followCustomer(custId: string, isFollow: boolean) {
  return new Promise((resolve, reject) => {
    const customer = AV.Object.createWithoutData("Customer", custId);
    customer.set("isFollow", isFollow);
    customer
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
