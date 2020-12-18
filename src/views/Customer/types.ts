export type CustomerBO = {
  id: string;
  userId: string;
  custPhone: string;
  custName: string;
  isFollow: boolean;
  provinceName: string;
  cityName: string;
  areaName: string;
  remark: string;
  gender: string;
};

export type CustomerVO = {
  userId: string;
  custPhone: string;
  custName: string;
  provinceName: string;
  provinceCode: string;
  cityName: string;
  cityCode: string;
  areaName: string;
  areaCode: string;
  remark: string;
  gender: string;
};

export type CustomerQueryVO = {
  custName: string;
};
