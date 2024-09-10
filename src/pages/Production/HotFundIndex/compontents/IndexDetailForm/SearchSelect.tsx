import { Select } from 'antd';
import { debounce as lodashDebounce } from 'lodash';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { fuzzySearch } from '../../service';
import { uniqBy as _uniqBy } from 'lodash';

const SelectPlus: React.FC<any> = ({ onChange, defaultValue, type }) => {
  const [optList, setOptList] = useState([]);

  const getOptList = useCallback(async (keyword) => {
    const { success, data } = await fuzzySearch({ searcherType: type, keyword });
    if (success && data) {
      const nList = _uniqBy(data || [], 'value');
      setOptList(nList || []);
    }
  }, []);

  useEffect(() => {
    if (!optList.length) {
      getOptList(defaultValue);
    }
  }, [defaultValue]);

  const handleSearch = lodashDebounce(async (newValue: string) => {
    if (newValue) {
      await getOptList(newValue);
    }
  }, 500);

  return (
    <div>
      <Select
        showSearch
        allowClear
        // mode="multiple"
        onSearch={handleSearch}
        defaultValue={defaultValue}
        filterOption={false}
        onChange={onChange}
        fieldNames={{
          label: 'name',
          value: 'name',
        }}
        options={optList}
      />
    </div>
  );
};

export default memo(SelectPlus);
