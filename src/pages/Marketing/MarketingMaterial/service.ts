import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export const iconMap = {
  excel: 'https://cdnprod.tianhongjijin.com.cn/thfile/excel_icon1660184717787.png',
  folder: 'https://cdnprod.tianhongjijin.com.cn/thfile/folder_icon1660184717804.png',
  ppt: 'https://cdnprod.tianhongjijin.com.cn/thfile/ppt_icon1660184805679.png',
  pdf: 'https://cdnprod.tianhongjijin.com.cn/thfile/pdf_icon1660195698393.png',
  txt: 'https://cdnprod.tianhongjijin.com.cn/thfile/txt_icon1660184805676.png',
  word: 'https://cdnprod.tianhongjijin.com.cn/thfile/word_icon1660184805676.png',
  zip: 'https://cdnprod.tianhongjijin.com.cn/thfile/zip_icon1660184805680.png',
  video: 'https://cdnprod.tianhongjijin.com.cn/thfile/vedio_icon1660195698407.png',
  audio: 'https://cdnprod.tianhongjijin.com.cn/thfile/audio_icon1660195720320.png',
  axure: 'https://cdnprod.tianhongjijin.com.cn/thfile/axure_icon1660184717800.png',
  default: 'https://cdnprod.tianhongjijin.com.cn/thfile/default_file_icon1660184717787.png',
};

export const iconUrl = (val: any) => {
  switch (val) {
    case 'pdf':
      return iconMap.pdf;
    case 'doc':
    case 'docx':
      return iconMap.word;
    case 'ppt':
    case 'pptx':
      return iconMap.ppt;
    case 'xls':
    case 'xlsx':
      return iconMap.excel;
    case 'zip':
    case 'rar':
      return iconMap.zip;
    case 'mp4':
    case 'wmv':
    case 'asf':
    case 'asx':
      return iconMap.video;
    case 'mp3':
    case 'wav':
    case 'wma':
      return iconMap.audio;
    default:
      return iconMap.default;
  }
};

// 支持类别查询
export async function catSupportQuery() {
  const { data } = await dispatchPass(API.marketingApi.catSupportQuery);
  return data || [];
}

// 类别查询
export async function catQuery(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.catQuery, params);
  return { data, success };
}

// 类别添加
export async function catAdd(params: any) {
  return await dispatchPass(API.marketingApi.catAdd, params);
}

// 类别修改
export async function catUpdate(params: any) {
  return await dispatchPass(API.marketingApi.catUpdate, params);
}

// 类别删除
export async function catDelete(params: any) {
  return await dispatchPass(API.marketingApi.catDelete, params);
}

// 标签查询
export async function labelQuery(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.labelQuery, params);
  return { data, success };
}

// 标签添加
export async function labelAdd(params: any) {
  return await dispatchPass(API.marketingApi.labelAdd, params);
}

// 标签修改
export async function labelUpdate(params: any) {
  return await dispatchPass(API.marketingApi.labelUpdate, params);
}

// 标签删除
export async function labelDel(params: any) {
  return await dispatchPass(API.marketingApi.labelDel, params);
}

// 上传类型接口
export async function getOssConfig(params: any) {
  return await dispatchPass(API.marketingApi.materialGetOss, params);
}

// 素材查询
export async function materialQuery(params: any) {
  const { data, success } = await dispatchPass(API.marketingApi.materialQuery, params);
  return { data, success };
}

// 素材添加
export async function materialAdd(params: any) {
  return await dispatchPass(API.marketingApi.materialAdd, params);
}

// 素材修改
export async function materialUpdate(params: any) {
  return await dispatchPass(API.marketingApi.materialUpdate, params);
}

// 素材添加-素材相关下拉数据
export async function catQueryAll(params: any) {
  const { data } = await dispatchPass(API.marketingApi.catQueryAll, params);
  return transOptions(data, 'catName', 'catId') || [];
}

// 素材添加-关联标签下拉查询
export async function labelQueryAll() {
  const { data } = await dispatchPass(API.marketingApi.labelQueryAll);
  return transOptions(data, 'labelName', 'labelId') || [];
}

// 素材添加-产品下拉查询
export async function queryFunds(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryFunds, params);
  return transOptions(data, 'fundAbbr', 'fundCode') || [];
}

// 产品经理下拉查询
export async function queryFundManagers() {
  const { data } = await dispatchPass(API.marketingApi.queryFundManagers);
  return transOptions(data, 'name', 'account') || [];
}

// 素材管理-删除
export async function materialDel(params: any) {
  return await dispatchPass(API.marketingApi.materialDel, params);
}

// 素材下载记录
export async function downloadTime(params: any) {
  return await dispatchPass(API.marketingApi.downloadTime, params);
}
