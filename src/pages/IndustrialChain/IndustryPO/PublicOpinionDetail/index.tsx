import React, { useEffect, useCallback, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { queryIndustryNewsInfo } from './service';
import { tagTypeMap } from '@/pages/IndustrialChain/data.d';
import { cardGutter, contentPadding } from '@/themes';
import Tag from '@/pages/IndustrialChain/components/Tag';
import styles from './index.less';
import { Empty } from 'antd';

// 政策详情
const PolicyDetail = (props: any) => {
  const { id: documentId } = props?.match?.params || {};
  const [info, setInfo] = useState<any>({});

  // 获取详情
  const getDetail = useCallback(async () => {
    const { success, data } = await queryIndustryNewsInfo({ documentId });

    if (success) {
      setInfo(data || {});
    }
  }, [documentId]);

  useEffect(() => {
    if (documentId && documentId !== 'undefined' && documentId !== 'null') {
      getDetail();
    }
  }, [documentId]);

  return (
    <ProCard
      ghost
      size="small"
      gutter={[0, cardGutter]}
      style={{ padding: contentPadding }}
      className={styles['public-opinion-detail']}
    >
      <ProCard size="small">
        <div className={styles['head-content']}>
          <div className={styles['head-content-title']}>
            <span
              className={styles['tag']}
              style={{
                color: tagTypeMap[info?.publicSentiment]?.color,
                backgroundColor: tagTypeMap[info?.publicSentiment]?.backgroundCol,
              }}
            >
              {info?.publicSentiment}
            </span>
            <span>{info?.eventTitle}</span>
          </div>
          <div className={styles['head-content-middle']}>
            <span>时间：{info?.clusterEventDate ?? '--'}</span>
            &nbsp;&nbsp; &nbsp;
            <span>来源：{info?.fromSource ?? '--'}</span>
            &nbsp;&nbsp;&nbsp;
            <a target="__block" style={{ fontSize: 12 }} href={info?.newsUrl}>
              【 查看原文 】
            </a>
          </div>
          <div className={styles['head-content-foot']}>
            {(info?.labelList || []).map((item: string) => (
              <Tag key={item} color="#4568F5" backgroundColor="#F0F5FF">
                {item}
              </Tag>
            ))}
          </div>
        </div>
        {info?.newsContentHtml ? (
          <div dangerouslySetInnerHTML={{ __html: info?.newsContentHtml }}></div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </ProCard>
    </ProCard>
  );
};

export default PolicyDetail;
