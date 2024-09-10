import ProCardPlus from '@/components/ProCardPlus';
import { EditableProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Form, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { queryAbnormalPushList, updateAbnormalPush } from '../../service';

type DataSourceType = {
  abnormalUrl: string | undefined;
  id: React.Key;
  abnormalReason?: string;
  abnormalType?: string;
  bizDate?: string;
  indexName?: string;
  indexSource?: string;
  indexTime?: string;
  industryId?: string;
  industryName?: string;
  needPush?: string;
  nodeName: string;
  suggest?: string;
};

const MoveIndex = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [list, setList] = useState<DataSourceType[]>(() => []); // table数组
  const [dataSource, setDataSource] = useState<DataSourceType[]>(() => []);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const getList = async () => {
    setLoading(true);

    const { success, data } = (await queryAbnormalPushList({ queryType: 'index' })) || {};

    if (success) {
      setList(data);
    }

    setLoading(false);
  };

  // 更新
  const putUpdateList = async () => {
    if (!dataSource?.length) return;

    setUpdateLoading(true);

    const { success } =
      (await updateAbnormalPush({ queryType: 'index', updateList: dataSource })) || {};

    if (success) {
      message.success('修改成功');
      setEditableRowKeys([]);
      getList();
    }

    setUpdateLoading(false);
  };

  // 获取table数据
  useEffect(() => {
    getList();
  }, []);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'industry_name',
      dataIndex: 'industryName',
      key: 'industryName',
      readonly: true,
      width: 100,
      ellipsis: true,
    },
    {
      title: 'biz_date',
      key: 'bizDate',
      dataIndex: 'bizDate',
      readonly: true,
      width: 80,
    },
    {
      title: 'abnormal_type',
      key: 'abnormalType',
      dataIndex: 'abnormalType',
      readonly: true,
      width: 100,
    },
    {
      title: 'abnormal_reason',
      key: 'abnormalReason',
      dataIndex: 'abnormalReason',
      readonly: true,
      width: 300,
      ellipsis: true,
    },
    {
      title: 'index_time',
      key: 'indexTime',
      dataIndex: 'indexTime',
      readonly: true,
      width: 80,
    },
    {
      title: 'index_name',
      key: 'indexName',
      dataIndex: 'indexName',
      readonly: true,
      ellipsis: true,
      width: 110,
    },
    {
      title: 'index_source',
      key: 'indexSource',
      dataIndex: 'indexSource',
      readonly: true,
      width: 160,
      ellipsis: true,
    },
    {
      title: 'node_name',
      key: 'nodeName',
      dataIndex: 'nodeName',
      readonly: true,
      width: 80,
    },
    {
      title: 'abnormal_url',
      key: 'abnormalUrl',
      dataIndex: 'abnormalUrl',
      readonly: true,
      width: 90,
      ellipsis: true,
      render: (_, row) => (
        <a target="__block" href={row?.abnormalUrl}>
          舆情详情
        </a>
      ),
    },
    {
      title: 'suggest',
      key: 'suggest',
      dataIndex: 'suggest',
      fixed: 'right',
      width: 220,
    },
    {
      title: 'need_push',
      key: 'needPush',
      dataIndex: 'needPush',
      valueType: 'select',
      width: 80,
      fixed: 'right',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      valueEnum: {
        '0': {
          text: '不推送',
          status: 'Error',
        },
        '1': {
          text: '推送',
          status: 'Success',
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 40,
      fixed: 'right',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record?.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  return (
    <ProCardPlus
      size="small"
      title="异动指标"
      bodyStyle={{ padding: 0 }}
      extra={
        <Space>
          <Button
            type="primary"
            key="save"
            size="small"
            loading={updateLoading}
            onClick={async () => {
              await form.validateFields();
              putUpdateList();
            }}
          >
            保存
          </Button>
          <Button
            key="rest"
            size="small"
            onClick={() => {
              form?.resetFields();
              setDataSource([]);
            }}
          >
            重置
          </Button>
        </Space>
      }
    >
      <EditableProTable<DataSourceType>
        rowKey="id"
        size="small"
        loading={loading}
        columns={columns}
        value={list}
        scroll={{
          x: 1900,
          y: 300,
        }}
        recordCreatorProps={false}
        editable={{
          form,
          type: 'multiple',
          editableKeys,
          onValuesChange: (record) => {
            // dataSource为修改的行的数组，如果已经修改过的，直接替换，如果没有修改过，则直接push
            if (dataSource.filter((item) => item?.id === record?.id).length) {
              const updateList = dataSource?.map((item) =>
                item?.id === record?.id ? record : item,
              );

              setDataSource(updateList);
            } else {
              setDataSource([...dataSource, record]);
            }
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.cancel],
        }}
      />
    </ProCardPlus>
  );
};

MoveIndex.isProCard = true;

export default MoveIndex;
