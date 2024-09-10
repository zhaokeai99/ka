import { ProCard } from '@ant-design/pro-components';
import { Input, Tooltip, Tree, message, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { EditOutlined, SwapOutlined } from '@ant-design/icons';
import './index.less';
import { updateSortCols } from '../service';

const { Search } = Input;

// 取父节点key值
const getParentKey = (key: React.Key, tree: any[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: { key: React.Key }) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

// dataList 模糊搜索list
const dataList: { key: React.Key; title: any }[] = [];
const generateList = (data: any[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, title } = node;
    dataList.push({ key, title });
    if (node.children) {
      generateList(node.children);
    }
  }
};

const LeftTree = ({ getEditItem, type, defaultData }: any) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [gData, setGData] = useState(defaultData);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [style] = useState<any>({
    fontSize: '12px',
    lineHeight: '24px',
    float: 'right',
    padding: '0 2px',
  });

  //展开收起
  const onExpand: any = (newExpandedKeys: string[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  // 搜索
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item: any) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, defaultData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  // 排序
  const onDrop = async (info: {
    node: { key: any; pos: string };
    dragNode: { key: any; pos: string };
    dropPosition: number;
    dropToGap: any;
  }) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dragPos = info.dragNode.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    if (dropPosition === 0) {
      dropPos.push('0');
    }
    if (dragPos.length !== dropPos.length) {
      message.warn('只允许同级项进行排序。（1级到1级、2级到2级）');
      return;
    }

    const loop = (
      data: any[],
      key: React.Key,
      callback: (node: any, i: number, data: any[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const newData = [...gData];

    let dragObj: any;
    loop(newData, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(newData, dropKey, (item) => {
        item.children = item.children || [];
        //示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length &&
      (info.node as any).props.expanded &&
      dropPosition === 1
    ) {
      loop(newData, dropKey, (item) => {
        item.children = item.children || [];
        //示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar: any[] = [];
      let i: number;
      loop(newData, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }

    // 更新结构
    setLoading(true);
    const result = await updateSortCols({
      searcherType: type,
      list: newData,
    });

    if (result) {
      setGData(newData);
    }
    setLoading(false);
  };

  // 初始化辅助数据
  useEffect(() => {
    generateList(defaultData);
    setGData(defaultData);
  }, [defaultData]);

  useEffect(() => {
    const loop = (data: any[], deep = 0): any[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);

        const title =
          index > -1 ? (
            <span key={item.key}>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
              {deep !== 0 && (
                <Tooltip title="编辑">
                  <EditOutlined
                    onClick={() => {
                      getEditItem(item);
                    }}
                    className="swapHover"
                    style={style}
                  />
                </Tooltip>
              )}
              <Tooltip title="拖动">
                <SwapOutlined className="swapHover" style={style} rotate={90} />
              </Tooltip>
            </span>
          ) : (
            <span>{strTitle}</span>
          );

        if (item.children) {
          return { title, key: item.key, children: loop(item.children, deep + 1) };
        }

        return {
          title,
          key: item.key,
        };
      });
    setGData(loop(defaultData));
  }, [searchValue, defaultData, style, getEditItem]);

  return (
    <ProCard style={{ padding: '0 12px' }} className="treeList" ghost colSpan="30%">
      <Search style={{ marginBottom: 8 }} placeholder="搜索" onChange={onChange} />
      <Spin spinning={loading}>
        <Tree
          onExpand={onExpand}
          draggable={{
            icon: false,
          }}
          blockNode
          showLine
          onDrop={onDrop}
          height={550}
          style={{ minHeight: '550px' }}
          defaultExpandedKeys={expandedKeys}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={gData}
        />
      </Spin>
    </ProCard>
  );
};
export default LeftTree;
