import { contentPadding, cardGutter } from '@/themes';
import ProCard from '@ant-design/pro-card';
import { Space, Tabs, Tooltip } from 'antd';
import React, { useState } from 'react';
import ColorSpan from '@/components/ColorSpan';
import './index.less';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import TabTable from './TabTable';
import moment from 'moment';

const { TabPane } = Tabs;

const IndexWeight = () => {
  const [activeTab, setActiveTab] = useState('DAILYFREQUENCY');
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>(['']);
  const [list, setList] = useState<any[]>([]);

  // 展开收起子级
  const handleClick = (id: any, listData: any[]) => {
    if (expandedRowKeys?.includes(id)) {
      setExpandedRowKeys(['']);
      return;
    }
    if (id) {
      setExpandedRowKeys([id]);
      setList(listData);
    }
  };

  const headRender = (_: any, record: { id: any; industryCode: any; stockDetailList: any[] }) =>
    record?.industryCode ? (
      <Space align="center" size={20}>
        <div
          onClick={() => {
            handleClick(record?.id, record?.stockDetailList);
          }}
        >
          {expandedRowKeys[0] === record?.id ? (
            <CaretDownOutlined style={{ marginLeft: '5px', color: 'rgba(0,0,0,0.6)' }} />
          ) : (
            <CaretRightOutlined style={{ marginLeft: '5px', color: 'rgba(0,0,0,0.6)' }} />
          )}
        </div>
      </Space>
    ) : (
      ''
    );

  // columns
  const historyHead = [
    {
      width: '2%',
      hideInSearch: true,
      fixed: 'left',
      search: false,
      render: headRender,
    },
    {
      title: '证券代码',
      dataIndex: 'stockCode',
      key: 'stockCode',
      width: '28%',
      render: (
        _: any,
        item: {
          industryName: string;
          industryTradeScale: string;
          industryQuotation: string;
          stockNum: string;
        },
      ) => {
        return {
          children: (
            <div className="collapse">
              <Tooltip placement="topLeft" title={item.industryName}>
                {item.industryName || '-'}
              </Tooltip>
              <span>
                {item.industryTradeScale ? (
                  <ColorSpan value={item.industryTradeScale} suffix="亿" />
                ) : (
                  '-'
                )}
              </span>
              <span>
                {item.industryQuotation ? (
                  <ColorSpan value={item.industryQuotation} suffix="%" />
                ) : (
                  '-'
                )}
              </span>
              <span>{item.stockNum ? <ColorSpan value={item.stockNum} suffix="只" /> : '-'}</span>
            </div>
          ),
          props: { colSpan: 7 },
        };
      },
    },
    {
      title: '基金代码',
      dataIndex: 'indexCode',
      initialValue: '987003',
      request: async () => {
        const data = [
          {
            label: '987003',
            value: '987003',
          },
        ];
        return data;
      },
      key: 'indexCode',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      order: 1,
    },
    {
      title: '证券名称',
      dataIndex: 'stockName',
      align: 'right',
      key: 'stockName',
      search: false,
      ellipsis: true,
      width: '15%',
      render: () => {
        return {
          props: { colSpan: 0 },
        };
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      key: 'startDate',
      align: 'right',
      valueType: 'date',
      width: '10%',
      render: () => {
        return {
          props: { colSpan: 0 },
        };
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      order: 1,
    },
    {
      title: '结束时间',
      dataIndex: 'stockPresentPrice',
      valueType: 'date',
      width: '10%',
      align: 'right',
      key: 'endDate',
      fieldProps: {
        disabledDate: (current: any) => {
          return current && current >= moment().startOf('day');
        },
      },
      render: () => {
        return {
          props: { colSpan: 0 },
        };
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      order: 1,
    },
    {
      title: '指数权重',
      dataIndex: 'indexWeight',
      key: 'indexWeight',
      width: '10%',
      align: 'right',
      search: false,
      render: () => {
        return {
          props: { colSpan: 0 },
        };
      },
    },
    {
      title: '涨跌幅',
      dataIndex: 'stockQuotation',
      width: '10%',
      align: 'right',
      key: 'stockQuotation',
      render: () => {
        return {
          props: { colSpan: 0 },
        };
      },
      search: false,
    },
    {
      title: '成交额',
      dataIndex: 'stockTradeScale',
      width: '10%',
      align: 'right',
      key: 'stockTradeScale',
      render: () => {
        return {
          props: { colSpan: 0 },
        };
      },
      search: false,
    },
  ];
  const dailyHead = [
    {
      width: '2%',
      hideInSearch: true,
      fixed: 'left',
      search: false,
      render: headRender,
    },
    {
      title: '证券代码',
      dataIndex: 'stockCode',
      fixed: 'left',
      key: 'stockCode',
      width: '28%',
      render: (
        _: any,
        item: {
          industryName: string;
          industryTradeScale: string;
          industryQuotation: string;
          stockNum: string;
        },
      ) => {
        return {
          children: (
            <div className="collapse">
              <Tooltip placement="topLeft" title={item.industryName}>
                {item.industryName || '-'}
              </Tooltip>
              <span>
                {item.industryTradeScale ? (
                  <ColorSpan value={item.industryTradeScale} suffix="亿" />
                ) : (
                  '-'
                )}
              </span>
              <span>
                {item.industryQuotation ? (
                  <ColorSpan value={item.industryQuotation} suffix="%" />
                ) : (
                  '-'
                )}
              </span>
              <span>{item.stockNum ? <ColorSpan value={item.stockNum} suffix="只" /> : '-'}</span>
            </div>
          ),
          props: { colSpan: 7 },
        };
      },
    },
    {
      title: '基金代码',
      dataIndex: 'indexCode',
      key: 'indexCode',
      initialValue: '987003',
      request: async () => {
        const data = [
          {
            label: '987003',
            value: '987003',
          },
        ];
        return data;
      },
      hideInTable: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      order: 1,
    },
    {
      title: '证券名称',
      dataIndex: 'stockName',
      key: 'stockName',
      align: 'right',
      width: '15%',
      search: false,
      render: () => {
        return {
          props: { colSpan: 0 },
        };
      },
    },
    {
      title: '业务日期',
      dataIndex: 'businessDate',
      key: 'businessDate',
      valueType: 'date',
      align: 'right',
      width: '15%',
      render: () => {
        return {
          props: { colSpan: 0 },
        };
      },
      search: false,
      order: 1,
    },
    {
      title: '现价',
      dataIndex: 'stockPresentPrice',
      key: 'stockPresentPrice',
      width: '10%',
      align: 'right',
      search: false,
      render: () => {
        return {
          props: { colSpan: 0 },
        };
      },
    },
    {
      title: '指数权重',
      dataIndex: 'indexWeight',
      key: 'indexWeight',
      width: '10%',
      align: 'right',
      search: false,
      render: () => {
        return {
          props: { colSpan: 0 },
        };
      },
    },
    {
      title: '涨跌幅',
      dataIndex: 'stockQuotation',
      width: '10%',
      align: 'right',
      key: 'stockQuotation',
      render: () => {
        return {
          props: { colSpan: 0 },
        };
      },
      search: false,
    },
    {
      title: '成交额',
      dataIndex: 'stockTradeScale',
      width: '10%',
      align: 'right',
      key: 'stockTradeScale',
      render: () => {
        return {
          props: { colSpan: 0 },
        };
      },
      search: false,
    },
  ];

  // TabPaneConfig
  const tabConfig = [
    {
      key: 'DAILYFREQUENCY',
      name: '日频数据',
      columns: dailyHead,
    },
    {
      key: 'HISTORY',
      name: '历史数据',
      columns: historyHead,
    },
  ];

  return (
    <ProCard
      style={{ padding: contentPadding }}
      direction="column"
      ghost
      gutter={[0, cardGutter]}
      size="small"
    >
      <ProCard style={{ padding: `0 ${contentPadding}` }} gutter={[cardGutter, 0]}>
        <Tabs
          onTabClick={(v: string) => {
            setActiveTab(v);
          }}
          defaultActiveKey={activeTab}
        >
          {tabConfig.map(({ key, name, columns }) => {
            return (
              <TabPane key={key} tab={name}>
                <TabTable
                  activeTab={activeTab}
                  list={list}
                  setExpandedRowKeys={setExpandedRowKeys}
                  expandedRowKeys={expandedRowKeys}
                  columns={columns}
                  rowKey={key}
                />
              </TabPane>
            );
          })}
        </Tabs>
      </ProCard>
    </ProCard>
  );
};

export default IndexWeight;
