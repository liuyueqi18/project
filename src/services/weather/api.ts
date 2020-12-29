import { requestV2, requestV7, key } from "@/services/weather/services";
import { CityBO, CityWeather } from "@/views/Weather/types";
import dayjs from "dayjs";
import { Toast } from "vant";

export async function getCityId(params: { location: string }) {
  const res = await requestV2.get<unknown, CityBO>("/v2/city/lookup", {
    params: {
      ...params,
      key: key
    }
  });
  if (res.code === "200") {
    return {
      list: res.location,
      code: "200"
    };
  } else {
    return {
      code: res.code,
      list: []
    };
  }
}

export async function getCityWeather(params: { location: string }) {
  const res = await requestV7.get<unknown, CityWeather>("/v7/weather/now", {
    params: {
      ...params,
      key: key
    }
  });
  if (res.code === "200") {
    return {
      ...res.now,
      updateTime: dayjs(res.updateTime).format("YYYY-MM-DD HH:mm:ss"),
      obsTime: dayjs(res.now.obsTime).format("YYYY-MM-DD HH:mm:ss")
    };
  } else {
    return {
      code: res.code
    };
  }
}
