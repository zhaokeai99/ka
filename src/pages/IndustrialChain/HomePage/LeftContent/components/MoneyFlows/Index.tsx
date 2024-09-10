import ProCardPlus from '@/components/ProCardPlus';
import { COLORENUM } from '@/pages/IndustrialChain/data.d';
import { Treemap } from '@ant-design/plots';
import { Col, Empty, Row } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import { queryIndustryMoneyFlow } from '../../service';

const COLORTYPE = {
  跌幅大: COLORENUM['green2'],
  跌幅小: COLORENUM['green1'],
  无涨跌: COLORENUM['gray'],
  涨幅小: COLORENUM['red1'],
  涨幅大: COLORENUM['red2'],
};

const legendList = [
  {
    label: '跌幅大(>1.5%)',
    clo: COLORTYPE['跌幅大'],
  },
  {
    label: '跌幅小(-1.5%~0%)',
    clo: COLORTYPE['跌幅小'],
  },
  {
    label: '无涨跌',
    clo: COLORTYPE['无涨跌'],
  },
  {
    label: '涨幅小(0%~1.5%)',
    clo: COLORTYPE['涨幅小'],
  },
  {
    label: '涨幅大(>1.5%)',
    clo: COLORTYPE['涨幅大'],
  },
];

// 资金流向
const MoneyFlows = () => {
  const [treeData, setTreeData] = useState<any>({ name: '', children: [] });

  const config: any = useMemo(
    () => ({
      legend: false,
      colorField: 'increase',
      color: ({ increase }: any) => {
        if (increase <= -1.5) {
          return COLORTYPE['跌幅大'];
        } else if (increase > -1.5 && increase < 0) {
          return COLORTYPE['跌幅小'];
        } else if (increase === 0) {
          return COLORTYPE['无涨跌'];
        } else if (0 < increase && increase <= 1.5) {
          return COLORTYPE['涨幅小'];
        }

        return COLORTYPE['涨幅大'];
      },
      label: {
        style: {
          textAlign: 'center',
          fontSize: 10,
          fill: 'rgba(0, 0, 0, 0.65)',
        },
        content: ({ data }: any) => {
          const { name, capitalInflow, increase } = data || {};

          return `${name}\n${capitalInflow}亿\n${increase}%`;
        },
      },
      tooltip: {
        customContent: (title: any, items: any): any => (
          <ul style={{ padding: 0, paddingTop: 12, textAlign: 'center', lineHeight: '25px' }}>
            {(items || []).map((item: any) => {
              const {
                data: { name, capitalInflow, increase, industryCode },
              } = item || {};

              return (
                <li key={industryCode}>
                  <div>{`行业：${name}`}</div>
                  <div>{`资金净流入： ${capitalInflow}亿`}</div>
                  <div>{`涨跌幅：${increase}%`}</div>
                </li>
              );
            })}
          </ul>
        ),
      },
    }),
    [],
  );

  const getList = useCallback(async () => {
    const result = (await queryIndustryMoneyFlow()) || [];

    const chartData = {
      name: 'root',
      children: result?.map((item: any) => ({
        ...item,
        name: item?.industryName,
        value: item?.capitalInflow,
      })),
    };

    setTreeData(chartData || {});
  }, []);

  useEffect(() => {
    getList();
  }, []);

  return (
    <ProCardPlus title="资金流向" layout="center">
      {treeData?.children?.length <= 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div style={{ width: '100%' }}>
          <Treemap
            {...config}
            data={treeData}
            style={{ height: 384 }}
            onReady={(plot: any) => {
              plot?.on('element:click', (evt: any) => {
                const { industryName, industryCode, chain } = evt?.data?.data || {};

                history.push(
                  `/industrialChain/industryCenter/${industryName}/${industryCode}/${chain}`,
                );
              });
            }}
          />
          <div
            style={{
              fontSize: '10px',
              color: 'rgba(0,0,0,0.45)',
              textAlign: 'left',
              marginTop: '5px',
            }}
          >
            地图面积越大代表主力流入/流出越大；地图红绿深浅代表涨跌幅大小
          </div>
          <Row>
            {legendList.map(({ clo, label }) => (
              <Col xxl={8} xl={12} key={label}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    background: clo,
                    marginRight: '10px',
                  }}
                ></span>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'rgba(0,0,0,0.65)',
                  }}
                >
                  {label}
                </span>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </ProCardPlus>
  );
};

MoneyFlows.isProCard = true;

export default MoneyFlows;
