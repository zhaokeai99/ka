import ProCardPlus from '@/components/ProCardPlus';
import { Empty } from 'antd';
import { useEffect, useState } from 'react';
import { queryPolicyInfoToHomePage } from '../../service';
import Tag from '@/pages/IndustrialChain/components/Tag';
import { tagTypeMap } from '@/pages/IndustrialChain/data.d';
import styles from './index.less';

const IndustryPolicyList = () => {
  const [policyList, setPolicyList] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { success, data } = (await queryPolicyInfoToHomePage()) || {};

      if (success) {
        setPolicyList(data || []);
      }
    })();
  }, []);

  return (
    <ProCardPlus
      ghost
      title="行业政策"
      extra={
        <a style={{ fontSize: 12 }} href="#/industrialChain/IndustryPolicy">
          查看更多 &gt;
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
              {
                title,
                policyAbstract,
                declareDate,
                officeName,
                originUrl,
                nodeNames,
                emotion,
              }: any,
              index: number,
            ) => (
              <li key={index} className={styles['list-item']}>
                <a className={styles['item-title-url']} href={originUrl} target="__block">
                  <div title={title} className={styles['item-title']}>
                    {title}
                  </div>
                  <div
                    title={policyAbstract}
                    dangerouslySetInnerHTML={{ __html: policyAbstract }}
                    className={styles['item-content']}
                  ></div>
                  <div className={styles['item-footer']}>
                    {declareDate}
                    <>
                      {officeName ? <>&nbsp;&nbsp;|&nbsp;&nbsp;{officeName}</> : <>&nbsp;&nbsp;</>}
                    </>
                  </div>
                  <div className={styles['item-bottom-tag']}>
                    {emotion ? (
                      <Tag
                        color={tagTypeMap[emotion]?.color}
                        backgroundColor={tagTypeMap[emotion]?.backgroundCol}
                      >
                        {emotion}
                      </Tag>
                    ) : null}
                    {nodeNames?.length
                      ? nodeNames?.map((item: string) => <Tag key={item}>{item}</Tag>)
                      : null}
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

IndustryPolicyList.isProCard = true;

export default IndustryPolicyList;
