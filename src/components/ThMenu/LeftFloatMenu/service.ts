import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 一维数组转换成树 假如用户菜单第一级就n个，就平铺
export function arrayToTree(arr) {
  if (!arr || arr.length <= 0) {
    return [];
  }
  const map = {};
  const firstLevel = [];
  for (const iterator of arr) {
    map[iterator['id']] = iterator;
    iterator.hasPriv = true;
    iterator.path = iterator.url;
  }
  for (const iterator of arr) {
    const key = iterator['pid'];
    if (!(key in map)) {
      firstLevel.push(iterator);
      continue;
    }
    map[key].children = (map[key].children || []).concat(iterator);
  }
  return firstLevel;
}

// 获取产品分布
export async function getPersonalMenu() {
  const result = await dispatchPass(API.getPersonalMenu, {});
  return result;
}
