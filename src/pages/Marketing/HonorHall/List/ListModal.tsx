import React, { useEffect, useRef, useState } from 'react';
import { ModalForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { message, Tag } from 'antd';
import {
  addWinnerList,
  queryBasisWinnerList,
  queryHonorAwardsName,
  queryListCycleTypeAndDesc,
  updateWinnerList,
} from '../service';
import ProFormDatePickerYear from '@ant-design/pro-form/lib/components/DatePicker/YearPicker';
import moment from 'moment';

type PropsType = {
  type: string;
  visible: boolean;
  initValues?: any;
  onClose: (val?: string) => void;
};

const ListModal = (props: PropsType) => {
  const { type, visible, onClose, initValues } = props;
  const [initStatus] = useState<any>({
    listId: '',
    listName: '',
    listYear: moment(),
    listCycle: '',
    awardsIds: [],
  });
  const formRef = useRef<ProFormInstance>();
  const [awardsOpt, setAwardsOpt] = useState<any[]>([]);

  const queryAwardsOpt = async () => {
    const data = await queryHonorAwardsName();
    const opt = data?.map((i: any, k: any) => ({
      ...i,
      value: i.awardsId,
      label: (
        <div key={k}>
          {i.awardsName}
          <Tag style={{ marginLeft: '12px', height: '20px' }} color="orange">
            {i.awardsTypeDesc}
          </Tag>
        </div>
      ),
    }));
    setAwardsOpt(opt);
  };

  // 回显
  useEffect(() => {
    if (visible) {
      queryAwardsOpt();
    }
    if (type === 'EDIT') {
      formRef.current?.setFieldsValue({
        ...initValues,
        awardsIds: initValues?.awardsBgVOList?.map((i: any) => i.awardsId),
      });
    } else {
      formRef.current?.setFieldsValue({ ...initStatus });
    }
  }, [visible, type, initValues]);

  // 提交
  const handleSubmit = async (values: any) => {
    let res: any = {};
    if (type !== 'EDIT') {
      res = await addWinnerList({
        ...values,
        ...(type === 'ADD_CYCLE'
          ? { listId: values?.listId?.value, listName: values?.listId?.label }
          : { listName: values.listName }),
        listYear: values.listYear ? moment(values.listYear).format('YYYY') : '',
      });
    } else {
      res = await updateWinnerList({
        ...values,
        listId: values?.listId?.value || initValues.listId,
        listName: values?.listId?.label || initValues.listName,
        listYear: values.listYear ? moment(values.listYear).format('YYYY') : '',
        id: initValues.id,
      });
    }

    if (res?.success) {
      message.success('榜单配置成功！');
      onClose('RELOAD');
    }
  };

  return (
    <ModalForm
      formRef={formRef}
      title={type === 'ADD' || type === 'ADD_CYCLE' ? '新增' : '编辑'}
      visible={visible}
      initialValues={initStatus}
      labelCol={{ span: 4 }}
      layout="horizontal"
      modalProps={{
        onCancel: () => onClose('CLOSE'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      {type !== 'ADD' ? (
        <ProFormSelect
          label="榜单名称"
          name="listId"
          rules={[{ required: true }]}
          request={async () => await queryBasisWinnerList()}
          fieldProps={{
            fieldNames: { label: 'listName', value: 'listId' },
            labelInValue: true,
            disabled: type === 'EDIT',
          }}
        />
      ) : (
        <ProFormText
          label="榜单名称"
          name="listName"
          placeholder="最多输入5个字符"
          rules={[{ required: true }]}
          fieldProps={{
            showCount: true,
            maxLength: 5,
          }}
        />
      )}
      <ProFormDatePickerYear
        label="颁奖年份"
        name="listYear"
        rules={[{ required: true }]}
        labelCol={{ span: 4 }}
        fieldProps={{
          disabledDate: (current: any) => {
            return (current && current < moment().subtract(1, 'year')) || current > moment('2099');
          },
        }}
      />
      <ProFormSelect
        label="颁奖周期"
        name="listCycle"
        rules={[{ required: true }]}
        request={async () => await queryListCycleTypeAndDesc()}
        fieldProps={{
          fieldNames: { label: 'typeDesc', value: 'type' },
        }}
      />
      <ProFormSelect
        label="榜单奖项"
        name="awardsIds"
        rules={[{ required: true }]}
        options={awardsOpt}
        fieldProps={{
          mode: 'multiple',
          showSearch: true,
          autoClearSearchValue: true,
          filterOption: (inputValue: any, option: any) => {
            return option?.awardsName?.includes(inputValue);
          },
        }}
      />
    </ModalForm>
  );
};

export default ListModal;
