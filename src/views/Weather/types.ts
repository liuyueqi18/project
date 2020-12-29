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

export const weekDay = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六"
];
