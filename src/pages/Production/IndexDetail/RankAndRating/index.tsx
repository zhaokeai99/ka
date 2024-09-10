import React, { memo, useEffect, useState } from 'react';
import { Empty, Rate, DatePicker } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { queryAllMarketFundInfo } from '../service';
import BoothComponent from '@/components/boothComponent';
import moment from 'moment';
interface RankAndRatingProps {
  fundCode: string;
}

// 全市场排名及评价
const RankAndRating: React.FC<RankAndRatingProps> = (props) => {
  const { fundCode } = props;
  const [navDate, setNavDate] = useState(null);
  const [rankList, setRankList] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await queryAllMarketFundInfo({ fundCode, navDate });
      setNavDate(res.navDate);
    })();
  }, [fundCode]);

  useEffect(() => {
    (async () => {
      const res = await queryAllMarketFundInfo({ fundCode, navDate });
      setRankList([
        {
          type: '银河',
          rating: parseInt(res?.galaxyRating || '0'),
          rankData: [
            { label: '近半年来收益率排名', value: res?.galaxyMon6IncomeRateRank },
            { label: '近一年来收益率排名', value: res?.galaxyYear1IncomeRateRank },
            { label: '近三年来收益率排名', value: res?.galaxyYear3IncomeRateRank },
            { label: '今年以来收益率排名', value: res?.galaxyYearThisIncomeRateRank },
          ],
        },
        {
          type: '晨星',
          rating: parseInt(res?.morningstaRating || '0'),
          rankData: [
            { label: '近半年来收益率排名', value: res?.morningstaMon6IncomeRateRank },
            { label: '近一年来收益率排名', value: res?.morningstaYear1IncomeRateRank },
            { label: '近三年来收益率排名', value: res?.morningstaYear3IncomeRateRank },
            { label: '今年以来收益率排名', value: res?.morningstaYearThisIncomeRateRank },
          ],
        },
        {
          type: '海通',
          rating: parseInt(res?.haitongRating || '0'),
          rankData: [
            { label: '近半年来收益率排名', value: res?.haitongMon6IncomeRateRank },
            { label: '近一年来收益率排名', value: res?.haitongYear1IncomeRateRank },
            { label: '近三年来收益率排名', value: res?.haitongYear3IncomeRateRank },
            { label: '今年以来收益率排名', value: res?.haitongYearThisIncomeRateRank },
          ],
        },
      ]);
    })();
  }, [fundCode, navDate]);

  return (
    <ProCardPlus style={{ padding: '24px 12px 12px' }} direction="column" ghost gutter={[0, 16]}>
      <BoothComponent boothId="rank" />
      <span style={{ marginLeft: '10px' }}>
        排名截至日期：
        <DatePicker
          value={moment(navDate)}
          onChange={(dateString: any) => {
            setNavDate(moment(dateString).format('YYYYMMDD'));
          }}
          allowClear={false}
        />
      </span>
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
                  <span style={{ fontWeight: 400 }}>（{item.type}一级分类）</span>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 400,
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginLeft: '24px' }}>{item.type}评级：</span>
                    <Rate
                      disabled
                      value={item.rating}
                      style={{ color: '#FBBE04', fontSize: '14px', marginBottom: '2px' }}
                    />
                    <span style={{ marginLeft: '10px' }}>{item.rating}分</span>
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
