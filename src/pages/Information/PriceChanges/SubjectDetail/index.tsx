import React, { useContext, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { Row, Col } from 'antd';
import { cardGutter, contentPadding } from '@/themes';
import SubjectBaseInfoCard from './components/SubjectBaseInfoCard';
import IssuanceBonds from './components/IssuanceBonds';
import styles from './index.less';
import IssuanceStock from './components/IssuanceStock';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import { useParams } from 'umi';

const SubjectDetail: React.FC = () => {
  const pramas = useParams<{ id: string; name: string }>(); //TODO

  const { key: tabTitleKey, setTabTitle } = useContext(TabLayoutContext);

  useEffect(() => {
    setTabTitle(tabTitleKey, `${pramas?.name}`);
  }, []);
  return (
    <ProCard
      ghost
      size="small"
      style={{ padding: contentPadding }}
      className={styles['subject-detail']}
    >
      <Row gutter={[0, cardGutter]}>
        <Col span={24}>
          <SubjectBaseInfoCard />
        </Col>
        <Col span={24}>
          <IssuanceBonds />
        </Col>
        <Col span={24}>
          <IssuanceStock />
        </Col>
      </Row>
    </ProCard>
  );
};

export default SubjectDetail;
