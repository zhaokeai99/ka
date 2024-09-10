import { Button, Table } from 'antd';
import React, { memo, useEffect, useImperativeHandle, useState } from 'react';
import IndexEditForm from '@/pages/Investment/BackEndManagement/DataSyncTaskManagement/components/indexEditForm';
import lodash from 'lodash';

interface ModalProps {
  columnList: any[];
  sourceDataList: any[];
  cRef: any;
}

const IndexTableInfo = (props: ModalProps) => {
  const { columnList, sourceDataList, cRef } = props;
  const [dataList, setDataList] = useState<any[]>([]);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [editInfo, setEditInfo] = useState<any>({});

  const editItem = (record: any) => {
    setEditInfo(record);
    setEditVisible(true);
  };

  const deleteItem = (record: any) => {
    const data: any = [];
    dataList.forEach((d) => {
      if (d.columnName === record.columnName) {
        data.push({ columnName: d.columnName });
      } else {
        data.push(d);
      }
    });
    setDataList(data);
  };

  const columns = [
    {
      title: '原表字段',
      width: 200,
      dataIndex: 'columnName',
    },
    {
      title: '索引字段',
      width: 200,
      dataIndex: 'mappingName',
    },
    {
      title: '索引类型',
      width: 200,
      dataIndex: 'mappingType',
    },
    {
      title: '扩展字段',
      dataIndex: 'mappingExpand',
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 150,
      render: (text: string, record: any) => {
        return (
          <>
            <Button type="link" onClick={() => editItem(record)}>
              编辑
            </Button>
            <Button type="link" onClick={() => deleteItem(record)}>
              删除
            </Button>
          </>
        );
      },
    },
  ];

  const getTableInfo = () => {
    return dataList;
  };

  useEffect(() => {
    const data: any = [];
    columnList.map((col) => {
      const obj = lodash.find(sourceDataList, { columnName: col });
      if (obj === undefined) {
        const d = {
          columnName: col,
        };
        data.push(d);
      } else {
        data.push(obj);
      }
    });
    setDataList(data);
    // setDataList(sourceDataList);
  }, [columnList, sourceDataList]);

  useImperativeHandle(cRef, () => ({
    getTableInfo: () => {
      return getTableInfo();
    },
  }));

  const finishInfo = (info: any) => {
    const tmp: any = [];
    dataList.forEach((d) => {
      if (d.columnName === info.columnName) {
        tmp.push(info);
      } else {
        tmp.push(d);
      }
    });
    setDataList([...tmp]);
    setEditVisible(false);
  };

  const cancelForm = () => {
    setEditVisible(false);
  };

  return (
    <>
      <Table size={'small'} columns={columns} dataSource={dataList} pagination={false} />
      <IndexEditForm
        visible={editVisible}
        initForm={editInfo}
        onFinish={finishInfo}
        onCancel={cancelForm}
      />
    </>
  );
};

export default memo(IndexTableInfo);
