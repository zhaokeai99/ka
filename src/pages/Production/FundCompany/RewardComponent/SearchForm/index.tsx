import { Button, Form, Input, Select, DatePicker, Row, Col } from 'antd';
import React, { memo, useEffect, useState, useCallback } from 'react';
import { queryCompanyAwardinfoLine } from '../service';

const { RangePicker }: any = DatePicker;
const { Option } = Select;

const SearchForm = ({ onFinish, currentTab }: any) => {
  const [form] = Form.useForm();
  const [awardOption, setAwardOption] = useState([]);

  const getData = useCallback(async () => {
    const res: any = await queryCompanyAwardinfoLine();
    if (currentTab == 0) {
      setAwardOption(res.productAwards);
    } else {
      setAwardOption(res.companyAwards);
    }
  }, []);
  useEffect(() => {
    getData();
  }, [currentTab]);

  const submit = async (value: any) => {
    onFinish(value);
  };
  return (
    <Form form={form} layout="inline" onFinish={submit} style={{ marginBottom: '16px' }}>
      <Row gutter={[0, 12]}>
        <Col>
          <Form.Item
            label={currentTab == 0 ? '奖项' : '颁奖机构'}
            name="awardinfo"
            labelAlign="left"
            initialValue=""
          >
            <Select style={{ width: 250 }}>
              {awardOption.map((item: any) => {
                return <Option value={item == '全部' ? '' : item}>{item}</Option>;
              })}
            </Select>
          </Form.Item>
        </Col>
        {currentTab == 0 ? (
          <Col>
            <Form.Item label="产品" name="fundName" initialValue="">
              <Input allowClear={true} style={{ width: '250px' }} />
            </Form.Item>
          </Col>
        ) : null}
        <Col>
          <Form.Item label="公布时间" name="date" initialValue="">
            <RangePicker
            // value={[moment(startDate), moment(endDate)]}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
              查询
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(SearchForm);
