import React, { useState, useEffect } from 'react';
import { Empty, message, Spin } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import SearchTree from './SearchTree';
import EditForm from './EditFrom';
import { queryFetCols, updateFetCols, queryColList } from './service';

export default ({ type, tab, handleChange }: any) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [editData, setEditData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getEditItem = async (item: any) => {
    setLoading(true);
    const result = await queryFetCols({
      colId: item.key,
      searcherType: type,
    });
    setLoading(false);
    const { colDesc } = result || {};
    const { disabled, desc, isChecked } =
      result[tab === 'COLUMN' ? 'supportResult' : 'supportQuery'] || {};
    setFormData({
      colDesc,
      desc,
      isChecked,
      disabled,
    });
    setEditData(result);
  };

  const handleOk = async (result: any) => {
    setLoading(true);
    const success = await updateFetCols({
      ...editData,
      colDesc: result?.colDesc,
      ...(tab === 'COLUMN' && {
        supportResult: {
          ...editData.supportResult,
          desc: result.desc,
          isChecked: result.isChecked,
          disabled: result.disabled,
        },
      }),
      ...(tab === 'FILTER' && {
        supportQuery: {
          ...editData.supportQuery,
          desc: result.desc,
          isChecked: result.isChecked,
          disabled: result.disabled,
        },
      }),
    });

    if (success) {
      message.success('列项更新成功！');
      const data = await queryColList({
        searcherType: type,
      });
      setTreeData(data);
      handleChange();
    }
    setLoading(false);
  };

  // 初始化
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await queryColList({
        searcherType: type,
      });
      setTreeData(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Spin spinning={loading}>
      <ProCard split="vertical" style={{ paddingBottom: '12px' }}>
        <ProCard style={{ padding: '0' }} className="treeList" ghost colSpan="30%">
          <SearchTree defaultData={treeData} type={type} getEditItem={getEditItem} />
        </ProCard>
        <ProCard headerBordered>
          {editData ? (
            <EditForm tab={tab} handleOk={handleOk} defaultData={formData} sourceData={editData} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </ProCard>
      </ProCard>
    </Spin>
  );
};
