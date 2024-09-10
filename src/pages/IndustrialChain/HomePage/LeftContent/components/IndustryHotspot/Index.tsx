import React, { useEffect, useCallback, useState } from 'react';
import { Divider, Rate, Spin, Empty } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import { FireFilled } from '@ant-design/icons';
import type { IndustryHotspotType } from '../../service';
import { queryIndustryHotNewsList } from '../../service';
import { history } from 'umi';
import { tagTypeMap } from '@/pages/IndustrialChain/data.d';
import Tag from '@/pages/IndustrialChain/components/Tag';
import styles from './index.less';

// 行业热点
const IndustryHotspot = () => {
  const [list, setList] = useState<IndustryHotspotType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getDataInfo = useCallback(async () => {
    setLoading(true);

    const result = await queryIndustryHotNewsList();

    setList(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    getDataInfo();
  }, []);

  // 三星：12+、二星：5-12、一星： 0-5、空白：0或NUL
  const getHotNum = (num: number = 0) => {
    if (num >= 12) {
      return 3;
    } else if (num >= 5 && num < 12) {
      return 2;
    } else if (num > 0 && num < 5) {
      return 1;
    } else {
      return 0;
    }
  };

  return (
    <Spin spinning={loading}>
      <ProCardPlus
        title="行业热点"
        layout="center"
        className={styles['industry-hotspot']}
        extra={
          <a style={{ fontSize: 12 }} href="#/industrialChain/industryPO">
            查看更多 &gt;
          </a>
        }
      >
        {list?.length ? (
          <ul className={styles['hot-list']}>
            {(list || []).map(
              (
                {
                  eventDate,
                  popularity,
                  eventTitle,
                  fromSource,
                  newsContent,
                  documentId,
                  publicSentiment,
                  chainNameList,
                }: any,
                key: number,
              ) => (
                <li
                  key={key}
                  className={styles['hot-list-item']}
                  onClick={() => {
                    history.push(`/industrialChain/publicOpinionDetail/${documentId}`);
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div title={eventTitle} className={styles['hot-list-item-title']}>
                      {eventTitle}
                    </div>
                    <span className={styles['hot-list-item-icon']}>
                      <Rate
                        disabled
                        defaultValue={getHotNum(+popularity)}
                        count={getHotNum(+popularity)}
                        character={() => <FireFilled className={styles['hot-icon']} />}
                      />
                    </span>
                  </div>
                  <div className={styles['hot-list-item-desc']}>{newsContent}</div>
                  <div className={styles['hot-list-item-date']}>
                    {eventDate} | {fromSource}
                  </div>
                  <div className={styles['hot-list-item-tag']}>
                    <Tag
                      color={tagTypeMap[publicSentiment]?.color}
                      backgroundColor={tagTypeMap[publicSentiment]?.backgroundCol}
                    >
                      {publicSentiment}
                    </Tag>
                    {(chainNameList || []).map((item: string, index: number) => (
                      <Tag key={index}>{item}</Tag>
                    ))}
                  </div>
                  <Divider style={{ marginTop: '8px', marginBottom: '15px' }} />
                </li>
              ),
            )}
          </ul>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </ProCardPlus>
    </Spin>
  );
};

IndustryHotspot.isProCard = true;

export default IndustryHotspot;
