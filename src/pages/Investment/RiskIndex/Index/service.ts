import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 数据源列表
export async function queryIntegrationSource(params: any) {
  const { success, data } = await dispatchPass(API.investmentApi.queryIntegrationSource, {
    ...params,
  });
  if (success && Array.isArray(data)) {
    return data.map(({ id, sourceName, sourceType }) => ({
      label: `${id} - ${sourceName}`,
      value: [id, sourceName, sourceType],
    }));
  }
  return [];
}

export async function queryTable(params: any) {
  const { success, data } = await dispatchPass(API.investmentApi.queryTable, {
    ...params,
  });
  if (success && Array.isArray(data)) {
    return data.map(({ id, tableView, tableName, sourceType }) => ({
      label: `${id} - ${tableView} - ${tableName}`,
      value: [id, tableView, sourceType, tableName],
    }));
  }
  return [];
}

// 查看单个报表
export async function queryTableById(parmas: any) {
  const res = await dispatchPass(API.investmentApi.queryTableById, {
    ...parmas,
  });
  return res?.data?.fieldModelList?.map((item: any) => ({
    ...item,
    value: item.columnName,
    label: item.columnName,
  }));
}

// 查看指标节点管理列表 checked
export async function getIndexNodeManageList(parmas: any) {
  const { success, data } = await dispatchPass(API.investmentApi.getIndexNodeManageList, {
    ...parmas,
  });
  if (success) {
    return data;
  }
  return [];
}

// 新增指标指标节点 checked
export async function addIndexCalculationNodeInfo(parmas: any) {
  const res = await dispatchPass(API.investmentApi.addIndexCalculationNodeInfo, {
    ...parmas,
  });
  return res;
}

// 修改指标节点 checked
export async function changeIndexCalculationNodeInfo(parmas: any) {
  const res = await dispatchPass(API.investmentApi.changeIndexCalculationNodeInfo, {
    ...parmas,
  });
  return res;
}

// 删除指标节点 checked
export async function deleteIndexNodeInfo(parmas: any) {
  const res = await dispatchPass(API.investmentApi.deleteIndexNodeInfo, {
    ...parmas,
  });
  return res;
}

// 修改指标节点发布状态 checked
export async function changeIndexNodePublishStatus(parmas: any) {
  const res = await dispatchPass(API.investmentApi.changeIndexNodePublishStatus, {
    ...parmas,
  });
  return res;
}

// 新增指标指标分组 checked
export async function addIndexGroupInfo(parmas: any) {
  const res = await dispatchPass(API.investmentApi.addIndexGroupInfo, {
    ...parmas,
  });
  return res;
}

// 测试指标节点 checked
export async function calIndexNode(parmas: any) {
  const res = await dispatchPass(API.investmentApi.calIndexNode, {
    ...parmas,
  });
  return res;
}

// 查看指标节点信息 checked
export async function getIndexNodeInfo(parmas: any) {
  const res = await dispatchPass(API.investmentApi.getIndexNodeInfo, {
    ...parmas,
  });
  return res;
}

// 查看发布的指标节点列表 checked
export async function getPublishIndexNodeList(parmas: any) {
  const { data } = await dispatchPass(API.investmentApi.getPublishIndexNodeList, {
    ...parmas,
  });
  if (data?.length) {
    const newData = data.map((item: { calculationName: string; calculationId: string }) => {
      return {
        ...item,
        label: item.calculationName,
        value: item.calculationId,
      };
    });
    return newData;
  }

  return [];
}

// 查看指标分组结果
export async function getIndexGroupInfo(parmas: any) {
  const res = await dispatchPass(API.investmentApi.getIndexGroupInfo, {
    ...parmas,
  });
  return res;
}

export async function getIndexGroupList(parmas: any) {
  const res = await dispatchPass(API.investmentApi.getIndexGroupList, {
    ...parmas,
  });
  return res;
}

// 通过类型查看指标节点信息
export async function getIndexNodeInfoByType(parmas: any) {
  const res = await dispatchPass(API.investmentApi.getIndexNodeInfoByType, {
    ...parmas,
  });
  return res;
}

// 查看指标节点结果列表
export async function getIndexNodeResultList(parmas: any) {
  const res = await dispatchPass(API.investmentApi.getIndexNodeResultList, {
    ...parmas,
  });
  return res;
}

// 查询子过滤条件
export async function getNodeByOriginIdAndNodeId(params: any) {
  const { data } = await dispatchPass(API.investmentApi.getNodeByOriginIdAndNodeId, params);
  return data || [];
}
