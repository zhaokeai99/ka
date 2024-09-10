import React, { useEffect, useCallback, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { queryIndustryPolicyInfo } from './service';
import { tagTypeMap } from '@/pages/IndustrialChain/data.d';
import { cardGutter, contentPadding } from '@/themes';
import Tag from '@/pages/IndustrialChain/components/Tag';
import styles from './index.less';
import { Empty } from 'antd';

// 政策详情
const PolicyDetail = (props: any) => {
  const { id: policyId } = props?.match?.params || {};
  const [info, setInfo] = useState<any>({});

  // 获取详情
  const getDetail = useCallback(async () => {
    const { success, data } = await queryIndustryPolicyInfo({ policyId });

    if (success) {
      setInfo(data || {});
    }
  }, [policyId]);

  useEffect(() => {
    if (policyId && policyId !== 'undefined' && policyId !== 'null') {
      getDetail();
    }
  }, [policyId]);

  return (
    <ProCard
      ghost
      size="small"
      gutter={[0, cardGutter]}
      style={{ padding: contentPadding }}
      className={styles['policy-detail']}
    >
      <ProCard size="small">
        <div className={styles['head-content']}>
          <div className={styles['head-content-title']}>
            <span
              className={styles['tag']}
              style={{
                color: tagTypeMap[info?.emotion]?.color,
                backgroundColor: tagTypeMap[info?.emotion]?.backgroundCol,
              }}
            >
              {info?.emotion}
            </span>
            <span>{info?.title}</span>
          </div>
          <div className={styles['head-content-middle']}>
            <span>发布时间：{info?.declareDate ?? '--'}</span>
            &nbsp;&nbsp; &nbsp;
            <span>发布机关：{info?.officeName ?? '--'}</span>
            &nbsp;&nbsp;&nbsp;
            <Tag color="#4568F5" backgroundColor="#F0F5FF">
              {info?.labelName}
            </Tag>
            <a target="__block" style={{ fontSize: 12 }} href={info?.originUrl}>
              【 查看原文 】
            </a>
          </div>
        </div>
        {info?.fullText ? (
          <div dangerouslySetInnerHTML={{ __html: info?.fullText }}></div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </ProCard>
    </ProCard>
  );
};

export default PolicyDetail;
