import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, message } from 'antd';
import { queryContactsByType, saveContcat, updateContcat, deleteContact } from '../../service';

type DataSourceType = {
  id: React.Key;
};

type ModulProps = {
  tabKey: string;
  partColumns: any;
};

export default (props: ModulProps) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [isAdd, setIsAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const actionRef = useRef<ActionType>();

  const { tabKey, partColumns } = props;

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 200,
      render: (text, record: any, _, action) => [
        <a
          key="editable"
          onClick={() => {
            setIsAdd(false);
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          placement="topLeft"
          title={'您确定要删除吗?'}
          onConfirm={async () => {
            setLoading(true);
            const result = await deleteContact({ dataType: record.dataType, id: record.id });
            setLoading(false);
            if (result) {
              actionRef?.current?.reload();
              message.success('删除成功');
              return;
            }
            message.error('删除失败');
          }}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link">删除</Button>
        </Popconfirm>,
      ],
    },
  ];
  columns.unshift(...partColumns);

  const onSave = useCallback(
    async (rowKey, data: any) => {
      setLoading(true);
      if (isAdd) {
        // 新增
        const result = await saveContcat({ dataType: tabKey, content: data });
        setLoading(false);
        actionRef?.current?.reload();
        if (result) {
          message.success('添加成功');
          return;
        }
        message.error('添加失败');
      } else {
        // 更新
        const result = await updateContcat({ dataType: tabKey, content: data, id: data.id || '' });
        setLoading(false);
        actionRef?.current?.reload();
        if (result) {
          message.success('更新成功');
          return;
        }
        message.error('更新失败');
      }
    },
    [isAdd],
  );

  const parseJSONSafely = (str: string) => {
    try {
      return JSON.parse(str);
    } catch (error) {
      return {};
    }
  };

  const getData = useCallback(async (params) => {
    setLoading(true);
    const res = await queryContactsByType({ dataType: tabKey, ...params });
    setLoading(false);
    const dealData = (res || []).map((item: any) => {
      return {
        ...parseJSONSafely(item.content),
        dataType: item.dataType,
        id: item.id,
        key: item.id,
      };
    });
    return {
      data: dealData,
      success: true,
    };
  }, []);

  const toolBarRender = useMemo(() => {
    return [
      <Button
        type="primary"
        onClick={() => {
          setIsAdd(true);
          actionRef.current?.addEditRecord?.({
            id: (Math.random() * 1000000).toFixed(0),
          });
        }}
        icon={<PlusOutlined />}
      >
        新建一行
      </Button>,
    ];
  }, []);

  return (
    <>
      <EditableProTable<DataSourceType>
        headerTitle="信息管理"
        actionRef={actionRef}
        rowKey="id"
        maxLength={5}
        scroll={{ x: 'max-content', y: 600 }}
        recordCreatorProps={false}
        toolBarRender={() => toolBarRender}
        loading={loading}
        columns={columns}
        request={getData}
        search={{ labelWidth: 'auto' }}
        options={{ reload: true, setting: false }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave,
          onChange: setEditableRowKeys,
        }}
      />
    </>
  );
};
