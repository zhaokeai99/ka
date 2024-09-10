import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ProCard from '@ant-design/pro-card';
import { contentPadding, cardGutter } from '@/themes';
import { useParams } from 'umi';
import { Tag, Empty, Spin } from 'antd';
import styles from './index.less';
import { IIndustryNewsInfoType, queryIndustryNewsInfo } from './service';
import { tagTypeMap } from '../Industry/IndustryContent/data.d';

const PublicOpinionDetail: React.FC & { isProCard: boolean } = () => {
  const parmas: Record<string, any> = useParams();
  const [info, setInfo] = useState<IIndustryNewsInfoType>({});
  const [loading, setLoading] = useState(false);

  const getViewInfo = useCallback(async (id) => {
    setLoading(true);
    setInfo({});
    const { data, success } = await queryIndustryNewsInfo({ documentId: id });
    if (success) {
      setInfo({
        ...data,
      });
      setLoading(false);
    } else {
      setInfo({});
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const { id } = parmas || {};
    if (id) {
      getViewInfo(id);
    }
  }, [parmas?.id]);

  const newsContentRender = useMemo(() => {
    if (info?.newsContentHtml) {
      return <div dangerouslySetInnerHTML={{ __html: info?.newsContentHtml }}></div>;
    } else if (info?.newsContent) {
      return <div>{info?.newsContent}</div>;
    } else {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
  }, [info]);

  return (
    <ProCard
      ghost
      size="small"
      gutter={[0, cardGutter]}
      style={{ padding: contentPadding }}
      className={styles['industry-po-view']}
    >
      <Spin spinning={loading}>
        <ProCard size="small">
          {Object.entries(info)?.length > 0 ? (
            <>
              <div className={styles['head-content']}>
                <div className={styles['head-content-title']}>
                  {info?.publicSentiment && (
                    <span
                      className={styles['tag']}
                      style={{
                        color: tagTypeMap[info?.publicSentiment as string]?.color,
                        backgroundColor: tagTypeMap[info?.publicSentiment as string]?.backgroundCol,
                      }}
                    >
                      {info?.publicSentiment}
                    </span>
                  )}
                  {info?.industryName && (
                    <span
                      className={styles['tag']}
                      style={{
                        color: '#F27C49',
                        backgroundColor: '#FFF2EB',
                      }}
                    >
                      {info?.industryName}
                    </span>
                  )}
                  <span>{info?.eventTitle}</span>
                </div>
                <div className={styles['head-content-middle']}>
                  {info?.clusterEventDate && <span>时间：{info.clusterEventDate ?? '--'}</span>}
                  &nbsp;&nbsp; &nbsp;
                  {info?.fromSource && <span>来源：{info.fromSource ?? '--'}</span>}
                  &nbsp;&nbsp;&nbsp;
                  {info?.newsUrl && (
                    <a target="__block" style={{ fontSize: 12 }} href={info?.newsUrl}>
                      【 查看原文 】
                    </a>
                  )}
                </div>
                <div className={styles['head-content-foot']}>
                  {(info?.labelList || []).map((item: string, index: number) => (
                    <Tag
                      key={index}
                      style={{ backgroundColor: '#F0F5FF', color: '#4568F5', border: 'none' }}
                    >
                      {item}
                    </Tag>
                  ))}
                </div>
              </div>
              {newsContentRender}
            </>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </ProCard>
      </Spin>
    </ProCard>
  );
};

PublicOpinionDetail.isProCard = true;

export default PublicOpinionDetail;
