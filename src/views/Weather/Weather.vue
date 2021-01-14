<template>
  <div class="weather">
    <div class="top">
      <van-sticky @scroll="handlerScrollTop">
        <div style="background: #75a4c7; height:90px">
          <p class="address">
            {{ state.city.name }}
          </p>
          <p class="text">
            {{ state.cityWeatherNow.text }}
          </p>
        </div>
      </van-sticky>
      <transition name="van-fade">
        <p class="temp" :style="{ opacity: tempOpacity }">
          {{ state.cityWeatherNow.temp }}
        </p>
      </transition>
    </div>
    <van-sticky offset-top="90px">
      <div class="weather24h">
        <div class="weather24h-warp">
          <div
            class="weather24h-warp-li"
            v-for="(item, i) in state.cityWeather24h"
            :key="i"
          >
            <span class="weather24h-fxTime">{{ item.fxTime }}</span>
            <span class="weather24h-pop">{{
              item.pop !== "0" ? item.pop + "%" : ""
            }}</span>
            <div class="weather24h-icon-box">
              <img class="weather24h-icon" :src="getWeatherUrl(item.icon)" />
            </div>
            <span class="weather24h-temp">{{ item.temp }}</span>
          </div>
        </div>
      </div>
    </van-sticky>
    <div class="bottom-box">
      <div class="weather7d">
        <div
          class="weather7d-detail"
          v-for="(item, i) in state.cityWeather7d"
          :key="i"
        >
          <span>{{ item.week }}</span>
          <div class="weather7d-icon-box">
            <img class="weather7d-icon" :src="getWeatherUrl(item.iconDay)" />
          </div>
          <div class="weather7d-temp">
            <span style="text-align:right;">{{ item.tempMax }}</span>
            <span style="text-align:right;">{{ item.tempMin }}</span>
          </div>
        </div>
      </div>
      <div class="detail">
        <div class="detail_box">
          <span class="label">云量</span>
          <span class="value">{{ state.cityWeatherNow.cloud || "0" }}%</span>
        </div>
        <div class="detail_box">
          <span class="label">降水量</span>
          <span class="value"
            >{{ state.cityWeatherNow.precip || "0" }}毫米</span
          >
        </div>
        <div class="detail_box">
          <span class="label">相对湿度</span>
          <span class="value">{{ state.cityWeatherNow.humidity || "0" }}%</span>
        </div>
        <div class="detail_box">
          <span class="label">风</span>
          <span class="value"
            >{{ state.cityWeatherNow.windDir || "0" }}
            {{ state.cityWeatherNow.windScale || "0" }}级
            {{ state.cityWeatherNow.windSpeed || "0" }}公里/小时</span
          >
        </div>
        <div class="detail_box">
          <span class="label">体感温度</span>
          <span class="value">{{ state.cityWeatherNow.feelsLike || "0" }}</span>
        </div>
        <div class="detail_box">
          <span class="label">气压</span>
          <span class="value"
            >{{ state.cityWeatherNow.pressure || "0" }}百帕</span
          >
        </div>
      </div>
      <div class="division"></div>
    </div>

    <div class="map" id="map"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import {
  getCityId,
  getCityWeatherNow,
  getCityWeather7d,
  getCityWeather24h
} from "@/services/weather/api";
import AMap from "AMap";
import { ItemCityBO } from "./types";
import { Toast } from "vant";

type ResponseCity = ReturnType<typeof getCityId> extends Promise<infer T>
  ? T
  : never;

type ResponseNow = ReturnType<typeof getCityWeatherNow> extends Promise<infer T>
  ? T
  : never;

type Response7d = ReturnType<typeof getCityWeather7d> extends Promise<infer T>
  ? T
  : never;

type Response24 = ReturnType<typeof getCityWeather24h> extends Promise<infer T>
  ? T
  : never;

type State = {
  city: ItemCityBO;
  cityWeatherNow: ResponseNow;
  cityWeather7d: Response7d["daily"];
  cityWeather24h: Response24["hourly"];
};

const iconUrl = {};
const r = require.context("@/assets/weather", true, /\.png$/);
r.keys().forEach(key => ((iconUrl as any)[key as string] = r(key)));

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
      cityWeatherNow: {
        cloud: "",
        dew: "",
        feelsLike: "",
        humidity: "",
        icon: "",
        obsTime: "",
        precip: "",
        pressure: "",
        temp: "",
        text: "",
        updateTime: "",
        vis: "",
        wind360: "",
        windDir: "",
        windScale: "",
        windSpeed: ""
      },
      cityWeather24h: [],
      cityWeather7d: []
    });
    let adcode = "";
    const mapObj = new AMap.Map("map");
    const tempOpacity = ref(1); // 透明度
    function handlerScrollTop(value: { scrollTop: number; isFixed: boolean }) {
      tempOpacity.value =
        (120 - value.scrollTop) / 100 > 0.1 ? (120 - value.scrollTop) / 100 : 0;
    }
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
              if (result.addressComponent) {
                adcode = result.addressComponent.adcode;
                resolve(result);
              } else {
                reject();
              }
            } else {
              reject();
            }
          });
        });
      });
    }
    function getCityWeatherById(id: string) {
      getCityWeatherNow({ location: id }).then(res => {
        state.cityWeatherNow = res;
      });
      getCityWeather7d({ location: id }).then(res => {
        state.cityWeather7d = res.daily;
      });
      getCityWeather24h({ location: id }).then(res => {
        state.cityWeather24h = res.hourly;
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
    function getWeatherUrl(status: string) {
      return (iconUrl as any)[`./heweather-icon-S1-source_${status}.png`];
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
      state,
      getWeatherUrl,
      handlerScrollTop,
      tempOpacity // 透明度
    };
  }
});
</script>
<style scoped lang="postcss">
.weather {
  background: #75a4c7;
  font-size: 18px;
  padding-bottom: 10vh;
  /* background: url("../../assets/test.jpeg");
  background-attachment: fixed;
  background-size: 100vw 100vh;
  background-repeat: no-repeat; */
  & .top {
    @apply text-center;
    background: #75a4c7;
    color: #f8f9fd;
    margin: 0 auto;
    padding-top: 60px;
    padding-bottom: 20px;
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
  & .weather24h {
    @apply w-screen overflow-hidden overflow-x-scroll overflow-y-hidden;
    background: #75a4c7;
    color: #f8f9fd;
    height: 120px;
    padding: 10px 0;
    border-top: 1px solid rgb(248 249 253 / 0.4);
    border-bottom: 1px solid rgb(248 249 253 / 0.4);
    & .weather24h-warp {
      @apply flex overflow-x-scroll overflow-y-hidden;
      height: 140px;
      & .weather24h-warp-li {
        @apply flex flex-col items-center;
        margin: 0 10px;
        & span {
          white-space: nowrap;
        }
        & .weather24h-pop {
          color: #94ccec;
          height: 14px;
          font-size: 14px;
          margin-top: 5px;
          margin-bottom: 3px;
        }
        & .weather24h-icon-box {
          width: 22px;
          height: 22px;
          margin-bottom: 26px;
          & .weather24h-icon {
            width: 22px;
            height: 22px;
          }
        }
      }
    }
    & .weather24h-warp .weather24h-warp-li:first-of-type {
      padding-left: 16px;
      margin-left: 0;
    }
    & .weather24h-warp .weather24h-warp-li:last-of-type {
      padding-right: 16px;
      margin-right: 0;
    }
  }
  & .bottom-box {
    & .weather7d {
      padding: 16px 16px;
      border-bottom: 1px solid rgb(248 249 253 / 0.4);
      & .weather7d-detail {
        @apply flex justify-between;
        opacity: 0.9;
        color: #f8f9fd;
        padding: 1px 0;
        & .weather7d-temp {
          @apply flex;
          & span {
            @apply text-right;
            min-width: 30px;
          }
        }
        & .weather7d-temp span:last-of-type {
          margin-left: 10px;
        }
        & .weather7d-icon-box {
          @apply text-left;
          min-width: 24px;
          & .weather7d-icon {
            width: 22px;
            height: 22px;
          }
        }
      }
    }
    & .detail {
      color: #f8f9fd;
      padding: 0 16px;
      & .detail_box {
        padding: 7px 0px 9px 0px;
        border-bottom: 1px solid rgb(248 249 253 / 0.4);
        & .label {
          @apply block;
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
      border-bottom: 0;
    }
    & .division {
      border-bottom: 1px solid rgb(248 249 253 / 0.4);
    }
  }
  & .map {
    width: 0;
    height: 0;
  }
}
</style>
