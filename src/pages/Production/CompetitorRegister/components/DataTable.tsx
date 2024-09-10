import { GUTTER_SIZE, tableEmptyCellRender } from '@/utils/utils';
import ProCard from '@ant-design/pro-card';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { Button, Select, TreeSelect } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  exportCollectProgressList,
  queryFundTypeList,
  queryMutualFundCollectList,
} from '../service';

const { SHOW_CHILD } = TreeSelect;
const { Option } = Select;

const DataTable: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns: any = [
    {
      title: '基金管理人',
      dataIndex: 'manager',
      key: 'manager',
      fixed: 'left',
      width: 120,
    },
    {
      title: '产品名称',
      dataIndex: 'fundName',
      key: 'fundName',
      fixed: 'left',
      width: 320,
      render: (text: string, { fundCode }: any) => {
        if (fundCode) {
          return <a href={`#/production/index/newDetail/${fundCode}`}>{text}</a>;
        }

        return text;
      },
    },
    {
      title: '申请事项',
      dataIndex: 'itemName',
      key: 'itemName',
      search: false,
    },
    {
      title: '产品类型',
      dataIndex: 'typeList',
      hideInTable: true,
      renderFormItem: (_, fieldConfig: any) => {
        if (fieldConfig.type === 'form') {
          return null;
        }

        return (
          <TreeSelect
            {...{
              treeData,
              allowClear: true,
              treeCheckable: true,
              showCheckedStrategy: SHOW_CHILD,
              style: {
                width: '100%',
              },
            }}
          />
        );
      },
    },
    {
      title: '产品类型一',
      dataIndex: 'fundType',
      key: 'fundType',
      search: false,
    },
    {
      title: '产品类型二',
      dataIndex: 'fundTypeTwo',
      key: 'fundTypeTwo',
      search: false,
    },
    {
      title: '接收材料日',
      dataIndex: 'jsclDate',
      key: 'jsclDate',
      search: false,
    },
    {
      title: '通知补正日',
      dataIndex: 'stepDate',
      key: 'stepDate',
      search: false,
    },
    {
      title: '接收补正材料日',
      dataIndex: 'jsbzclDate',
      key: 'jsbzclDate',
      search: false,
    },
    {
      title: '受理通知日期',
      dataIndex: 'sltzDate',
      key: 'sltzDate',
      search: false,
    },
    {
      title: '一次书面反馈日',
      dataIndex: 'smfk1Date',
      key: 'smfk1Date',
      search: false,
    },
    {
      title: '接受书面回复日',
      dataIndex: 'jssmhfDate',
      key: 'jssmhfDate',
      search: false,
    },
    {
      title: '情况说明',
      dataIndex: 'stepDesc',
      key: 'stepDesc',
      search: false,
    },
    {
      title: '决定日',
      dataIndex: 'jdDate',
      key: 'jdDate',
      search: false,
    },
    {
      title: '备注',
      dataIndex: '',
      key: '',
      search: false,
    },
    {
      title: '募集起始日',
      dataIndex: 'issueStartdatend',
      key: 'issueStartdatend',
      search: false,
      sorter: true,
    },
    {
      title: '募集结束日',
      dataIndex: 'issueEnddatend',
      key: 'issueEnddatend',
      search: false,
      sorter: true,
    },
    {
      title: '成立日',
      dataIndex: 'setupDate',
      key: 'setupDate',
      search: false,
      sorter: true,
    },
    {
      title: '上市日',
      dataIndex: 'listDate',
      key: 'listDate',
      search: false,
      sorter: true,
    },
    {
      title: '产品代码',
      dataIndex: 'fundCode',
      key: 'fundCode',
      search: false,
    },
    {
      title: '发行份额',
      dataIndex: 'issueTotalunit',
      key: 'issueTotalunit',
      search: false,
    },
    {
      title: '申购起始日',
      dataIndex: 'pchStartdate',
      key: 'pchStartdate',
      search: false,
    },
    {
      title: '赎回起始日',
      dataIndex: 'redmStartdate',
      key: 'redmStartdate',
      search: false,
    },
    {
      title: '封闭期（天）',
      dataIndex: 'closedPeriod',
      key: 'closedPeriod',
      search: false,
      sorter: true,
    },
    {
      title: '托管行',
      dataIndex: 'custodiabank',
      key: 'custodiabank',
    },
    {
      title: '基金经理',
      dataIndex: 'fundmanager',
      dataIndex: 'fundmanager',
      key: '',
      search: false,
    },
    {
      title: '合计发行份额（亿份）',
      dataIndex: 'totalIssueTotalunit',
      key: 'totalIssueTotalunit',
      search: false,
      sorter: true,
    },
    {
      title: '有效认购申请金额',
      dataIndex: 'effsubsappamount',
      key: 'effsubsappamount',
      search: false,
    },
    {
      title: '有效认购金额',
      dataIndex: 'effsubsamount',
      key: 'effsubsamount',
      search: false,
    },
    {
      title: '确认比例',
      dataIndex: 'confirmRatio',
      key: 'confirmRatio',
      search: false,
    },
    {
      title: '募集天数',
      dataIndex: 'raiseDays',
      key: 'raiseDays',
      search: false,
    },
    {
      title: '销售代理人（个）',
      dataIndex: 'sellingAgentNum',
      key: 'sellingAgentNum',
      search: false,
      sorter: true,
    },
    {
      title: '跟踪指数',
      dataIndex: 'indexName',
      key: 'indexName',
      search: false,
    },
    {
      title: '代码批复时间',
      dataIndex: 'replyDate',
      key: 'replyDate',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      search: false,
      sorter: true,
      valueEnum: {
        1: '已报待审',
        2: '已批待发',
        3: '募集期',
        4: '待成立',
        5: '存续封闭期',
        6: '存续已开放',
      },
    },
    {
      title: '状态',
      dataIndex: 'statusList',
      hideInTable: true,
      renderFormItem: (_, fieldConfig: any) => {
        if (fieldConfig.type === 'form') {
          return null;
        }

        return (
          <Select mode="multiple" showSearch={false} placeholder="请选择-支持多选">
            <Option value={1}>已报待审</Option>
            <Option value={2}>已批待发</Option>
            <Option value={3}>募集期</Option>
            <Option value={4}>待成立</Option>
            <Option value={5}>存续封闭期</Option>
            <Option value={6}>存续已开放</Option>
          </Select>
        );
      },
    },
    {
      title: '接收材料日',
      dataIndex: 'jsclSearchDate',
      key: 'jsclSearchDate',
      valueType: 'dateRange',
      hideInTable: true,
    },
  ];

  const onDownload = async () => {
    setLoading(true);

    const downloadUrl = await exportCollectProgressList(formRef?.current?.getFieldsValue());
    setLoading(false);
    if (downloadUrl) {
      window.open(downloadUrl);
    }
  };

  useEffect(() => {
    (async () => {
      const result = await queryFundTypeList();
      setTreeData(result);
    })();
  }, []);

  return (
    <ProCard gutter={[GUTTER_SIZE, 0]} ghost>
      <ProTable
        formRef={formRef}
        size="small"
        options={false}
        columns={tableEmptyCellRender(columns as any)}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 'max-content' }}
        rowKey="id"
        request={(p: any, s: any) => {
          const { jsclSearchDate = [undefined, undefined], ...arg } = p;
          const { jsclSearchDate: d, ...other } = formRef?.current?.getFieldsValue();
          const params = {
            ...arg,
            ...other,
            startDate: jsclSearchDate[0],
            endDate: jsclSearchDate[1],
          };
          const [keyName] = Object.keys(s || {});

          return queryMutualFundCollectList({
            ...params,
            pageNo: p.current,
            pageSize: p.pageSize,
            ...(keyName && {
              sortField: keyName,
              sortOrder: s[keyName],
            }),
          });
        }}
        search={{
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Button key="export" type="primary" onClick={onDownload} loading={loading}>
              导出
            </Button>,
          ],
        }}
      />
    </ProCard>
  );
};

export default DataTable;
