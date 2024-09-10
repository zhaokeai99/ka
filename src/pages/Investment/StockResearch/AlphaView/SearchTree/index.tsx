import ProCardPlus from '@/components/ProCardPlus';
import { Input, Tree, Spin, Button } from 'antd';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import style from './index.less';
import {
  IrReportFacadeQueryIrStockTreeByUserName,
  IrReportFacadeQueryIrStockTree,
} from './service';
import { MenuFoldOutlined, SearchOutlined } from '@ant-design/icons';
import Icons from './icons';
import lodash from 'lodash';

type PropsType = {
  colSpan: number | string;
  userAccount: string;
  onSelect: (val: any) => void;
  show: boolean;
  onTrigger: () => void;
  clientHeight: number;
  beginDate: string;
  cRef: any;
};

const checkDefault = ['0_Label', ''];

const getTreeKey = (parentId: any, key: any) => {
  return parentId + '_' + key;
};

const SearchTree = (props: PropsType) => {
  const { colSpan, onSelect, userAccount, show, onTrigger, clientHeight, beginDate, cRef } = props;

  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [treeLoading, setTreeLoading] = useState(true);
  const [treeList, setTreeList] = useState<any[]>([]);
  const [treeSelected, setSelectedChecked] = useState<any[]>(['0_Label']);
  const [dataList] = useState<any[]>([]);

  const expendTreeNodeAll = (data: any) => {
    const newExpend: any = [];
    data?.map((d: any) => {
      if (d.children !== undefined && d.children?.length > 0) {
        newExpend.push(...expendTreeNodeAll(d.children));
      } else {
        newExpend.push(getTreeKey(d.parentId, d.stockCode));
      }
    });
    return newExpend;
  };

  //展开全部树
  const expendTreeAll = (data: any) => {
    setExpandedKeys(expendTreeNodeAll(data));
    setAutoExpandParent(true);
  };
  //展开全部树
  const closeTreeAll = () => {
    setExpandedKeys([]);
    setAutoExpandParent(true);
  };

  //树是否选中
  const checkTree = (treeData: any, value: any): boolean => {
    let success = false;
    for (let i = 0; i < treeData.length; i++) {
      const tree = treeData[i];
      const tree_id = getTreeKey(tree.parentId, tree.stockCode);
      if (tree_id === value) {
        setSelectedChecked([tree_id]);
        onSelect({ stockCode: tree_id, options: { node: tree } });
        success = true;
        break;
      } else if (tree.children && tree.children.length > 0) {
        success = checkTree(tree.children, value);
        if (success) {
          break;
        }
      }
    }
    return success;
  };

  // 股票标签列表树
  const queryTreeList = async (check?: any) => {
    setTreeLoading(true);
    let treeData = [];
    if (userAccount === 'all') {
      const params = { beginDate };
      const resultData = await IrReportFacadeQueryIrStockTree(params);
      treeData = resultData || [];
      setTreeList(treeData);
      // expendTreeAll(treeData);
    } else {
      const params = { userName: userAccount, beginDate };
      const resultData = await IrReportFacadeQueryIrStockTreeByUserName(params);
      treeData = resultData || [];
      setTreeList(treeData);
      // expendTreeAll(treeData);
    }
    //处理选择tree
    if (check) {
      for (let i = 0; i < check.length; i++) {
        const value = check[i];
        const result = checkTree(treeData, value);
        if (result) {
          break;
        }
      }
    } else {
      let successCheck = false;
      for (let i = 0; i < treeSelected.length; i++) {
        const value = treeSelected[i];
        const result = checkTree(treeData, value);
        if (result) {
          successCheck = true;
          break;
        }
      }
      if (!successCheck) {
        for (let i = 0; i < checkDefault.length; i++) {
          const value = checkDefault[i];
          const result = checkTree(treeData, value);
          if (result) {
            break;
          }
        }
      }
    }

    setTreeLoading(false);
  };

  //账号变更
  useEffect(() => {
    queryTreeList(checkDefault);
  }, [userAccount]);

  //时间变更
  useEffect(() => {
    queryTreeList();
  }, [beginDate]);

  const generateList = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { stockCode, stockName, pinyin } = node;
      dataList.push({ stockCode, stockName, pinyin });
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  useEffect(() => {
    generateList(treeList);
  }, [treeList]);

  const getParentKey: any = (value: any, tree: any) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: any) => item?.stockName === value)) {
          parentKey = getTreeKey(node.parentId, node.stockCode);
        } else if (node.children.some((item: any) => item?.stockCode === value)) {
          parentKey = getTreeKey(node.parentId, node.stockCode);
        } else if (node.children.some((item: any) => item?.pinyin === value)) {
          parentKey = getTreeKey(node.parentId, node.stockCode);
        } else if (getParentKey(value, node.children)) {
          parentKey = getParentKey(value, node.children);
        }
      }
    }
    return parentKey;
  };

  const onExpand = (newExpandedKeys: any) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  // 搜索
  const treeSearch = (e: any) => {
    let value = e?.target?.value;
    if (value === undefined) {
      value = e;
    }
    if (value === undefined || value === '') {
      setSearchValue('');
      setExpandedKeys(expendTreeNodeAll(treeList));
      setAutoExpandParent(true);
      return;
    }
    const newExpandedKeys = dataList
      .map((item: any) => {
        if (item?.stockCode?.indexOf(value) > -1) {
          return getParentKey(item.stockCode, treeList);
        }
        if (item?.stockName?.indexOf(value) > -1) {
          return getParentKey(item.stockName, treeList);
        }
        if (item?.pinyin?.indexOf(value) > -1) {
          return getParentKey(item.pinyin, treeList);
        }
        return null;
      })
      .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const getStockCodeByKey = (key: any) => {
    if (key === undefined) {
      return undefined;
    }
    const values = key.split('_');
    return values[values.length - 1];
  };

  const loop = (data: any) => {
    return data?.map((item: any) => {
      const strStockCodeTitle = item.stockCode;
      const strStockNameTitle = item.stockName;
      const strPinyinTitle = item.pinyin;

      const indexCode = strStockCodeTitle?.indexOf(searchValue);
      const indexName = strStockNameTitle?.indexOf(searchValue);
      const indexPinyin = strPinyinTitle?.indexOf(searchValue);
      const title =
        searchValue && (indexCode > -1 || indexName > -1 || indexPinyin > -1) ? (
          <span>
            <span style={{ color: '#f50' }}>{item.stockName}</span>
          </span>
        ) : (
          <span>{item.stockName}</span>
        );
      if (item.children) {
        return {
          ...item,
          title,
          key: getTreeKey(item.parentId, item.stockCode),
          itemTitle: item.stockName,
          children: loop(item.children),
          level: item.level, // 层级
        };
      }
      return {
        ...item,
        title,
        key: getTreeKey(item.parentId, item.stockCode),
        itemTitle: item.stockName,
        level: item.level, // 层级
      };
    });
  };

  const setTreeValueAll = () => {
    setSelectedChecked(['0_']);
    // onSelect({ stockCode: getStockCodeByKey('0_'), options: options });
    console.log('tree.setAll');
    const allObj = lodash.find(treeList, { stockName: '全部' });
    onSelect({ stockCode: getStockCodeByKey('0_'), options: { node: allObj } });
  };
  //指定查询
  useImperativeHandle(cRef, () => ({
    setAll: () => {
      setTreeValueAll();
    },
  }));

  return (
    <ProCardPlus colSpan={colSpan} style={{ height: clientHeight }}>
      <div style={show ? {} : { display: 'none' }}>
        <Input
          style={{ marginBottom: 8, width: 178 }}
          placeholder="搜索"
          onChange={treeSearch}
          suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
        />
        <Button
          onClick={onTrigger}
          className={style['search-button']}
          icon={<MenuFoldOutlined />}
        />
      </div>
      <div style={{ textAlign: 'right' }}>
        <Button
          onClick={() => expendTreeAll(treeList)}
          className={style['search-button']}
          icon={Icons.exportIcon}
        />
        <Button onClick={closeTreeAll} className={style['search-button']} icon={Icons.closeIcon} />
      </div>
      <Spin spinning={treeLoading}>
        {treeList?.length > 0 && (
          <Tree
            style={show ? {} : { display: 'none' }}
            height={clientHeight - 96}
            onExpand={onExpand}
            selectedKeys={treeSelected}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={loop(treeList)}
            onSelect={(selectedKeys: any[], options: any) => {
              console.log('tree.select', selectedKeys, options);
              onSelect({ stockCode: getStockCodeByKey(selectedKeys[0]), options: options });
              setSelectedChecked(selectedKeys);
            }}
          />
        )}
      </Spin>
    </ProCardPlus>
  );
};

SearchTree.isProCard = true;

export default SearchTree;
