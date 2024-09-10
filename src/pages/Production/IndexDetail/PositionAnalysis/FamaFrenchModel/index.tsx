import { Column } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import { Empty, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { EMPTY_DESC, queryFundDetailNavRegff3ModelData } from '../../service';
import '../index.less';

type PropsType = {
  fundCode: string;
};

const FamaFrenchModel = (props: PropsType) => {
  const { fundCode } = props;
  const [data, setData] = useState<any[]>([]);
  const [coefficient, setCoefficient] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await queryFundDetailNavRegff3ModelData({ fundCodes: [fundCode] });
      setLoading(false);
      if (res && res.length !== 0) {
        setData([
          { name: '市场因子', value: res[0]?.ff3Mkt || 0 },
          { name: '规模因子', value: res[0]?.ff3Smb || 0 },
          { name: '价值因子', value: res[0]?.ff3Hml || 0 },
        ]);
      }
      setCoefficient(res[0]?.rsquared || '');
    })();
  }, [fundCode]);

  const config: any = {
    data,
    appendPadding: 10,
    xField: 'name',
    yField: 'value',
    style: {
      height: '320px',
      width: '100%',
    },
    maxColumnWidth: 36,
    tooltip: {
      formatter: (item: any) => {
        return { name: item.name, value: item.value };
      },
    },
  };

  return (
    <ProCard ghost bordered title="Fama-French三因子模型" style={{ height: '100%' }}>
      <Spin tip="加载中..." spinning={loading}>
        <div className="chart-empty-style">
          {data.length ? (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ margin: '10px 10px 0 auto' }}>
                R<sup>2</sup> = {coefficient}
              </div>
              <Column {...config} />
            </div>
          ) : (
            <Empty description={EMPTY_DESC} />
          )}
        </div>
      </Spin>
    </ProCard>
  );
};

FamaFrenchModel.isProCard = true;

export default FamaFrenchModel;
