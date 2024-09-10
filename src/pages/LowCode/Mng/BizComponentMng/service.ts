// import Data from '../../mainDB';
import {
  createBizComponentUsingPOST,
  modifyComponentUsingPOST,
  querySingleBizComponentUsingPOST,
  queryBizComponentUsingPOST,
} from '@/services/risk-ding2/bizComponentController';

// 查询接口支持入参 id查询，以及其他常用入参
export async function queryBizComponentList(params: any) {
  // console.log('queryBizComponentList params ', params, Data.bizComponents);
  // return {
  //   data: [].concat(Data.bizComponents),
  //   success: true,
  //   pageSize: 10,
  //   pageNum: 1,
  //   total: 100,
  // };
  const newParam = {
    currIndex: params.current,
    pageSize: params.pageSize,
    searchWord: params.searchWord,
  };
  console.log('queryBizComponentList params ', newParam);
  const result = await queryBizComponentUsingPOST(newParam);
  console.log('queryBizComponentList ', result);
  if (result && result.success && result.data) {
    return {
      ...result.data,
      success: true,
    };
  }
  return { success: false };
}

// export async function deleteDataItem(params: any) {
//   console.log('deleteDataItem params ', params);
//   for (let i = 0; i < Data.bizComponents.length; i++) {
//     const item = Data.bizComponents[i];
//     if (item && item.id === params.id) {
//       Data.bizComponents.splice(i, 1);
//       break;
//     }
//   }
//   console.log('deleteDataItem end ', Data.bizComponents);
// }

export async function getItemDetail(params: any) {
  console.log('getItemDetail params ', params);
  // for (let i = 0; i < Data.bizComponents.length; i++) {
  //   const item = Data.bizComponents[i];
  //   if (item && item.id === params.id) {
  //     console.log('getItemDetail find item ', item);
  //     return {
  //       success: true,
  //       data: item,
  //     };
  //   }
  // }
  // return { success: false };

  const result = await querySingleBizComponentUsingPOST(params);
  console.log('getItemDetail params ', params);
  return result;
}

export async function updateItem(params: any) {
  console.log('updateItem params ', params);
  const result = await modifyComponentUsingPOST(params);
  console.log('updateItem ', result);
  return result;
  // console.log('updateItem params ', params);
  // for (let i = 0; i < Data.bizComponents.length; i++) {
  //   const item = Data.bizComponents[i];
  //   if (item && item.id === params.id) {
  //     console.log('updateItem find item ', item);
  //     item.title = params.title;
  //     item.description = params.description;
  //     item.keywords = params.keywords;
  //     item.category = params.category;
  //     // item.uiComponent = params.uiComponent; // UI组件类型暂时不变了，只能改其中的一些属性，描述
  //     item.app = params.app;
  //     item.imgUrl = params.imgUrl;
  //     item.props = params.props;
  //     return {
  //       success: true,
  //       detail: item,
  //     };
  //   }
  // }
  // return { success: false };
}

export async function addItem(params: any) {
  // console.log('addItem params ', params);
  // Data.bizComponents.push(params);
  // console.log('addItem lists ', Data.bizComponents);
  // return { success: true };
  console.log('updateItem params ', params);
  const result = await createBizComponentUsingPOST(params);
  console.log('updateItem ', result);
  return result;
}
