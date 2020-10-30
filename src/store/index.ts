import { createStore, Store, StoreOptions } from "vuex";
import Vuex from "vuex";

type genderListType = {
  value: number;
  label: string;
};
export type State = {
  genderList: Array<genderListType>;
};
const rootState: StoreOptions<State> = {
  state: {
    genderList: [
      {
        value: 1,
        label: "男",
      },
      {
        value: 2,
        label: "女",
      },
    ],
  },
  mutations: {
    // setSearchInfo(state, genderList: Array<genderListType>) {
    //   state.genderList = genderList;
    // },
  },
  actions: {},
  modules: {},
};

const store = new Vuex.Store<State>(rootState);

export type StoreInstance = Store<State>;
export default store;

// export default createStore({
//   state: {
//     genderList: [],
//   },
//   mutations: {},
//   actions: {},
//   modules: {},
// });
