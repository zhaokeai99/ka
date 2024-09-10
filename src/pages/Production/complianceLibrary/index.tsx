import { cardGutter, contentPadding } from '@/themes';
import React, { useState, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import BoothComponent from '@/components/boothComponent';
import './index.less';
import {
  getTypeList,
  queryComPlianceLibraryDataList,
  deleteComPlianceLibraryData,
} from './service';

const ComplianceLibrary = () => {
  const actionRef = useRef<ActionType>();
  const [isShowModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editValues, setEditValues] = useState({});

  const handleShowModal = (type: any, values: any) => {
    setEditValues(values);
    setModalType(type);
    setShowModal(true);
  };

  const handleColse = () => {
    setShowModal(false);
    actionRef.current?.reload();
  };

  const handleDelete = async (id: any) => {
    const { success, errorMsg } = await deleteComPlianceLibraryData({ id: id });
    if (success) {
      message.success('删除成功');
      actionRef.current?.reload();
    } else {
      message.error(errorMsg || '删除失败');
    }
  };

  const columns: ProColumns[] = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        valueType: 'index',
        hideInSearch: true,
        fixed: 'left',
        width: 60,
      },
      {
        title: '文库类型',
        dataIndex: 'libraryType',
        width: 120,
        request: async () => {
          const { libraryTypeList } = await getTypeList();
          return libraryTypeList?.map((item: any) => {
            return {
              label: item,
              value: item,
            };
          });
        },
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
        fixed: 'left',
      },
      {
        title: '影响类型',
        dataIndex: 'impactType',
        width: 120,
        request: async () => {
          const { impactTypeList } = await getTypeList();
          return impactTypeList?.map((item: any) => {
            return {
              label: item,
              value: item,
            };
          });
        },
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
        fixed: 'left',
      },
      {
        title: '文案',
        dataIndex: 'content',
        hideInSearch: true,
        // ellipsis: true,
        width: 600,
        fixed: 'left',
        render: (text: any) => {
          const newText = text
            .replace(/(<red>)/g, '<span class="red_color">')
            .replace(/(<\/red>)/g, '</span>');
          console.log(newText);
          return <div dangerouslySetInnerHTML={{ __html: newText }}></div>;
        },
      },
      {
        title: '展位类型',
        dataIndex: 'boothName',
        hideInSearch: true,
        width: 120,
        request: async () => {
          const { boothInfos } = await getTypeList();
          return boothInfos?.map((item: any) => {
            return {
              label: item,
              value: item,
            };
          });
        },
      },
      {
        title: '维护人',
        ellipsis: true,
        dataIndex: 'createUser',
        hideInSearch: true,
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: '维护时间',
        dataIndex: 'updateTime',
        hideInSearch: true,
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: '状态',
        ellipsis: true,
        dataIndex: 'contentStatusStr',
        hideInSearch: true,
        valueEnum: {
          0: {
            text: '启用',
          },
          1: {
            text: '失效',
          },
        },
      },
      {
        title: '操作',
        width: 200,
        key: 'option',
        valueType: 'option',
        align: 'center',
        render: (text, record) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-around', fontWeight: 500 }}>
              <a onClick={() => handleShowModal('check', record)}>查看</a>
              <a onClick={() => handleShowModal('edit', record)}>编辑</a>
              <Popconfirm
                placement="topLeft"
                title={'删除文案，您确定要删除当前文案吗?'}
                onConfirm={() => {
                  handleDelete(record.id);
                }}
                okText="确定"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }, []);

  return (
    <ProCard ghost size="small" gutter={[0, cardGutter]} style={{ padding: contentPadding }}>
      <ProTable
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
          //defaultCollapsed: false,
        }}
        request={async (params, sorter) => {
          const result = await queryComPlianceLibraryDataList({
            pageNo: params.current,
            pageSize: params.pageSize,
            contentStatus: params.contentStatusStr,
            libraryTypes: params.libraryType,
            impactTypes: params.impactType,
            orderType: Object.keys(sorter)[0],
            orderSorter: sorter[Object.keys(sorter)[0]] == 'ascend' ? 'asc' : 'desc',
          });
          return {
            data: result.dataList || [],
            total: result.total || 0,
          };
        }}
        tableExtraRender={() => (
          <ProCard>
            <BoothComponent boothId="library" />
          </ProCard>
        )}
        toolBarRender={() => [
          <span className="note">
            {'注：可以通过<red>xxxx</red>、<b>xxxx</b>、xxxx<br/>来配置展位文案标红、加粗以及换行'}
          </span>,
          <Button
            key="add_button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleShowModal('add', {})}
          >
            新增
          </Button>,
        ]}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />
      <DetailModal
        visible={isShowModal}
        modalType={modalType}
        initValues={editValues}
        onClose={handleColse}
      />
    </ProCard>
  );
};

export default ComplianceLibrary;
