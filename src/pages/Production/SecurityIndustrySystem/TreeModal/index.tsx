import React, { memo, useRef, useEffect, useCallback, useState } from 'react';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { getIndexTracking, getTraceSecuritiesList } from '../service';
import { debounce as _debounce } from 'lodash';
import { Spin } from 'antd';

const TreeModal: React.FC<any> = ({ type, showModal, onFinish, onClose, id, editInfo }) => {
  const formRef = useRef<any>();
  const [traceListOptions, setTraceListOptions] = useState<any[]>([]);
  const [trackingListOptions, setTrackingListOptions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  // 配置指数
  const searchTrackingList = useCallback(
    _debounce(async (value = '') => {
      setFetching(true);
      const result = await getIndexTracking({ id, keyword: value });
      const newList = result.map((r: any) => ({ value: r.value, label: r.name }));
      setFetching(false);
      setTrackingListOptions(newList);
    }, 800),
    [],
  );

  // 自动映射体系
  const searchTraceList = useCallback(
    _debounce(async (value = '') => {
      setFetching(true);
      const result = await getTraceSecuritiesList({ id, keyword: value });
      const newList = result.map((r: any) => ({ value: r.id, label: r.value }));
      setFetching(false);
      setTraceListOptions(newList);
    }, 800),
    [],
  );

  useEffect(() => {
    searchTraceList();
    searchTrackingList();
    if (showModal && type === 'UPDATE') {
      formRef?.current?.setFieldsValue({
        ...editInfo,
        traceNodeIds: editInfo?.traceNodeIds?.map((i: any) => i.id),
      });
    }
  }, [editInfo, showModal, type]);

  return (
    <ModalForm
      width="30%"
      title={type === 'ADD' ? '添加' : '修改'}
      formRef={formRef}
      visible={showModal}
      onFinish={async (values: any) => {
        onFinish({ ...values });
      }}
      modalProps={{
        okText: '保存',
        onCancel: onClose,
        maskClosable: false,
        destroyOnClose: true,
      }}
    >
      <ProFormText rules={[{ required: true }]} width="md" name="name" label="行业名称" />
      <ProFormSelect
        label="自动映射体系"
        name="traceNodeIds"
        placeholder="请输入"
        width="md"
        fieldProps={{
          notFoundContent: fetching ? <Spin size="small" /> : null,
          showSearch: true,
          onSearch: searchTraceList,
          mode: 'multiple',
          autoClearSearchValue: true,
        }}
        options={traceListOptions}
      />
      <ProFormSelect
        label="配置指数"
        name="algoTraceCode"
        placeholder="请输入"
        width="md"
        fieldProps={{
          notFoundContent: fetching ? <Spin size="small" /> : null,
          showSearch: true,
          onSearch: searchTrackingList,
        }}
        options={trackingListOptions}
      />
    </ModalForm>
  );
};

export default memo(TreeModal);
