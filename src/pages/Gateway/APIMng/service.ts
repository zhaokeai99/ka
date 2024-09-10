import {
  methodInfoCreatePOST,
  methodInfoDeletePOST,
  methodInfoModifyPOST,
  methodInfoQueryPOST,
} from '../../../services/fundportal/gateway';

// const mockData = {
//   dataList: [
//     {
//       operateType: 'fundportal.query',
//       appName: 'fundportal',
//       timeout: 10,
//       authority: 'NO',
//       description: '查询',
//       modifier: '张三',
//       createTime: '1965-01-01',
//       modifyTime: '2022-09-07',
//       id: 0,
//     },
//     {
//       operateType: 'fundportal.insert',
//       appName: 'fundportal',
//       timeout: 15,
//       authority: 'NO',
//       description: '插入',
//       modifier: '李四',
//       createTime: '1986-01-01',
//       modifyTime: '2022-09-06',
//       id: 1,
//     },
//     {
//       operateType: 'fundportal.update',
//       appName: 'fundportal',
//       timeout: 10,
//       authority: 'YES',
//       description: '更新',
//       modifier: '王五',
//       createTime: '1991-01-01',
//       modifyTime: '2022-09-05',
//       id: 2,
//     },
//     {
//       operateType: 'fundportal.delete',
//       appName: 'fundportal',
//       timeout: 5,
//       authority: 'YES',
//       description: '删除',
//       modifier: '赵六',
//       createTime: '1991-01-01',
//       modifyTime: '2022-09-05',
//       id: 3,
//     },
//   ],
// };

// 查找列表
export async function querydataList(param) {
  const newParam = {
    ...param,
    index: param.current,
    size: param.pageSize,
    searchWord: param.searchWord,
  };

  const { success, data } = await methodInfoQueryPOST(newParam);

  const dataList = [];
  if (success) {
    if (data && data.records) {
      data.records.forEach((element) => {
        if (element) {
          const { mobileGwMethodInfoDO } = element;
          dataList.push({
            ...mobileGwMethodInfoDO,
            checkLogin: mobileGwMethodInfoDO.checkLogin ? 'YES' : 'NO',
            isProtobuf: mobileGwMethodInfoDO.isProtobuf ? 'YES' : 'NO',
            gmtModify: mobileGwMethodInfoDO.gmtModify || '--',
          });
        }
      });
    }
  }

  return {
    success,
    data: dataList,
    total: data && data.total,
    pageSize: data && data.size,
    pageNum: data && data.current,
  };
}

// 新增
export async function addItem(param) {
  const newParam = {
    ...param,
    checkLogin: param.checkLogin === 'YES' ? true : false,
    isProtobuf: param.isProtobuf === 'YES' ? true : false,
  };
  return await methodInfoCreatePOST(newParam);
}

// 修改
export async function updateItem(param) {
  const newParam = {
    ...param,
    checkLogin: param.checkLogin === 'YES' ? true : false,
    isProtobuf: param.isProtobuf === 'YES' ? true : false,
  };
  return await methodInfoModifyPOST(newParam);
}

// 删除
export async function deleteItem(param) {
  return await methodInfoDeletePOST(param);
}
