import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

//查询接口参数转换
export function TransformParams(list: any, query: any) {
  const newQuery: any = JSON.parse(JSON.stringify(query));
  if (newQuery.rules && newQuery.rules.length) {
    newQuery.rules = newQuery.rules
      .map((item: any) => {
        if (item.rules) {
          if (item.rules.length) {
            return TransformParams(list, item);
          } else {
            return null;
          }
        } else {
          if (item.value) {
            const arr = list.filter(
              (jtem: any) =>
                item.field === jtem.columnName ||
                item.field === `${jtem.tableName}.${jtem.columnName}`,
            );
            let obj = {
              ...item,
              alias: arr[0]?.alias,
              type: arr[0]?.columnAttributeType,
              field: item.field,
              fieldValue: item.value,
              tableName: arr[0]?.tableName,
            };
            if (item.valueSource === 'field') {
              const _arr = list.filter(
                (ktem: any) =>
                  item.value === ktem.columnName ||
                  item.value === `${ktem.tableName}.${ktem.columnName}`,
              );
              obj = {
                ...obj,
                valueAlias: _arr[0]?.alias,
                valueIfCalculateColumn: _arr[0]?.ifCalculateColumn,
              };
            }
            return obj;
          } else {
            return null;
          }
        }
      })
      .filter((ktem: any) => !!ktem);
  }
  return newQuery;
}

// 树
export const transOptions: any = (
  list: any = [],
  labelName: string = 'nodeName',
  valueName: string = 'nodeId',
  title: string = 'title',
  key: string = 'key',
  children: string = 'tagList',
  subChildren: string = 'subTagList',
  childrenName: string = 'name',
  childrenValue: string = 'id',
  showOtherKey = true,
) => {
  if (!Array.isArray(list)) {
    return [];
  }
  const treeList = list.map((item: any) => {
    return {
      ...(showOtherKey ? item : {}),
      [title]: item[labelName] || '--',
      [key]: `${item[labelName]}${item[valueName]}`,
      children: Array.isArray(item[children])
        ? transOptions(item[children], childrenName, childrenValue, title, key, subChildren)
        : [],
    };
  });

  return treeList?.map((cur: any) => {
    if (!cur[children]?.length) {
      if (cur?.field) {
        cur.children = cur?.field?.map((j: any) => {
          return {
            ...j,
            [title]: j.alias || '--',
            [key]: `field${j.id}`,
          };
        });
      }
    }
    return cur;
  });
};

//查找父节点
export function familyTree(arr1: any, id: any, idName = 'id') {
  let temp: any[] = [];
  const forFn = function (arr: any, tagId: any) {
    arr.forEach((item: any) => {
      if (item[idName] === tagId) {
        temp = item;
        return;
      } else {
        if (item.children) {
          forFn(item.children, tagId);
        }
      }
    });
  };
  forFn(arr1, id);
  return temp;
}

// 已选标签数据传参数据
export function unique(arr: any[] = []) {
  const newArr: any[] = [];
  arr.forEach((item) => {
    return newArr.includes(item.tableName) ? '' : newArr.push(item.tableName);
  });
  return newArr.map((item) => {
    const data: any[] = [];
    arr.forEach((cur) => {
      if (cur.tableName === item) {
        data.push(cur);
      }
    });
    return {
      tableName: item,
      partitions: data,
    };
  });
}

// 已选标签数据处理
export const flatTree = (list: any[]) => {
  const flatTreeData: any[] = [];
  list?.forEach((item) => {
    item?.partitions?.forEach((cur: any) => {
      flatTreeData.push({
        ...cur,
        alias: cur.alias,
        columnName: cur.dataColumn,
        columnAttributeType: cur.dataType,
        tableName: item.tableName,
        tableColumnName: item.tableColumnName || cur.tableColumnName,
      });
    });
  });
  return flatTreeData;
};

// paramJson
export const setParamJson = (list: any[], children = 'rules') => {
  const resultArr: any[] = [];
  const flat = (newList: any[], child: any) => {
    if (!newList || !newList.length) return [];
    newList.forEach((node) => {
      resultArr.push({ ...node });
      return flat(node[child], child);
    });
  };
  flat(list, children);
  return resultArr;
};

// Tag列表
export async function queryModelTagList(params?: any) {
  const { data } = await dispatchPass(API.investmentApi.queryModelTagList, params);
  return data || [];
}

// 查询业务/个人模版的列表
export async function queryModelTemplateList(params?: any) {
  const { data } = await dispatchPass(API.investmentApi.queryModelTemplateList, params);
  return data || [];
}

// 查询模板详情接口
export async function queryTemplateDetail(params?: any) {
  const { data } = await dispatchPass(API.investmentApi.queryTemplateDetail, params);
  return data || [];
}

// 保存模板详情接口
export async function saveTemplate(params?: any) {
  const res = await dispatchPass(API.investmentApi.saveTemplate, params);
  return res || {};
}

// 查询详情接口
export async function queryReport(params?: any) {
  const res = await dispatchPass(API.investmentApi.queryReport, params);
  return res || {};
}

// 删除详情接口
export async function deleteTemplate(params?: any) {
  const res = await dispatchPass(API.investmentApi.deleteTemplate, params);
  return res || {};
}

// 下拉框查询
export async function queryCompanySelect(params?: any) {
  const { data } = await dispatchPass(API.investmentApi.queryCompanySelect, params);
  return data || [];
}

// 根据基金代码查详情
export async function queryBondList(params: any) {
  const { data } = await dispatchPass(API.investmentApi.queryBondList, params);
  return data || [];
}

// 主体财务
export async function queryFinancialRepByComp(params?: any) {
  const { data } = await dispatchPass(API.investmentApi.queryFinancialRepByComp, params);
  return data || [];
}

// 详情财务
export async function queryFinancialRepByQuarter(params?: any) {
  const { data } = await dispatchPass(API.investmentApi.queryFinancialRepByQuarter, params);
  return data || [];
}

// 基本信息
export async function queryCompInfoByCompId(params?: any) {
  const { data } = await dispatchPass(API.investmentApi.queryCompInfoByCompId, params);
  return data || [];
}

// 时间
export async function queryQuarterList(params?: any) {
  const { data } = await dispatchPass(API.investmentApi.queryQuarterList, params);
  return data || [];
}

// 查询当前时间的上一个工作日(大陆工作日)
export async function queryLastWkDayByNow(params?: any) {
  const { data } = await dispatchPass(API.investmentApi.queryLastWkDayByNow, params);
  return data || '';
}
