import React, { useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { Tag, Row, Col, Spin } from 'antd';
import { contentPadding } from '@/themes';
import { useParams } from 'umi';
import styles from '../index.less';
import { getCompanyInfo } from '../service';

interface IBondBaseInfoType {
  compCode: string; //主体Code
  compName: string; //主体名称
  compRating: string; //主体评级
  compWindCode: string; //所属行业
  compWindName: string; //所属行业
  guarantorNature: string; //性质
  region: string; //地区
  type: string; //类型
}

const SubjectBaseInfoCard: React.FC = () => {
  const [baseInfo, setBaseInfo] = useState<Partial<IBondBaseInfoType>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const pramas = useParams<{ id: string }>(); //TODO

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await getCompanyInfo({ code: pramas?.id });
      setBaseInfo({
        ...data,
      });
      setLoading(false);
    })();
  }, [pramas?.id]);

  return (
    <ProCard size="small" style={{ padding: contentPadding }} bodyStyle={{ padding: 0 }}>
      <Spin spinning={loading}>
        <div className={styles['base-info-title']}>
          <span style={{ fontWeight: 600 }}>{baseInfo?.compName ?? '--'}</span>
          {baseInfo?.type && (
            <Tag color="volcano" style={{ marginLeft: 12 }}>
              {baseInfo?.type}
            </Tag>
          )}
        </div>
        <Row>
          <Col span={6}>
            <div className={styles['base-info-label']}>主体评级</div>
            <div className={styles['base-info-value']}>{baseInfo?.compRating ?? '--'}</div>
          </Col>
          <Col span={6}>
            <div className={styles['base-info-label']}>所属行业</div>
            <div className={styles['base-info-value']}>{baseInfo?.compWindName ?? '--'}</div>
          </Col>
          <Col span={6}>
            <div className={styles['base-info-label']}>性质</div>
            <div className={styles['base-info-value']}>{baseInfo?.guarantorNature ?? '--'}</div>
          </Col>
          <Col span={6}>
            <div className={styles['base-info-label']}>地区</div>
            <div className={styles['base-info-value']}>{baseInfo?.region ?? '--'}</div>
          </Col>
        </Row>
      </Spin>
    </ProCard>
  );
};

export default SubjectBaseInfoCard;
