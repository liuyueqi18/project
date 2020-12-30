export type CityBO = {
  code: string;
  location: ItemCityBO[];
};

export type ItemCityBO = {
  adm1: string;
  adm2: string;
  country: string;
  fxLink: string;
  id: string;
  isDst: string;
  lat: string;
  lon: string;
  name: string;
  rank: string;
  type: string;
  tz: string;
  utcOffset: string;
};

export type CityWeather = {
  code: string;
  updateTime: string;
  now: {
    cloud: string;
    dew: string;
    feelsLike: string;
    humidity: string;
    icon: string;
    obsTime: string;
    precip: string;
    pressure: string;
    temp: string;
    text: string;
    vis: string;
    wind360: string;
    windDir: string;
    windScale: string;
    windSpeed: string;
  };
};

export type CityWeather7d = {
  code: string;
  updateTime: string;
  daily: {
    cloud: string;
    fxDate: string;
    humidity: string;
    iconDay: string;
    iconNight: string;
    moonPhase: string;
    moonrise: string;
    moonset: string;
    precip: string;
    pressure: string;
    sunrise: string;
    sunset: string;
    tempMax: string;
    tempMin: string;
    textDay: string;
    textNight: string;
    uvIndex: string;
    vis: string;
    wind360Day: string;
    wind360Night: string;
    windDirDay: string;
    windDirNight: string;
    windScaleDay: string;
    windScaleNight: string;
    windSpeedDay: string;
    windSpeedNight: string;
  }[];
};

export type CityWeather24h = {
  code: string;
  updateTime: string;
  hourly: {
    cloud: string;
    dew: string;
    fxTime: string;
    humidity: string;
    icon: string;
    pop: string;
    precip: string;
    pressure: string;
    temp: string;
    text: string;
    wind360: string;
    windDir: string;
    windScale: string;
    windSpeed: string;
  }[];
};

export const weekDay = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六"
];

/**
  now.obsTime	实况观测时间	2013-12-30T01:45+08:00
  now.temp	实况温度，默认单位：摄氏度	21
  now.feelsLike	实况体感温度，默认单位：摄氏度	23
  now.icon	当前天气状况和图标的代码，图标可通过天气状况和图标下载	100
  now.text	实况天气状况的文字描述，包括阴晴雨雪等天气状态的描述	晴
  now.wind360	实况风向360角度	305
  now.windDir	实况风向	西北
  now.windScale	实况风力等级	3
  now.windSpeed	实况风速，公里/小时	15
  now.humidity	实况相对湿度，百分比数值	40
  now.precip	实况降水量，默认单位：毫米	1.2
  now.pressure	实况大气压强，默认单位：百帕	1020
  now.vis	实况能见度，默认单位：公里	10
  now.cloud	实况云量，百分比数值	23
  now.dew	实况露点温度	12
*/

/** 
  hourly.fxTime	逐小时预报时间	
  hourly.temp	逐小时预报温度	2
  hourly.icon	逐小时预报天气状况图标代码，图标可通过天气状况和图标下载	101
  hourly.text	逐小时预报天气状况文字描述，包括阴晴雨雪等天气状态的描述	多云
  hourly.wind360	逐小时预报风向360角度	305
  hourly.windDir	逐小时预报风向	西北
  hourly.windScale	逐小时预报风力等级	3
  hourly.windSpeed	逐小时预报风速，公里/小时	15
  hourly.humidity	逐小时预报相对湿度，百分比数值	40
  hourly.precip	逐小时预报降水量，默认单位：毫米	1.2
  hourly.pop	逐小时预报降水概率，百分比数值，可能为空	5
  hourly.pressure	逐小时预报大气压强，默认单位：百帕	1020
  hourly.cloud	逐小时预报云量，百分比数值	23
  hourly.dew	逐小时预报露点温度
*/

/** 
  daily.fxDate	预报日期	2013-05-31
  daily.sunrise	日出时间	07:34
  daily.sunset	日落时间	17:21
  daily.moonrise	月升时间	16:09
  daily.moonset	月落时间	04:21
  daily.moonPhase	月相名称	满月
  daily.tempMax	预报当天最高温度	4
  daily.tempMin	预报当天最低温度	-5
  daily.iconDay	预报白天天气状况的图标代码，图标可通过天气状况和图标下载	100
  daily.textDay	预报白天天气状况文字描述，包括阴晴雨雪等天气状态的描述	晴
  daily.iconNight	预报夜间天气状况的图标代码，图标可通过天气状况和图标下载	100
  daily.textNight	预报晚间天气状况文字描述，包括阴晴雨雪等天气状态的描述	晴
  daily.wind360Day	预报白天风向360角度	305
  daily.windDirDay	预报白天风向	西北
  daily.windScaleDay	预报白天风力等级	3-4
  daily.windSpeedDay	预报白天风速，公里/小时	15
  daily.wind360Night	预报夜间风向360角度	305
  daily.WindDirNight	预报夜间当天风向	西北
  daily.windScaleNight	预报夜间风力等级	3-4
  daily.windSpeedNight	预报夜间风速，公里/小时	15
  daily.humidity	预报当天相对湿度，百分比数值	40
  daily.precip	预报当天降水量，默认单位：毫米	1.2
  daily.pressure	预报当天大气压强，默认单位：百帕	1020
  daily.vis	预报当天能见度，默认单位：公里	10
  daily.cloud	预报当天云量，百分比数值	23
  daily.uvIndex	预报当天紫外线强度指数	3
*/
