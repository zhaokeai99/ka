import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  queryDivisionManager,
  queryInfoByParentId,
  queryDpt,
  querySubBranch,
  updateSalesUserInfo,
} from './service';
import { transOptions } from '@/utils/utils';

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, modalType } = props;

  const [initStates] = useState({
    divisionId: '',
    divisionName: '',
    userId: '',
    userName: '',
    mobile: '',
    agencyId: '',
    dptId: '',
    subBranchId: '',
    subBranchName: '',
    netId: '',
    netName: '',
  });

  // 定义选填支行名称是否必填
  const [subNameRequired, setSubNameRequired] = useState<boolean>(false);
  const [subIdRequired, setSubIdRequired] = useState<boolean>(true);
  // 定义支行选填标志 判断展示下拉框还是输入框
  const [subBranchInput, setSubBranchInput] = useState<any>(undefined);
  const [netBranchInput, setNetBranchInput] = useState<any>(undefined);
  // 存放分行信息
  const [dptData, setDptData] = useState<any>(undefined);
  // 存放支行信息
  const [subdptData, setSubdptData] = useState<any>(undefined);
  // 存放网点信息
  const [netdptData, setNetdptData] = useState<any>(undefined);
  // 根据分行id查询支行行信息
  const getSubdptData = useCallback(async (value) => {
    const result = await querySubBranch({
      parentId: value,
    });
    // 存放没有前缀的数据
    const removeResult: any = [];
    for (let i = 0; i < result.length; i++) {
      if (result[i].dptName.startsWith('front-')) {
        result[i].dptName = result[i].dptName.replace('front-', '');
      }
      if (result[i].dptName.startsWith('back-')) {
        result[i].dptName = result[i].dptName.replace('back-', '');
      }
      removeResult.push(result[i]);
      // if (!result[i].dptName.startsWith('front-') && !result[i].dptName.startsWith('back-')) {
      //   removeResult.push(result[i]);
      // }
    }
    removeResult.push({ dptName: '其他' });
    setSubdptData(transOptions(removeResult, 'dptName', 'dptId', false));
  }, []);
  // 根据支行查询网点信息
  const getNetdptData = useCallback(async (value) => {
    if (value) {
      const result = await queryInfoByParentId({
        dptId: value,
      });
      result.push({ dptName: '其他' });
      setNetdptData(transOptions(result, 'dptName', 'dptId', false));
    }
  }, []);

  function containsNumber(str: any[]) {
    for (let i = 0; i < 10; i++) {
      if (str.indexOf(i) !== -1) return true;
    }
    return false;
  }

  useEffect(() => {
    if (props.visible) {
      if (props.modalType === 'edit' && Object.keys(props.initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          formValues[key] = props.initValues[key] || '';
        });
        formRef.current?.setFieldsValue(formValues);
        setSubBranchInput(false);
        setNetBranchInput(false);
        if (props.initValues.divisionId) {
          queryDpt({
            divisionId: props.initValues.divisionId,
          }).then((data) => {
            setDptData(transOptions(data, 'dptName', 'dptId', false));
          });
        }
        if (props.initValues.dptId) {
          getSubdptData(props.initValues.dptId);
        }
        if (props.initValues.subBranchId) {
          getNetdptData(props.initValues.subBranchId);
        }
      } else {
        formRef.current?.setFieldsValue(initStates);
      }
    }
  }, [props]);
  // 0:删除
  let netDelete: String = '';
  let subDelete: String = '';
  const handleSubmit = useCallback(
    async (value) => {
      let result: any = {};
      if (props.modalType === 'edit') {
        if (
          props.initValues.subBranchName === value.subBranchName &&
          props.initValues.subBranchId === value.subBranchId &&
          props.initValues.dptId === value.dptId &&
          props.initValues.userName === value.userName &&
          props.initValues.netId === value.netId &&
          props.initValues.netName === value.netName
        ) {
          message.warn('您没有修改任何内容');
          return;
        }
        if (value.subBranchName && containsNumber(value.subBranchName)) {
          message.warn('支行名称不允许包含数字');
          return;
        }
        if (value.netName && containsNumber(value.netName)) {
          message.warn('网点名称不允许包含数字');
          return;
        }
        if (props.initValues.subBranchId) {
          if (!value.subBranchId && !value.subBranchName) {
            subDelete = '0';
          }
        }
        if (props.initValues.netId) {
          if (!value.netId && !value.netName) {
            netDelete = '0';
          }
        }
        if (netDelete === '0' && !value.netId && !value.netName)
          value.netId = props.initValues.netId;
        if (value.subBranchId === 'null') {
          value.subBranchId = '';
        }
        if (value.subBranchId && value.subBranchName) {
          value.subBranchName = '';
        }
        if (value.netId && value.netName) {
          value.netName = '';
        }
        result = await updateSalesUserInfo({
          ...value,
          subDelete: subDelete,
          netDelete: netDelete,
        });
      }
      if ((props.modalType === 'edit' && value.subBranchName) || value.netName) {
        document.location.reload();
      }
      if (result.success) {
        setSubBranchInput(false);
        setNetBranchInput(false);
        props.onClose('reload');
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
        onCancel: () => props.onClose('cancel'),
      }}
      onFinish={handleSubmit}
    >
      <ProFormSelect
        name="divisionId"
        label="赛区名称"
        request={async () => {
          const divisionVar = await queryDivisionManager({});
          return transOptions(divisionVar, 'divisionName', 'divisionId', false);
        }}
        placeholder="请选择赛区名称"
        showSearch
        rules={[{ required: true }]}
        disabled={modalType === 'edit'}
      />
      <ProFormText
        name="userId"
        label="用户ID"
        rules={[{ required: true }]}
        hidden={true}
        readonly={modalType === 'edit'}
      />
      <ProFormText
        name="mobile"
        label="手机号"
        rules={[{ required: true }]}
        disabled={modalType === 'edit'}
      />
      <ProFormText
        name="userName"
        label="用户名称"
        placeholder="请输入用户名称,只能为中文汉字，最多15个字符"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 15,
        }}
      />
      <ProFormSelect
        name="dptId"
        label="分行名称"
        showSearch
        options={dptData}
        rules={[{ required: true }]}
        placeholder="请选择分行名称"
        fieldProps={{
          onChange: (value) => {
            setSubBranchInput(false);
            formRef?.current?.setFieldsValue({
              subBranchId: '',
              subBranchName: '',
              netName: '',
              netId: '',
            });
            setNetdptData(transOptions([{ dptName: '其他' }], 'dptName', 'dptId', false));
            getSubdptData(value);
          },
        }}
      />
      <ProFormSelect
        required={true}
        name="subBranchId"
        label="支行名称"
        showSearch
        options={subdptData}
        placeholder="请选择支行名称"
        rules={[{ required: subIdRequired }]}
        fieldProps={{
          onChange: (value) => {
            if (value === '其他') {
              // 为防止选择‘其他’后 subBranchId值也为'其他',所以清空原 subBranchId和subBranchName值
              formRef?.current?.setFieldsValue({
                subBranchId: '',
                subBranchName: '',
                netName: '',
                netId: '',
              });
              setSubBranchInput(true);
              setSubNameRequired(true);
              setSubIdRequired(false);
              setNetdptData(transOptions([{ dptName: '其他' }], 'dptName', 'dptId', false));
              return;
            }
            getNetdptData(value);
            setSubBranchInput(false);
            if (value) {
              formRef?.current?.setFieldsValue({ subBranchId: value });
            }
            formRef?.current?.setFieldsValue({ netId: '', netName: '' });
          },
        }}
        hidden={subBranchInput}
      />
      <ProFormText
        name="subBranchName"
        label="支行名称"
        placeholder="请输入支行名称"
        fieldProps={{
          showCount: true,
          maxLength: 64,
        }}
        rules={[{ required: subNameRequired }]}
        hidden={!subBranchInput}
      />
      <ProFormSelect
        name="netId"
        label="网点名称"
        showSearch
        options={netdptData}
        placeholder="请选择网点名称"
        fieldProps={{
          onChange: (value) => {
            setNetBranchInput(false);
            if (value) {
              formRef?.current?.setFieldsValue({ netId: value });
            }
            if (value === '其他') {
              formRef?.current?.setFieldsValue({
                netName: '',
                netId: '',
              });
              setNetBranchInput(true);
            }
          },
        }}
        hidden={netBranchInput}
      />
      <ProFormText
        name="netName"
        label="网点名称"
        placeholder="请输入网点名称"
        fieldProps={{
          showCount: true,
          maxLength: 64,
        }}
        hidden={!netBranchInput}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
