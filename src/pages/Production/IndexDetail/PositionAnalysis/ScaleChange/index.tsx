import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/charts';
import { EMPTY_DESC, queryHistoryFundAssetAmt } from '../../service';
import { Empty, Spin } from 'antd';
import moment from 'moment';
import ProCard from '@ant-design/pro-card';
import '../index.less';

type PropsType = {
  fundCode: string;
};

const ScaleChange = (props: PropsType) => {
  const { fundCode } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await queryHistoryFundAssetAmt({
        colNames: 'fund_asset_amt',
        fundCodes: [fundCode], // 与基金pk共用一个接口，参数参照基金pk格式
      });
      setLoading(false);
      setData(result || []);
    })();
  }, [fundCode]);

  const config: any = {
    data,
    appendPadding: 10,
    style: {
      height: '320px',
      width: '100%',
    },
    xField: 'assetAmtDate',
    yField: 'fundAssetAmt',
    meta: {
      fundAssetAmt: {
        alias: '规模',
        formatter: (v: any) => `${v}亿`,
      },
      assetAmtDate: {
        formatter: (text: any) => moment(text).format('YYYY-MM-DD'),
      },
    },
  };

  return (
    <ProCard bordered ghost title="规模变动" style={{ height: '100%' }}>
      <Spin tip="加载中..." spinning={loading}>
        <div className="chart-empty-style">
          {data.length ? <Line {...config} /> : <Empty description={EMPTY_DESC} />}
        </div>
      </Spin>
    </ProCard>
  );
};

ScaleChange.isProCard = true;

export default ScaleChange;
