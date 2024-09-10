import React, { useEffect, useState } from 'react';
import { ProFormSelect } from '@ant-design/pro-components';
import { queryProductInfo } from '../../service';

const FundForm = ({ formRef, setFundIdFn }: any) => {
  const [fundList, setFundList] = useState<any>([]);
  const [fundCode, setFundCode] = useState<any>({});
  const [fundName, setFundName] = useState<any>('');
  useEffect(() => {
    if (fundCode) {
      const currentObj = fundList.find((item: any) => item.fundCode === fundCode);
      // if (!info.fundName) {
      // 不是查看时 设置
      setFundIdFn(currentObj?.id);
      formRef?.current?.setFieldsValue({ fundName: currentObj?.fundName });
      // }
    }
  }, [fundCode]);

  useEffect(() => {
    if (fundName) {
      const currentObj = fundList.find((item: any) => item.fundName == fundName);
      // if (!info.fundName) {
      // 不是查看时 设置
      setFundIdFn(currentObj?.id);
      formRef?.current?.setFieldsValue({ fundCode: currentObj?.fundCode });
      // }
    }
  }, [fundName]);
  return (
    <>
      <ProFormSelect
        name="fundCode"
        label="基金代码"
        width="md"
        showSearch
        debounceTime={300}
        request={async ({ keyWords }) => {
          if (!keyWords) return;
          const result = await queryProductInfo({ keyword: keyWords });
          setFundList(result);
          return (result || []).map((item: any) => {
            return {
              value: item.fundCode,
              label: item.fundCode + item.fundShortName,
              id: item.id,
            };
          });
        }}
        fieldProps={{
          optionLabelProp: 'value',
          // labelInValue: true,
          onChange: setFundCode,
        }}
        placeholder="请输入基金代码"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        width="md"
        name="fundName"
        label="基金名称"
        showSearch
        debounceTime={300}
        request={async ({ keyWords }) => {
          if (!keyWords) return;
          const result = await queryProductInfo({ keyword: keyWords });
          setFundList(result);
          return (result || []).map((item: any) => {
            return {
              value: item.fundName,
              label: item.fundName,
            };
          });
        }}
        fieldProps={{
          optionLabelProp: 'value',
          onChange: setFundName,
        }}
        placeholder="请输入基金名称"
        rules={[{ required: true }]}
      />
    </>
  );
};
export default FundForm;
