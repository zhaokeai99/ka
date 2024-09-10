import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { ProForm, ProFormRadio, ProFormText, ProFormDependency } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import FundForm from './components/fundForm';
import UploadList from './components/uploadList';
import { queryOASeatByProcessId } from '../service';

const SeatRental = ({ isResetBtn, setFundIdFn, fundId, seatType }: any, ref) => {
  const [seatTypeOption, setSeatTypeOption] = useState<string>('NORMAL_SEAT');
  const [templateList, setTemplateList] = useState<any>([]);
  const formRef = useRef<ProFormInstance>();
  // 席位类型
  const seatTypeOptions = [
    { label: '深交所普通席位', value: 'NORMAL_SEAT' },
    { label: '深交所FOF产品席位', value: 'FOF_SEAT' },
    { label: '深交所联接基金专用申赎席位', value: 'JOIN_SEAT' },
  ];

  useImperativeHandle(ref, () => ({
    getData: () => {
      const currentData = formRef?.current?.getFieldsValue();
      let list = [];
      if (templateList?.length) {
        list = templateList?.map((item: any, i: number) => {
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
      const obj = Object.assign({}, currentData, { templateList: list }, { fundId });
      return obj;
    },
  }));

  useEffect(() => {
    setSeatTypeOption('NORMAL_SEAT');
    formRef?.current?.resetFields();
  }, [isResetBtn]);

  const OAChangeFn = async (e: any) => {
    const processId = e.target.value;
    const data = await queryOASeatByProcessId({ processId });
    const { trusteeName, securitiesNo, securitiesName } = data;
    formRef?.current?.setFieldsValue({
      trustee: trusteeName,
      seatNo: securitiesNo,
      broker: securitiesName,
    });
  };
  return (
    <ProForm
      layout={'horizontal'}
      labelCol={{ span: 5 }}
      width="60%"
      initialValues={{
        childType: 'NORMAL_SEAT',
      }}
      formRef={formRef}
      submitter={false}
    >
      <ProFormRadio.Group
        name="childType"
        layout="vertical"
        label="席位类型"
        options={seatTypeOptions}
        rules={[{ required: true }]}
        fieldProps={{
          onChange: (e: any) => {
            formRef?.current?.resetFields();
            formRef?.current?.setFieldsValue({ childType: e.target.value });
            setSeatTypeOption(e.target.value);
          },
        }}
      />
      <ProFormText
        width="md"
        name="seatFlowNo"
        label="OA流程号"
        placeholder="请输入OA流程号"
        rules={[{ required: true }]}
        fieldProps={{
          onChange: OAChangeFn,
        }}
      />

      <ProFormDependency name={['seatFlowNo']}>
        {({ seatFlowNo }: any) => {
          if (seatFlowNo) {
            return (
              <>
                <ProFormText
                  width="md"
                  name="broker"
                  label="券商全称"
                  placeholder="请输入券商全称"
                  rules={[{ required: true }]}
                />
                <ProFormText
                  width="md"
                  name="seatNo"
                  label="席位号"
                  placeholder="请输入席位号"
                  rules={[{ required: true }]}
                />
                <ProFormText
                  width="md"
                  name="trustee"
                  label="托管人"
                  placeholder="请输入托管人"
                  rules={[{ required: true }]}
                />
              </>
            );
          }
          return null;
        }}
      </ProFormDependency>
      {seatTypeOption === 'JOIN_SEAT' ? (
        <FundForm formRef={formRef} setFundIdFn={setFundIdFn} />
      ) : null}
      <ProFormDependency name={['fundCode']}>
        {({ fundCode }: any) => {
          if (seatTypeOption === 'JOIN_SEAT') {
            return fundCode ? (
              <UploadList
                seatType={seatType}
                childType={seatTypeOption}
                fundId={fundId}
                getChildFn={setTemplateList}
              />
            ) : null;
          }
          return (
            <UploadList
              seatType={seatType}
              childType={seatTypeOption}
              fundId={fundId}
              getChildFn={setTemplateList}
            />
          );
        }}
      </ProFormDependency>
    </ProForm>
  );
};

export default forwardRef(SeatRental);
