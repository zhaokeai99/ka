import { Button, Form, Input, Select } from 'antd';
import React, { memo, useEffect, useState, useCallback } from 'react';
import { queryProductTypeData } from '../service';
const { Option } = Select;

const SearchForm = ({ onFinish, rowKey }: any) => {
  const [form] = Form.useForm();
  const [fundselectList, setFundSelectList] = useState<any[]>([]);
  const [windselectList, setWindSelectList] = useState<any[]>([]);
  const getData = useCallback(async () => {
    const res: any = await queryProductTypeData();
    setFundSelectList(res?.thFundClassList);
    setWindSelectList(res?.windClassList);
  }, []);
  useEffect(() => {
    getData();
  }, []);

  const submit = useCallback(async (value) => {
    onFinish(value);
  }, []);
  return (
    <Form form={form} layout="inline" onFinish={submit} style={{ marginBottom: '16px' }}>
      <Form.Item name="keyWord" label="基金代码/名称" labelAlign="left" initialValue="">
        <Input allowClear={true} />
      </Form.Item>
      <Form.Item label="我司产品类型" name="productTypeOne" initialValue="">
        <Select style={{ width: 100 }}>
          {fundselectList?.map((item) => {
            return <Option value={item == '全部' ? '' : item}>{item}</Option>;
          })}
        </Select>
      </Form.Item>
      <Form.Item label="wind产品类型" name="thClassType" initialValue="">
        <Select style={{ width: 140 }}>
          {windselectList?.map((item) => {
            return <Option value={item == '全部' ? '' : item}>{item}</Option>;
          })}
        </Select>
      </Form.Item>
      {rowKey === 'InTheTube' && (
        <Form.Item label="只展示初始化基金" name="initFundFlag" initialValue="是">
          <Select style={{ width: 80 }}>
            <Option value={''}>否</Option>
            <Option value={'是'}>是</Option>
          </Select>
        </Form.Item>
      )}
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
    </Form>
  );
};

export default memo(SearchForm);
