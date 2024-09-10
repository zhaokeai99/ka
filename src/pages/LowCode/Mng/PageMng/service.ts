// import Data from '../../mainDB';
import {
  createPageUsingPOST,
  modifyUiComponentUsingPOST,
  querySingleUiComponentUsingPOST,
  queryUiComponentUsingPOST,
} from '@/services/risk-ding2/pageInfoController';

import { queryBizComponentByIdsUsingPOST } from '@/services/risk-ding2/bizComponentController';

export async function queryPageList(params: any) {
  // console.log('queryPageList params ', params);
  // return { success: true, data: [].concat(Data.pages) };
  const newParam = {
    currIndex: params.current,
    pageSize: params.pageSize,
    searchWord: params.searchWord,
  };
  console.log('queryPageList params ', newParam);
  const result = await queryUiComponentUsingPOST(newParam);
  console.log('queryPageList ', result);
  if (result && result.success && result.data) {
    return {
      ...result.data,
      success: true,
    };
  }
  return { success: false };
}

// export async function deletePageItem(params: any) {
//   console.log('deletePageItem params ', params);
//   for (let i = 0; i < Data.pages.length; i++) {
//     const item = Data.pages[i];
//     if (item && item.pageId === params.pageId) {
//       Data.pages.splice(i, 1);
//       break;
//     }
//   }
//   console.log('deletePageItem end ', Data.pages);
// }

export async function getPageDetail(params: any) {
  console.log('getPageDetail params ', params);
  // for (let i = 0; i < Data.pages.length; i++) {
  //   const item = Data.pages[i];
  //   if (item && item.pageId === params.pageId) {
  //     console.log('getPageDetail find item ', item);
  //     return {
  //       success: true,
  //       data: item,
  //     };
  //   }
  // }
  // return { success: false };
  const result = await querySingleUiComponentUsingPOST({ id: params.id });
  console.log('getPageDetail ', result);
  return result;
}

export async function updatePageItem(params: any) {
  // console.log('updatePageItem params ', params);
  // for (let i = 0; i < Data.pages.length; i++) {
  //   if (Data.pages[i] && Data.pages[i].pageId === params.pageId) {
  //     Data.pages[i].title = params.title;
  //     Data.pages[i].description = params.description;
  //     Data.pages[i].keywords = params.keywords;
  //     Data.pages[i].category = params.category;
  //     Data.pages[i].layout = params.layout;
  //     Data.pages[i].lastVersion = params.lastVersion;
  //     break;
  //   }
  // }
  // return { success: false };
  console.log('updatePageItem params ', params);
  const result = await modifyUiComponentUsingPOST(params);
  console.log('updatePageItem ', result);
  return result;
}

export async function addPageItem(params: any) {
  console.log('addPageItem params ', params);
  // Data.pages.push(params);
  // console.log('addPageItem lists ', Data.pages);
  // return { success: true };
  // 由于layout需要校验不为空，但是前端是再新页面编辑layout，所以传个默认值
  const result = await createPageUsingPOST({ ...params, layout: '-' });
  console.log('addPageItem result ', result);

  return result;
}

export async function getBizComponentsProps(params: any) {
  console.log('getBizComponentsProps params ', params);
  const result = await queryBizComponentByIdsUsingPOST({ ...params, layout: '-' });
  console.log('getBizComponentsProps result ', result);

  return result;
}
