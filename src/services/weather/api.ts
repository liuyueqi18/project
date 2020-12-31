import { requestV2, requestV7, key } from "@/services/weather/services";
import {
  CityBO,
  CityWeather,
  CityWeather24h,
  CityWeather7d,
  weekDay
} from "@/views/Weather/types";
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

export async function getCityWeatherNow(params: { location: string }) {
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
    Toast("错误");
  }
}

export async function getCityWeather7d(params: { location: string }) {
  const res = await requestV7.get<unknown, CityWeather7d>("/v7/weather/10d", {
    params: {
      ...params,
      key: key
    }
  });
  if (res.code === "200") {
    return {
      code: res.code,
      daily: res.daily.map(item => {
        return {
          ...item,
          week: weekDay[dayjs(item.fxDate).day()],
          updateTime: dayjs(res.updateTime).format("YYYY-MM-DD HH:mm:ss")
        };
      })
    };
  } else {
    Toast("错误");
    return {
      code: res.code
    };
  }
}

export async function getCityWeather24h(params: { location: string }) {
  const res = await requestV7.get<unknown, CityWeather24h>("/v7/weather/24h", {
    params: {
      ...params,
      key: key
    }
  });
  if (res.code === "200") {
    return {
      code: res.code,
      hourly: res.hourly.map(item => {
        return {
          ...item,
          fxTime: `${dayjs(item.fxTime).format("HH")}时`,
          updateTime: dayjs(res.updateTime).format("YYYY-MM-DD HH:mm:ss")
        };
      })
    };
  } else {
    Toast("错误");
    return {
      code: res.code
    };
  }
}
