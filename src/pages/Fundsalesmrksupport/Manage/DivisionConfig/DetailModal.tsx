import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Button, message, Tooltip } from 'antd';
import MrkUploadItem from '@/components/MrkUploadItem';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProForm,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { addFundManager, updateFundManager, queryDivisionManager } from './service';
import { transOptions } from '@/utils/utils';
import { DeleteOutlined } from '@ant-design/icons';

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
    divisionAnotherName: '',
    pushActivityName: '',
    backgroundImage: '',
    rankNum: '',
    rankDefault: '',
    rankAbstract: '',
    managerImage: '',
    managerName: '',
    pushEmail: '',
    redirectUrl: '',
    configState: '',
    ranking: [{ rankName: '0' }],
  });
  const selectedRank: any[] = [
    { index: 0, value: '0' },
    { index: 1, value: '' },
    { index: 2, value: '' },
  ];
  const initOptions = [
    {
      label: '收益榜',
      value: '0',
    },
    {
      label: '收益率榜',
      value: '1',
    },
    {
      label: '回撤榜',
      value: '2',
    },
  ];
  // 传输组 验证是否重复
  const isRepeat = useCallback(async (v) => {
    const obj = {};
    for (const i in v) {
      if (obj[v[i]]) {
        return true;
      }
      obj[v[i]] = true;
    }
    return false;
  }, []);

  const hasSelect = useCallback(
    async (f, index, action, value, flag) => {
      if (flag == 2) {
        for (let i = 0; i < selectedRank.length; i++) {
          if (index === selectedRank[i].index) {
            selectedRank.splice(index, 1, { index: index, value: '' });
          }
        }
        action.remove(index);
      }

      /*   if (props.initValues.ranking !== undefined) {
        for (let i = 0; i < props.initValues.ranking.length; i++) {
          selectedRank.splice(i, 1, { index: i, value: props.initValues.ranking[i].rankName });
        }
      }
      for (let i = 0; i < selectedRank.length; i++) {
        if (index === selectedRank[i].index) {
          selectedRank.splice(index, 1, { index, value });
        }
      }
      const seleceed: any = [];
      for (let i = 0; i < selectedRank.length; i++) {
        if (selectedRank[i].value) {
          seleceed.push(selectedRank[i].value);
        }
      }

      if ((await isRepeat(seleceed)) && modalType === 'add') {
        message.error('同一类型的榜单只能选择一次,请重新确认后添加。');
      }*/
    },
    [props],
  );

  useEffect(() => {
    if (props.visible) {
      if (props.modalType === 'edit' && Object.keys(props.initValues).length >= 0) {
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

  // 非零的正整数
  // ^[1-9]\d*$ 或 ^([1-9][0-9]*){1,3}$ 或 ^\+?[1-9][0-9]*$
  const regex = /^[1-9]\d*$/;
  const formValuesregex = useCallback(async (code) => {
    if (!regex.test(code.target.value)) {
      message.error('请输入非零的正整数');
    }
  }, []);

  const handleSubmit = useCallback(
    async (value) => {
      if (value.rankNum != '' && !regex.test(value.rankNum)) {
        message.error('排行榜展示人数只能为非0的正整数');
        return;
      }
      const rankParams: any = [];
      const rankingParams: any = [];
      if (value.ranking && value.ranking.length > 0) {
        value.ranking.forEach((rank: any) => {
          rankingParams.push(rank);
          rankParams.push(rank.rankName);
        });
      }
      if (await isRepeat(rankParams)) {
        message.error('同一类型的榜单只能选择一次,请重新确认后添加。');
        return;
      }
      let result: any = {};
      if (props.modalType === 'add') {
        result = await addFundManager({
          ...value,
          ranking: rankingParams,
          rankDefault: value.rankDefault || 0,
          configState: value.configState || 0,
        });
      } else {
        result = await updateFundManager({
          ...value,
          ranking: rankingParams,
          rankDefault: value.rankDefault || 0,
          configState: value.configState || 0,
        });
      }
      if (result.success) {
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
        disabled={modalType === 'edit'}
        rules={[{ required: true }]}
      />

      <ProFormText
        name="divisionAnotherName"
        label="赛区别名"
        placeholder="请输入赛区别名"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 50,
        }}
      />
      <ProFormText
        name="pushActivityName"
        label="活动名称"
        placeholder="请确保与主视觉图片文字一致"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 30,
        }}
      />
      <MrkUploadItem
        required
        accept=".jpg, .jpeg, .png"
        name="backgroundImage"
        label="背景图"
        formRef={formRef}
      />
      <ProFormText
        name="rankNum"
        label="排行榜展示人数"
        placeholder="请输入排行榜展示人数(非零的正整数),默认:10"
        fieldProps={{
          showCount: true,
          maxLength: 10,
          onChange: (val) => formValuesregex(val),
        }}
        rules={[{ required: modalType === 'edit' }]}
      />
      <ProFormText
        name="rankAbstract"
        label="排行榜摘要"
        placeholder="请输入排行榜摘要,最多输入25个字符，默认:收益排行TOP10每人赢奖金"
        fieldProps={{
          showCount: true,
          maxLength: 25,
        }}
        rules={[{ required: modalType === 'edit' }]}
      />
      <ProFormText
        name="managerName"
        label="客户经理名称"
        placeholder="请输入客户经理名称,最多输入20个字符"
        fieldProps={{
          showCount: true,
          maxLength: 20,
        }}
      />
      <MrkUploadItem
        accept=".jpg, .jpeg, .png"
        name="managerImage"
        label="客户经理二维码"
        placeholder="请上传客户经理二维码图片"
        formRef={formRef}
      />
      <ProFormTextArea
        name="pushEmail"
        label="联系人邮箱"
        placeholder="请输入联系人邮箱，多个邮箱请用逗号隔开"
      />
      <ProFormText name="redirectUrl" label="重定向地址" placeholder="请输入重定向地址" />
      {/*<ProFormSelect
        name="rankDefault"
        label="排行榜默认榜单"
        options={[
          {
            label: '收益',
            value: '',
          },
          {
            label: '收益率',
            value: 1,
          },
        ]}
      />*/}
      <ProFormList
        name="ranking"
        label="排行榜榜单"
        min={1}
        max={3}
        creatorButtonProps={{
          creatorButtonText: '添加榜单',
          icon: false,
          style: {
            width: 'unset',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
            left: 200,
            top: -55,
          },
        }}
        copyIconProps={false}
        deleteIconProps={false}
        itemContainerRender={(doms) => {
          return <ProForm.Group>{doms}</ProForm.Group>;
        }}
        alwaysShowItemLabel
        actionGuard={{
          beforeAddRow: async () => {
            return new Promise((resolve) => {
              setTimeout(() => resolve(true), 10);
            });
          },
          beforeRemoveRow: async (index) => {
            return new Promise((resolve) => {
              if (index === 0) {
                message.error('最少保留一个榜单');
                resolve(false);
                return;
              }
              setTimeout(() => resolve(true), 10);
            });
          },
        }}
      >
        {(f, index, action) => {
          return (
            <>
              <ProFormSelect
                name="rankName"
                label={`榜 ${index + 1}  `}
                placeholder="请选择榜单"
                rules={[{ required: true }]}
                fieldProps={{
                  onChange: (val) => hasSelect(f, index, action, val, 1),
                }}
                options={initOptions}
              />
              <Button type={'link'} style={{ left: -35 }} hidden={index == 0}>
                <Tooltip placement="top" title="删除此行">
                  <DeleteOutlined onClick={() => hasSelect(f, index, action, null, 2)} />
                </Tooltip>
              </Button>
            </>
          );
        }}
      </ProFormList>
      <ProFormRadio.Group
        name="configState"
        label="赛区配置状态"
        options={[
          {
            label: '正常',
            value: '',
          },
          {
            label: '停用',
            value: 1,
          },
        ]}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
