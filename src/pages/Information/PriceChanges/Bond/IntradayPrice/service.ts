import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { ICommonTableItems } from '../service';

export interface IValuationTableItem extends Required<ICommonTableItems> {}

export interface IYesterdayTableItem extends Required<ICommonTableItems> {}

// 盘中价格异动-昨收偏离
export async function getDayPreValOffset(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetDayPreValOffset,
    params,
  );
  return {
    data,
    success,
  };
}

// 盘中价格异动-估值偏离
export async function getDayValOffset(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetDayValOffset,
    params,
  );
  return {
    data,
    success,
  };
}

// 筛选条件-债券模糊查询
export async function likeBondName(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeLikeBondName,
    params,
  );
  return {
    data,
    success,
  };
}

// 筛选条件-主体模糊查询
export async function likeCompanyName(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeLikeCompanyName,
    params,
  );
  return {
    data,
    success,
  };
}
