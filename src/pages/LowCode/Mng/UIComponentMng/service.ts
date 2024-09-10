// import Data from '../../mainDB';
import {
  createUiComponentUsingPOST,
  modifyUiComponentUsingPOST1,
  querySingleUiComponentUsingPOST1,
  queryUiComponentUsingPOST1,
} from '@/services/risk-ding2/uiComponentController';

// 查询接口支持入参 id查询，以及其他常用入参
export async function queryUIComponentList(params: any) {
  // console.log('queryUIComponentList end ', Data.UIComponents);
  const newParam = {
    currIndex: params.current,
    pageSize: params.pageSize,
    searchWord: params.searchWord,
  };
  console.log('queryUIComponentList params ', newParam);
  const result = await queryUiComponentUsingPOST1(newParam);
  console.log('queryUIComponentList ', result);
  if (result && result.success && result.data) {
    return {
      ...result.data,
      success: true,
    };
  }
  return { success: false };

  // if (params.id) {
  //   for (let i = 0; i < Data.UIComponents.length; i++) {
  //     if (Data.UIComponents[i] && Data.UIComponents[i].id === params.id) {
  //       return {
  //         data: [Data.UIComponents[i]],
  //         success: true,
  //         pageSize: 10,
  //         pageNum: 1,
  //         total: 100,
  //       };
  //     }
  //   }
  // }
  // return {
  //   data: [].concat(Data.UIComponents),
  //   success: true,
  //   pageSize: 10,
  //   pageNum: 1,
  //   total: 100,
  // };
}

// export async function deleteDataItem(params: any) {
//   console.log('deleteDataItem params ', params);
//   for (let i = 0; i < Data.UIComponents.length; i++) {
//     const item = Data.UIComponents[i];
//     if (item && item.id === params.id) {
//       Data.UIComponents.splice(i, 1);
//       break;
//     }
//   }
//   console.log('deleteDataItem end ', Data.UIComponents);
// }

export async function getItemDetail(params: any) {
  console.log('getItemDetail params ', params);
  // for (let i = 0; i < Data.UIComponents.length; i++) {
  //   const item = Data.UIComponents[i];
  //   if (item && item.id === params.id) {
  //     console.log('getItemDetail find item ', item);
  //     return {
  //       success: true,
  //       data: item,
  //     };
  //   }
  // }
  // return { success: false };
  const result = await querySingleUiComponentUsingPOST1({ id: params.id });
  console.log('getItemDetail ', result);
  return result;
}

export async function updateItem(params: any) {
  console.log('updateItem params ', params);
  const result = await modifyUiComponentUsingPOST1(params);
  console.log('updateItem ', result);
  return result;
  // for (let i = 0; i < Data.UIComponents.length; i++) {
  //   const item = Data.UIComponents[i];
  //   if (item && item.id === params.id) {
  //     console.log('updateItem find item ', item);
  //     item.title = params.title;
  //     item.description = params.description;
  //     item.keywords = params.keywords;
  //     item.category = params.category;
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
  console.log('addItem params ', params);
  // Data.UIComponents.push(params);
  // console.log('addItem lists ', Data.UIComponents);
  // console.log('createUiComponentUsingPOST params ', params);
  const result = await createUiComponentUsingPOST(params);
  console.log('addItem result ', result);

  return result;
}
