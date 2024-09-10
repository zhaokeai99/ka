import ProCardPlus from '@/components/ProCardPlus';
import { Empty } from 'antd';
import { useContext, useEffect, useState } from 'react';
import Tag from '@/pages/IndustrialChain/components/Tag';
import { tagTypeMap } from '@/pages/IndustrialChain/data.d';
import { history } from 'umi';
import { IndustryProvider, queryIndustryNewsInfoAndLabel } from '../../service';
import styles from './index.less';

const PublicOpinion = () => {
  const { industryName } = useContext(IndustryProvider);
  const [policyList, setPolicyList] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const params = {
        chainName: industryName,
      };

      const data = await queryIndustryNewsInfoAndLabel(params);

      setPolicyList(data || []);
    })();
  }, [industryName]);

  return (
    <ProCardPlus
      ghost
      title="行业舆情"
      className={styles['public-opinion-container']}
      extra={
        <a style={{ fontSize: 12 }} href="#/industrialChain/industryPO">
          更多行业舆情 &gt;
        </a>
      }
    >
      {policyList?.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <ul className={styles['public-opinion-list']}>
          {policyList?.map(
            (
              {
                eventTitle,
                clusterEventDate,
                publicSentiment,
                fromSource,
                documentId,
                newsContent,
              }: any,
              index: number,
            ) => (
              <li
                key={index}
                className={styles['list-item']}
                onClick={() => {
                  history.push(`/industrialChain/publicOpinionDetail/${documentId}`);
                }}
              >
                <div className={styles['item-title-url']}>
                  <div title={eventTitle} className={styles['item-title']}>
                    {eventTitle}
                  </div>
                  <div title={newsContent} className={styles['item-content']}>
                    {newsContent}
                  </div>
                  <div className={styles['item-footer']}>
                    {clusterEventDate}

                    {fromSource ? (
                      <>
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        {fromSource}
                      </>
                    ) : null}

                    {publicSentiment ? (
                      <>
                        &nbsp;&nbsp;
                        <Tag
                          color={tagTypeMap[publicSentiment]?.color}
                          backgroundColor={tagTypeMap[publicSentiment]?.backgroundCol}
                        >
                          {publicSentiment}
                        </Tag>
                      </>
                    ) : null}
                  </div>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </ProCardPlus>
  );
};

PublicOpinion.isProCard = true;

export default PublicOpinion;
