import React, { useEffect, useState, useCallback, memo } from 'react';
import { TreeSelect } from 'antd';
import { queryProductCategoryDropDownList } from '../service';
import { transOptions } from '@/utils/utils';
type Option = {
  label: React.ReactNode | string;
  value: number;
};
interface PropsType {
  value?: string;
  onChange?: (value: string) => void;
}
const MySelect: React.FC<PropsType> = (props) => {
  const [treeData, setTreeData] = useState<Option[]>([]);
  const getOptionData = useCallback(async () => {
    const res: any = await queryProductCategoryDropDownList();
    if (res.success) {
      const data = transOptions(res.data || [], 'title', 'id');
      setTreeData(data);
    }
  }, []);
  useEffect(() => {
    getOptionData();
  }, []);
  return (
    <TreeSelect
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择产品分类"
      treeData={treeData}
      value={props.value}
      onChange={props.onChange}
    />
  );
};
export default memo(MySelect);
