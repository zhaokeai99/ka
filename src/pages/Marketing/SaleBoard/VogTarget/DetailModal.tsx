import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message, InputNumber, Form } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormSelect, ProFormDependency } from '@ant-design/pro-form';
import {
  addVogTargetInfo,
  updateVogTargetInfo,
  getDictInfoByType,
  querySysDeptInfo,
} from './service';
const FormItem = Form.Item;

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, modalType, initValues, onClose } = props;
  const [initStates] = useState({
    vogType: '',
    vogYear: '',
    vogTarget: '',
    sys: '',
    dept: '',
    fundType: '',
    salesType: '',
  });
  const [VogType, setVogType] = useState();
  const [Sys, setSys] = useState();
  const [deptInfo, setDeptInfo] = useState<any>([]);

  useEffect(() => {
    if (visible) {
      const { vogType, sys } = initValues;
      setVogType(vogType);
      setSys(sys);
      querySysDeptInfo({ departType: 0 }).then((res) => {
        setDeptInfo(res);
      });
      if (modalType === 'edit' && Object.keys(initValues).length >= 0) {
        const formValues: any = {};
        Object.keys(initStates).forEach((key: string) => {
          formValues[key] = initValues[key] || '';
          if (key === 'sys') formValues[key] = Number(initValues[key]) || '';
          if (key === 'dept') formValues[key] = Number(initValues[key]) || '';
        });
        formRef.current?.setFieldsValue(formValues);
      } else {
        formRef.current?.setFieldsValue(initStates);
      }
    }
  }, [props]);

  const getDeptInfo = async (sys: any) => {
    const list = await querySysDeptInfo({ departType: 0, parentId: sys });
    setDeptInfo(list);
  };

  useEffect(() => {
    if (Sys && (VogType === '2' || VogType === '5')) {
      getDeptInfo(Sys);
    }
  }, [Sys, VogType]);

  const handleSubmit = useCallback(
    async (value) => {
      let result: any = {};
      if (modalType === 'add') {
        result = await addVogTargetInfo(value);
      } else {
        result = await updateVogTargetInfo({
          ...value,
          id: initValues.id,
        });
      }
      if (result.success) {
        onClose('reload');
        return;
      }
      message.error(result.errorMsg || '接口请求失败');
    },
    [props],
  );

  return (
    <ModalForm
      visible={visible}
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      title={modalType === 'add' ? '新增' : '编辑'}
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => onClose('cancel'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <FormItem
        name="vogYear"
        label="考核年份"
        rules={[{ required: true, message: '请填写考核年份' }]}
      >
        <InputNumber min={2000} max={2999} precision={0} />
      </FormItem>
      <ProFormSelect
        name="vogType"
        label="考核数据维度"
        request={async () => {
          return await getDictInfoByType({ dictType: 'vog_target_type' });
        }}
        fieldProps={{
          onChange: (value) => {
            formRef?.current?.setFieldsValue({ dept: '' });
            setVogType(value);
          },
        }}
        placeholder="请选择考核数据维度"
        rules={[{ required: true }]}
      />
      <ProFormDependency name={['vogType']}>
        {({ vogType }) => {
          if (vogType !== '4') {
            return (
              <ProFormSelect
                name="sys"
                label="体系"
                request={async () => {
                  return await querySysDeptInfo({ departType: 1 });
                }}
                fieldProps={{
                  onChange: (value) => {
                    formRef?.current?.setFieldsValue({ dept: '' });
                    setSys(value);
                  },
                }}
                placeholder="请选择体系"
                rules={[{ required: true }]}
              />
            );
          }
          if (vogType === '4') {
            return (
              <ProFormSelect
                name="fundType"
                label="产品类型"
                request={async () => {
                  return await getDictInfoByType({ dictType: 'fund_vog_type' });
                }}
                placeholder="请选择产品类型"
                rules={[{ required: true }]}
              />
            );
          }
          return null;
        }}
      </ProFormDependency>
      <ProFormDependency name={['vogType', 'sys']}>
        {({ vogType, sys }) => {
          if (vogType === '2' && sys) {
            return (
              <ProFormSelect
                name="dept"
                label="部门"
                options={deptInfo}
                placeholder="请选择部门"
                rules={[{ required: true }]}
              />
            );
          }
          if (vogType === '3' && sys) {
            return (
              <ProFormSelect
                name="fundType"
                label="产品类型"
                request={async () => {
                  return await getDictInfoByType({ dictType: 'fund_vog_type' });
                }}
                placeholder="请选择产品类型"
                rules={[{ required: true }]}
              />
            );
          }
          if (vogType === '5' && sys) {
            return (
              <>
                <ProFormSelect
                  name="dept"
                  label="部门"
                  options={deptInfo}
                  placeholder="请选择部门"
                  rules={[{ required: true }]}
                />
                <ProFormSelect
                  name="fundType"
                  label="产品类型"
                  request={async () => {
                    return await getDictInfoByType({ dictType: 'fund_vog_type' });
                  }}
                  placeholder="请选择产品类型"
                  rules={[{ required: true }]}
                />
              </>
            );
          }
          return null;
        }}
      </ProFormDependency>
      <ProFormSelect
        name="salesType"
        label="销售类别"
        request={async () => {
          return await getDictInfoByType({ dictType: 'sales_kind' });
        }}
        placeholder="请选择销售类别"
        rules={[{ required: true }]}
      />
      <FormItem
        name="vogTarget"
        label="考核目标(单位:亿)"
        rules={[{ required: true, message: '请填写考核目标' }]}
      >
        <InputNumber />
      </FormItem>
    </ModalForm>
  );
};

export default memo(DetailModal);
