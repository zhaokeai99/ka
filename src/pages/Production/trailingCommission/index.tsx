import { cardGutter, contentPadding } from '@/themes';
import React, { useState, useMemo, useRef } from 'react';
import type { ProColumns, ActionType, ProFormInstance } from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import moment from 'moment';
import {
  queryCareFeePage,
  delCareFee,
  queryDis,
  queryCareFeeFundInfo,
  exportCareFee,
} from './service';

const TrailingCommission = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [isShowModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editValues, setEditValues] = useState({});
  const [exportLoading, setExportLoading] = useState(false);

  const handleShowModal = (type: any, values: any) => {
    setEditValues(values);
    setModalType(type);
    setShowModal(true);
  };

  const handleColse = () => {
    setShowModal(false);
    actionRef.current?.reload();
  };

  const handleExport = async (para: any) => {
    console.log(para);
    setExportLoading(true);
    const downloadUrl = await exportCareFee(para);
    setExportLoading(false);
    window.open(downloadUrl);
  };

  const handleDelete = async (record: any) => {
    const para = {
      tconfconsignmentFeeDO: {
        ...record,
        fundcodefundname: [`${record?.fundCode}=${record?.fundName}`],
        effectDate: moment(record.effectDate).format('YYYY-MM-DD'),
        effectEndDate: moment(record.effectEndDate).format('YYYY-MM-DD'),
        personalFeeType: record.personType != '1' ? record.feeType : '',
        impersonalFeeType: record.personType != '0' ? record.feeType : '',
        personalFeeRate: record.personType != '1' ? record.tConfConsignmentFeeRangeDOs : [],
        impersonalFeeRate: record.personType != '0' ? record.tConfConsignmentFeeRangeDOs : [],
      },
    };
    const { success, errorMsg } = await delCareFee(para);
    if (success) {
      message.success('已提交删除流程');
      actionRef.current?.reload();
    } else {
      message.error(errorMsg || '提交删除流程失败');
    }
  };

  const columns: ProColumns[] = useMemo(() => {
    return [
      {
        title: '销售商代码',
        width: 90,
        dataIndex: 'distributorCode',
        hideInSearch: true,
        fixed: 'left',
      },
      {
        title: '销售商名称',
        width: 90,
        dataIndex: 'distributorName',
        hideInSearch: true,
        fixed: 'left',
      },
      {
        title: '销售商',
        hideInTable: true,
        dataIndex: 'distributor',
        valueType: 'select',
        request: async () => {
          const res = await queryDis();
          return res?.map((i: any) => {
            return {
              value: i.cDistributorCode,
              label: `${i.cDistributorCode}-${i.cDistributorName}`,
            };
          });
        },
        fieldProps: {
          mode: 'multiple',
        },
      },
      {
        title: '基金',
        dataIndex: 'fundCode',
        hideInSearch: true,
        render: (text: any, record: any) =>
          record.fundCode == '***' ? (
            `${record.fundCode}`
          ) : (
            <a href={`#/production/index/newDetail/${record.fundCode}`}>{text}</a>
          ),
      },
      {
        title: '基金名称',
        dataIndex: 'fundName',
        hideInSearch: true,
        render: (text: any, record: any) =>
          record.fundCode == '***' ? (
            `${record.fundCode}`
          ) : (
            <a href={`#/production/index/newDetail/${record.fundCode}`}>{text}</a>
          ),
      },
      {
        title: '基金',
        hideInTable: true,
        dataIndex: 'fund',
        valueType: 'select',
        request: async () => {
          const res = await queryCareFeeFundInfo();
          return res?.map((i: any) => {
            return {
              value: i.cPfundCode,
              label: `${i.cPfundCode}-${i.cPfundName}`,
            };
          });
        },
        fieldProps: {
          mode: 'multiple',
        },
      },
      {
        title: '生效日期',
        dataIndex: 'effectDate',
        valueType: 'date',
        hideInSearch: true,
      },
      {
        title: '生效日期',
        dataIndex: 'effectDate',
        valueType: 'dateRange',
        initialValue: [moment().year(2019), moment().year(2024)],
        hideInTable: true,
      },
      {
        title: '截止日期',
        dataIndex: 'effectEndDate',
        valueType: 'date',
        hideInSearch: true,
      },
      {
        title: '客户类型',
        dataIndex: 'personType',
        hideInSearch: true,
        valueEnum: {
          0: '个人',
          1: '非个人',
          9: '全部',
        },
      },
      {
        title: '费用方式',
        dataIndex: 'feeType',
        hideInSearch: true,
        valueEnum: {
          0: '管理费比例',
          1: '固定费率',
          2: '分段管理费比例',
          3: '分段固定费率',
          4: '分段规模占比',
        },
      },
      {
        title: '管理费比例',
        dataIndex: 'tConfConsignmentFeeRangeDOs',
        hideInSearch: true,
        render: (text: any, item: any) => (
          <div>
            {item.feeType == '2' || item.feeType == '4' ? (
              <Tooltip
                title={item.tConfConsignmentFeeRangeDOs.map((i: any, index: any) => (
                  <div key={index} style={{ fontSize: '12px' }}>
                    {i.feeStart} - {i.feeEnd}: {`${(i.careFee * 100).toFixed(2)}%`}{' '}
                  </div>
                ))}
              >
                <a>详情</a>
              </Tooltip>
            ) : item.feeType == 0 ? (
              `${(text[0].careFee * 100).toFixed(2)}%`
            ) : (
              '-'
            )}
          </div>
        ),
      },
      {
        title: '固定费率',
        dataIndex: 'tConfConsignmentFeeRangeDOs',
        hideInSearch: true,
        render: (text: any, item: any) => (
          <div>
            {item.feeType == '3' ? (
              <Tooltip
                title={item.tConfConsignmentFeeRangeDOs.map((i: any, index: any) => (
                  <div key={index}>
                    {i.feeStart} - {i.feeEnd}: {`${(i.careFee * 100).toFixed(2)}%`}{' '}
                  </div>
                ))}
              >
                <a>详情</a>
              </Tooltip>
            ) : item.feeType == 1 ? (
              `${(text[0].careFee * 100).toFixed(2)}%`
            ) : (
              '-'
            )}
          </div>
        ),
      },
      {
        title: '使用外部投资占比',
        dataIndex: 'external',
        hideInSearch: true,
        valueEnum: {
          0: '否',
          1: '是',
        },
      },
      {
        title: '计提场内尾佣',
        dataIndex: 'exchange',
        hideInSearch: true,
        valueEnum: {
          0: '否',
          1: '是',
        },
      },
      {
        title: '修改人',
        dataIndex: 'modifyBy',
        hideInSearch: true,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 120,
        key: 'option',
        valueType: 'option',
        align: 'center',
        render: (_, record) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-around', fontWeight: 500 }}>
              <a onClick={() => handleShowModal('edit', record)}>编辑</a>
              <Popconfirm
                placement="topLeft"
                title={'删除记录，您确定要删除当前记录吗?'}
                onConfirm={() => {
                  handleDelete(record);
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
    <ProCardPlus
      ghost
      size="small"
      gutter={[0, cardGutter]}
      style={{ padding: contentPadding }}
      sn={'_Production_Menu__TrailingCommission'}
    >
      <ProTable
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        request={async (params) => {
          const result = await queryCareFeePage({
            pageNum: params.current,
            pageSize: params.pageSize,
            distributorCodes: params.distributor,
            fundCodes: params.fund,
            effectDateBegin: params.effectDate
              ? moment(params.effectDate[0]).format('YYYYMMDD')
              : '',
            effectDateEnd: params.effectDate ? moment(params.effectDate[1]).format('YYYYMMDD') : '',
          });
          return {
            data: result.list || [],
            total: result.paginator.items || 0,
          };
        }}
        toolBarRender={() => [
          <Button
            loading={exportLoading}
            key="add_button"
            icon={<DownloadOutlined />}
            type="primary"
            onClick={() => handleExport(formRef.current.getFieldsValue())}
          >
            数据导出
          </Button>,
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
    </ProCardPlus>
  );
};

export default TrailingCommission;
