import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

export interface TableListItem {
  taskLogId: number;
  taskLogName: string;
  taskLogRemark: string;
  execFlag: string;
  busiDate: string;
  execDate: string;
  taskParams: string;
  taskExecTime: Date;
  taskEndTime: Date;
  taskResult: string;
  taskRemark: string;
}

// 索引状态查询
export async function QueryLogByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.queryLogByPage, params);
  return data || {};
}
// 中止任务
export async function EsIndexInfoFacadeStopTask(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.EsIndexInfoFacadeStopTask, params);
  return data || {};
}
// 查看情况
export async function EsIndexInfoFacadeGetRunTaskInfo(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.EsIndexInfoFacadeGetRunTaskInfo, params);
  return data || '';
}
