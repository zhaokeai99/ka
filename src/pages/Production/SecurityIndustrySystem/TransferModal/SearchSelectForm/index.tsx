import React, { memo, useState, useMemo, useEffect } from 'react';
import { ProFormSelect } from '@ant-design/pro-form';
import { Empty, Spin } from 'antd';
import { debounce } from 'lodash';

const SearchSelectForm: React.FC<any> = ({
  fetchList,
  label,
  name,
  mode = false,
  required = true,
}) => {
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(false);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: any = '') => {
      // if (!value) return;
      setOptions([]);
      setFetching(true);

      fetchList(value).then((res: any) => {
        setOptions(res);
        setFetching(false);
      });
    };
    return debounce(loadOptions, 800);
  }, [fetchList]);

  useEffect(() => {
    debounceFetcher();
  }, []);

  return (
    <ProFormSelect
      width="md"
      name={name}
      label={label}
      showSearch
      rules={[{ required }]}
      options={options}
      placeholder="请输入"
      fieldProps={{
        notFoundContent: fetching ? <Spin size="small" /> : <Empty />,
        filterOption: false,
        onSearch: debounceFetcher,
        autoClearSearchValue: true,
        mode: mode,
      }}
    />
  );
};

export default memo(SearchSelectForm);
