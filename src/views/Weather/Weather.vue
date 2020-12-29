<template>
  <div class="weather">
    <div class="top">
      <p class="address">{{ state.city.name }}</p>
      <p class="text">{{ state.cityWeather.text }}</p>
      <p class="temp">{{ state.cityWeather.temp }}</p>
    </div>
    <div class="detail">
      <div class="detail_box">
        <span class="label">云量</span>
        <span class="value">{{ state.cityWeather.cloud }}%</span>
      </div>
      <div class="detail_box">
        <span class="label">降水量</span>
        <span class="value">{{ state.cityWeather.precip }}毫米</span>
      </div>
      <div class="detail_box">
        <span class="label">相对湿度</span>
        <span class="value">{{ state.cityWeather.humidity }}%</span>
      </div>
      <div class="detail_box">
        <span class="label">风</span>
        <span class="value"
          >{{ state.cityWeather.windDir }} {{ state.cityWeather.windScale }}级
          {{ state.cityWeather.windSpeed }}公里/小时</span
        >
      </div>
      <div class="detail_box">
        <span class="label">体感温度</span>
        <span class="value">{{ state.cityWeather.feelsLike }}</span>
      </div>
      <div class="detail_box">
        <span class="label">气压</span>
        <span class="value">{{ state.cityWeather.pressure }}百帕</span>
      </div>
    </div>
    <div class="map" id="map"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { getCityId, getCityWeather } from "@/services/weather/api";
import AMap from "AMap";
import { ItemCityBO } from "./types";
import { Toast } from "vant";

type Response = ReturnType<typeof getCityWeather> extends Promise<infer T>
  ? T
  : never;
type ResponseCity = ReturnType<typeof getCityId> extends Promise<infer T>
  ? T
  : never;
type State = {
  city: ItemCityBO;
  cityWeather: Response;
};
export default defineComponent({
  setup() {
    const state = reactive<State>({
      city: {
        adm1: "",
        adm2: "",
        country: "",
        fxLink: "",
        id: "",
        isDst: "",
        lat: "",
        lon: "",
        name: "",
        rank: "",
        type: "",
        tz: "",
        utcOffset: ""
      },
      cityWeather: {
        cloud: "", // 实况云量，百分比数值
        dew: "", // 实况露点温度
        feelsLike: "", // 实况体感温度，默认单位：摄氏度
        humidity: "", // 实况相对湿度，百分比数值
        icon: "", // 当前天气状况和图标的代码
        obsTime: "", // 实况观测时间
        precip: "", // 实况降水量，默认单位：毫米
        pressure: "", // 实况大气压强，默认单位：百帕
        temp: "", // 实况温度，默认单位：摄氏度
        text: "", // 实况天气状况的文字描述，包括阴晴雨雪等天气状态的描述
        updateTime: "", // 更新时间
        vis: "", // 实况能见度，默认单位：公里
        wind360: "", // 实况风向360角度
        windDir: "", // 实况风向
        windScale: "", // 实况风力等级
        windSpeed: "" // 实况风速，公里/小时
      }
    });
    let adcode = "";
    const mapObj = new AMap.Map("map");
    function geolocation() {
      return new Promise((resolve, reject) => {
        mapObj.plugin("AMap.Geolocation", function() {
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: false, //是否使用高精度定位，默认:true
            timeout: process.env.VUE_APP_TITLE === "dev" ? 1000 : 3000, //超过10秒后停止定位，默认：无穷大
            maximumAge: 0, //定位结果缓存0毫秒，默认：0
            convert: false, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: false, //显示定位按钮，默认：true
            showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: false, //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: false //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          mapObj.addControl(geolocation);
          geolocation.getCurrentPosition(function(status: any, result: any) {
            if (status === "complete") {
              adcode = result.addressComponent[0].id;
              resolve(result);
            } else {
              reject();
            }
          });
        });
      });
    }
    function getCityWeatherById(id: string) {
      getCityWeather({ location: id }).then(res => {
        state.cityWeather = res;
      });
    }
    function getCityIdByAdcode() {
      getCityId({ location: adcode ? adcode : "310000" }).then(res => {
        if (res.code === "200") {
          state.city = res.list[0];
          getCityWeatherById(state.city.id);
        } else {
          Toast("请求失败");
        }
      });
    }
    onMounted(() => {
      geolocation()
        .then(() => {
          getCityIdByAdcode();
        })
        .catch(() => {
          adcode = mapObj.getAdcode();
          getCityIdByAdcode();
        });
    });
    return {
      state
    };
  }
});
</script>
<style scoped lang="postcss">
.weather {
  background: #75a4c7;
  min-height: 100vh;
  & .top {
    margin: 0 auto;
    color: #f8f9fd;
    padding-top: 60px;
    text-align: center;
    margin-bottom: 20px;
    & .address {
      font-size: 34px;
      font-weight: 300;
    }
    & .text {
      font-size: 14px;
    }
    & .temp {
      font-size: 70px;
      font-weight: 200;
    }
  }
  & .detail {
    color: #f8f9fd;
    padding: 0 16px;
    & .detail_box {
      padding: 7px 16px 9px 16px;
      border-top: 1px solid rgb(248 249 253 / 0.4);
      & .label {
        font-size: 13px;
        display: block;
        opacity: 0.7;
      }
      & .value {
        font-size: 20px;
      }
    }
  }
  & .detail .detail_box:last-of-type {
    border-bottom: 1px solid rgb(248 249 253 / 0.4);
  }
  & .map {
    width: 0;
    height: 0;
  }
}
</style>
