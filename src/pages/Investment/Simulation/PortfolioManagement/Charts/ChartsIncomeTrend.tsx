import React, { memo, useEffect, useState } from 'react';
import { DualAxes } from '@ant-design/plots';
import ProCard from '@ant-design/pro-card';
import { Descriptions, Divider, Empty, Popover, Spin } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ColorSpan from '@/components/ColorSpan';

interface ModalProps {
  dicMap: { domain: []; benchmark: [] };
  data: any;
  detail: any;
  version: number;
  loading: boolean;
}

// 弹窗
const ChartsIncomeTrendModal = (props: ModalProps) => {
  const { data, detail, version, loading } = props;

  const [config, setConfig] = useState<any>({});

  const COLOR_PLATE_10 = ['#5B8FF9', '#5AD8A6', '#E8684A'];

  const handleConfig = (d: any) => {
    setConfig({
      data: [d?.lineData, d?.ColumnData],
      xField: 'tradeDate',
      yField: ['valueDec', 'value2'],
      geometryOptions: [
        {
          geometry: 'line',
          seriesField: 'idxName',
          smooth: true,
          color: COLOR_PLATE_10,
          lineStyle: ({ idxName }) => {
            if (idxName === '调整时点') {
              return {
                lineWidth: 0,
              };
            }
          },
          point: {
            style: ({ idxName }: any) => {
              let flg = {};
              if (idxName !== '调整时点') {
                flg = {
                  r: 0,
                };
              }
              return flg;
            },
          },
          state: {
            active: {
              style: ({ idxName }: any) => {
                let flg = {};
                if (idxName === '调整时点') {
                  flg = {
                    lineWidth: 0,
                  };
                }
                return flg;
              },
            },
          },
          tooltip: {
            formatter: ({ idxName, valueDec }: any) => {
              return { name: idxName, value: valueDec.toFixed(4) + '%' };
            },
          },
        },
        {
          geometry: 'column',
          seriesField: 'idxName',
          tooltip: {
            formatter: ({ idxName, value2 }: any) => {
              return { name: idxName, value: value2.toFixed(4) + '%' };
            },
          },
          color: '#e7e7e7',
        },
      ],
      meta: {
        valueDec: {
          // 数值格式化为千分位
          formatter: (v2: string) => `${v2}%`,
        },
        value2: {
          // 数值格式化为千分位
          formatter: (v1: string) => `${v1}%`,
        },
      },
      legend: {
        layout: 'horizontal',
        position: 'bottom',
      },
    });
  };

  //数据
  useEffect(() => {
    if (JSON.stringify(data) === '{}') {
      handleConfig({});
    } else {
      handleConfig(data);
    }
  }, [version]);

  return (
    <ProCardPlus
      title={
        <div>
          收益走势&nbsp;
          <Popover content="组合及基准累计收益" title="收益走势">
            <QuestionCircleOutlined />
          </Popover>
        </div>
      }
      split={'horizontal'}
      style={{ marginBottom: 10 }}
    >
      <ProCard bordered split={'vertical'}>
        <ProCard colSpan="70%">
          <Spin tip="Loading..." spinning={loading}>
            {data?.lineData?.length ? (
              <DualAxes {...config} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Spin>
        </ProCard>
        <ProCard colSpan="30%" bodyStyle={{ padding: 0 }}>
          <Spin tip="Loading..." spinning={loading}>
            <Descriptions
              size={'small'}
              column={1}
              bordered
              contentStyle={{ textAlign: 'right' }}
              labelStyle={{ width: '50%' }}
            >
              <Descriptions.Item
                label={
                  <div>
                    组合收益率&nbsp;
                    <Popover
                      content={
                        <div>
                          𝑅𝑒𝑡𝑢𝑟𝑛𝑠(𝑃)=(𝑃𝑒𝑛𝑑 − 𝑃𝑠𝑡𝑎𝑟𝑡) / 𝑃𝑠𝑡𝑎𝑟𝑡 ∗ 100%
                          <br />
                          <br />
                          𝑃𝑠𝑡𝑎𝑟𝑡: 组合期初净值
                          <br />
                          𝑃𝑒𝑛𝑑: 组合期末净值
                        </div>
                      }
                      title="组合收益率 𝑅𝑒𝑡𝑢𝑟𝑛𝑠(𝑃)"
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                }
              >
                {detail?.NetGrowthRatio ? (
                  <ColorSpan value={detail?.NetGrowthRatio} suffix={'%'} />
                ) : null}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    基准收益率&nbsp;
                    <Popover
                      content={
                        <div>
                          𝑅𝑒𝑡𝑢𝑟𝑛𝑠(𝐵)=(𝐵𝑒𝑛𝑑 − 𝐵𝑠𝑡𝑎𝑟𝑡) / 𝐵𝑠𝑡𝑎𝑟𝑡 ∗ 100%
                          <br />
                          <br />
                          𝐵𝑠𝑡𝑎𝑟𝑡: 基准期初净值
                          <br />
                          𝐵𝑒𝑛𝑑: 基准期末净值
                          <Divider plain />
                          复合基准收益率 = 𝑆𝑢𝑚(𝑅𝑒𝑡𝑢𝑟𝑛𝑠(𝐵)𝑖 * 𝑊𝑖)
                          <br />
                          <br />
                          𝑅𝑒𝑡𝑢𝑟𝑛𝑠(𝐵)𝑖: 子基准收益率
                          <br />
                          𝑊𝑖: 子基准权重，其中，𝑆𝑢𝑚(𝑊𝑖) = 100%
                        </div>
                      }
                      title="基准收益率 𝑅𝑒𝑡𝑢𝑟𝑛𝑠(𝐵)"
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                }
              >
                {detail?.BenchmarkNetGrowthRatio ? (
                  <ColorSpan value={detail?.BenchmarkNetGrowthRatio} suffix={'%'} />
                ) : null}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    超额收益率&nbsp;
                    <Popover
                      content={
                        <div>
                          𝐸𝐼 = 𝑅𝑒𝑡𝑢𝑟𝑛𝑠(𝑃) - 𝑅𝑒𝑡𝑢𝑟𝑛𝑠(𝐵)
                          <br />
                          <br />
                          𝑅𝑒𝑡𝑢𝑟𝑛𝑠(𝑃): 组合区间收益率
                          <br />
                          𝑅𝑒𝑡𝑢𝑟𝑛𝑠(𝐵): 基准区间收益率
                        </div>
                      }
                      title="超额收益率 𝐸𝐼"
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                }
              >
                {detail?.ExcessReturns ? (
                  <ColorSpan value={detail?.ExcessReturns} suffix={'%'} />
                ) : null}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    年化收益率&nbsp;
                    <Popover
                      content={
                        <div>
                          𝑅𝑝 = ((1+𝑅𝑒𝑡𝑢𝑟𝑛𝑠(𝑃)) ** (250 / 𝐷𝑎𝑦𝑠) - 1) ∗ 100%
                          <br />
                          <br />
                          𝑅𝑒𝑡𝑢𝑟𝑛𝑠(𝑃): 组合区间收益率
                          <br />
                          𝐷𝑎𝑦𝑠: 区间交易日天数
                        </div>
                      }
                      title="年化收益率 𝑅𝑝"
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                }
              >
                {detail?.AnnualizedReturns ? (
                  <ColorSpan value={detail?.AnnualizedReturns} suffix={'%'} />
                ) : null}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    换手率&nbsp;
                    <Popover
                      content={<div>𝑇 = 区间换手总金额 / 组合区间内交易日净值均值</div>}
                      title="换手率 𝑇"
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                }
              >
                {detail?.TurnoverRatio}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    夏普比率&nbsp;
                    <Popover
                      content={
                        <div>
                          𝑆ℎ𝑎𝑟𝑝𝑒 𝑅𝑎𝑡𝑖𝑜 = (𝑅𝑝−𝑅𝑓) / 𝜎𝑝
                          <br />
                          <br />
                          𝑅𝑝: 组合年化收益率
                          <br />
                          𝑅𝑓: 无风险利率（默认0.04）
                          <br />
                          𝜎𝑝: 组合收益波动率，组合净值每日增长率标准差年化
                        </div>
                      }
                      title="夏普比率 𝑆ℎ𝑎𝑟𝑝𝑒 𝑅𝑎𝑡𝑖𝑜"
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                }
              >
                {detail?.Sharpe}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    索提诺比率&nbsp;
                    <Popover
                      content={
                        <div>
                          𝑆𝑜𝑟𝑡𝑖𝑛𝑜 𝑅𝑎𝑡𝑖𝑜 = (𝑅𝑝−𝑅𝑓) / 𝜎𝑝𝑑
                          <br />
                          <br />
                          𝑅𝑝: 组合年化收益率
                          <br />
                          𝑅𝑓: 无风险利率（默认0.04）
                          <br />
                          𝜎𝑝𝑑: 组合下行波动率，和收益波动率相比，下行标准差区分了好的和坏的波动
                        </div>
                      }
                      title="索提诺比率 𝑆𝑜𝑟𝑡𝑖𝑛𝑜 𝑅𝑎𝑡𝑖𝑜"
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                }
              >
                {detail?.Sortino}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    信息比率&nbsp;
                    <Popover
                      content={
                        <div>
                          𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑅𝑎𝑡𝑖𝑜 = (𝑅𝑝−𝑅𝑚) / 𝜎𝑡
                          <br />
                          <br />
                          𝑅𝑝: 组合年化收益率
                          <br />
                          𝑅𝑚: 基准年化收益率
                          <br />
                          𝜎𝑡: 组合与基准每日收益差值的年化标准差
                        </div>
                      }
                      title="信息比率 𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑅𝑎𝑡𝑖𝑜"
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                }
              >
                {detail?.InformationRatio}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    Alpha&nbsp;
                    <Popover
                      content={
                        <div>
                          𝐴𝑙𝑝ℎ𝑎 = 𝛼 = 𝑅𝑝 −[𝑅𝑓 + 𝛽𝑝 * (𝑅𝑚 − 𝑅𝑓)]
                          <br />
                          <br />
                          𝑅𝑝: 组合年化收益率
                          <br />
                          𝑅𝑚: 基准年化收益率
                          <br />
                          𝑅𝑓: 无风险利率（默认0.04）
                          <br />
                          𝛽𝑝: 组合𝑏𝑒𝑡𝑎值
                          <br />
                          <br />
                          𝛼&gt;0: 组合相对于风险，获得了超额收益
                          <br />
                          𝛼=0: 组合相对于风险，获得了适当收益
                          <br />
                          𝛼&lt;0: 组合相对于风险，获得了较少收益
                        </div>
                      }
                      title="Alpha"
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                }
              >
                {detail?.Alpha}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    Beta&nbsp;
                    <Popover
                      content={
                        <div>
                          𝐵𝑒𝑡𝑎 = 𝛽𝑝 = 𝐶𝑜𝑣(𝐷𝑝, 𝐷𝑚) / 𝑉𝑎𝑟(𝐷𝑚)
                          <br />
                          <br />
                          𝐷𝑝: 组合每日收益
                          <br />
                          𝐷𝑚: 基准每日收益
                          <br />
                          𝐶𝑜𝑣(𝐷𝑝,𝐷𝑚): 组合每日收益与基准每日收益的协方差
                          <br />
                          𝑉𝑎𝑟(𝐷𝑚): 基准每日收益的方差
                          <br />
                          <br />
                          𝛽𝑝&lt;0: 组合和基准的走向通常反方向，如空头头寸类
                          <br />
                          𝛽𝑝=0: 组合和基准的走向没有相关性，如固定收益类
                          <br />
                          0&lt;𝛽𝑝&lt;1: 组合和基准的走向相同，但是比基准的移动幅度更小
                          <br />
                          𝛽𝑝=1: 组合和基准的走向相同，并且和基准的移动幅度贴近
                          <br />
                          𝛽𝑝&gt;1: 组合和基准的走向相同，但是比基准的移动幅度更大
                        </div>
                      }
                      title="Beta"
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                }
              >
                {detail?.Beta}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    最大回撤&nbsp;
                    <Popover
                      content={
                        <div>
                          𝑀𝑎𝑥 𝐷𝑟𝑎𝑤𝑑𝑜𝑤𝑛 = 𝑀𝑎𝑥((𝑃𝑥−𝑃𝑦)/𝑃𝑥)
                          <br />
                          <br />
                          𝑃𝑥,𝑃𝑦: 组合某日净值，𝑦&gt;𝑥
                        </div>
                      }
                      title="最大回撤 𝑀𝑎𝑥 𝐷𝑟𝑎𝑤𝑑𝑜𝑤𝑛"
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                }
              >
                {detail?.MaxDrawdown}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    超额胜率&nbsp;
                    <Popover
                      content={
                        <div>
                          超额胜率 = 组合期间每日超额收益大于0的天数 / 𝐷𝑎𝑦𝑠
                          <br />
                          <br />
                          𝐷𝑎𝑦𝑠: 区间交易日天数
                        </div>
                      }
                      title="超额胜率"
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                }
              >
                {detail?.ExcessWinRatio}
              </Descriptions.Item>
            </Descriptions>
          </Spin>
        </ProCard>
      </ProCard>
    </ProCardPlus>
  );
};
export default memo(ChartsIncomeTrendModal);
