import React, { useEffect, useCallback, useContext, useMemo, useState } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ModelInfoProvider, queryBackTest } from '@/pages/IndustrialChain/Tracking/service';
import { COLORENUM, tagTypeMap } from '@/pages/IndustrialChain/data.d';
import styles from './index.less';

interface DataType {
  abnormalCorr: string;
  abnormalDate: number;
  abnormalReasonShort: string;
  abnormalSignal: string;
  returnRate30days: string;
  returnRate60days: string;
  returnRateMax30days: string;
  returnRateMax60days: string;
  updateFreq: string;
  winRate30days: string;
  winRate60days: string;
}

const IndicatorsTable = () => {
  const { search = {}, modelInfo = {} }: any = useContext(ModelInfoProvider);
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getTableData = useCallback(async () => {
    const { abnormalDate, industryCode } = search;
    const { abnormalId, preAbnormalName } = modelInfo;
    if (abnormalId && preAbnormalName && abnormalDate && industryCode) {
      setLoading(true);

      const { data, success } = await queryBackTest({
        abnormalDate,
        industryCode,
        abnormalId,
        abnormalName: preAbnormalName,
      });

      if (success) {
        setTableData(data ?? []);
      }

      setLoading(false);
    } else {
      setTableData([]);
    }
  }, [modelInfo]);

  // 获取table数据
  useEffect(() => {
    getTableData();
  }, [modelInfo]);

  const tableTitle = () => {
    return (
      <div className={styles['table-title']}>
        *注：季频指标发布日期相较报告日有较大延迟，历史异动相关性和回测计算为保证准确性，会模拟实际情况取数时间向后延；
      </div>
    );
  };

  // 判断涨跌
  const isRose = (value: string) => {
    if (value) {
      const num = value?.split('%')[0];
      const res = /^\d+(\.{0,1}\d+){0,1}$/.test(num);

      return <span style={{ color: res ? COLORENUM.red6 : COLORENUM.green6 }}>{value}</span>;
    } else {
      return '-';
    }
  };

  // 是否大于50%
  const isGreaterThan50 = (value: string) => {
    if (value) {
      const num = value?.split('%')[0];
      const res = +num > 50.0;

      return <span style={{ color: res ? COLORENUM.red6 : COLORENUM.green6 }}>{value}</span>;
    } else {
      return '-';
    }
  };

  const columns: ColumnsType<DataType> = useMemo(() => {
    return [
      {
        title: '异动日期',
        dataIndex: 'abnormalDate',
        key: 'abnormalDate',
        width: 100,
        align: 'center',
        render: (text: string) => text || '-',
      },
      {
        title: '指标频率',
        dataIndex: 'updateFreq',
        key: 'updateFreq',
        width: 100,
        align: 'center',
        render: (text: string) => text || '-',
      },
      {
        title: '持仓30日',
        children: [
          {
            title: '收益率',
            dataIndex: 'returnRate30days',
            key: 'returnRate30days',
            width: 100,
            align: 'center',
            render: (text: string) => {
              return isRose(text);
            },
          },
          {
            title: '最大收益率',
            dataIndex: 'returnRateMax30days',
            key: 'returnRateMax30days',
            width: 120,
            align: 'center',
            render: (text: string) => isRose(text),
          },
          {
            title: '胜率',
            dataIndex: 'winRate30days',
            key: 'winRate30days',
            width: 100,
            align: 'center',
            render: (text: string) => isGreaterThan50(text),
          },
        ],
      },
      {
        title: '持仓60日',
        children: [
          {
            title: '收益率',
            dataIndex: 'returnRate60days',
            key: 'returnRate60days',
            width: 100,
            align: 'center',
            render: (text: string) => isRose(text),
          },
          {
            title: '最大收益率',
            dataIndex: 'returnRateMax60days',
            key: 'returnRateMax60days',
            width: 120,
            align: 'center',
            render: (text: string) => isRose(text),
          },
          {
            title: '胜率',
            dataIndex: 'winRate60days',
            key: 'winRate60days',
            width: 100,
            align: 'center',
            render: (text: string) => isGreaterThan50(text),
          },
        ],
      },
      {
        title: '行情相关性',
        dataIndex: 'abnormalCorr',
        key: 'abnormalCorr',
        width: 100,
        align: 'center',
        render: (text: string) => text || '-',
      },
      {
        title: '调仓建议',
        dataIndex: 'abnormalSignal',
        key: 'abnormalSignal',
        width: 100,
        align: 'center',
        render: (text: string) => {
          return text ? <Tag color={tagTypeMap[text]?.color}>{text}</Tag> : '-';
        },
      },
      {
        title: '异动说明',
        dataIndex: 'abnormalReasonShort',
        key: 'abnormalReasonShort',
        width: 250,
        ellipsis: true,
        align: 'center',
        render: (text: string) => text || '-',
      },
    ];
  }, [modelInfo]);

  return (
    <div className={styles['indicators-table']}>
      <Table
        bordered
        rowKey="abnormalDate"
        size="small"
        loading={loading}
        title={tableTitle}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        scroll={{
          y: 240,
        }}
      />
    </div>
  );
};

export default IndicatorsTable;
