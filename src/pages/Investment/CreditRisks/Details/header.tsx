import React, { useState } from 'react';
import { Descriptions, Row, Col, Form, DatePicker } from 'antd';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
// import { queryLastWkDayByNow } from '../service';
// import Search from '@/components/Search';
// import { HeartFilled, HeartOutlined } from '@ant-design/icons';

const { Item } = Descriptions;

const Header: React.FC<any> = ({ data, desColumn, change, dateStr }) => {
  const Items = [
    {
      label: '授信额度',
      value: data?.creditNo,
    },
    {
      label: '内部评级',
      value: data?.rating,
    },
    {
      label: '省',
      value: data?.province,
    },
    {
      label: '审计意见',
      value: data?.auditName,
    },
    {
      label: '外部评级',
      value: data?.exRating,
    },
    {
      label: '市',
      value: data?.city,
    },
    {
      label: '上市股票',
      value: data?.stockName,
    },
  ];
  const [date, setDate] = useState(dateStr);
  return (
    <ProCard
      title={
        <Row align="middle" gutter={[15, 0]}>
          <Col style={{ fontSize: '20px', fontWeight: 500 }}>{data?.compName || '-'}</Col>
        </Row>
      }
      extra={
        <Form>
          <Form.Item
            style={{ marginBottom: '0' }}
            label="日期"
            required
            rules={[{ required: true }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              defaultValue={moment(date, 'YYYY-MM-DD')}
              onChange={(_data, dataString) => {
                setDate(moment(dataString).format('YYYYMMDD'));
                change(moment(dataString).format('YYYYMMDD'));
              }}
            />
          </Form.Item>
        </Form>
      }
    >
      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Descriptions column={desColumn || 1}>
            {Items?.map((item: any, index: number) => (
              <Item key={index} label={item.label}>
                {item.value || '-'}
                {item.label === '授信额度' ? '(亿元)' : ''}
              </Item>
            ))}
          </Descriptions>
        </Col>
      </Row>
    </ProCard>
  );
};

export default Header;
