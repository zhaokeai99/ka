import React from 'react';
import { Empty, List, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { useEffect, useState } from 'react';
import './index.less';

const HolderList = ({ fundCode, baseDates, fetch = () => {} }: any) => {
  const [loading, setLoading] = useState(false);
  const [holderListData, setHolderListData] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await fetch({
        fundCode: fundCode,
      });
      setHolderListData(result);
      setLoading(false);
    })();
  }, []);

  return (
    <ProCard
      loading={loading}
      title={
        <span>
          机构持有人前十大
          <Tooltip
            title={
              <span>
                母基金维度数据，根据产品最近一个交易日持仓数据计算得出，非定报数据，仅供参考
              </span>
            }
          >
            <QuestionCircleOutlined
              style={{ fontSize: '12px', color: '#999', marginLeft: '2px' }}
            />
          </Tooltip>
        </span>
      }
      bodyStyle={{ padding: 0 }}
      extra={`截至${baseDates?.businessDay}`}
    >
      {!Array.isArray(holderListData) || holderListData.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div>
          <List
            style={{ width: '100%', height: 'calc(400px - 40px)', overflowY: 'scroll' }}
            dataSource={holderListData}
            size="small"
            renderItem={(item: { investorName: string }, i) => {
              return (
                <List.Item>
                  <span style={{ width: '10%', textAlign: 'center' }}>{i + 1}</span>
                  <span className="investorName" title={item.investorName}>
                    {item.investorName}
                  </span>
                </List.Item>
              );
            }}
          />
        </div>
      )}
    </ProCard>
  );
};

export default HolderList;
