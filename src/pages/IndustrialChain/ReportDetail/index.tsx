import React, { useEffect, useCallback, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { queryIndustryReportInfo } from './service';
import { tagTypeMap } from '../data.d';
import { cardGutter, contentPadding } from '@/themes';
import Tag from '@/pages/IndustrialChain/components/Tag';
import TabsContent from './TabsContent';
import styles from './index.less';

// 研报分析详情
const ReportDetail = (props: any) => {
  const { id: reportId } = props?.match?.params || {};
  const [info, setInfo] = useState<any>({});

  // 获取详情
  const getDetail = useCallback(async () => {
    const { success, data } = await queryIndustryReportInfo({ reportId });

    if (success) {
      setInfo(data || {});
    }
  }, [reportId]);

  useEffect(() => {
    if (reportId && reportId !== 'undefined' && reportId !== 'null') {
      getDetail();
    }
  }, [reportId]);

  return (
    <ProCard
      ghost
      size="small"
      gutter={[0, cardGutter]}
      style={{ padding: contentPadding }}
      className={styles['report-detail']}
    >
      <ProCard size="small">
        <div className={styles['head-content']}>
          <div className={styles['head-content-title']}>
            <span
              className={styles['tag']}
              style={{
                color: tagTypeMap[info?.reportViewpoint]?.color,
                backgroundColor: tagTypeMap[info?.reportViewpoint]?.backgroundCol,
              }}
            >
              {info?.reportViewpoint}
            </span>
            <span>{info?.ratingMemo}</span>
          </div>
          <div className={styles['head-content-middle']}>
            <span>{info?.ratingDt}</span>
            &nbsp;&nbsp;
            <span>{info?.ratingInstitute}</span>
          </div>
          <div className={styles['head-content-foot']}>
            <Tag color="#4568F5" backgroundColor="#F0F5FF">
              {info?.reportViewpoint}
            </Tag>
            <Tag color="#F27C49" backgroundColor="#FFF2EB">
              {info?.reportInd}
            </Tag>
            <Tag color="#545FC8" backgroundColor="#EBEBFF">
              {info?.reportType}
            </Tag>
            <Tag color="#E673C0" backgroundColor="#FFF0F6">
              {info?.industryName}
            </Tag>
          </div>
        </div>
        <div className={styles['body-content']}>
          <TabsContent data={info?.ratingMemo} />
        </div>
      </ProCard>
    </ProCard>
  );
};

export default ReportDetail;
