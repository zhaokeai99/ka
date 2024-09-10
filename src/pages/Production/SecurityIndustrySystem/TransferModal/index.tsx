import React, { useCallback, memo } from 'react';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { getAlgoList, getSecuritiesSortNodeList, queryTargetSecuritiesSort } from '../service';
import SearchSelectForm from './SearchSelectForm';

// 调入行业/调入证券/证券自动化分类参数 弹窗
const TransferModal: React.FC<any> = ({
  showModal = false,
  type,
  title,
  onClose,
  id,
  onFinish = () => {},
  originIndustry,
}) => {
  const queryAlgoList = useCallback(async () => {
    const result = await getAlgoList({ id });
    return result.map((r: any) => ({ value: r.id, label: r.value }));
  }, []);

  // 获取目标行业下拉数据
  async function getSecuritiesList(value: any): Promise<any[]> {
    return getSecuritiesSortNodeList({ id, name: value }).then((result) => {
      return result.map((r: any) => ({
        value: r.id,
        label: r.value,
      }));
    });
  }

  // 获取目标证券下拉数据
  async function getTargetSecuritiesList(value: any): Promise<any[]> {
    return queryTargetSecuritiesSort({ id, keyword: value }).then((result) => {
      return result.map((r: any) => ({
        value: r.id,
        label: r.value,
      }));
    });
  }

  const renderItem = () => {
    switch (type) {
      // 调入行业
      case 'CALL_IN_INDUSTRY':
      case 'CALL_IN_INDUSTRY_UNSORTED':
        return <SearchSelectForm label="目标行业" name="nodeId" fetchList={getSecuritiesList} />;
      case 'ALGORITHM':
        return (
          <ProFormSelect
            width="md"
            name="algoId"
            label="算法"
            request={queryAlgoList}
            rules={[{ required: true }]}
          />
        );
      // 调入证券
      case 'SECURITIES':
        return (
          <SearchSelectForm
            mode="multiple"
            label="目标证券"
            name="resultIds"
            fetchList={getTargetSecuritiesList}
          />
        );
      case 'INDUSTRY_ADJUSTMENT':
      case 'INDUSTRY_ADJUSTMENT_SORTED':
        return (
          <>
            <ProFormText
              width="md"
              name="id"
              label="原行业归属"
              disabled
              fieldProps={{ value: originIndustry || '' }}
            />
            <SearchSelectForm label="目标行业" name="nodeId" fetchList={getSecuritiesList} />
          </>
        );
    }
    return null;
  };

  return (
    <ModalForm
      width="30%"
      title={title}
      visible={showModal}
      // onVisibleChange={(visible) => {}}
      onFinish={(values: any) => onFinish(values, type)}
      modalProps={{
        okText: '保存',
        onCancel: onClose,
        maskClosable: false,
        destroyOnClose: true,
      }}
    >
      {renderItem()}
    </ModalForm>
  );
};

export default memo(TransferModal);
