import ProCardPlus from '@/components/ProCardPlus';
import { Descriptions, Empty } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { queryAllMarketFundInfo } from '../service';

const { Item } = Descriptions;
interface FullMarketDetailProps {
  fundCode: string;
}

// 全市场基本信息
const FullMarketDetail: React.FC<FullMarketDetailProps> = (props) => {
  const { fundCode } = props;
  const [basicInfo, setBasicInfo] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await queryAllMarketFundInfo({ fundCode });
      setBasicInfo([
        [
          { label: '托管人', value: res?.custodianName },
          { label: '托管费', value: res?.custodianRate },
          { label: '管理费', value: res?.managerRate },
          { label: '销售手续费', value: res?.salesServiceRate },
          { label: 'wind投资分类一级', value: res?.windLevel1InvestType },
          { label: 'wind投资分类二级', value: res?.windLevel2InvestType },
          { label: 'wind投资分类三级', value: res?.windLevel3InvestType },
        ],
        [
          { label: '银河分类一级', value: res?.galaxyLevel1InvestType },
          { label: '银河分类二级', value: res?.galaxyLevel2InvestType },
          { label: '海通分类一级', value: res?.haitongLevel1InvestType },
          { label: '海通分类二级', value: res?.haitongLevel2InvestType },
          { label: '晨星评级', value: res?.morningstaRating },
          { label: '银河评级', value: res?.galaxyRating },
          { label: '海通评级', value: res?.haitongRating },
        ],
      ]);
    })();
  }, [fundCode]);

  return (
    <ProCardPlus style={{ padding: '24px 12px 12px' }} direction="column" ghost gutter={[0, 8]}>
      {!basicInfo || basicInfo.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        basicInfo?.map((item: any, key: number) => (
          <Descriptions key={key} column={4}>
            {item?.map((i: any, k: number) => (
              <Item key={k} label={i.label}>
                {i.value || '-'}
              </Item>
            ))}
          </Descriptions>
        ))
      )}
    </ProCardPlus>
  );
};

export default memo(FullMarketDetail);
