import { Col, Form, Row, Input, DatePicker, Button } from 'antd';
import React, { useState, useEffect, useCallback, memo } from 'react';
import moment from 'moment';
import StandardFormRow from '@/components/StandardFormRow';
import { MultipleSelect } from '@/components/TagSelect';
import type { optionType } from '../service';
import { getSentType, getWorkDayRange } from '../service';
import styles from './index.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const formItemLayout = {
  labelCol: { span: 8, offset: 0 },
};

interface FormProps {
  onSearch: (allValues: any) => void;
}

const SearchForm = (props: FormProps) => {
  const [form] = Form.useForm();
  const [typeOptions, setTypeOptions] = useState<optionType[]>([]);

  const handleSubmit = useCallback(
    (allVal) => {
      const { rangePicker, ...other } = allVal || {};
      props.onSearch({
        ...other,
        beginDate: rangePicker[0] ? moment(rangePicker[0]).format(dateFormat) : '',
        endDate: rangePicker[1] ? moment(rangePicker[1]).format(dateFormat) : '',
      });
    },
    [props],
  );

  const getInitData = useCallback(async () => {
    const [typeResult, dayResult] = await Promise.all([getSentType(), getWorkDayRange()]);
    setTypeOptions(typeResult);
    // 设置开始日期与结束日期
    const begin = dayResult.beginDate ? moment(dayResult.beginDate, dateFormat) : moment();
    const end = dayResult.endDate ? moment(dayResult.endDate, dateFormat) : moment();
    form.setFieldsValue({ rangePicker: [begin, end] });
    // 默认查询一次
    const fromValues = form.getFieldsValue();
    handleSubmit(fromValues);
  }, [handleSubmit]);

  useEffect(() => {
    getInitData();
  }, []);

  return (
    <Form
      form={form}
      initialValues={{
        sentTypeList: [],
        productCode: '',
        bondCode: '',
      }}
      onFinish={handleSubmit}
      className={styles['form-row']}
    >
      <StandardFormRow title="所属类目" block>
        <FormItem name="sentTypeList">
          <MultipleSelect>
            {typeOptions?.map((item) => {
              return (
                <MultipleSelect.Option value={item.subTypeName} key={item.subTypeName}>
                  {item.subTypeName}
                </MultipleSelect.Option>
              );
            })}
          </MultipleSelect>
        </FormItem>
      </StandardFormRow>
      <Row style={{ paddingTop: '6px' }}>
        <Col span={6}>
          <FormItem
            name="productCode"
            label="产品代码"
            labelAlign="left"
            // labelCol={{ span: 8, offset: 2, pull: 2 }}
          >
            <Input placeholder="请输入产品代码" />
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formItemLayout} name="bondCode" label="债券代码">
            <Input placeholder="请输入债券代码" />
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formItemLayout} name="rangePicker" label="日期">
            <RangePicker format={dateFormat} />
          </FormItem>
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(SearchForm);
