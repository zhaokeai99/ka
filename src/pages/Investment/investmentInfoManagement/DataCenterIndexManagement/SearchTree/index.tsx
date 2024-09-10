import ProCardPlus from '@/components/ProCardPlus';
import { Input, Tree, Spin, Tabs, Table } from 'antd';
import React, { memo, useEffect, useImperativeHandle, useState } from 'react';
import {
  IndexDataInfoFacadeQueryIndexTypeInfo,
  IndustryTemplateInfoFacadeQueryTemplateInfo,
} from '../service';
import { SearchOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';

type PropsType = {
  colSpan: number | string;
  onSelect: (val: any) => void;
  clientHeight: number;
  onShowTypeChange: (type: string) => void;
  onCheckRow: (id: any) => void;
  onTabsClick?: (val: any) => void;
  cRef?: any;
};

const { TabPane } = Tabs;

const SearchTreeView = (props: PropsType) => {
  const { colSpan, onSelect, clientHeight, onShowTypeChange, onCheckRow, onTabsClick, cRef } =
    props;
  const { initialState } = useModel('@@initialState');

  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [treeLoading, setTreeLoading] = useState(true);
  const [treeList, setTreeList] = useState<any[]>([]);
  const [treeSelected, setSelectedChecked] = useState<any[]>(['0_Label']);
  const [dataList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [myTemplateData, setMyTemplateData] = useState<any>([]);
  const [allLoading, setAllLoading] = useState<boolean>(false);
  const [allTemplateData, setAllTemplateData] = useState<any>([]);
  const [checkRowId, setCheckRowId] = useState<any>(undefined);

  const [tabCheckType, setTabCheckType] = useState<any>(undefined);

  // 股票标签列表树
  const queryTreeList = async () => {
    setTreeLoading(true);
    let treeData = [];

    const params = {};
    const resultData = await IndexDataInfoFacadeQueryIndexTypeInfo(params);
    treeData = resultData || [];
    setTreeList(treeData);

    setTreeLoading(false);
  };

  //账号变更
  useEffect(() => {
    queryTreeList();
  }, []);

  const generateList = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { indexHierCode, indexHierName, pinyin } = node;
      dataList.push({ indexHierCode, indexHierName, pinyin });
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
        if (node.children.some((item: any) => item?.indexHierName === value)) {
          parentKey = node.indexHierCode;
        } else if (node.children.some((item: any) => item?.indexHierCode === value)) {
          parentKey = node.indexHierCode;
        } else if (node.children.some((item: any) => item?.pinyin === value)) {
          parentKey = node.indexHierCode;
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
      setExpandedKeys([]);
      setAutoExpandParent(true);
      return;
    }
    const newExpandedKeys = dataList
      .map((item: any) => {
        if (item?.indexHierCode?.indexOf(value) > -1) {
          return getParentKey(item.indexHierCode, treeList);
        }
        if (item?.indexHierName?.indexOf(value) > -1) {
          return getParentKey(item.indexHierName, treeList);
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

  const loop = (data: any) => {
    const d = data?.map((item: any) => {
      const strIndexHierCodeTitle = item.indexHierCode;
      const strIndexHierNameTitle = item.indexHierName;
      const strPinyinTitle = item.pinyin;

      const indexCode = strIndexHierCodeTitle?.indexOf(searchValue);
      const indexName = strIndexHierNameTitle?.indexOf(searchValue);
      const indexPinyin = strPinyinTitle?.indexOf(searchValue);
      const title =
        searchValue && (indexCode > -1 || indexName > -1 || indexPinyin > -1) ? (
          <span>
            <span style={{ color: '#f50' }}>{item.indexHierName}</span>
          </span>
        ) : (
          <span>{item.indexHierName}</span>
        );
      if (item.children) {
        return {
          ...item,
          title,
          key: item.indexHierCode,
          itemTitle: item.indexHierName,
          children: loop(item.children),
          level: item.level, // 层级
        };
      }
      return {
        ...item,
        title,
        key: item.indexHierCode,
        itemTitle: item.indexHierName,
        level: item.level, // 层级
      };
    });
    return d;
  };

  //我的方案
  const myColumns = [
    {
      title: '模版名称',
      dataIndex: 'templateName',
    },
  ];

  const myRowsClick = (record: any) => {
    setCheckRowId(record.id);
    onCheckRow(record.id);
  };

  const allRowsClick = (record: any) => {
    setCheckRowId(record.id);
    onCheckRow(record.id);
  };

  const queryMyTemplateDataList = async () => {
    if (initialState?.userName) {
      setLoading(true);
      const params = { isUsed: 0, creator: initialState?.userName };
      const data = await IndustryTemplateInfoFacadeQueryTemplateInfo(params);
      setMyTemplateData(data);
      setLoading(false);
    } else {
      setMyTemplateData([]);
    }
  };

  const queryAllTemplateDataList = async () => {
    if (initialState?.userName) {
      setAllLoading(true);
      const params = { isUsed: 0 };
      const data = await IndustryTemplateInfoFacadeQueryTemplateInfo(params);
      setAllTemplateData(data);
      setAllLoading(false);
    } else {
      setAllTemplateData([]);
    }
  };

  const tabClick = (key: string) => {
    setTabCheckType(key);
    onTabsClick?.(key);
    if (key === 'myTemp') {
      queryMyTemplateDataList();
      onShowTypeChange('view');
    } else if (key === 'allTemp') {
      queryAllTemplateDataList();
      onShowTypeChange('view');
    } else {
      onShowTypeChange('edit');
    }
    setCheckRowId(undefined);
  };

  //指定查询
  useImperativeHandle(cRef, () => ({
    dataRefresh: () => {
      if (tabCheckType === 'myTemp') {
        queryMyTemplateDataList();
      } else if (tabCheckType === 'allTemp') {
        queryAllTemplateDataList();
      }
    },
  }));

  return (
    <ProCardPlus colSpan={colSpan} style={{ height: clientHeight }}>
      <div>
        <Input
          style={{ marginBottom: 8, width: 210 }}
          placeholder="搜索"
          onChange={treeSearch}
          suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
        />
      </div>
      <Tabs size={'small'} tabBarGutter={17} onTabClick={tabClick}>
        <TabPane tab="行业数据" key="tree">
          <Spin spinning={treeLoading}>
            {treeList?.length > 0 && (
              <Tree
                height={clientHeight - 40 - 38 - 16 - 24}
                onExpand={onExpand}
                selectedKeys={treeSelected}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                treeData={loop(treeList)}
                onSelect={(selectedKeys: any[], options: any) => {
                  onSelect({ indexHierCode: selectedKeys[0], options: options });
                  setSelectedChecked(selectedKeys);
                }}
              />
            )}
          </Spin>
        </TabPane>
        <TabPane tab="我的方案" key="myTemp">
          <Table
            rowKey={'id'}
            columns={myColumns}
            dataSource={myTemplateData}
            pagination={false}
            loading={loading}
            size={'small'}
            showHeader={false}
            onRow={(record) => {
              return {
                onClick: () => myRowsClick(record),
              };
            }}
          />
        </TabPane>
        <TabPane tab="全部方案" key="allTemp">
          <Table
            rowKey={'id'}
            rowClassName={(record: any) =>
              record.id === checkRowId ? 'ant-table-row-selected' : ''
            }
            columns={myColumns}
            dataSource={allTemplateData}
            pagination={false}
            loading={allLoading}
            size={'small'}
            showHeader={false}
            onRow={(record) => {
              return {
                onClick: () => allRowsClick(record),
              };
            }}
          />
        </TabPane>
      </Tabs>
    </ProCardPlus>
  );
};

export default memo(SearchTreeView);
