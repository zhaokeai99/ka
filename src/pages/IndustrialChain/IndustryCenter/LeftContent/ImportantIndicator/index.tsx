import { useContext, useEffect, useState, useCallback } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import TabsContent from './components/TabsContent';
import { Spin } from 'antd';
import { IndustryProvider, queryChainEdbFinanceInfoList } from '../../service';

interface dataType {
  edbData: any;
  financeData: any;
}

// 重点指标
const ImportantIndicator = () => {
  const { industryId, chain, industryName } = useContext(IndustryProvider);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<dataType>({
    edbData: [],
    financeData: [],
  });

  // 获取数据
  const getData = useCallback(
    async (indexType: string) => {
      setLoading(true);

      // 指标type edb = EDB指标，finance = 财务指标
      const { data: list, success } =
        (await queryChainEdbFinanceInfoList({ chainId: industryId, indexType })) || {};

      setLoading(false);

      if (success) {
        return list?.map((item: any) => ({
          data: item,
          title: item[0]?.tableTitle + (item[0]?.unit === '元' ? '（单位：亿元）' : ''),
          abnormalSignal: item[0]?.abnormalSignal,
        }));
      }

      return [];
    },
    [industryId],
  );

  useEffect(() => {
    (async () => {
      const edb: any = await getData('edb');
      const finance: any = await getData('finance');

      setData({
        edbData: edb,
        financeData: finance,
      });
    })();
  }, [industryId]);

  return (
    <ProCardPlus
      title="重点指标"
      extra={
        chain === '1' ? (
          <a
            style={{ fontSize: 12 }}
            href={`#/industrialChain/chainDetail/${industryName}/${industryId}`}
          >
            更多指标 &gt;
          </a>
        ) : null
      }
    >
      <Spin spinning={loading}>
        <TabsContent chain={chain} data={data} />
      </Spin>
    </ProCardPlus>
  );
};

ImportantIndicator.isProCard = true;

export default ImportantIndicator;
