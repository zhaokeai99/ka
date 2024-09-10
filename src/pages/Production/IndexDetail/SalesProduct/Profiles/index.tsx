import React, { useEffect, useMemo, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { Empty, Radio } from 'antd';
import ProCard from '@ant-design/pro-card';
import { Line } from '@ant-design/charts';
import { queryFundTableInfo, queryFundChartInfo } from '../../../../Marketing/Product/service';
import RangeComponent from '../../../../Marketing/ChannelDistribution/RangeComponent';
import moment from 'moment';
import styles from './index.less';
import ProCardPlus from '@/components/ProCardPlus';

// 概览
export default function (props: any) {
  const { fundCode } = props;
  const [tableData, setTableData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [rangeDate, setRangeDate] = useState<any>({
    startDate: '',
    endDate: '',
  });
  const [yKey, setYkey] = useState('purchaseAmt');
  const initialRangeValue = {
    type: 'months',
    start: moment().startOf('months').format('YYYY-MM-DD'),
    end: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  };

  useEffect(() => {
    (async () => {
      const { data } = await queryFundTableInfo({ fundCode: fundCode });
      setTableData(data);
    })();
  }, [fundCode]);

  useEffect(() => {
    (async () => {
      const { data } = await queryFundChartInfo({
        fundCode: fundCode,
        startDate: rangeDate.startDate || initialRangeValue.start,
        endDate: rangeDate.endDate || initialRangeValue.end,
      });
      setLineData(data);
    })();
  }, [rangeDate, fundCode]);

  const lineConfig = useMemo(
    () => ({
      xField: 'natureDate',
      yField: yKey,
      yAxis: {
        label: {
          formatter: (v: any) => {
            let result = '';
            switch (yKey) {
              case 'purchaseAmt':
              case 'redeemAmt':
              case 'netAmt':
                result = `${Number(v).toLocaleString()} 万`;
                break;
              case 'holdNetAmt':
              case 'stockAmt':
                result = `${Number(v).toLocaleString()} 亿`;
                break;
            }
            return result;
          },
        },
        tickCount: 4,
      },
      tooltip: {
        customContent: (title: any, items: any): any => (
          <>
            <h5 style={{ marginTop: 16 }}>{moment(title).format('YYYY-MM-DD')}</h5>
            <ul style={{ padding: 0 }}>
              {items?.map((item: any, index: number) => {
                const { data } = item;
                return (
                  <div key={index} className={styles.toolTipContainer}>
                    <span className={styles.item}>
                      <span className={styles.label}>申购:</span>
                      <span>{Number(data.purchaseAmt).toLocaleString()} 万</span>
                    </span>
                    <span className={styles.item}>
                      <span className={styles.label}>赎回:</span>
                      <span>{Number(data.redeemAmt).toLocaleString()} 万</span>
                    </span>
                    <span className={styles.item}>
                      <span className={styles.label}>净申购:</span>
                      <span>{Number(data.netAmt).toLocaleString()} 万</span>
                    </span>
                    <span className={styles.item}>
                      <span className={styles.label}>存量规模:</span>
                      <span>{Number(data.stockAmt).toLocaleString()} 亿</span>
                    </span>
                    {data.yearHeadInrRatio !== '0.00%' && (
                      <span className={styles.item}>
                        <span className={styles.label}>年初以来增长:</span>
                        <span>{data.yearHeadInrRatio} </span>
                      </span>
                    )}
                    <span className={styles.item}>
                      <span className={styles.label}>年度保有净增:</span>
                      <span>{Number(data.holdNetAmt).toLocaleString()} 亿</span>
                    </span>
                  </div>
                );
              })}
            </ul>
          </>
        ),
      },
    }),
    [lineData, yKey],
  );

  const radioOnChange = (item: any) => {
    setYkey(item.target.value);
  };

  const columns = [
    {
      title: '日期维度',
      dataIndex: 'dateName',
      key: 'dateName',
      width: 100,
    },
    {
      title: '申购（万）',
      dataIndex: 'purchaseAmt',
      key: 'purchaseAmt',
      valueType: 'BIFundColor',
    },
    {
      title: '赎回（万）',
      dataIndex: 'redeemAmt',
      key: 'redeemAmt',
      valueType: 'BIFundColor',
    },
    {
      title: '净申购（万）',
      dataIndex: 'netAmt',
      key: 'netAmt',
      valueType: 'BIFundColor',
    },
    {
      title: '时点规模（亿）',
      dataIndex: 'stockAmt',
      key: 'stockAmt',
      valueType: 'BIFundColor',
    },
    {
      title: '年度保有净增（亿）',
      dataIndex: 'holdNetAmt',
      key: 'holdNetAmt',
      valueType: 'BIFundColor',
    },
  ];

  const rangeOnChange = (value: any) => {
    setRangeDate({
      startDate: value.startDate || '',
      endDate: value.endDate || '',
    });
  };

  return (
    <ProCardPlus title="销售情况" direction="column" ghost size="small">
      <div style={{ margin: '12px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <RangeComponent
          onChange={rangeOnChange}
          selectType={initialRangeValue.type}
          startDate={initialRangeValue.start}
          endDate={initialRangeValue.end}
        />
      </div>
      <ProCard ghost split="vertical" bordered>
        <ProCard ghost colSpan={12} style={{ paddingTop: '12px' }}>
          <ProTable
            options={false}
            search={false}
            columns={columns}
            dataSource={tableData}
            bordered
            pagination={false}
            rowKey="dateDimension"
            scroll={{ x: 'max-content' }}
          />
        </ProCard>
        <ProCard ghost colSpan={12} style={{ padding: '12px 12px' }}>
          <Radio.Group
            style={{ marginBottom: '12px' }}
            buttonStyle="solid"
            defaultValue="purchaseAmt"
            onChange={radioOnChange}
          >
            <Radio.Button value="purchaseAmt">申购</Radio.Button>
            <Radio.Button value="redeemAmt">赎回</Radio.Button>
            <Radio.Button value="netAmt">净申购</Radio.Button>
            <Radio.Button value="holdNetAmt">年度保有净增</Radio.Button>
            <Radio.Button value="stockAmt">存量规模</Radio.Button>
          </Radio.Group>
          {!lineData || lineData?.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Line {...lineConfig} data={lineData} style={{ height: '300px' }} />
          )}
        </ProCard>
      </ProCard>
    </ProCardPlus>
  );
}
