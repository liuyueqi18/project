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
