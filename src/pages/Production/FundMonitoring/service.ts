import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import _maxBy from 'lodash/maxBy';

// 规模/份额/只数列表
export async function queryEtfIndexInfoCondition(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryEtfIndexInfoCondition, params);
  return data || {};
}

// 指数行业分类
export async function queryEtfSortSys(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryEtfSortSys, params);
  return data || [];
}

// ETF类型
export async function queryEtfTypeList(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryEtfTypeList, params);
  if (!data || !Array.isArray(data)) {
    return [];
  }
  return data.sort((a: { value: number }, b: { value: number }) => {
    return a.value - b.value;
  });
}

// 查询ETF场内资金监控
export async function queryEtfIndexInfoList(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryEtfIndexInfoList, params);
  if (!data && !Array.isArray(data)) {
    return [];
  }
  const newNavAtmAdd: number[] = [];
  return data.map((ite: any) => {
    newNavAtmAdd.push(...ite.infos);

    const maxNavAmtAddRatio: any = _maxBy(newNavAtmAdd, 'navAmtAddRatio');
    newNavAtmAdd.forEach((item: any) => {
      if (item.navAmt === item.navAmtAdd) {
        item.value = [
          item.navAmt,
          maxNavAmtAddRatio.navAmtAddRatio ? maxNavAmtAddRatio.navAmtAddRatio : 1 || 0,
        ];
      } else {
        item.value = [item.navAmt, item.navAmtAddRatio || 0];
      }
    });

    const newInfos = ite.infos.map((item: any) => {
      item.name = item.finalFundName;
      return item;
    });

    return {
      name: ite.indexTrackType,
      children: [...newInfos],
    };
  });
}

// 折线图
export async function queryLineChartList(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryLineChartList, params);
  return data || [];
}
