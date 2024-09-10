import React, { useEffect, useRef, useState } from 'react';
import {
  FormListActionType,
  ModalForm,
  ProFormGroup,
  ProFormInstance,
  ProFormList,
  ProFormSelect,
} from '@ant-design/pro-form';
import { Button } from 'antd';
import { saveMarkSchemesData } from '../service';
import styles from './index.less';

type PropsType = {
  visible: boolean;
  onClose: (type?: string) => void;
  params: any;
  echoValue: any;
  planList: any;
};

const AutoMarkingModal = (props: PropsType) => {
  const { visible, echoValue, onClose, params, planList } = props;
  const formRef = useRef<ProFormInstance>();
  const listActionRef = useRef<FormListActionType | any>();
  const [disOpt, setDisOpt] = useState<any[]>([]); //置灰不可选下拉ID
  const [planOpt, setPlanOpt] = useState<any[]>([]);
  const [addBtnStatus, setAddBtnStatus] = useState(false);
  const [initValues] = useState({
    plan: '',
    list: [],
  });
  const [operator] = useState<any[]>([
    { label: '或', value: 'OR' },
    { label: '且', value: 'AND' },
    { label: '非', value: 'NON' },
  ]);

  // 处理方案下拉数据显隐
  const handleOptStatus = (values: any) => {
    const { plan, list } = values || {};
    const arr = [plan?.value, ...(list?.map((i: any) => i.schemesId?.value) || [])];
    // 选中方案数量 = 方案总数量，新增条件置灰
    setAddBtnStatus(arr.length === planList.length);
    setDisOpt(arr);
  };

  // 方案可选处理
  useEffect(() => {
    const newOpt = planList?.map((i: any) => ({ ...i, disabled: disOpt.includes(i.value) }));
    setPlanOpt(newOpt || []);
  }, [planList, disOpt]);

  useEffect(() => {
    if (visible) {
      // 方案回显处理
      if (echoValue?.schemesId) {
        const { schemesId, schemesName, schemes } = echoValue || {};
        const echoObj = {
          plan: {
            value: schemesId,
            label: schemesName,
          },
          list:
            schemes?.map((i: any) => ({
              relation: i.relation,
              schemesId: { label: i.schemesName, value: i.schemesId },
            })) || [],
        };
        handleOptStatus(echoObj);
        formRef.current?.setFieldsValue({ ...echoObj });
      } else {
        // 方案数量小于等于1，新增条件置灰
        setAddBtnStatus(planList?.length <= 1);
        formRef.current?.setFieldsValue({ ...initValues });
      }
    }
  }, [visible, echoValue, planList]);

  const close = (type: string) => {
    formRef?.current?.resetFields();
    setDisOpt([]);
    onClose(type);
  };

  // 自动打标方案保存
  const onFinish = async (values: any) => {
    const { plan, list } = values;
    const listParams =
      list?.map((i: any) => ({
        schemesId: i.schemesId?.value,
        schemesName: i.schemesId?.label,
        relation: i.relation,
      })) || [];

    const res = await saveMarkSchemesData({
      markId: params.markId,
      schemesId: plan?.value,
      schemesName: plan?.label,
      schemes: listParams,
    });

    if (res?.success) {
      close('RELOAD');
    }
  };

  return (
    <ModalForm
      title="自动打标"
      formRef={formRef}
      visible={visible}
      onFinish={onFinish}
      modalProps={{
        okText: '保存',
        onCancel: () => close('CANCEL'),
        maskClosable: false,
      }}
      className={styles['auto-marking-form-item']}
      layout="horizontal"
    >
      <ProFormGroup>
        <ProFormSelect
          width="md"
          label="查询方案"
          name="plan"
          options={planOpt}
          rules={[{ required: true }]}
          fieldProps={{
            allowClear: false,
            onChange: () => handleOptStatus(formRef.current?.getFieldsValue()),
            labelInValue: true,
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            listActionRef.current?.add();
          }}
          disabled={addBtnStatus}
        >
          新增条件
        </Button>
      </ProFormGroup>
      <ProFormList
        name="list"
        creatorButtonProps={false}
        copyIconProps={false}
        deleteIconProps={false}
        actionRef={listActionRef}
      >
        {({ name }, _, action, count) => {
          // 新增数量 = 方案总数 - 1，新增条件置灰
          setAddBtnStatus(count >= planOpt?.length - 1);
          return (
            <ProFormGroup key="group">
              <ProFormSelect
                name="relation"
                options={operator}
                rules={[{ required: true }]}
                initialValue="OR"
              />
              <ProFormSelect
                width="md"
                name="schemesId"
                label="查询方案"
                options={planOpt}
                rules={[{ required: true }]}
                fieldProps={{
                  allowClear: false,
                  labelInValue: true,
                  onChange: () => handleOptStatus(formRef.current?.getFieldsValue()),
                }}
              />
              <Button
                type="link"
                onClick={() => {
                  action.remove(name);
                  handleOptStatus(formRef.current?.getFieldsValue());
                }}
              >
                删除
              </Button>
            </ProFormGroup>
          );
        }}
      </ProFormList>
    </ModalForm>
  );
};

export default AutoMarkingModal;
