import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询指数新规配置项
export async function queryComplianceConfigList() {
  const { data } = await dispatchPass(API.productionApi.queryComplianceConfigList);
  if (!data) {
    return [];
  }
  return data;
}

// 更新指数新规配置项
export async function updateComplianceConfig(params: any) {
  const { data } = await dispatchPass(API.productionApi.updateComplianceConfig, params);
  return data;
}

// 查询个性化热力图权重配置
export async function getIndexHotMapUserWeights() {
  const { data } = await dispatchPass(API.productionApi.getIndexHotMapUserWeights);
  if (!data) {
    return [];
  }

  const arr = [
    {
      type: 'latestGmv',
      title: 'GMV',
      value: Number(data?.latestGmv * 100),
    },
    {
      type: 'newValue',
      title: '新发值',
      value: Number(data?.newValue * 100),
    },
    {
      type: 'pb',
      title: '市净率',
      value: Number(data?.pb * 100),
    },
    {
      type: 'pe',
      title: '市盈率',
      value: Number(data?.pe * 100),
    },
    {
      type: 'productTotalScale',
      title: '产品总规模',
      value: Number(data?.productTotalScale * 100),
    },
    {
      type: 'reservedProductsNum',
      title: '储备产品数',
      value: Number(data?.reservedProductsNum * 100),
    },
    {
      type: 'stockedProductsNum',
      title: '存量产品数',
      value: Number(data?.stockedProductsNum * 100),
    },
    {
      type: 'turnOverRate',
      title: '换手率',
      value: Number(data?.turnOverRate * 100),
    },
  ];
  return arr;
}

// 更新个性化热力图权重配置
export async function addOrUpdateIndexHotMapUserWeights(params: any) {
  const { data } = await dispatchPass(API.productionApi.addOrUpdateIndexHotMapUserWeights, params);
  return data;
}
