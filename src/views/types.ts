import AV from "leancloud-storage";

export type UserInfoBO = {
  birthTime: string;
  createdAt: string;
  email: string;
  emailVerified: boolean;
  gender: number;
  mobilePhoneVerified: boolean;
  objectId: string;
  updatedAt: string;
  username: string;
};

export type CustomerBO = {
  id: string;
  userId: string;
  custName: string;
  isFollow: boolean;
  provinceName: string;
  cityName: string;
  areaName: string;
};

export type CustomerVO = {
  userId: string;
  custName: string;
  provinceName: string;
  provinceCode: string;
  cityName: string;
  cityCode: string;
  areaName: string;
  areaCode: string;
};

type MyFile<T> = Omit<AV.File, "get"> & {
  get<K extends keyof T>(key: K): T[K];
};
export class Query<T extends object> {
  constructor(path: string) {
    return new AV.Query(path) as any;
  }
  find(): Promise<MyFile<T>[]> {
    return this.find();
  }
}
// 支持的写法
// class A<T extends object> {
//   value: T;
//   constructor(value: T) {
//     this.value = value;
//   }
//   get<K extends keyof T>(key: K) {
//     return this.value[key] as T[K];
//   }
// }

// const instance = new A({
//   a: 1,
//   b: "1",
// });

// const a = instance.get("a");
// const b = instance.get("b");
