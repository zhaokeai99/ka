import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import { queryAllProductRecommend, deleteProductRecommend, getTypeList } from './service';
import type { TableListItem } from './service';

const { Link } = Typography;

// 产品推荐
const ProductPromotion = () => {
  const actionRef = useRef<ActionType>();
  const [isShowModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editValues, setEditValues] = useState({});

  const handleShowModal = useCallback((type, values) => {
    setEditValues(values);
    setModalType(type);
    setShowModal(true);
  }, []);

  const handleColse = useCallback((key) => {
    setShowModal(false);
    if (key === 'reload') {
      actionRef.current?.reload();
    }
  }, []);

  const handleDelete = useCallback(async (code) => {
    const { success, errorMsg } = await deleteProductRecommend({ fundCode: code });
    if (success) {
      message.success('删除成功');
      actionRef.current?.reload();
    } else {
      message.error(errorMsg || '删除失败');
    }
  }, []);

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '基金代码',
        dataIndex: 'fundCode',
      },
      {
        title: '基金名称',
        dataIndex: 'fundName',
      },
      {
        title: '产品类型',
        dataIndex: 'vogType',
        valueType: 'select',
        hideInTable: true,
        request: async () => {
          return await getTypeList();
        },
      },
      {
        title: '产品类型',
        dataIndex: 'vogTypeDesc',
        hideInSearch: true,
      },
      {
        title: 'PPT链接',
        dataIndex: 'pptUrl',
        hideInSearch: true,
        render: (text, record) => {
          if (!record.pptUrl) {
            return '--';
          }
          return (
            <Link href={record.pptUrl} target="_blank" copyable={{ text: record.pptUrl }}>
              查看
            </Link>
          );
        },
      },
      {
        title: 'PDF链接',
        dataIndex: 'pdfUrl',
        hideInSearch: true,
        render: (text, record) => {
          if (!record.pdfUrl) {
            return '--';
          }
          return (
            <Link href={record.pdfUrl} target="_blank" copyable={{ text: record.pdfUrl }}>
              查看
            </Link>
          );
        },
      },
      {
        title: '物料包地址',
        dataIndex: 'materialPackageUrl',
        hideInSearch: true,
        render: (text, record) => {
          if (!record.materialPackageUrl) {
            return '--';
          }
          return (
            <Link
              href={record.materialPackageUrl}
              target="_blank"
              copyable={{ text: record.materialPackageUrl }}
            >
              查看
            </Link>
          );
        },
      },
      {
        title: '标签',
        ellipsis: true,
        hideInSearch: true,
        dataIndex: 'tag',
      },
      {
        title: '是否重点推荐',
        dataIndex: 'showType',
        hideInSearch: true,
        align: 'center',
        render: (text, record) => {
          return record.showType === '0' ? '是' : '否';
        },
      },
      {
        title: '发布时间',
        valueType: 'dateRange',
        dataIndex: 'publishDate',
        hideInTable: true,
      },
      {
        title: '发布时间',
        dataIndex: 'publishDate',
        hideInSearch: true,
      },
      {
        title: '创建时间',
        hideInSearch: true,
        dataIndex: 'createTime',
        sorter: (a: any, b: any) =>
          new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
      },
      {
        title: '修改时间',
        hideInSearch: true,
        dataIndex: 'updateTime',
        sorter: (a: any, b: any) =>
          new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime(),
      },
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        align: 'center',
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal('edit', record)}>
                编辑
              </Button>
              <Popconfirm
                placement="topLeft"
                title={'删除后不可恢复，您确定要删除吗?'}
                onConfirm={() => {
                  handleDelete(record.fundCode);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button type="text" danger>
                  删除{' '}
                </Button>
              </Popconfirm>
            </>
          );
        },
      },
    ];
  }, []);

  return (
    <>
      <ProTable<TableListItem>
        size="small"
        actionRef={actionRef}
        rowKey="fundCode"
        search={{ labelWidth: 120 }}
        request={async (params) => {
          const { publishDate = ['', ''], ...other } = params;
          const result = await queryAllProductRecommend({
            ...other,
            beginPublishDate: publishDate[0],
            endPublishDate: publishDate[1],
            currentPage: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: result.data || [],
            total: result.total || 0,
          };
        }}
        toolBarRender={() => [
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
        pagination={{ pageSize: 10 }}
      />
      <DetailModal
        visible={isShowModal}
        modalType={modalType}
        initValues={editValues}
        onClose={handleColse}
      />
    </>
  );
};

export default ProductPromotion;
