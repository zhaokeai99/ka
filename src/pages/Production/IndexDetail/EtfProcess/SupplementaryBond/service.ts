import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function querySupplyBondFlow(params: any) {
  return await dispatchPass(API.productionApi.querySupplyBondFlow, params);
}
export async function querySupplyBondFile(params: any) {
  return await dispatchPass(API.productionApi.querySupplyBondFile, params);
}
export async function querySupplyBondArrive(params: any) {
  return await dispatchPass(API.productionApi.querySupplyBondArrive, params);
}
export async function querySupplyBondExecute(params: any) {
  return await dispatchPass(API.productionApi.querySupplyBondExecute, params);
}
