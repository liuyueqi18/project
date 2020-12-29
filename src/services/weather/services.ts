import { WEATHERV2, WEATHERV7 } from "@/constants";
import Axios, { AxiosResponse } from "axios";
import { Toast } from "vant";

export const requestV2 = Axios.create({
  baseURL: WEATHERV2,
  data: {},
  responseType: "json"
});

requestV2.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status !== 200) {
      return Promise.reject(new Error(response.data.message || "Error"));
    }
    return response.data;
  },
  (error: unknown) => {
    Toast(String(error));
    return Promise.reject(error);
  }
);

export const requestV7 = Axios.create({
  baseURL: WEATHERV7,
  data: {},
  responseType: "json"
});

requestV7.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status !== 200) {
      return Promise.reject(new Error(response.data.message || "Error"));
    }
    return response.data;
  },
  (error: unknown) => {
    Toast(String(error));
    return Promise.reject(error);
  }
);

export const key = "a544df5cc71c43f287d29075ba0096a3";
