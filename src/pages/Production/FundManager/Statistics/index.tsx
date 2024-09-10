import React, { memo } from 'react';
import { Statistic, Row, Col } from 'antd';

const Statistics = (props: any) => {
  const { statisticsData } = props;

  return (
    <Row gutter={16} justify="center">
      <Col span={3} style={{ textAlign: 'center' }}>
        <Statistic title="从业年限" value={statisticsData?.practiceYear || '-'} />
      </Col>
      <Col span={3} style={{ textAlign: 'center' }}>
        <Statistic
          title="基金管理年限"
          value={statisticsData?.managedYearsDays || '0'}
          // suffix="年"
        />
      </Col>
      <Col span={3} style={{ textAlign: 'center' }}>
        <Statistic title="管理规模" value={statisticsData?.fundAmtWithUnit || '0'} suffix="" />
      </Col>
      <Col span={3} style={{ textAlign: 'center' }}>
        <Statistic title="在管基金数" value={statisticsData?.fundCnt || '0'} suffix="只" />
      </Col>
      <Col span={3} style={{ textAlign: 'center' }}>
        <Statistic title="基助管理基金数" value={statisticsData?.asstFundCnt || '0'} suffix="只" />
      </Col>
      <Col span={3} style={{ textAlign: 'center' }}>
        <Statistic title="拟任基金数" value={statisticsData?.uneffectFundCnt || '0'} suffix="只" />
      </Col>
      <Col span={3} style={{ textAlign: 'center' }}>
        <Statistic title="拟任+在管" value={statisticsData?.fundUneffectCnt || '0'} suffix="只" />
      </Col>
      <Col span={3} style={{ textAlign: 'center' }}>
        <Statistic title="历任基金数" value={statisticsData?.historyFundCnt || '0'} suffix="只" />
      </Col>
    </Row>
  );
};

export default memo(Statistics);
