import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import { ProFormDependency, ProFormInstance, ProFormSelect } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { setOrgCustomerInfo, getOrgAgencyInfo, getDictInfoByType, queryBankInfo } from './service';
import { transOptions } from '@/utils/utils';

interface ModalProps {
  visible: boolean;
  initValues?: any;
  fundaccos: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, fundaccos } = props;
  const [initStates] = useState({
    thuserid: '',
    fundacco: '',
    investorName: '',
    orgAgencyCode: '',
    capitalType: '',
    firstBranchCode: '',
    cooperDept: '',
    financialManagerName: '',
    memo: '',
  });
  const [OrgAgency, setOrgAgency] = useState([]);
  const [OrgAgencyCode, setOrgAgencyCode] = useState();
  const [CapitalType, setCapitalType] = useState();
  const [bnakInfo, setBankInfo] = useState([]);

  useEffect(() => {
    if (props.visible) {
      const { orgAgencyCode, capitalType } = props.initValues;
      setOrgAgencyCode(orgAgencyCode);
      setCapitalType(capitalType);
      if (Object.keys(props.initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          formValues[key] = props.initValues[key] || '';
        });
        formRef.current?.setFieldsValue(formValues);
      } else {
        formRef.current?.setFieldsValue(initStates);
      }
    }
  }, [props]);

  useEffect(() => {
    getOrgAgencyInfo().then((res) => {
      setOrgAgency(res);
    });
  }, []);

  const getBankInfo = useCallback(async (orgAgencyCode) => {
    const { data, success, errorMsg } = await queryBankInfo({ orgAgencyCode });
    const list = transOptions(data, 'firstBranchName', 'firstBranchCode', false);
    if (success) {
      setBankInfo(list);
      return;
    } else {
      setBankInfo([]);
      message.error(errorMsg || '接口请求失败');
    }
  }, []);

  useEffect(() => {
    if (OrgAgencyCode && CapitalType === 'CT0') {
      getBankInfo(OrgAgencyCode);
    }
  }, [CapitalType, OrgAgencyCode]);

  const handleSubmit = useCallback(
    async (value) => {
      const { success, errorMsg } = await setOrgCustomerInfo({
        ...value,
        ...(Array.isArray(fundaccos) && fundaccos.length > 0
          ? { fundaccos }
          : { fundacco: value.fundacco }),
      });
      if (success) {
        props.onClose('reload');
        return;
      }
      message.error(errorMsg || '接口请求失败');
    },
    [props],
  );

  return (
    <ModalForm
      visible={visible}
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      title="机构客户配置"
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => props.onClose('cancel'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      {!fundaccos?.length ? (
        <>
          <ProFormText name="thuserid" label="天弘userid" rules={[{ required: true }]} disabled />
          <ProFormText name="fundacco" label="基金账号" rules={[{ required: true }]} disabled />
          <ProFormText name="investorName" label="客户名称" rules={[{ required: true }]} disabled />
        </>
      ) : null}

      <ProFormSelect
        name="orgAgencyCode"
        label="客户简称"
        options={OrgAgency}
        placeholder="请选择客户简称"
        fieldProps={{
          onChange: (value) => {
            formRef?.current?.setFieldsValue({ firstBranchCode: '' });
            setOrgAgencyCode(value);
          },
        }}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="capitalType"
        label="资金性质"
        request={async () => {
          return await getDictInfoByType({ dictType: 'capital_type' });
        }}
        fieldProps={{
          onChange: (value) => {
            setCapitalType(value);
          },
        }}
        placeholder="请选择资金性质"
      />
      <ProFormDependency name={['capitalType', 'orgAgencyCode']}>
        {({ capitalType, orgAgencyCode }) => {
          if (orgAgencyCode && capitalType === 'CT0') {
            return (
              <ProFormSelect
                name="firstBranchCode"
                label="一级分行"
                options={bnakInfo}
                placeholder="请选择一级分行"
              />
            );
          }
          return null;
        }}
      </ProFormDependency>
      <ProFormSelect
        name="cooperDept"
        label="合作部门"
        request={async () => {
          return await getDictInfoByType({ dictType: 'cooper_dept' });
        }}
        placeholder="请选择合作部门"
      />
      <ProFormDependency name={['cooperDept']}>
        {({ cooperDept }) => {
          if (cooperDept === '1') {
            return <ProFormText name="financialManagerName" label="理财子名称" />;
          }
          return null;
        }}
      </ProFormDependency>
      <ProFormText name="memo" label="备注" />
    </ModalForm>
  );
};

export default memo(DetailModal);
