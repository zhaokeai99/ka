import React, { memo, useEffect, useMemo, useState } from 'react';
import type { TableListMpDeal } from '../service';
import { MpRsDealQueryByPage } from '../service';
import { PortfolioInfo } from '@/pages/Investment/Simulation/PortfolioManagement/service';
import { DEAL_DIRECTION_DIC, MTK_CODE_DIC, ORDER_CODE_DIC, STK_TYPE_DIC } from '../../service';
import { dealNumThousandsAndFloat } from '@/utils/utils';
import '../index.less';
import { Col, Pagination, Row, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Link } from 'umi';

interface ModalProps {
  portfolioInfo: PortfolioInfo;
  dicMap: { domain: []; benchmark: [] };
  tradeDate: string;
  onUpdateState: (key: any, value: any) => void;
}

const MpHoldItemTable = (props: ModalProps) => {
  const { portfolioInfo, tradeDate, onUpdateState } = props;
  const [tableData, setTableData] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<any>({ current: 1, pageSize: 10, total: 0 });

  const request = async (params?: any) => {
    setLoading(true);
    if (portfolioInfo === undefined || tradeDate === undefined) {
      setTableData([]);
      return false;
    }

    const result = await MpRsDealQueryByPage({
      tradeDate,
      ...params,
      mpCode: portfolioInfo.mpCode,
      domain: portfolioInfo.domain,
    });
    const { data = [], current, pageSize, total } = result || {};

    if (JSON.stringify(result) !== '{}') {
      setTableData(data);
      setPageInfo({ current, pageSize, total });
      onUpdateState('deal', total);
    } else {
      setTableData([]);
      onUpdateState('deal', 0);
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

  const pageChange = (tablePagParm: any) => {
    const { current, pageSize } = tablePagParm;
    setPageInfo({ ...pageInfo, current: current, pageSize: pageSize });

    request({ ...pageInfo, current: current, pageSize: pageSize });
  };

  const columns: ColumnsType<TableListMpDeal> = useMemo(() => {
    return [
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
          return MTK_CODE_DIC[record.mtkCode];
        },
      },
      {
        title: '下单方式',
        dataIndex: 'orderType',
        align: 'center',
        render: (text, record) => {
          return ORDER_CODE_DIC[record.orderType];
        },
      },
      {
        title: '成交权重',
        dataIndex: 'dealWeight',
        className: 'text-right head-center',
        render: (text, record) => {
          // @ts-ignore
          const val = record?.dealWeight;
          if (val === undefined || val === null) {
            return '-';
          }
          return (val * 100).toFixed(2) + '%';
        },
      },
      {
        title: '成交汇率',
        dataIndex: 'exRate',
        className: 'text-right head-center',
      },
      {
        title: '成交方向',
        dataIndex: 'dealDirection',
        align: 'center',
        render: (text, record) => {
          return DEAL_DIRECTION_DIC[record.dealDirection];
        },
      },
      {
        title: '成交价格',
        dataIndex: 'dealPrice',
        className: 'text-right head-center',
        render: (text, record) => {
          // @ts-ignore
          const val = record?.dealPrice;
          if (val === undefined || val === null) {
            return '-';
          }
          return dealNumThousandsAndFloat(val, 2);
        },
      },
      {
        title: '成交股数(手)',
        dataIndex: 'dealAmount',
        className: 'text-right head-center',
        render: (text, record) => {
          // @ts-ignore
          const val = record?.dealAmount;
          if (val === undefined || val === null) {
            return '-';
          }
          return dealNumThousandsAndFloat(val / 100, 2);
        },
      },
      {
        title: '成交金额(万元)',
        dataIndex: 'dealBalance',
        className: 'text-right head-center',
        render: (text, record) => {
          // @ts-ignore
          const val = record?.dealBalance;
          if (val === undefined || val === null) {
            return '-';
          }
          return dealNumThousandsAndFloat((val / 10000).toFixed(2), 2);
        },
      },
      {
        title: '交易费用',
        dataIndex: 'ordelFee',
        className: 'text-right head-center',
        render: (text, record) => {
          // @ts-ignore
          const val = record?.ordelFee;
          if (val === undefined || val === null) {
            return '-';
          }
          return dealNumThousandsAndFloat(val, 2);
        },
      },
    ];
  }, []);

  const checkJumpUrl = (mpInfo: any) => {
    const { mpCode, mpName, domain } = mpInfo;
    const baseUrl = `/investment/portfolio/mpDealSearch/${mpCode}/${mpName}/${domain}`;
    return baseUrl;
  };

  return (
    <div className={tableData?.length ? '' : 'notHover'}>
      <Table<TableListMpDeal>
        loading={loading}
        key={`id`}
        scroll={{ x: 'max-content' }}
        size={'small'}
        columns={columns}
        dataSource={tableData}
        onChange={pageChange}
        pagination={false}
      />
      <Row style={{ marginTop: '10px' }}>
        <Col flex="100px">{<Link to={checkJumpUrl(portfolioInfo)}>查看历史数据</Link>}</Col>
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
