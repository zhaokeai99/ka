import React, { memo, useEffect, useMemo, useState } from 'react';
import type { TableListMpTurnOver } from '../service';
import { MpTurnOverQueryByPage } from '../service';
import {
  MTK_CODE_DIC,
  PortfolioInfo,
} from '@/pages/Investment/Simulation/PortfolioManagement/service';
import { STK_TYPE_DIC } from '../../service';
import { dealNumThousandsAndFloat } from '@/utils/utils';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

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

    const result = await MpTurnOverQueryByPage({
      tradeDate,
      ...params,
      mpCode: portfolioInfo.mpCode,
      domain: portfolioInfo.domain,
    });
    const { data = [], current, pageSize, total } = result || {};

    if (JSON.stringify(result) !== '{}') {
      setTableData(data);
      setPageInfo({ current, pageSize, total });
      onUpdateState('turnover', total);
    } else {
      setTableData([]);
      onUpdateState('turnover', 0);
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

  const columns: ColumnsType<TableListMpTurnOver> = useMemo(() => {
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
          // @ts-ignore
          const val = record?.mtkCode;
          if (val === undefined || val === null) {
            return '-';
          }
          return MTK_CODE_DIC[val];
        },
      },
      {
        title: '调仓前市值',
        dataIndex: 'beforeMv',
        className: 'text-right head-center',
        render: (text, record) => {
          // @ts-ignore
          const val = record?.beforeMv;
          if (val === undefined || val === null) {
            return '-';
          }
          return dealNumThousandsAndFloat(val, 4);
        },
      },
      {
        title: '调仓后市值',
        dataIndex: 'afterMv',
        className: 'text-right head-center',
        render: (text, record) => {
          // @ts-ignore
          const val = record?.afterMv;
          if (val === undefined || val === null) {
            return '-';
          }
          return dealNumThousandsAndFloat(val, 4);
        },
      },
      {
        title: '市值变化',
        dataIndex: 'diffMv',
        className: 'text-right head-center',
        render: (text, record) => {
          // @ts-ignore
          const val = record?.diffMv;
          if (val === undefined || val === null) {
            return '-';
          }
          return dealNumThousandsAndFloat(val, 4);
        },
      },
      {
        title: '调仓市值变化占净值比',
        dataIndex: 'pctChange',
        className: 'text-right head-center',
        render: (text, record) => {
          // @ts-ignore
          const val = record?.pctChange;
          if (val === undefined || val === null) {
            return '-';
          }
          return (val * 100).toFixed(2) + '%';
        },
      },
    ];
  }, []);

  return (
    <div className={tableData?.length ? '' : 'notHover'}>
      <Table<TableListMpTurnOver>
        loading={loading}
        key={`id`}
        scroll={{ x: 'max-content' }}
        size={'small'}
        columns={columns}
        onChange={pageChange}
        dataSource={tableData}
        pagination={{
          ...pageInfo,
          defaultPageSize: pageInfo.pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total, range) => `第 ${range[0]} 到 ${range[1]} 条 | 共 ${total} 条`,
        }}
      />
    </div>
  );
};

export default memo(MpHoldItemTable);
