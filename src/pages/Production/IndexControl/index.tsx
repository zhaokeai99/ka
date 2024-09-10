import React, { useState, useEffect } from 'react';
import { Radio, Select, Row, Col } from 'antd';
import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import Ratio from './Ratio';
import IndexArea from './IndexArea';

import { fetchIndexSortSys, linearIndexSectorNav } from './service';
import './index.less';
const { Option } = Select;

// 范围枚举
const RangeMap = {
  0: null,
  1: true,
  2: false,
};

const IndexControl: React.FC = () => {
  const [sortSys, setSortSys] = useState([{ id: '', name: '' }]); // 行业
  const [sysId, setSysId] = useState(''); // 选中的id
  const [period, setPeriod] = useState('LATEST_3_YEAR');
  const [periodData, setPeriodData] = useState<any>([]); // 折线图
  const [ratioData, setRatioData] = useState<any>([]); // 下面的柱状图
  const [floodFund, setFloodFund] = useState(0); // 选中的范围

  // 指数行业分类
  useEffect(() => {
    (async () => {
      const data = await fetchIndexSortSys({ securitiesType: 'FUND' });

      if (data && data.length) {
        setSysId(data[0].id);
        setSortSys(data);
      }
    })();
  }, []);

  // 全赛道季频总规模折线图
  useEffect(() => {
    (async () => {
      if (sysId) {
        const periodList = await linearIndexSectorNav({
          securitiesSortSysId: sysId,
          period,
          floodFund: RangeMap[floodFund],
        });

        setPeriodData(periodList);
      }
    })();
  }, [period, sysId, floodFund]);

  // 获取赛道
  useEffect(() => {
    (async () => {
      if (sysId) {
        const ratioList = await linearIndexSectorNav({
          securitiesSortSysId: sysId,
          period: 'LATEST_QUARTER', // 写死获取近一季度
          floodFund: RangeMap[floodFund],
        });

        setPeriod('LATEST_3_YEAR');
        setRatioData(ratioList);
      }
    })();
  }, [sysId, floodFund]);

  return (
    <ProCard ghost gutter={[8, 8]} direction="column" size="small" style={{ padding: '12px' }}>
      <ProCard>
        <Row align="middle">
          <Col style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ marginLeft: '20px' }}>范围：</label>
            <Radio.Group
              value={floodFund}
              size="small"
              buttonStyle="solid"
              onChange={(e: any) => setFloodFund(e?.target?.value)}
            >
              <Radio.Button value={0}>全市场</Radio.Button>
              <Radio.Button value={1}>场内</Radio.Button>
              <Radio.Button value={2}>场外</Radio.Button>
            </Radio.Group>
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ marginLeft: '20px' }}>指数行业分类： </label>
            <Select
              key={sortSys[0]?.id}
              defaultValue={sortSys[0]?.id}
              style={{ width: '200px' }}
              onChange={(id) => setSysId(id)}
            >
              {sortSys.map(({ id, name }) => {
                return (
                  <Option key={id} value={id}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          </Col>
        </Row>
      </ProCard>
      <ProCardPlus title="指数产品规模分析" direction="column">
        <ProCard
          colSpan={24}
          headStyle={{ border: 'none' }}
          title="全市场资金赛道分布"
          extra={
            <Radio.Group
              value={period}
              buttonStyle="solid"
              size="small"
              onChange={(e) => {
                setPeriod(e.target.value);
              }}
            >
              <Radio.Button value="LATEST_QUARTER">近1季度</Radio.Button>
              <Radio.Button value="LATEST_HALF_YEAR">近半年</Radio.Button>
              <Radio.Button value="LATEST_1_YEAR">近一年</Radio.Button>
              <Radio.Button value="THIS_YEAR">今年以来</Radio.Button>
              <Radio.Button value="LATEST_3_YEAR">近三年</Radio.Button>
            </Radio.Group>
          }
        >
          <IndexArea data={periodData} />
        </ProCard>
        <Ratio data={ratioData} floodFund={RangeMap[floodFund]} />
      </ProCardPlus>
    </ProCard>
  );
};

export default IndexControl;
