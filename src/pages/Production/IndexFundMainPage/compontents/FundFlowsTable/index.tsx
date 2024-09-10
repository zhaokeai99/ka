import React, { useState, useMemo, memo, useCallback, useEffect } from 'react';
import { GUTTER_SIZE } from '@/utils/utils';
import ProCardPlus from '@/components/ProCardPlus';
import { Table } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { queryIndexFundAllMarketCapital } from '../../service';
import styles from './index.less';
import { negativeColor, positiveColor } from '@/themes/index';

const FundFlowsTable: React.FC<{ fundType?: any }> = ({}) => {
  const [dataSource, setData] = useState<any[]>([]);
  const getData = useCallback(async () => {
    // TODO 后端接口部署后打开请求直接返回可用数据
    const result: any = await queryIndexFundAllMarketCapital({});
    setData(result || []);
  }, []);
  useEffect(() => {
    getData();
  }, []);
  const columnRender = useCallback((text) => {
    if (!text) return '--';
    return (
      <span className={styles['data-render']}>
        {text}
        {text > 0 ? (
          <CaretUpOutlined className={styles['icon']} style={{ color: positiveColor }} />
        ) : (
          <CaretDownOutlined className={styles['icon']} style={{ color: negativeColor }} />
        )}
      </span>
    );
  }, []);
  const columns: any = useMemo(() => {
    return [
      {
        title: '排名',
        align: 'center',
        width: '4%',
        className: styles['column_left'],
        children: [
          {
            title: '排名',
            dataIndex: 'index',
            align: 'center',
            width: '4%',
            className: styles['column_left'],
            render: (_: any, __: any, index: number) => {
              return index + 1;
            },
          },
        ],
      },
      // {
      //   title: '板块',
      //   align: 'center',
      //   children: [
      //     {
      //       title: '成分股',
      //       dataIndex: 'marketPlate',
      //       align: 'center',
      //     },
      //   ],
      // },
      {
        title: '近1日流入金额',
        align: 'center',
        width: '16%',
        className: styles['column_left'],
        children: [
          {
            title: '板块',
            dataIndex: 'oneInflowPlate',
            // align: 'center',
            width: '8%',
            ellipsis: true,
            className: styles['column_left'],
          },
          {
            title: '金额(亿)',
            dataIndex: 'oneInflowAmount',
            // align: 'center',
            width: '8%',
            ellipsis: true,
            className: styles['column_left'],
            render: (text: any) => {
              return columnRender(text);
            },
          },
        ],
      },
      {
        title: '近5日流入金额',
        align: 'center',
        width: '16%',
        className: styles['column_left'],
        children: [
          {
            title: '板块',
            dataIndex: 'fiveInflowPlate',
            // align: 'center',
            width: '8%',
            ellipsis: true,
            className: styles['column_left'],
          },
          {
            title: '金额(亿)',
            dataIndex: 'fiveInflowAmount',
            // align: 'center',
            width: '8%',
            ellipsis: true,
            className: styles['column_left'],
            render: (text: any) => {
              return columnRender(text);
            },
          },
        ],
      },
      {
        title: '近20日流入金额',
        align: 'center',
        width: '16%',
        className: styles['column_left'],
        children: [
          {
            title: '板块',
            dataIndex: 'twentyInflowPlate',
            // align: 'center',
            width: '8%',
            ellipsis: true,
            className: styles['column_left'],
          },
          {
            title: '金额(亿)',
            dataIndex: 'twentyInflowAmount',
            // align: 'center',
            width: '8%',
            ellipsis: true,
            className: styles['column_left'],
            render: (text: any) => {
              return columnRender(text);
            },
          },
        ],
      },
      {
        title: '近1日流出金额',
        align: 'center',
        width: '16%',
        className: styles['colummn_right'],
        children: [
          {
            title: '板块',
            dataIndex: 'oneFlowOutPlate',
            // align: 'center',
            width: '8%',
            ellipsis: true,
            className: styles['colummn_right'],
          },
          {
            title: '金额(亿)',
            dataIndex: 'oneFlowOutAmount',
            // align: 'center',
            width: '8%',
            ellipsis: true,
            className: styles['colummn_right'],
            render: (text: any) => {
              return columnRender(text);
            },
          },
        ],
      },
      {
        title: '近5日流出金额',
        align: 'center',
        width: '16%',
        className: styles['colummn_right'],
        children: [
          {
            title: '板块',
            dataIndex: 'fiveFlowOutPlate',
            // align: 'center',
            width: '8%',
            ellipsis: true,
            className: styles['colummn_right'],
          },
          {
            title: '金额(亿)',
            dataIndex: 'fiveFlowOutAmount',
            // align: 'center',
            width: '8%',
            ellipsis: true,
            className: styles['colummn_right'],
            render: (text: any) => {
              return columnRender(text);
            },
          },
        ],
      },
      {
        title: '近20日流出金额',
        align: 'center',
        width: '16%',
        className: styles['colummn_right'],
        children: [
          {
            title: '板块',
            dataIndex: 'twentyInflowPlate',
            // align: 'center',
            width: '8%',
            ellipsis: true,
            className: styles['colummn_right'],
          },
          {
            title: '金额(亿)',
            dataIndex: 'twentyFlowOutAmount',
            // align: 'center',
            width: '8%',
            ellipsis: true,
            className: styles['colummn_right'],
            render: (text: any) => {
              return columnRender(text);
            },
          },
        ],
      },
    ];
  }, []);
  return (
    <ProCardPlus
      className={styles['box']}
      direction="column"
      ghost
      colSpan="100%"
      gutter={[0, GUTTER_SIZE]}
    >
      <ProCardPlus
        title={<p style={{ fontSize: 16, fontWeight: 'bold', margin: 0 }}>全市场ETF资金流向</p>}
        bordered={false}
        style={{ marginTop: 8 }}
        // style={{ margin: `${GUTTER_SIZE}px 0` }}
        gutter={[0, GUTTER_SIZE]}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          size="middle"
          pagination={false}
          // scroll={{ x: 'calc(700px + 50%)'}}
        />
      </ProCardPlus>
    </ProCardPlus>
  );
};

export default memo(FundFlowsTable);
