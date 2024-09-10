import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { ICommonTableItems } from '../service';

export interface IRelativeTableItem extends Required<ICommonTableItems> {}

export interface IValuationMoveTableItem extends Required<ICommonTableItems> {}

export interface IClosingTableItem extends Required<ICommonTableItems> {}

// 盘后价格异动-收盘价格异动
export async function getYestDayClosePriceOffset(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetYestDayClosePriceOffsett,
    params,
  );
  return {
    data,
    success,
  };
}
// 盘后价格异动-估值异动
export async function getYestDayValChange(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetYestDayValChange,
    params,
  );
  return {
    data,
    success,
  };
}

// 盘后价格异动-相对估值偏离
export async function getYestDayValOffset(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.BondPriceChangeGetYestDayValOffset,
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
