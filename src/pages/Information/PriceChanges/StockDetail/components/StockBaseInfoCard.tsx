import React, { useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { Spin, Tag } from 'antd';
import { contentPadding } from '@/themes';
import { history, useParams } from 'umi';
import styles from '../index.less';
import { getStockInfo } from '../service';
import { getColorText } from '../data.d';

interface IBondBaseInfoType {
  closeAmt: number; //收盘价
  incomeRate: number; //个股涨跌幅
  citicClassifyOneTypeName: string; //中信行业名称
  stockType: string; //股票类型
  windStockCode: string; //Wind代码
  stockName: string; //证券简称
  windCompanyCode: string; //主体code
  windCompanyName: string; //主体name
  listBoardName: string; //上市板类型
  marketTypeName: string; //交易所
}

interface IStockBaseInfoCardProps {
  setStockType: (type: string) => void;
}

const StockBaseInfoCard: React.FC<IStockBaseInfoCardProps> = ({ setStockType }) => {
  const [baseInfo, setBaseInfo] = useState<Partial<IBondBaseInfoType>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const pramas = useParams<{ id: string }>(); //TODO

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await getStockInfo({ code: pramas?.id });
      setBaseInfo({
        ...data,
      });
      setStockType(data?.stockType);
      setLoading(false);
    })();
  }, [pramas?.id]);

  const onNavigateClick = (bondCode: any, name: any) => () => {
    history.push(`/information/priceChanges/subjectDetail/${name}/${bondCode}`);
  };

  return (
    <ProCard size="small" style={{ padding: contentPadding }} bodyStyle={{ padding: 0 }}>
      <Spin spinning={loading}>
        <div className={styles['stock-info-box']}>
          <div className={styles['stock-info-left']}>
            <div className={styles['stock-info-title']}>
              <span>
                {baseInfo?.stockName ?? '--'}
                {baseInfo?.windStockCode && `（${baseInfo?.windStockCode}）`}
              </span>
            </div>
            {baseInfo?.stockType && <Tag color="volcano">{baseInfo?.stockType}</Tag>}
            {baseInfo?.citicClassifyOneTypeName && (
              <Tag color="blue">{baseInfo?.citicClassifyOneTypeName}</Tag>
            )}
            <div className={styles['stock-info-text']}>
              <span>{baseInfo?.closeAmt}</span>
            </div>
            <div className={styles['stock-info-text']}>
              {baseInfo?.incomeRate && (
                <span style={{ color: getColorText(baseInfo?.incomeRate) }}>
                  {baseInfo?.incomeRate}%
                </span>
              )}
            </div>
          </div>
          <div className={styles['stock-info-right']}>
            {baseInfo?.windCompanyCode && (
              <a
                onClick={onNavigateClick(baseInfo?.windCompanyCode, baseInfo?.windCompanyName)}
                target="__block"
              >
                {baseInfo?.windCompanyName}&gt;&gt;
              </a>
            )}
          </div>
        </div>
      </Spin>
    </ProCard>
  );
};

export default StockBaseInfoCard;
