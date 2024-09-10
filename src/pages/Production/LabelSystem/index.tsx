import React, { useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { contentPadding } from '@/themes';
import { Empty } from 'antd';
import AutoMarking from './AutoMarking';
import LabelTab from './LabelTab';
import SearchTree from './SearchTree';

const unCheckedId = [1, 2, 3];

const LabelSystem: React.FC = () => {
  const [tableParams, setTableParams] = useState<any>({
    markId: '',
    markType: '',
  }); // 列表参数
  const [actionEdit, setActionEdit] = useState<any>({}); // 编辑权限

  const onSelect = (val: any) => {
    const { markId, markType, userCanEdit } = val;
    setTableParams({ markId, markType });
    setActionEdit(userCanEdit);
  };

  return (
    <ProCardPlus ghost style={{ padding: contentPadding }} size="small">
      <ProCardPlus split="vertical">
        <SearchTree colSpan="27%" onSelect={onSelect} />
        <ProCardPlus ghost colSpan="73%" size="small" direction="column">
          {tableParams?.markId && !unCheckedId.includes(tableParams?.markId) ? (
            <>
              <AutoMarking params={tableParams} />
              <LabelTab params={tableParams} actionEdit={actionEdit} />
            </>
          ) : (
            <Empty
              style={{ marginTop: 60 }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="请从左侧选择标签查看数据"
            />
          )}
        </ProCardPlus>
      </ProCardPlus>
    </ProCardPlus>
  );
};

export default LabelSystem;
