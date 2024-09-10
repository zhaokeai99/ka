import React, { useEffect, useState } from 'react';
import { Mix } from '@ant-design/plots';
import { Empty, Popover, Spin } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import './index.less';
import ProCard from '@ant-design/pro-card';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface ModalProps {
  dicMap: { domain: []; benchmark: [] };
  data: { dDnv: any[]; retrace: any; mpNv: any[] };
  version: number;
  loading: boolean;
}

const MaxPullbackAnalysisView: React.FC<ModalProps> = (props) => {
  const { data, version, loading } = props;
  const [config, setConfig] = useState<any>({});
  const [chartsData, setChartsDate] = useState<any>({});
  const handleConfig = (chartData: any) => {
    setConfig({
      appendPadding: 8,
      tooltip: {
        shared: true,
      },
      syncViewPadding: true,
      legend: {
        layout: 'horizontal',
        position: 'bottom',
      },
      autoFit: true,
      plots: [
        {
          type: 'area',
          options: {
            data: chartData?.dDnv,
            nice: true,
            xField: 'tradeDate',
            yField: 'maxDrawdown',
            seriesField: 'maxDrawdownName',
            line: {
              style: {
                strokeOpacity: 0,
              },
            },
            yAxis: {
              title: {
                position: 'center',
                text: '回撤率',
              },
              max: 0,
            },
            color: '#13c197',
            smooth: true,
            meta: {
              tradeDate: {
                sync: true,
              },
              maxDrawdown: {
                alias: '净值回撤',
                formatter: (val: number) => `${(val * 100)?.toFixed(4)}%`,
              },
            },
            annotations: [
              {
                type: 'dataMarker',
                position: [data?.retrace?.dataDate, (data?.retrace?.dd || 0) * -1],
                text: {
                  content: `最大回撤：${((data?.retrace?.dd || 0) * -100)?.toFixed(4)}%`,
                },
                direction: 'upward ',
                point: {
                  style: {
                    stroke: '#13c197',
                    lineWidth: 2,
                  },
                },
              },
            ],
          },
        },
        {
          type: 'line',
          options: {
            data: chartData?.mpNv,
            smooth: true,
            nice: true,
            xField: 'tradeDate',
            yField: 'rowValue',
            seriesField: 'rowName',
            color: ['#018ff8'],
            yAxis: {
              line: null,
              grid: null,
              position: 'right',
              min: 'min',
              max: 'max',
              title: {
                position: 'center',
                text: '净值',
              },
            },
            meta: {
              tradeDate: {
                sync: true,
              },
            },
          },
        },
      ],
    });
  };

  //数据
  useEffect(() => {
    if (data === undefined) {
      setChartsDate({});
      handleConfig({});
    } else {
      setChartsDate(data);
      handleConfig(data);
    }
  }, [version]);

  return (
    <ProCard ghost>
      <ProCardPlus
        title={
          <div>
            最大回撤&nbsp;
            <Popover content="组合净值回撤" title="最大回撤">
              <QuestionCircleOutlined />
            </Popover>
          </div>
        }
        split={'horizontal'}
        style={{ height: '100%' }}
      >
        <Spin tip="Loading..." spinning={loading}>
          <div className="charts-empty-style">
            {chartsData?.mpNv?.length ? (
              // @ts-ignore
              <Mix {...config} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        </Spin>
      </ProCardPlus>
    </ProCard>
  );
};

export default MaxPullbackAnalysisView;
