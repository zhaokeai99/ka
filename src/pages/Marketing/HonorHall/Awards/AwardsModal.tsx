import React, { memo, useEffect, useRef, useState } from 'react';
import {
  ModalForm,
  ProFormDependency,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form';
import {
  addAwardsWinner,
  queryBasisWinnerList,
  queryWinnerCandidate,
  queryWinnerInfo,
  updateAwardsWinner,
} from '../service';
import { message, Tag } from 'antd';
import { find as _find } from 'lodash';

type PropsType = {
  type: string;
  visible: boolean;
  initValues?: any;
  onClose: (val?: string) => void;
};

const AwardsModal = (props: PropsType) => {
  const { type, visible, onClose, initValues } = props;
  const [initStatus] = useState({
    listId: '',
    listYear: '',
    listCycle: '',
    awardsId: '',
    winnerId: '',
    winnerDesc: '',
    winnerType: '1',
  });
  const formRef = useRef<ProFormInstance>();
  const [listOpt, setListOpt] = useState<any[]>([]);
  const [yearOpt, setYearOpt] = useState<any[]>([]);
  const [cycleOpt, setCycleOpt] = useState<any[]>([]);
  const [awardsOpt, setAwardsOpt] = useState<any[]>([]);
  const [perOpt, setPerOpt] = useState<any[]>([]);
  const [teamOpt, setTeamOpt] = useState<any[]>([]);

  // 处理表单下拉数据
  const handleOptList = async () => {
    const res = await queryBasisWinnerList();
    setListOpt(res || []);
    if (type === 'EDIT') {
      const { listYear, listCycle, listId }: any = initValues;
      const { listYearBgVOList }: any = _find(res, { listId }) || [];
      setYearOpt(listYearBgVOList || []);
      const { listCycleBgVOList }: any = _find(listYearBgVOList, { listYear }) || [];
      setCycleOpt(listCycleBgVOList || []);
      const { awardsList }: any = _find(listCycleBgVOList, { listCycleType: listCycle }) || [];
      setAwardsOpt(awardsList || []);
    }
  };

  const queryWinnerList = async () => {
    // 个人下拉
    const perData = await queryWinnerInfo();
    const perList = perData?.map((i: any, k: any) => ({
      ...i,
      value: i.winnerId,
      label: (
        <div key={k}>
          {i.winnerName}
          <Tag style={{ marginLeft: '12px', height: '20px' }} color="orange">
            {i.dptName}
          </Tag>
        </div>
      ),
    }));
    setPerOpt(perList || []);

    // 部门下拉
    const teamData = await queryWinnerCandidate();
    setTeamOpt(teamData || []);
  };

  // 回显
  useEffect(() => {
    if (visible) {
      queryWinnerList();
      handleOptList();
    }
    if (type === 'EDIT') {
      formRef.current?.setFieldsValue({ ...initValues });
    } else {
      formRef.current?.setFieldsValue({ ...initStatus });
    }
  }, [visible, type, initValues]);

  // 提交
  const handleSubmit = async (values: any) => {
    let res: any = {};
    if (type === 'ADD') {
      res = await addAwardsWinner({
        ...values,
        winnerId: values?.winnerId?.winnerId,
        winnerName: values?.winnerId?.winnerName,
      });
    } else {
      res = await updateAwardsWinner({
        ...values,
        winnerId: values?.winnerId?.winnerId || initValues?.winnerId,
        winnerName: values?.winnerId?.winnerName || initValues?.winnerName,
        id: initValues?.id,
      });
    }

    if (res?.success) {
      message.success('颁奖配置成功！');
      onClose('RELOAD');
    }
  };

  return (
    <ModalForm
      formRef={formRef}
      title={type === 'ADD' ? '新增' : '编辑'}
      visible={visible}
      initialValues={initStatus}
      labelCol={{ span: 4 }}
      layout="horizontal"
      modalProps={{
        onCancel: () => onClose('CLOSE'),
        maskClosable: false,
        afterClose: () => {
          setListOpt([]);
          setYearOpt([]);
          setCycleOpt([]);
          setAwardsOpt([]);
        },
      }}
      onFinish={handleSubmit}
    >
      <ProFormSelect
        label="榜单名称"
        name="listId"
        rules={[{ required: true }]}
        placeholder="请选择"
        fieldProps={{
          options: listOpt,
          fieldNames: { label: 'listName', value: 'listId' },
          onChange: (_, o: any) => {
            setYearOpt(o?.listYearBgVOList || []);
            setCycleOpt([]);
            setAwardsOpt([]);
            formRef.current?.setFieldsValue({ listYear: '', listCycle: '', awardsId: '' });
          },
        }}
      />
      <ProFormSelect
        label="颁奖年份"
        name="listYear"
        rules={[{ required: true }]}
        placeholder="请选择"
        options={yearOpt}
        fieldProps={{
          fieldNames: { label: 'listYear', value: 'listYear' },
          onChange: (_, o: any) => {
            setCycleOpt(o?.listCycleBgVOList || []);
            setAwardsOpt([]);
            formRef.current?.setFieldsValue({ listCycle: '', awardsId: '' });
          },
        }}
      />
      <ProFormSelect
        label="颁奖周期"
        name="listCycle"
        rules={[{ required: true }]}
        placeholder="请选择"
        options={cycleOpt}
        fieldProps={{
          fieldNames: { label: 'listCycleDesc', value: 'listCycleType' },
          onChange: (_, o: any) => {
            setAwardsOpt(o?.awardsList || []);
            formRef.current?.setFieldsValue({ awardsId: '' });
          },
        }}
      />
      <ProFormSelect
        label="奖项名称"
        name="awardsId"
        rules={[{ required: true }]}
        placeholder="请选择"
        options={awardsOpt}
        fieldProps={{
          fieldNames: { label: 'awardsName', value: 'awardsId' },
        }}
      />
      <ProFormRadio.Group
        name="winnerType"
        label="授予对象"
        radioType="button"
        options={[
          { label: '团队', value: '1' },
          { label: '个人', value: '0' },
        ]}
        fieldProps={{
          onChange: () => {
            formRef.current?.setFieldsValue({ winnerId: '' });
          },
        }}
      />
      <ProFormDependency name={['winnerType']}>
        {({ winnerType }: any) => {
          return winnerType === '0' ? (
            <ProFormSelect
              key="personal"
              label="获奖人"
              name="winnerId"
              rules={[{ required: true }]}
              placeholder="请选择"
              options={perOpt}
              fieldProps={{
                labelInValue: true,
                showSearch: true,
                filterOption: (inputValue: any, option: any) => {
                  return option?.winnerName?.includes(inputValue);
                },
              }}
            />
          ) : (
            <ProFormSelect
              key="team"
              label="获奖团队"
              name="winnerId"
              rules={[{ required: true }]}
              placeholder="请选择"
              options={teamOpt}
              fieldProps={{
                labelInValue: true,
                fieldNames: { label: 'winnerName', value: 'winnerId' },
              }}
            />
          );
        }}
      </ProFormDependency>
      <ProFormTextArea
        label="获奖简介"
        placeholder="获奖简介不得超过200字"
        name="winnerDesc"
        rules={[{ required: true }]}
        fieldProps={{
          rows: 3,
          showCount: true,
          maxLength: 200,
        }}
      />
    </ModalForm>
  );
};

export default memo(AwardsModal);
