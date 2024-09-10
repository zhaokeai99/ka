import ProCardPlus from '@/components/ProCardPlus';
import { Empty } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { IndustryProvider, queryThsPolicyData } from '../../service';
import Tag from '@/pages/IndustrialChain/components/Tag';
import { tagTypeMap } from '@/pages/IndustrialChain/data.d';
import styles from './index.less';

const IndustryPolicy = () => {
  const { industryName } = useContext(IndustryProvider);
  const [policyList, setPolicyList] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const result = await queryThsPolicyData({ chainName: industryName });

      setPolicyList(result || []);
    })();
  }, [industryName]);

  return (
    <ProCardPlus
      ghost
      title="行业政策"
      extra={
        <a style={{ fontSize: 12 }} href="#/industrialChain/IndustryPolicy">
          更多行业政策 &gt;
        </a>
      }
      style={{ backgroundColor: '#fff' }}
      className={styles['industry-policy-container']}
    >
      {policyList?.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <ul className={styles['industry-policy-list']}>
          {policyList?.map(
            (
              { title, abstractContent, declareDate, officeName, originUrl, emotion }: any,
              index: number,
            ) => (
              <li key={index} className={styles['list-item']}>
                <a className={styles['item-title-url']} href={originUrl} target="__block">
                  <div title={title} className={styles['item-title']}>
                    {title}
                  </div>
                  <div title={abstractContent} className={styles['item-content']}>
                    {abstractContent}
                  </div>
                  <div className={styles['item-footer']}>
                    {declareDate}
                    <>
                      {officeName ? (
                        <>&nbsp;&nbsp;|&nbsp;&nbsp;{officeName}&nbsp;&nbsp;</>
                      ) : (
                        <>&nbsp;&nbsp;</>
                      )}
                    </>
                    {emotion ? (
                      <Tag
                        color={tagTypeMap[emotion]?.color}
                        backgroundColor={tagTypeMap[emotion]?.backgroundCol}
                      >
                        {emotion}
                      </Tag>
                    ) : null}
                  </div>
                </a>
              </li>
            ),
          )}
        </ul>
      )}
    </ProCardPlus>
  );
};

IndustryPolicy.isProCard = true;

export default IndustryPolicy;
