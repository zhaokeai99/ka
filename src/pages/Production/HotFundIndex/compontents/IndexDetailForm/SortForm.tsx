import React, { useState, memo, useEffect } from 'react';
import { TreeSelect } from 'antd';
import { find as _find, difference as _difference } from 'lodash';
import { queryEtfSortSys, querySysNodeList } from '../../service';

const transOptions: any = (list, rootid) => {
  if (!Array.isArray(list)) {
    return [];
  }
  return list.map((item: any) => {
    return {
      label: item.title || '--',
      value: rootid + '-' + item.key,
      ...(item.children ? { key: item.id } : {}),
      children: Array.isArray(item.children) ? transOptions(item.children, rootid) : [],
    };
  });
};
const { TreeNode } = TreeSelect;
const NumberPlus: React.FC<any> = ({ value: valueList, onChange }) => {
  const [treeData, setTreeData] = useState([]);
  // 记录打开的ids 用于点击是展开还是收起
  const [expandids, setexpandids] = useState([]);
  const [checkedKey, setCheckedKey] = useState('');

  // 获取指数行业分类
  const getFetchIndexSortSys = async () => {
    const data = await queryEtfSortSys({ securitiesType: 'FUND' });
    // 指数行业分类置为不可选中
    const options = data.map((i: any) => {
      return { ...i, label: i.name, value: `root${i.id}`, isRoot: true };
    });
    setTreeData(options);
  };

  const querySysNodeTree = async (rootid) => {
    const data = await querySysNodeList({ id: rootid });
    const cT = _find(treeData, (i) => i.value === `root${rootid}`);
    if (cT) {
      cT.children = transOptions(data, rootid);
    }
    setTreeData([...treeData]);
  };

  useEffect(() => {
    if (!valueList || valueList.length <= 0 || treeData.length <= 0) return;
    const rootIds = valueList.map((i) => i.sysId);
    const treeIds = valueList.map((i) => i.nodeId);
    rootIds.forEach((id) => {
      querySysNodeTree(id);
    });
    if (treeIds && treeIds.length >= 1 && rootIds && rootIds.length >= 1) {
      setCheckedKey(`${rootIds[0]}-${treeIds[0]}`);
    }
  }, [valueList]);

  useEffect(() => {
    getFetchIndexSortSys();
  }, []);

  const hanleChange = (value) => {
    // setCheckedKey(value)
    const [sysId, nodeId] = value.split('-');
    onChange([{ sysId, nodeId }]);
  };

  const expandTree = (ids) => {
    if (ids.length > expandids.length) {
      const [id] = _difference(ids, expandids);
      if (id.substr(0, 4) === 'root') {
        querySysNodeTree(id.replace('root', ''));
      }
    }
    setexpandids(ids);
  };

  const getTreeNodeList = (data) => {
    return data.map((treeItem) => {
      const { children, label, value, isRoot } = treeItem;
      // 根节点
      if (isRoot) {
        return (
          <TreeNode isLeaf={false} value={value} title={label} selectable={false}>
            {getTreeNodeList(treeItem.children || [])}
          </TreeNode>
        );
      }
      // 中间节点
      if (children && children.length >= 1) {
        return (
          <TreeNode value={value} title={label}>
            {getTreeNodeList(treeItem.children)}
          </TreeNode>
        );
      }
      // 叶节点
      return <TreeNode value={value} title={label} />;
    });
  };

  return (
    <TreeSelect
      multiple={false}
      onChange={(value, label, extra) => hanleChange(value, label, extra)}
      onTreeExpand={(value) => expandTree(value)}
      defaultValue={checkedKey}
    >
      {getTreeNodeList(treeData)}
    </TreeSelect>
  );
};

export default memo(NumberPlus);
