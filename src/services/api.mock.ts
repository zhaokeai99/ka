/**
 * (1) 如果想单独配置api
 *  mockApis: [
 *    'com.thfund.product.facade.service.IndexMapFacade.indexCompanyDynamic',
 *    'xxxx',
 *  ]
 * (2) 如果全部
 *  mockApis: '*'
 */

export const mockApis: string | string[] = '*';
