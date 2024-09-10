import React, { useRef, useState, useMemo, useEffect } from 'react';
import type { FormInstance } from 'antd';
import { message, Button, Space, Modal, Table } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
// import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import useAuth from '@/components/Hooks/useAuth';
import { tableEmptyCellRender } from '@/utils/utils';
import ModalForm from './form';
import Detail from './detail';
import type { IndexFeeItem } from './data';
import {
  queryReportList,
  queryBusinessCycleList,
  queryIndexPublisherList,
  queryById,
  add,
  update,
  configListExport,
  detailConfigExport,
  batchDetailConfigExport,
} from './service';

let oldBusinessCycle: any = null;

const IndexFee: React.FC<{ history: any; location: any }> = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const operateShow = useAuth({ sn: '_production_indexFee__singleTable___createButton' });
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [currentFundCode, setCurrentFundCode] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns: ProColumns<IndexFeeItem>[] = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'id',
        hideInTable: true,
        search: false,
      },
      {
        title: '业务周期',
        dataIndex: 'businessCycle',
        hideInTable: true,
        valueType: 'select',
        request: async () => {
          const { data, defaultValue } = await queryBusinessCycleList();
          if (!formRef?.current?.getFieldValue('businessCycle')) {
            formRef?.current?.setFieldsValue({
              businessCycle: defaultValue,
            });
          }
          return data;
        },
      },
      {
        title: '产品代码',
        dataIndex: 'fundCode',
        fixed: 'left',
        width: 100,
      },
      {
        title: '产品名称',
        dataIndex: 'fundName',
        fixed: 'left',
        width: 200,
      },
      {
        title: '跟标指数',
        dataIndex: 'indexFollow',
        search: false,
        render: (text) => <a href={`#/production/indexStock/detail/${text}`}>{text}</a>,
      },
      {
        title: '指数名称',
        dataIndex: 'companyName',
      },
      {
        title: '指数公司',
        dataIndex: 'publisher',
        valueType: 'select',
        request: queryIndexPublisherList,
      },
      {
        title: '计算起始日',
        dataIndex: 'startDate',
        search: false,
      },
      {
        title: '计算截止日',
        dataIndex: 'endDate',
        search: false,
      },
      {
        title: '费率',
        dataIndex: 'rate',
        search: false,
      },
      {
        title: '季度最低应付费(元)',
        dataIndex: 'minFeePayable',
        search: false,
      },
      {
        title: '累计计提应付费(元)',
        dataIndex: 'sumFeePayable',
        search: false,
      },
      {
        title: '季度日均基金资产净值(元)',
        dataIndex: 'quarterNav',
        search: false,
      },
      {
        title: '季度日均基金资产净值阈值(元)',
        dataIndex: 'quarterNavThreshold',
        search: false,
      },
      {
        title: '实际应付费',
        dataIndex: 'actualPayable',
        search: false,
      },
      {
        title: '公司支付',
        dataIndex: 'companyPay',
        search: false,
        render: (text) => (text === 0 ? '是' : '否'),
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        dataIndex: '',
        search: false,
        render: (text, record: any) => {
          return (
            <Space>
              {operateShow ? (
                <a
                  onClick={async () => {
                    const result: any = await queryById({ fundCode: record.fundCode });
                    setEditValues(result);
                    setShowEdit(true);
                  }}
                >
                  修改
                </a>
              ) : null}

              <a
                onClick={async () => {
                  setShowDetail(true);
                  setCurrentFundCode(record.fundCode);
                }}
              >
                查看
              </a>
              <a
                onClick={() =>
                  window.open(
                    detailConfigExport(
                      record.fundCode,
                      formRef.current?.getFieldValue('businessCycle'),
                    ),
                  )
                }
              >
                导出
              </a>
            </Space>
          );
        },
      },
    ],
    [],
  );

  useEffect(() => {
    return () => {
      oldBusinessCycle = null;
    };
  }, []);

  return (
    <ProCardPlus ghost style={{ padding: '12px' }} sn="_production_indexFee__singleTable">
      <ProTable<IndexFeeItem>
        size="small"
        options={{
          density: false,
        }}
        actionRef={actionRef}
        formRef={formRef}
        rowKey="fundCode"
        search={{
          labelWidth: 120,
        }}
        request={(p: any) => {
          const { businessCycle } = p || {};

          if (oldBusinessCycle !== businessCycle) {
            oldBusinessCycle = businessCycle;
            setSelectedRowKeys([]);
          }

          return queryReportList({ ...p, pageNo: p.current, pageSize: p.pageSize });
        }}
        toolBarRender={() => [
          operateShow ? (
            <Button
              key="add_button"
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setShowAdd(true)}
            >
              新增
            </Button>
          ) : null,
          <Button
            key="export_button"
            icon={<DownloadOutlined />}
            onClick={() => window.open(configListExport(formRef.current?.getFieldsValue()))}
          >
            导出
          </Button>,
          <Button
            key="export_button_batch"
            icon={<DownloadOutlined />}
            onClick={() =>
              window.open(
                batchDetailConfigExport('', formRef.current?.getFieldValue('businessCycle')),
              )
            }
          >
            导出全部明细
          </Button>,
        ]}
        columns={tableEmptyCellRender(columns as any)}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 'max-content' }}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          onChange: (values: any) => setSelectedRowKeys(values || []),
          preserveSelectedRowKeys: true,
          selectedRowKeys,
        }}
        tableAlertOptionRender={() => {
          if (selectedRowKeys.length > 0) {
            return (
              <Space size={16}>
                <a
                  rel="noopener noreferrer"
                  onClick={() => {
                    window.open(
                      batchDetailConfigExport(
                        selectedRowKeys.join(','),
                        formRef.current?.getFieldValue('businessCycle'),
                      ),
                    );
                  }}
                  key="upload-batch"
                >
                  导出数据
                </a>
              </Space>
            );
          }

          return null;
        }}
      />
      {/** 新建表单 */}
      <ModalForm
        title="新增"
        type="add"
        visible={showAdd}
        onFinish={async (values) => {
          const { followInfo, fundInfo } = values || {};
          const followValues = followInfo;
          const fundValues = fundInfo;
          const { success } = await add({
            ...values,
            fundCode: fundValues[1],
            fundName: fundValues[0],
            indexFollow: followValues[1],
            companyName: followValues[0],
            publisher: followValues[2],
          });
          if (success) {
            message.success('新增成功！');
            actionRef.current?.reload();
          }
          return true;
        }}
        onVisibleChange={setShowAdd}
      />

      {/** 编辑表单 */}
      <ModalForm
        title="编辑"
        type="edit"
        visible={showEdit}
        initialValues={editValues}
        onFinish={async (values) => {
          const { followInfo, fundInfo } = values || {};
          const followValues = followInfo.value;
          const fundValues = fundInfo.value;
          const { success } = await update({
            ...values,
            fundCode: fundValues[1],
            fundName: fundValues[0],
            indexFollow: followValues[1],
            companyName: followValues[0],
            publisher: followValues[2],
          });
          if (success) {
            message.success('修改成功！');
            actionRef.current?.reload();
          }
          return true;
        }}
        onVisibleChange={setShowEdit}
      />

      {/** 查看详情 */}
      <Modal
        title="费用详情"
        visible={showDetail}
        onOk={() => setShowDetail(false)}
        onCancel={() => setShowDetail(false)}
        width="55%"
        destroyOnClose
      >
        <Detail
          fundCode={currentFundCode}
          businessCycle={formRef.current?.getFieldValue('businessCycle')}
          showDetail={showDetail}
        />
      </Modal>
    </ProCardPlus>
  );
};

export default IndexFee;
