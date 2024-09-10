import { Select } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { uniqBy as _uniqBy } from 'lodash';

const SelectPlus: React.FC<any> = ({ onChange, defaultValue, options }) => {
  const [optList, setOptList] = useState(options);

  useEffect(() => {
    const thList = [];
    const notThList = [];
    const nList = _uniqBy(options || [], 'value');

    (nList || []).map((opt: any) => {
      if (!!opt.isTh) {
        thList.push(opt);
      } else {
        notThList.push(opt);
      }
    });
    setOptList([...thList, ...notThList]);
  }, [options]);

  return (
    <div>
      <Select
        showSearch
        mode="multiple"
        allowClear
        defaultValue={defaultValue}
        onChange={onChange}
        options={optList}
      />
    </div>
  );
};

export default memo(SelectPlus);
