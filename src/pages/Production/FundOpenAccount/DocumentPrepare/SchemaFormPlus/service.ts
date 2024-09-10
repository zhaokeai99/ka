import request from 'umi-request';

// 网关转发
export async function dispatchPass(operationType = '', params = {}) {
  return await request('/dispatchByThssoLogin', {
    method: 'POST',
    data: {
      operationType,
      params,
    },
  });
}
