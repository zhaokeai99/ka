import ProCardPlus from '@/components/ProCardPlus';
import { Table } from 'antd';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { IndexDataInfoFacadeQueryMasterInfo } from '../service';
import _ from 'lodash';
import styles from './index.less';

type PropsType = {
  code: any;
  onSelect: (select: boolean, record: any) => void;
  clientHeight: number;
  checkData: any[];
  cRef: any;
};

const getIds = (data: any) => {
  return data.map((n) => n.indexCode);
};

const SearchTree = (props: PropsType) => {
  const { code, onSelect, cRef, clientHeight, checkData } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 股票标签列表树
  const queryList = async (codeValue: string) => {
    setLoading(true);

    const params = { indexHierTag: codeValue };
    const resultData = await IndexDataInfoFacadeQueryMasterInfo(params);
    const treeData = resultData || [];
    setDataList(treeData);
    setLoading(false);
    setSelectedRowKeys(getIds(checkData));
  };

  useEffect(() => {
    console.log('checkData.useEffect', checkData);
  }, [checkData]);

  //账号变更
  useEffect(() => {
    if (code !== undefined && code.indexHierCode !== undefined) {
      queryList(code.indexHierCode);
    }
  }, [code]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'indexName',
      width: '170px',
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onTableSelect = (record: any, select: boolean) => {
    onSelect(select, record);
  };

  const rowSelection = {
    columnWidth: '40px',
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: onTableSelect,
  };

  const rowClick = (record: any) => {
    if (selectedRowKeys.indexOf(record.indexCode) < 0) {
      setSelectedRowKeys([...selectedRowKeys, record.indexCode]);
      onSelect(true, record);
    } else {
      _.remove(selectedRowKeys, (n) => {
        return n === record.indexCode;
      });
      setSelectedRowKeys([...selectedRowKeys]);
      onSelect(false, record);
    }
  };

  const removeChangeKey = (target: any) => {
    _.remove(selectedRowKeys, (key: any) => {
      return key === target.indexCode;
    });
    // console.log('selectedRowKeys', tmp, selectedRowKeys);
    setSelectedRowKeys([...selectedRowKeys]);
  };
  //指定查询
  useImperativeHandle(cRef, () => ({
    removeKey: (obj: any) => {
      removeChangeKey(obj);
    },
    refresh: () => {
      queryList(code.indexHierCode);
    },
  }));

  return (
    <ProCardPlus style={{ height: clientHeight }}>
      <div>{code ? code.indexHierName : ''}</div>
      <Table
        rowKey={'indexCode'}
        rowClassName={styles['table-row-choose']}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataList}
        pagination={false}
        loading={loading}
        size={'small'}
        showHeader={false}
        className={styles['table-check']}
        scroll={{ y: clientHeight - 60, x: 'hidden' }}
        onRow={(record) => {
          return {
            onClick: () => rowClick(record),
          };
        }}
      />
    </ProCardPlus>
  );
};

SearchTree.isProCard = true;

export default SearchTree;
