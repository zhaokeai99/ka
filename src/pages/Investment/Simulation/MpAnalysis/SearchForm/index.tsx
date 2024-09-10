import { Button, Col, DatePicker, Form, Row, Select, Tag } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import {
  CHARTS_OPTIONS_TYPE_DIC,
  MpDomainFacadeImplQueryMpDomain,
  MpRsPortfolioFacadeMyPortfolio,
  MpRsPortfolioFacadeQueryByPage,
  MpRsSysBaseInfoFacadeGetDateInfo,
} from '../service';
import moment from 'moment';

const { Option } = Select;
const FormItem = Form.Item;
const { CheckableTag } = Tag;

interface FormProps {
  onSubmit: (formValues: any) => void;
  onLoadDomainDic: (value: any) => void;
}

const SearchForm = (props: FormProps) => {
  const { onSubmit, onLoadDomainDic } = props;
  const [form] = Form.useForm();

  const [domainDic, setDomainDic] = useState<any>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    CHARTS_OPTIONS_TYPE_DIC[0].value,
    CHARTS_OPTIONS_TYPE_DIC[2].value,
    CHARTS_OPTIONS_TYPE_DIC[4].value,
    CHARTS_OPTIONS_TYPE_DIC[6].value,
    CHARTS_OPTIONS_TYPE_DIC[8].value,
  ]);

  const searchDomainDic = async () => {
    const domainResult = await MpDomainFacadeImplQueryMpDomain({});
    setDomainDic(domainResult);
    onLoadDomainDic(domainResult);
    return domainResult;
  };

  const submit = async () => {
    const values = await form?.validateFields();
    values.domainDic = domainDic;
    onSubmit(values);
  };

  const getNewData = async () => {
    const stringList: string[] = [];

    // 查询业务域
    const resultDomDic = await searchDomainDic();

    resultDomDic?.map(async (itm: any) => {
      const params = {
        domain: itm.value,
        isPublic: '1',
        status: '1',
        sortField: 'mpCode',
        sortOrder: 'asc',
      };
      const lookPor = await MpRsPortfolioFacadeQueryByPage(params);
      lookPor?.data?.map((it: any) => {
        stringList.push(it.mpCode);
      });
    });

    const myPor = await MpRsPortfolioFacadeMyPortfolio({
      status: '1',
      sortField: 'bmCode',
      sortOrder: 'asc',
    });
    myPor?.map((i: any) => {
      stringList.push(i.mpCode);
    });

    const { tradeDate } = await MpRsSysBaseInfoFacadeGetDateInfo({ mpCodes: stringList });
    return tradeDate;
  };

  useEffect(() => {
    (async () => {
      const tradeDate: any = await getNewData();
      form.setFieldsValue({
        circles: [...selectedTags],
        tradeDate: moment(tradeDate, 'YYYYMMDD'),
        domainDic: domainDic,
      });
      submit();
    })();
  }, []);

  const handleChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
    form.setFieldsValue({ circles: nextSelectedTags });
  };

  const handleAllChange = (checkedAll: boolean) => {
    if (checkedAll) {
      const tagArr: string[] = [];
      CHARTS_OPTIONS_TYPE_DIC?.map((itm: any) => {
        tagArr.push(itm?.value);
      });
      setSelectedTags(tagArr);
      form.setFieldsValue({ circles: tagArr });
    } else {
      setSelectedTags([]);
      form.setFieldsValue({ circles: undefined });
    }
  };

  const onReset = async () => {
    const newData: any = await getNewData();

    setSelectedTags([
      CHARTS_OPTIONS_TYPE_DIC[0].value,
      CHARTS_OPTIONS_TYPE_DIC[2].value,
      CHARTS_OPTIONS_TYPE_DIC[4].value,
      CHARTS_OPTIONS_TYPE_DIC[6].value,
      CHARTS_OPTIONS_TYPE_DIC[8].value,
    ]);
    form.setFieldsValue({
      domains: [],
      tradeDate: moment(newData, 'YYYYMMDD'),
      circles: [
        CHARTS_OPTIONS_TYPE_DIC[0].value,
        CHARTS_OPTIONS_TYPE_DIC[2].value,
        CHARTS_OPTIONS_TYPE_DIC[4].value,
        CHARTS_OPTIONS_TYPE_DIC[6].value,
        CHARTS_OPTIONS_TYPE_DIC[8].value,
      ],
    });
    submit();
  };

  return (
    <Form form={form} style={{ margin: 12 }}>
      <Row align={'middle'} style={{ height: 32 }}>
        <Col span={8}>
          <FormItem
            label="日期"
            name="tradeDate"
            rules={[{ required: true }]}
            initialValue={moment()}
          >
            <DatePicker defaultValue={moment()} />
          </FormItem>
        </Col>
        <Col span={8}>
          {domainDic.length > 1 ? (
            <FormItem label="业务域" name="domains">
              <Select
                mode="multiple"
                allowClear
                style={{ width: '250px' }}
                maxTagCount="responsive"
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                placeholder={'请选择业务域'}
              >
                {domainDic?.map((itm: any) => (
                  <Option key={itm.value} value={itm.value}>
                    {itm.label}
                  </Option>
                ))}
              </Select>
            </FormItem>
          ) : null}
        </Col>
        <Col
          span={8}
          style={{
            textAlign: 'right',
          }}
        >
          <FormItem>
            <Button type="primary" onClick={submit} style={{ marginRight: 5 }}>
              查询
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </FormItem>
        </Col>
      </Row>
      <Row align={'middle'} style={{ marginTop: 12, height: 32, marginBottom: 0 }}>
        <Col span={24}>
          <FormItem
            label="时间范围"
            name="circles"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <CheckableTag
              checked={selectedTags.length === CHARTS_OPTIONS_TYPE_DIC.length}
              onChange={(checkedAll) => handleAllChange(checkedAll)}
            >
              {'全部'}
            </CheckableTag>
            {CHARTS_OPTIONS_TYPE_DIC.map((tag: any) => (
              <CheckableTag
                key={tag?.value}
                checked={selectedTags.indexOf(tag?.value) > -1}
                onChange={(checked) => handleChange(tag?.value, checked)}
              >
                {tag?.label}
              </CheckableTag>
            ))}
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(SearchForm);
