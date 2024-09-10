import ProCardPlus from '@/components/ProCardPlus';
import { Empty, Spin } from 'antd';
import { map as _map } from 'lodash';
import { useEffect, useState } from 'react';
import TitleExtra from '../../Components/TitleExtra';
import LineChart from '../LineChart';
import { fundManagerTrendChart } from '../service';
import './index.less';

// 管理规模走势
type PropsType = {
  codes: any;
};

const ScaleTrend = (props: PropsType) => {
  const { codes } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await fundManagerTrendChart({
        codeList: _map(codes, 'code'),
        colName: 'fund_amt',
      });
      setLoading(false);
      setData(result);
    })();
  }, [codes]);

  return (
    <ProCardPlus title="管理规模走势" extra={<TitleExtra id="manageScale" />}>
      <Spin tip="加载中..." spinning={loading}>
        <div className="pk-scale-trend-empty-style">
          {data.length ? <LineChart data={data} type="AMT" /> : <Empty />}
        </div>
      </Spin>
    </ProCardPlus>
  );
};

ScaleTrend.isProCard = true;

export default ScaleTrend;
