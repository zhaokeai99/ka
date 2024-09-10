import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { request } from 'umi';

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
  return await dispatchPass(API.marketingApi.getMrkOssConfig);
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
