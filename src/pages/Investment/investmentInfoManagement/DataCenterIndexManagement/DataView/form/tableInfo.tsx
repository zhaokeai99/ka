import ProCardPlus from '@/components/ProCardPlus';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from '../index.less';

type PropsType = {
  clientHeight: number;
  dataList: any[];
  tableData: any[];
};

/**
 * 表格数据
 * @param props
 * @constructor
 */
const TableData = (props: PropsType) => {
  const { clientHeight, dataList, tableData } = props;
  const [columns, setColumns] = useState<any>([]);

  const getColumns = () => {
    const cols: any = [
      {
        title: '日期',
        dataIndex: 'date',
        align: 'center',
      },
    ];
    if (dataList) {
      dataList.map((n: any) => {
        cols.push({
          title: n.indexName,
          dataIndex: n.indexCode,
          align: 'right',
          className: 'head-center',
        });
      });
    }
    setColumns(cols);
  };

  useEffect(() => {
    getColumns();
  }, [dataList]);

  return (
    <ProCardPlus style={{ height: clientHeight, width: '100%' }}>
      <Table
        className={styles['table-style']}
        rowKey={'indexCode'}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        size={'small'}
        scroll={{ y: clientHeight - 60 }}
      />
    </ProCardPlus>
  );
};

export default TableData;
