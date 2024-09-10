import { API } from '@/services/api';
import { request } from 'umi';
import { dispatchPass } from '@/services/service';
import {
  cancelRoadShowMeetingUsingPOST,
  createRoadShowMeetingUsingPOST,
  modifyRoadShowMeetingUsingPOST,
  queryUsingPOST,
  detailUsingPOST,
  searchEHRPOST,
  searchGroupPeoplePOST,
} from '@/services/fundportal/roadShowController';

export interface fileParams {
  urlPath: string;
  file: any;
  accessKey: string;
  secretKey: string;
  accountType: string;
  bucket: string;
  filePath: string;
}

// 类型接口
export async function getOssConfig() {
  return await dispatchPass(API.marketingApi.getOssConfig);
}

// 上传文件到 OSS
/**
 * @param
 *   -- file 文件
 *   -- accessKey 应用AK，文件系统分配
 *   -- secretKey 应用SK，文件系统分配，暂时不使用加密，内部系统简单校验，后续有公网系统接入考虑通过加签的方式通过AK验证SK
 *   -- accountType 账户类型 固定传：OSS
 *   -- bucket    需要传到OSS服务的哪个bucket下
 *   -- filePath  文件路径
 * @returns
 */
export async function uploadOss(params: fileParams) {
  const fileData = new FormData();
  const { urlPath, ...other } = params;
  Object.keys(other).forEach((key) => {
    fileData.append(key, other[key]);
  });
  return await request(urlPath, {
    method: 'POST',
    requestType: 'form',
    data: fileData,
  });
}

export async function newRoadShow(params) {
  const result = await createRoadShowMeetingUsingPOST(params);

  return result;
}

export async function updateRoadShow(params) {
  const result = await modifyRoadShowMeetingUsingPOST(params);

  return result;
}

export async function queryRoadShow(params) {
  const result = await queryUsingPOST(params);

  return result;
}

export async function queryRoadShowDetail(params) {
  const result = await detailUsingPOST(params);

  return result;
}

export async function cancelRoadShow(params) {
  const result = await cancelRoadShowMeetingUsingPOST(params);

  return result;
}

export async function queryContactByKey(params) {
  const result = await searchEHRPOST(params);
  return result;
}

export async function queryGroupDetail(params) {
  const result = await searchGroupPeoplePOST(params);

  return result;
}
