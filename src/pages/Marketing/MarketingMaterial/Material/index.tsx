import React, { useEffect, useRef, useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space, Tag, Tooltip } from 'antd';
import MaterialModal from './MaterialModal';
import MaterialDetail from './MaterialDetail';
import { catQueryAll, materialDel, materialQuery, queryFundManagers, queryFunds } from '../service';
import '../index.less';
import { ProFormInstance } from '@ant-design/pro-components';

const Material = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [visible, setVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [type, setType] = useState('');
  const [detailInfo, setDetailInfo] = useState({});
  const [fundOptions, setFundOptions] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    (async () => {
      const optList = await queryFunds({ managerAccounts: [] });
      setFundOptions(optList);
    })();
  }, []);

  // 添加、编辑弹窗
  const showModal = (val: string) => {
    setType(val);
    setVisible(true);
  };

  const onEdit = (item: any) => {
    showModal('EDIT');
    setDetailInfo(item);
  };

  const onDelete = async (materialId: any) => {
    const { data } = await materialDel({ materialId });

    if (data) {
      message.success('删除成功');
      actionRef.current?.reload();
    }
  };

  const listRender = (data: any, renderKey: string) => {
    const tagList = data?.map((i: any) => i[renderKey]) || [];
    return (
      <Tooltip placement="topLeft" title={tagList.join(', ')}>
        {tagList.join(', ')}
      </Tooltip>
    );
  };

  const columns: any[] = [
    {
      title: '素材名称',
      key: 'materialName',
      dataIndex: 'materialName',
      render: (text: any, record: any) => (
        <a
          className="text-ellipsis"
          onClick={() => {
            setDetailVisible(true);
            setDetailInfo(record);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '内容分类',
      key: 'contentClassifyName',
      dataIndex: 'contentClassifyName',
      hideInSearch: true,
    },
    {
      title: '素材描述',
      key: 'description',
      dataIndex: 'description',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '素材类型',
      key: 'materialTypeName',
      dataIndex: 'materialTypeName',
      hideInSearch: true,
    },
    // {
    //   title: '素材状态',
    //   key: 'materialStatus',
    //   dataIndex: 'materialStatus',
    //   valueType: 'select',
    //   hideInTable: true,
    //   request: async () => await catQueryAll({ catModule: 'materialStatus' }),
    // },
    {
      title: '素材状态',
      key: 'materialStatusName',
      dataIndex: 'materialStatusName',
      hideInSearch: true,
      render: (text: string, record: any) => {
        const { extInfo } = record;
        return <Tag color={extInfo?.statusColor}>{text}</Tag>;
      },
    },
    {
      title: '关联基金经理',
      key: 'fundManagersDesc',
      dataIndex: 'fundManagersDesc',
      hideInSearch: true,
      ellipsis: true,
      render: (_: string, record: any) => listRender(record.fundManagers, 'name'),
    },
    {
      title: '关联经理',
      key: 'fundManagerIds',
      dataIndex: 'fundManagerIds',
      valueType: 'select',
      hideInTable: true,
      request: async () => await queryFundManagers(),
      fieldProps: {
        mode: 'multiple',
        onChange: async (val: any) => {
          console.log('val==>', val);
          const fundOpt = await queryFunds({ managerAccounts: val });
          formRef.current?.setFieldValue('fundIds', []);
          setFundOptions(fundOpt);
        },
      },
    },
    {
      title: '关联产品',
      key: 'fundVOS',
      dataIndex: 'fundVOS',
      ellipsis: true,
      hideInSearch: true,
      render: (_: string, record: any) => listRender(record.fundVOS, 'fundAbbr'),
    },
    {
      title: '关联产品',
      key: 'fundIds',
      dataIndex: 'fundIds',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        options: fundOptions,
      },
    },
    {
      title: '素材类型',
      key: 'materialType',
      dataIndex: 'materialType',
      valueType: 'select',
      hideInTable: true,
      request: async () => await catQueryAll({ catModule: 'materialType' }),
    },
    // {
    //   title: '上传时间',
    //   key: 'gmtCreate',
    //   dataIndex: 'gmtCreate',
    //   valueType: 'dateRange',
    //   hideInTable: true,
    //   search: {
    //     transform: (value: any) => {
    //       return {
    //         uploadStartTime: value[0],
    //         uploadEndTime: value[1],
    //       };
    //     },
    //   },
    // },
    {
      title: '下载次数',
      key: 'downloadTimes',
      dataIndex: 'downloadTimes',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
      render: (_: any, record: any) => {
        return record.canUpdate ? (
          <Space size={12}>
            <a onClick={() => onEdit(record)}>编辑</a>
            <Popconfirm
              placement="topLeft"
              title={'您确定要删除吗?'}
              onConfirm={() => onDelete(record.materialId)}
              okText="确定"
              cancelText="取消"
            >
              <a className="table-action-del">删除</a>
            </Popconfirm>
          </Space>
        ) : (
          '-'
        );
      },
    },
  ];

  const queryTableList = async (params: any) => {
    const { data, success } = await materialQuery({
      ...params,
      currentPage: params?.current,
    });

    if (success) {
      setPagination({
        current: data?.currentPage,
        pageSize: data?.pageSize,
      });
    }

    return data;
  };

  const onClose = (val: any) => {
    setVisible(false);
    if (val === 'RELOAD') {
      actionRef.current?.reload();
    }
  };

  return (
    <ProCardPlus ghost style={{ padding: '12px 12px' }} gutter={[0, 8]} size="small">
      <ProTable
        size="small"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="name"
        request={queryTableList}
        toolBarRender={() => {
          return [
            <Button icon={<PlusOutlined />} type="primary" onClick={() => showModal('ADD')}>
              新增
            </Button>,
          ];
        }}
        columns={columns}
        pagination={pagination}
        search={{
          defaultCollapsed: false,
        }}
      />
      <MaterialModal visible={visible} modalType={type} onClose={onClose} initValues={detailInfo} />
      <MaterialDetail
        visible={detailVisible}
        initValues={detailInfo}
        onClose={() => {
          actionRef.current?.reload();
          setDetailVisible(false);
        }}
      />
    </ProCardPlus>
  );
};

export default Material;
