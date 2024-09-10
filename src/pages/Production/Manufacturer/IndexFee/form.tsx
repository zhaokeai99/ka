import React, { useCallback, useState, useRef, useEffect } from 'react';
import { debounce as _debounce } from 'lodash';
import type { FormInstance } from 'antd';
import ProForm, {
  ModalForm,
  ProFormSelect,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';
import { queryFundInfoList, queryIndexFollowList } from './service';
// import { qfw } from '@/utils/utils';

const Form: React.FC<{
  visible: boolean;
  onVisibleChange: (any) => any;
  onFinish: (any) => any;
  type: 'edit' | 'add';
  title: string;
  initialValues?: any;
}> = ({ visible, type, title, initialValues, onVisibleChange, onFinish }) => {
  const formRef = useRef<FormInstance>();
  const [fundInfoOptions, setFundInfoOptions] = useState([]);
  const [indexFollowOptions, setIndexFollowOptions] = useState([]);

  const handleSearchFundInfo = useCallback(
    _debounce(async (value) => {
      const result = await queryFundInfoList(value);
      setFundInfoOptions(result);
    }, 300),
    [],
  );

  const handleSearchIndexFollow = useCallback(
    _debounce(async (value) => {
      const result = await queryIndexFollowList(value);
      setIndexFollowOptions(result);
    }, 300),
    [],
  );

  useEffect(() => {
    // 确保formRef存在
    setTimeout(() => {
      formRef?.current?.setFieldsValue({
        ...initialValues,
      });
    }, 100);
  }, [initialValues]);

  useEffect(() => {
    queryFundInfoList().then((result) => setFundInfoOptions(result));
    queryIndexFollowList().then((result) => setIndexFollowOptions(result));
  }, []);

  return (
    <ModalForm
      title={title}
      formRef={formRef}
      visible={!!visible}
      onFinish={async (values) => {
        const params = { ...values };

        if (type === 'edit') {
          params.id = initialValues.id;
        }

        await formRef.current?.validateFields();
        const result = await onFinish(params);
        formRef.current?.resetFields();
        return result;
      }}
      layout={'horizontal'}
      onVisibleChange={onVisibleChange}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
    >
      <ProForm.Group title="产品基本信息" />
      <ProFormSelect
        label="产品选择"
        name="fundInfo"
        rules={[{ required: true, message: '这是必填项' }]}
        placeholder="请输入关键字搜索"
        disabled={type === 'edit' ? true : false}
        fieldProps={{
          showSearch: true,
          onSearch: handleSearchFundInfo,
          labelInValue: true,
          onSelect: ({ value }: any) => {
            if (Array.isArray(value) && value.length === 4) {
              formRef.current?.setFieldsValue({
                date: [value[2], value[3] || null],
                fundInfo: value,
              });
            }
          },
          onClear: () => {
            formRef.current?.setFieldsValue({
              date: null,
            });
          },
        }}
        options={fundInfoOptions}
      />
      <ProFormSelect
        label="跟踪指标"
        name="followInfo"
        placeholder="请输入关键字搜索"
        rules={[{ required: true, message: '这是必填项' }]}
        disabled={type === 'edit' ? true : false}
        fieldProps={{
          showSearch: true,
          onSearch: handleSearchIndexFollow,
          labelInValue: true,
          onSelect: ({ value }: any) => {
            if (Array.isArray(value) && value.length === 4) {
              formRef.current?.setFieldsValue({
                publisherInfo: `${value[2]} - ${value[3]}`,
                followInfo: value,
              });
            }
          },
        }}
        options={indexFollowOptions}
      />
      <ProFormText label="跟标指数公司" name="publisherInfo" disabled={true} />
      <ProFormDateRangePicker
        label="产品存续期"
        name="date"
        disabled={true}
        transform={(values) => ({
          startDate: values ? values[0] : undefined,
          endDate: values ? values[1] : null,
        })}
      />
      <ProForm.Group title="费用信息" />
      <ProFormDigit
        label="指数使用费率"
        name="rate"
        min={0}
        max={100}
        rules={[{ required: true, message: '这是必填项' }]}
        fieldProps={{
          formatter: (value: number) => `${value}%`,
          precision: 4,
        }}
      />
      <ProFormDigit
        label="季度最低费用标准（元）"
        name="lowestCost"
        min={0}
        rules={[{ required: true, message: '这是必填项' }]}
        fieldProps={{
          // formatter: qfw,
          // !!!勿动
          formatter: (value: number) => `￥${value}`,
        }}
      />
      <ProFormDigit
        label="季度日均资产净值阈值（万）"
        name="quarterNavThreshold"
        min={0}
        rules={[{ required: true, message: '这是必填项' }]}
        fieldProps={{
          // formatter: qfw,
          // !!!勿动
          formatter: (value: number) => `￥${value}`,
        }}
      />
      <ProFormSwitch
        label="公司支付"
        name="companyPay"
        checkedChildren="开启"
        unCheckedChildren="关闭"
        rules={[{ required: true, message: '这是必填项' }]}
        initialValue={true}
        transform={(value) => ({
          companyPay: value ? 0 : 1,
        })}
      />
    </ModalForm>
  );
};

export default Form;
