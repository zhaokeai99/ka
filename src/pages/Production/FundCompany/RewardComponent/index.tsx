import { useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { Empty } from 'antd';
import { queryCompanyAwardinfoData } from './service';
import SearchForm from './SearchForm';
import moment from 'moment';
import './index.less';

export default function ({ code }: any) {
  const Config = [
    {
      key: '0',
      name: '产品奖项',
    },
    {
      key: '1',
      name: '公司奖项',
    },
  ];
  const [activeTabKey, setActiveTabKey] = useState(0);
  const initialParams = {
    awardinfo: '',
    fundName: '',
    date: [null, null],
  };

  const [awardData, setAwardData] = useState([]);
  const fetchAwardData = async (para: any) => {
    const res = await queryCompanyAwardinfoData({
      code,
      companyProduct: activeTabKey,
      startDate: para.date
        ? para.date[0] || para.date
          ? moment(para.date[0]).format('YYYYMMDD')
          : null
        : null,
      endDate: para.date ? (para.date[1] ? moment(para.date[1]).format('YYYYMMDD') : null) : null,
      fundName: '',
      ...para,
    });
    setAwardData(res);
  };
  useEffect(() => {
    (async () => {
      fetchAwardData(initialParams);
    })();
  }, [activeTabKey]); //

  return (
    <ProCard bodyStyle={{ padding: 0 }}>
      {/* <ProCard
        ghost
        style={{ padding: contentPadding }}
        gutter={[16, 16]}
        size="small"
        wrap
        className="rewardList"
      > */}
      <ProCard
        ghost
        tabs={{
          type: 'card',
          tabPosition: 'top',
          onChange: (key: any) => setActiveTabKey(key),
        }}
      >
        {Config.map((item) => {
          return (
            <ProCard.TabPane
              key={item.key}
              tab={
                <div>
                  <span className="new"></span>
                  {item.name}
                </div>
              }
              className="rewardList"
              style={{ padding: 0 }}
              // cardProps={{ wrap: true }}
            >
              <ProCard bodyStyle={{ padding: 0 }} wrap>
                <ProCard colSpan={24} bodyStyle={{ padding: 0 }}>
                  <SearchForm
                    onFinish={(values: any) => {
                      fetchAwardData(values);
                    }}
                    onReset={() => {
                      fetchAwardData(initialParams);
                    }}
                    currentTab={activeTabKey}
                  />
                </ProCard>
                <ProCard gutter={[16, 16]} wrap bodyStyle={{ padding: 0 }} colSpan={24}>
                  {awardData.length === 0 ? (
                    <ProCard layout="center">
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </ProCard>
                  ) : (
                    awardData.map(({ index, journal, awardinfo, year, fundName, yearDate }) => {
                      return (
                        <ProCard
                          colSpan={6}
                          bodyStyle={{ padding: '24px 22px' }}
                          className="rewardItem"
                          key={index}
                        >
                          <div className="rewardName">{journal}</div>
                          <span className="rewardDate">
                            {moment(yearDate).format('YYYY-MM-DD')}
                          </span>
                          <div className="rewardContent">
                            {awardinfo}
                            <span className="rewardDate">{year}年度</span>
                          </div>
                          <div className="rewardFund">{fundName}</div>
                          <span className="newIcon"></span>
                        </ProCard>
                      );
                    })
                  )}
                </ProCard>
              </ProCard>
            </ProCard.TabPane>
          );
        })}
      </ProCard>
    </ProCard>
  );
}
