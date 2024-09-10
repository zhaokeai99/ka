import {
  applicationCreatePOST,
  applicationDeletePOST,
  applicationModifyPOST,
  applicationQueryPOST,
} from '../../../services/fundportal/gateway';

// 查找列表
export async function queryAppList(param) {
  const newParam = {
    ...param,
    index: param.current,
    size: param.pageSize,
    searchWord: param.searchWord,
  };
  const { success, data } = await applicationQueryPOST(newParam);
  const dataList = [];

  if (success) {
    if (data && data.records) {
      data.records.forEach((element) => {
        if (element) {
          const {
            applicationName,
            mobilegwApplicationAuthModel,
            mobilegwApplicationRpcInfoModel,
            gmtModified,
            modifior,
          } = element;
          dataList.push({
            appName: applicationName,
            ak: mobilegwApplicationAuthModel && mobilegwApplicationAuthModel.ak,
            checkSign: mobilegwApplicationAuthModel && mobilegwApplicationAuthModel.checkSign,
            sk: mobilegwApplicationAuthModel && mobilegwApplicationAuthModel.sk,
            retryable: mobilegwApplicationRpcInfoModel && mobilegwApplicationRpcInfoModel.retryable,
            timeout: mobilegwApplicationRpcInfoModel && mobilegwApplicationRpcInfoModel.timeout,
            gmtModified: gmtModified || '--',
            modifior,
          });
        }
      });
    }
  }
  return {
    success,
    data: dataList,
    total: data && data.total,
    pageSize: data && data.size,
    pageNum: data && data.current,
  };
}

// 新增
export async function addItem(param) {
  const newParam = {
    applicationName: param.appName,
    mobilegwApplicationAuthVo: {
      ak: param.ak,
      checkSign: param.checkSign === 'YES' ? true : false,
      sk: param.sk,
    },
    mobilegwApplicationRpcInfoVo: {
      retryable: param.retryable === 'YES' ? true : false,
      timeout: param.timeout,
    },
  };
  return await applicationCreatePOST(newParam);
}

// 修改
export async function updateItem(param) {
  const newParam = {
    applicationName: param.appName,
    mobilegwApplicationAuthVo: {
      ak: param.ak,
      checkSign: param.checkSign === 'YES' ? true : false,
      sk: param.sk,
    },
    mobilegwApplicationRpcInfoVo: {
      retryable: param.retryable === 'YES' ? true : false,
      timeout: param.timeout,
    },
  };
  return await applicationModifyPOST(newParam);
}

// 删除
export async function deleteItem(param) {
  const newParam = {
    applicationName: param.appName,
  };
  return await applicationDeletePOST(newParam);
}
