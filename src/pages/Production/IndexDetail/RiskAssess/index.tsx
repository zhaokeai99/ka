import { memo, useState, useEffect } from 'react';
import { Empty } from 'antd';
import ProCard from '@ant-design/pro-card';
import IndexRadar from './IndexRadar';
import IndexTable from './IndexTable';
import Rater from './Rater';
import { getFundQuotaScore } from './service';

function RiskAssess({ fundId }: { fundId: string }) {
  const [baseData, setBaseData] = useState({
    dataList: [],
    score: 0,
    fundCode: '',
    priceDate: '',
  });

  useEffect(() => {
    (async () => {
      const data = await getFundQuotaScore({ fundCode: fundId });

      data?.dataList?.map((item: any) => {
        item.value = Number(item.value);

        return item;
      });

      setBaseData(data);
    })();
  }, []);

  if (!baseData) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <ProCard style={{ padding: '12px 12px' }} direction="column" ghost gutter={[0, 8]}>
      <ProCard gutter={[8, 0]} ghost>
        <ProCard
          colSpan={24}
          headStyle={{ margin: 'auto', border: 'none' }}
          bodyStyle={{ paddingTop: 0 }}
          layout="center"
          bordered
          title={
            <>
              <span>指数基金：{baseData.fundCode}</span>
              <span style={{ paddingLeft: 20, paddingRight: 10 }}>
                内部风险评级：
                <Rater data={baseData} />
              </span>
              <span>&nbsp;&nbsp;&nbsp;报告期：{baseData.priceDate}</span>
            </>
          }
        >
          <ProCard colSpan={12}>
            <IndexRadar width={300} height={300} data={baseData.dataList} />
          </ProCard>
          <ProCard colSpan={12}>
            <IndexTable />
          </ProCard>
        </ProCard>
      </ProCard>
    </ProCard>
  );
}

export default memo(RiskAssess);
