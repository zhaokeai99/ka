import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import SeatNo from './components/seatNo';
import FundForm from './components/fundForm';
import UploadDom from './components/uploadList';
import { ProForm, ProFormRadio, ProFormDependency } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';

const TradeAuthority = ({ isResetBtn, setFundIdFn, fundId, seatType }: any, ref) => {
  const [marketOption, setMarketOption] = useState<string>('SH_OPEN');
  const [templateList, setTemplateList] = useState<any>([]);
  const formRef = useRef<ProFormInstance>();
  // 开通市场
  const marketOptions = [
    { label: '上交所开通', value: 'SH_OPEN' },
    { label: '深交所开通', value: 'SZ_OPEN' },
    { label: '深交所关闭', value: 'SZ_CLOSE' },
  ];

  useImperativeHandle(ref, () => ({
    getData: () => {
      const currentData = formRef?.current?.getFieldsValue();
      let list = [];
      if (templateList?.length) {
        list = templateList.map((item: any, i: number) => {
          const url = currentData[`file${i}`] ? currentData[`file${i}`][0]?.response?.data : '';
          delete currentData[`file${i}`];
          return {
            templateId: item.templateId,
            treeId: item.treeId,
            fileUrl: url,
            fileName: item.fileName,
          };
        });
      }
      const { seatno, trusteeName, securitiesFirmName } = currentData?.seatNo;
      const obj = Object.assign(
        {},
        currentData,
        { templateList: list },
        { seatNo: seatno, trustee: trusteeName, broker: securitiesFirmName },
        { fundId },
      );
      return obj;
    },
  }));

  useEffect(() => {
    setMarketOption('SH_OPEN');
    formRef?.current?.resetFields();
  }, [isResetBtn]);

  return (
    <ProForm
      layout={'horizontal'}
      labelCol={{ span: 5 }}
      width="60%"
      initialValues={{
        childType: 'SH_OPEN',
      }}
      formRef={formRef}
      submitter={false}
    >
      <ProFormRadio.Group
        name="childType"
        layout="vertical"
        label="席位类型"
        options={marketOptions}
        rules={[{ required: true }]}
        fieldProps={{
          // defaultValue: marketOption,
          onChange: (e: any) => {
            formRef?.current?.resetFields();
            formRef?.current?.setFieldsValue({ childType: e.target.value });
            setMarketOption(e.target.value);
          },
        }}
      />
      <SeatNo />
      <FundForm formRef={formRef} setFundIdFn={setFundIdFn} />
      <ProFormDependency name={['fundCode']}>
        {({ fundCode }: any) => {
          if (fundCode) {
            return (
              <UploadDom
                seatType={seatType}
                childType={marketOption}
                fundId={fundId}
                getChildFn={setTemplateList}
              />
            );
          }
          return null;
        }}
      </ProFormDependency>
    </ProForm>
  );
};

export default forwardRef(TradeAuthority);
