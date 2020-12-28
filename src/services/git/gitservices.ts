import { GIT } from "@/constants";
import Axios, { AxiosResponse } from "axios";
import { Toast } from "vant";

const requestGit = Axios.create({
  baseURL: GIT,
  headers: {
    Accept: "application/vnd.github.v3+json",
    authorization: "token 68871da3a21c3eac7c84dc560eaf91ce2d27275d"
  },
  data: {},
  responseType: "json"
});

requestGit.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status !== 200) {
      return Promise.reject(new Error(response.data.message || "Error"));
    }
    // console.log(
    //   `${response.config.baseURL}${response.config.url}`,
    //   response.data
    // );
    return response.data;
  },
  (error: unknown) => {
    Toast(String(error));
    return Promise.reject(error);
  }
);

export default requestGit;
