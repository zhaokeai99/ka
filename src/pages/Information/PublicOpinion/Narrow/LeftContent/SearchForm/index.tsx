import { Col, Form, Row, Input, DatePicker, Radio } from 'antd';
import React, { useState, useEffect, useCallback, memo } from 'react';
import moment from 'moment';
import StandardFormRow from '@/components/StandardFormRow';
import { MultipleSelect } from '@/components/TagSelect';
import type { optionType } from '../service';
import { getSentType, getWorkDayRange } from '../service';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;

const formItemLayout = {
  // labelCol: {
  //   span: 12,
  //   offset: 0,
  // },
};
interface FormProps {
  onChange: (allValues: any) => void;
}

const SearchForm = (props: FormProps) => {
  const [form] = Form.useForm();
  const [isDisabledSentTypeList, setDisabledSentTypeList] = useState(false);
  const [typeOptions, setTypeOptions] = useState<optionType[]>([]);
  const [beginDate, setBeginDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());

  const handleFormChange = useCallback(
    (curVal, allVal) => {
      const { rangePicker, sentTypeList, ...other } = allVal || {};
      // 当更新的字段是 舆情时效 时, 需要变更日期选项, 1 代表离线；2 代表当日
      if (Object.keys(curVal).includes('xyType')) {
        if (curVal.xyType === 2) {
          rangePicker[0] = moment();
          rangePicker[1] = moment();
          setDisabledSentTypeList(true); // 设置全部类目不可点击
          form.setFieldsValue({ sentTypeList: [] });
        } else {
          rangePicker[0] = beginDate;
          rangePicker[1] = endDate;
          setDisabledSentTypeList(false);
        }
        form.setFieldsValue({ rangePicker });
      }
      props.onChange({
        ...other,
        sentTypeList: curVal.xyType === 2 ? [] : sentTypeList,
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
    const begin = dayResult.beginDate ? moment(dayResult.beginDate, dateFormat) : beginDate;
    const end = dayResult.endDate ? moment(dayResult.endDate, dateFormat) : endDate;
    setBeginDate(begin);
    setEndDate(end);
    form.setFieldsValue({ rangePicker: [begin, end] });
    handleFormChange({}, form.getFieldsValue());
  }, [beginDate, endDate, handleFormChange]);

  useEffect(() => {
    getInitData();
  }, []);

  return (
    <Form
      layout="inline"
      form={form}
      initialValues={{
        sentTypeList: [],
        xyType: 1,
        holdStatus: 0,
        bondSearchContext: '',
        issuerName: '',
        rangePicker: [beginDate, endDate],
      }}
      onValuesChange={handleFormChange}
    >
      <StandardFormRow title="所属类目" block>
        <FormItem name="sentTypeList">
          <MultipleSelect expandable isDisabledAll={isDisabledSentTypeList}>
            {typeOptions.map((item) => {
              return (
                <MultipleSelect.Option value={item.subTypeName} key={item.subTypeName}>
                  {item.subTypeName}
                </MultipleSelect.Option>
              );
            })}
          </MultipleSelect>
        </FormItem>
      </StandardFormRow>
      <Row>
        <Col>
          <FormItem {...formItemLayout} name="xyType" label="舆情时效">
            <Radio.Group size="small">
              <Radio.Button value={1}>离线舆情</Radio.Button>
              <Radio.Button value={2}>当日舆情</Radio.Button>
            </Radio.Group>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...formItemLayout} name="holdStatus" label="持有状态">
            <Radio.Group size="small">
              <Radio.Button value={1}>有</Radio.Button>
              <Radio.Button value={0}>无</Radio.Button>
            </Radio.Group>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...formItemLayout} name="bondSearchContext" label="债券搜索">
            <Input placeholder="代码/名称模糊" size="small" />
          </FormItem>
        </Col>
        <Col>
          <FormItem {...formItemLayout} name="issuerName" label="主体">
            <Input placeholder="名称模糊" size="small" />
          </FormItem>
        </Col>
        <Col>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.xyType !== currentValues.xyType}
          >
            {({ getFieldValue }) => (
              <FormItem {...formItemLayout} name="rangePicker" label="日期">
                <RangePicker
                  size="small"
                  format={dateFormat}
                  disabled={getFieldValue('xyType') === 2}
                />
              </FormItem>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(SearchForm);
