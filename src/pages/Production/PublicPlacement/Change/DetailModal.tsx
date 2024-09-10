import { ModalForm, ProFormInstance } from '@ant-design/pro-form';
import FormArea from './FormArea';
import React, { useCallback, useRef } from 'react';
import { addProductInfo, updateProductInfo } from '../service';
import { message } from 'antd';

interface ModalProps {
  formVisible: boolean;
  modalType: string;
  values?: any;
  onClose: (formObj: any, val?: string) => void;
}

const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { modalType, onClose, formVisible, values } = props;

  // 添加/修改
  const addProduct = useCallback(
    async (formObj: any) => {
      let res: any = {};
      const value = {
        ...values,
        approveRelease: formObj.approveRelease,
        companyBusinessLine: formObj.companyBusinessLine,
        evaluateResult: formObj.evaluateResult,
        feedback: formObj.feedback,
        finalizeApprove: formObj.finalizeApprove,
        fundManager: formObj.fundManager,
        fundName: formObj.fundName,
        fundTypeLevel2: formObj.fundTypeLevel2,
        launchBackground: formObj.launchBackground,
        launchDepartment: formObj.launchDepartment,
        planReport: formObj.planReport,
        productManager: formObj.productManager,
        programmeEvaluate: formObj.programmeEvaluate,
        conveneHolderMeet: formObj.conveneHolderMeet,
        reportDeal: formObj.reportDeal,
        trusteeBank: formObj.trusteeBank,
        fundState: 'CHANGE',
      };
      if (modalType === 'add') {
        res = await addProductInfo({
          ...formObj,
          fundState: 'CHANGE',
        });
      } else {
        res = await updateProductInfo(value);
      }
      if (res?.data) {
        message.success(modalType === 'add' ? '新增成功' : '修改成功');
        formRef.current?.resetFields();
        onClose('reload');
        return;
      }
      message.error(modalType === 'add' ? '新增失败' : '修好失败');
    },
    [props],
  );

  return (
    <ModalForm
      title={modalType === 'add' ? '新增' : '修改'}
      formRef={formRef}
      visible={formVisible}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      layout={'horizontal'}
      style={{ padding: '0 12px' }}
      grid={true}
      labelAlign="right"
      modalProps={{
        onCancel: () => {
          props.onClose('cancel');
          formRef.current?.resetFields();
        },
      }}
      onFinish={async (val) => {
        addProduct(val);
      }}
    >
      <FormArea modalType={modalType} formRef={formRef} values={values} formVisible={formVisible} />
    </ModalForm>
  );
};

export default DetailModal;
