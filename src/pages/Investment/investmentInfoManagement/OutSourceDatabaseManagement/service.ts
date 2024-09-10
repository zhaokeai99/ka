import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  id: number;
  bizName: string;
  bizUrl: string;
  bizType: string;
  bizTheme: string;
  bizDesc: string;
  bizRemark: string;
  logo: string;
  dep: string;
  beginDate: string;
  endDate: string;
  creator: string;
  status: number;
  updateTime: Date;
}

// 获取路演中心查询
export async function IrOutsourceFacadeQueryIrOutsourceList(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.IrOutsourceFacadeQueryIrOutsourceList,
    params,
  );
  return data || {};
}

// 路演中心保存
export async function IrOutsourceFacadeUpdateIrOutsourceList(params = {}) {
  const data = await dispatchPass(API.investmentApi.IrOutsourceFacadeUpdateIrOutsourceList, params);
  return data || {};
}

// 路演中心新增
export async function IrOutsourceFacadeInsertIrOutsourceList(params = {}) {
  const data = await dispatchPass(API.investmentApi.IrOutsourceFacadeInsertIrOutsourceList, params);
  return data || {};
}
