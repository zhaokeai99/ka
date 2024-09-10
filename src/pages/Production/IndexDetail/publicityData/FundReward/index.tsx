import { useState, useEffect } from 'react';
import { Empty } from 'antd';
import ProCard from '@ant-design/pro-card';
import { queryFundCodeAwardinfoData } from './service';
import { contentPadding } from '@/themes';
import BoothComponent from '@/components/boothComponent';
import moment from 'moment';
import './index.less';

function FundReward({ fundCode }: any) {
  const [awardData, setAwardData] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await queryFundCodeAwardinfoData({ code: fundCode });
      setAwardData(res);
    })();
  }, []);
  if (awardData.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <ProCard
      ghost
      style={{ padding: contentPadding }}
      gutter={[16, 16]}
      size="small"
      wrap
      className="rewardList"
    >
      <div style={{ margin: '0 8px' }}>
        <BoothComponent boothId="prize" />
      </div>
      {awardData.map(({ index, journal, awardinfo, year, fundName, yearDate }) => {
        return (
          <ProCard
            colSpan={6}
            bodyStyle={{ padding: '24px 22px' }}
            className="rewardItem"
            key={index}
          >
            <div className="rewardName">{journal}</div>
            <span className="rewardDate">{moment(yearDate).format('YYYY-MM-DD')}</span>
            <div className="rewardContent">
              {awardinfo}
              <span className="rewardDate">{year}年度</span>
            </div>
            <div className="rewardFund">{fundName}</div>
            <span className="newIcon"></span>
          </ProCard>
        );
      })}
    </ProCard>
  );
}
export default FundReward;
