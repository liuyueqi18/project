export type CustomerBO = {
  id: string;
  userId: string;
  custName: string;
  isFollow: boolean;
};

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
