import ProCardPlus from '@/components/ProCardPlus';
import { GUTTER_SIZE } from '@/utils/utils';
import { Card, Col, Row, Table } from 'antd';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { queryIndexFundCompanyScaleTop } from '../../service';
import { companyColumns, themeColumns, widthFundColumns } from './columns';
const cardTitleStyles = {
  fontSize: 16,
  fontWeight: 'bold',
  margin: 0,
};
const RankTableList: React.FC<{ fundType?: any }> = ({}) => {
  const [companyData, setComData] = useState<any[]>([]);
  const [themeData, setTemData] = useState<any[]>([]);
  const [widthFundData, setwitFunData] = useState<any[]>([]);

  const getData = useCallback(async () => {
    const {
      companyScalesTop = [],
      themeScalesTop = [],
      widthFundScalesTop = [],
    }: any = await queryIndexFundCompanyScaleTop({});
    setComData(companyScalesTop);
    setTemData(themeScalesTop);
    setwitFunData(widthFundScalesTop);
  }, []);
  useEffect(() => {
    getData();
  }, []);
  return (
    <ProCardPlus direction="column" ghost colSpan="100%" gutter={[0, GUTTER_SIZE]}>
      <Row gutter={[GUTTER_SIZE, GUTTER_SIZE]} style={{ marginTop: 12, width: '100%' }}>
        <Col span={8}>
          <Card title={<p style={cardTitleStyles}>基金公司ETF规模 TOP 10</p>} bordered={false}>
            <Table
              columns={companyColumns}
              dataSource={companyData}
              bordered={false}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<p style={cardTitleStyles}>主题ETF规模 TOP 10</p>} bordered={false}>
            <Table
              columns={themeColumns}
              dataSource={themeData}
              bordered={false}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<p style={cardTitleStyles}>宽基ETF规模 TOP 10</p>} bordered={false}>
            <Table
              columns={widthFundColumns}
              dataSource={widthFundData}
              bordered={false}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </ProCardPlus>
  );
};

export default memo(RankTableList);
