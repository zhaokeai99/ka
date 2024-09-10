import React, { memo, useEffect, useState } from 'react';
import type { TableListMpHoldItem } from '../service';
import {
  MpRsHoldItemFacadeQueryByPage,
  MTK_CODE_DIC,
  PortfolioInfo,
  STK_TYPE_DIC,
} from '../../service';
import { dealNumThousandsAndFloat } from '@/utils/utils';
import '../index.less';
import { Col, Pagination, Row, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Link } from 'umi';

interface ModalProps {
  portfolioInfo: PortfolioInfo;
  dicMap: { domain: []; benchmark: [] };
  tradeDate: string;
}

const MpHoldItemTable = (props: ModalProps) => {
  const { portfolioInfo, tradeDate } = props;

  const [tableData, setTableData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<any>({ current: 1, pageSize: 10, total: 0 });

  const request = async (params?: any) => {
    setLoading(true);
    if (!portfolioInfo || !tradeDate) {
      setTableData([]);
      return false;
    }
    const result = await MpRsHoldItemFacadeQueryByPage({
      tradeDate,
      ...params,
      mpCode: portfolioInfo.mpCode,
      domain: portfolioInfo.domain,
    });

    const { data = [], current, pageSize, total } = result || {};
    if (JSON.stringify(result) !== '{}') {
      setTableData(data);
      setPageInfo({ current, pageSize, total });
    } else {
      setTableData([]);
    }

    setLoading(false);
    return true;
  };

  useEffect(() => {
    const p = {
      current: pageInfo.current,
      pageSize: pageInfo.pageSize,
    };
    request(p);
  }, [tradeDate, portfolioInfo?.id]);

  const getItemTypeName = (v: string) => {
    return STK_TYPE_DIC[v];
  };
  const getMktName = (v: string) => {
    return MTK_CODE_DIC[v];
  };

  const pageChange = (tablePagParm: any) => {
    const { current, pageSize } = tablePagParm;
    setPageInfo({ ...pageInfo, current: current, pageSize: pageSize });

    request({ ...pageInfo, current: current, pageSize: pageSize });
  };
  const columns: ColumnsType<TableListMpHoldItem> = [
    {
      title: '交易日期',
      dataIndex: 'tradeDate',
      align: 'center',
    },
    {
      title: '证券类型',
      dataIndex: 'stkType',
      align: 'center',
      render: (text, record) => {
        // @ts-ignore
        return getItemTypeName(record.stkType);
      },
    },
    {
      title: '证券代码',
      dataIndex: 'stkCode',
      align: 'center',
    },
    {
      title: '证券名称',
      dataIndex: 'stkName',
      align: 'center',
    },
    {
      title: '证券市场',
      dataIndex: 'mtkCode',
      align: 'center',
      render: (text, record) => {
        // @ts-ignore
        const val = record?.mtkCode;
        if (val === undefined || val === null) {
          return '-';
        }
        return getMktName(val);
      },
    },
    {
      title: '权重',
      dataIndex: 'weight',
      className: 'text-right head-center',
      render: (text, record) => {
        // @ts-ignore
        const val = record?.weight;
        if (val === undefined || val === null) {
          return '-';
        }
        return (val * 100).toFixed(2) + '%';
      },
    },
    {
      title: '持有(手)',
      dataIndex: 'amount',
      className: 'text-right head-center',
      render: (text, record) => {
        // @ts-ignore
        const val = record?.amount;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val / 100, 2);
      },
    },
    {
      title: '价格(收盘价)',
      dataIndex: 'price',
      className: 'text-right head-center',
      render: (text, record) => {
        // @ts-ignore
        const val = record?.price;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val, 2);
      },
    },
    {
      title: '汇率',
      dataIndex: 'exRate',
      className: 'text-right head-center',
    },
    {
      title: '市值(¥)',
      dataIndex: 'marketValue',
      className: 'text-right head-center',
      render: (text, record) => {
        // @ts-ignore
        const val = record?.marketValue;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val, 2);
      },
    },
    {
      title: '当日收益(万元)',
      dataIndex: 'profit',
      className: 'text-right head-center',
      render: (text, record) => {
        // @ts-ignore
        const val = record?.profit;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat((val / 10000).toFixed(2), 2);
      },
    },
    {
      title: '当日收益率',
      dataIndex: 'profitRatio',
      className: 'text-right head-center',
      render: (text, record) => {
        // @ts-ignore
        const val = record?.profitRatio;
        if (val === undefined || val === null) {
          return '-';
        }
        return (val * 100).toFixed(4) + '%';
      },
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      className: 'text-right head-center',
      render: (text, record) => {
        // @ts-ignore
        const val = record?.costPrice;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val.toFixed(4), 4);
      },
    },
    {
      title: '总成本(万元)',
      dataIndex: 'costValue',
      className: 'text-right head-center',
      render: (text, record) => {
        // @ts-ignore
        const val = record?.costValue;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat((val / 10000).toFixed(2), 2);
      },
    },
    {
      title: '总收益(万元)',
      dataIndex: 'accuIncome',
      className: 'text-right head-center',
      render: (text, record) => {
        // @ts-ignore
        const val = record?.holdProfit;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat((val / 10000).toFixed(2), 2);
      },
    },
    {
      title: '总费用',
      dataIndex: 'totalFee',
      className: 'text-right head-center',
      render: (text, record) => {
        // @ts-ignore
        const val = record?.totalFee;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val, 2);
      },
    },
  ];

  const checkJumpUrl = (mpInfo: any) => {
    const { mpCode, mpName, domain } = mpInfo;
    const baseUrl = `/investment/portfolio/mpHoldItemSearch/${mpCode}/${mpName}/${domain}`;
    return baseUrl;
  };
  return (
    <div className={tableData?.length ? '' : 'notHover'}>
      <Table<TableListMpHoldItem>
        loading={loading}
        key={`id`}
        scroll={{ x: 'max-content' }}
        size={'small'}
        dataSource={tableData}
        columns={columns}
        onChange={pageChange}
        pagination={false}
      />
      <Row style={{ marginTop: '10px' }}>
        <Col flex="100px">
          <Link to={checkJumpUrl(portfolioInfo)}>查看历史数据</Link>
        </Col>
        <Col flex="auto">
          {tableData?.length ? (
            <Pagination
              style={{ float: 'right' }}
              size={'small'}
              onChange={(page, pageSize) => pageChange({ current: page, pageSize: pageSize })}
              {...pageInfo}
              defaultPageSize={pageInfo.pageSize}
              showSizeChanger={true}
              showQuickJumper={true}
              pageSizeOptions={['5', '10', '20', '50']}
              showTotal={(total, range) => `第 ${range[0]} 到 ${range[1]} 条 | 共 ${total} 条`}
            />
          ) : (
            ''
          )}
        </Col>
      </Row>
    </div>
  );
};

export default memo(MpHoldItemTable);
