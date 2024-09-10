import React, { memo, useEffect, useState } from 'react';
import { Empty, Rate, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ProCardPlus from '@/components/ProCardPlus';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { queryFundEvaluateData } from './service';
import BoothComponent from '@/components/boothComponent';
interface RankAndRatingProps {
  fundCode: string;
}

// 全市场排名及评价
const RankAndRating: React.FC<RankAndRatingProps> = (props) => {
  const { fundCode } = props;
  const [rankList, setRankList] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await queryFundEvaluateData({ code: fundCode });
      setRankList([
        {
          type: '银河',
          rating: parseInt(res?.galaxyRating || '0'),
          rankData: [
            { label: '近一年来收益率排名', value: res?.year1GalaxyRank },
            { label: '近两年来收益率排名', value: res?.year2GalaxyRank },
            { label: '近三年来收益率排名', value: res?.year3GalaxyRank },
            { label: '近五年来收益率排名', value: res?.year5GalaxyRank },
          ],
          navDate: res.galaxyRankDate,
          dataSource: (
            <span>
              数据来源:银河证券基金评价中心
              <br />
              网址:
              <br />
              http://www.yhzqjj.cn/#/association
            </span>
          ),
          classify: res.galaxyRankClass,
          updateInfo: '周度更新',
        },
        {
          type: '海通',
          rating: parseInt(res?.haitongRating || '0'),
          rankData: [
            { label: '近一年来收益率排名', value: res?.year1HaitongRank },
            { label: '近两年来收益率排名', value: res?.year2HaitongRank },
            { label: '近三年来收益率排名', value: res?.year3HaitongRank },
            { label: '近五年来收益率排名', value: res?.year5HaitongRank },
            { label: '近七年来收益率排名', value: res?.year7HaitongRank },
            { label: '近十年来收益率排名', value: res?.year10HaitongRank },
          ],
          navDate: res.haitongRankDate,
          dataSource: (
            <span>
              数据来源:海通证券基金评价中心
              <br />
              网址:
              <br />
              https://fund.htsec.com/#/?redirectUrl=%2FperfEval%2FgainAnal&dialog=0.35115315780456324
            </span>
          ),
          classify: res.haitongRankClass,
          updateInfo: '月度更新',
        },
      ]);
    })();
  }, [fundCode]);

  return (
    <ProCardPlus style={{ padding: '24px 12px 12px' }} direction="column" ghost gutter={[0, 16]}>
      <BoothComponent boothId="rank01" />
      {!rankList || rankList.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        rankList?.map((item: any, key: number) => (
          <ProCard key={key} ghost>
            <StatisticCard.Group
              style={{ backgroundColor: '#fafafa' }}
              title={
                <>
                  <span style={{ fontSize: '16px', fontWeight: 500 }}>{item.type}同类排名</span>
                  <span style={{ fontWeight: 400 }}>（{item.classify}）</span>
                  <Tooltip title={item.dataSource}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 400,
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginLeft: '8px' }}>{item.type}评级：</span>
                    <Rate
                      disabled
                      value={item.rating}
                      style={{ color: '#FBBE04', fontSize: '14px', marginBottom: '2px' }}
                    />
                    <span style={{ marginLeft: '8px' }}>{item.rating}分</span>
                    <span style={{ marginLeft: '8px', fontSize: '12px' }}>截至{item.navDate}</span>
                    <Tooltip title={item.updateInfo}>
                      <QuestionCircleOutlined style={{ marginLeft: '5px', fontSize: '12px' }} />
                    </Tooltip>
                  </div>
                </>
              }
              direction="row"
            >
              {item.rankData?.map((i: any, k: number) => (
                <StatisticCard
                  key={k}
                  style={{ backgroundColor: 'transparent' }}
                  statistic={{
                    title: i.label,
                    value: i.value || '-',
                    valueStyle: {
                      fontSize: 22,
                    },
                  }}
                />
              ))}
            </StatisticCard.Group>
          </ProCard>
        ))
      )}
    </ProCardPlus>
  );
};

export default memo(RankAndRating);
