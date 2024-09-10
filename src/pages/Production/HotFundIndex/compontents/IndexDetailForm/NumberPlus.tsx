import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, InputNumber, Select } from 'antd';
import { pullAt as _pullAt } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
const NumberPlus: React.FC<any> = ({ onChange, defaultValue, type, unitList }) => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (defaultValue.length >= 1) {
      setFields([...defaultValue]);
    } else {
      setFields([{ op: null, value: '', times: null }]);
    }
  }, []);

  const add = () => {
    setFields([...fields, { value: '' }]);
  };

  const remove = (index) => {
    const nFields = [...fields];
    _pullAt(nFields, index);
    setFields(nFields);
    onChange(nFields);
  };

  const hanleChange = (index, key, value) => {
    const nFields = [...fields];
    nFields[index][key] = value;
    setFields([...nFields]);
    onChange(nFields);
  };

  return (
    <>
      {fields.map((field, index) => (
        <div style={{ display: 'flex', marginBottom: 5 }} key={`${index}-${field?.op}`}>
          <Select
            onChange={(val) => hanleChange(index, 'op', val)}
            value={field.op}
            style={{ flex: 1 }}
            options={[
              { value: 'EQ', label: '等于' },
              { value: 'GT', label: '大于' },
              { value: 'GE', label: '大于等于' },
              { value: 'LT', label: '小于' },
              { value: 'LE', label: '小于等于' },
            ]}
          />
          <InputNumber
            addonAfter={type === 'percent' ? '%' : null}
            value={field.value}
            style={{ flex: 1, minWidth: 40, marginLeft: 4 }}
            onChange={(val) => hanleChange(index, 'value', val)}
          />
          {unitList && unitList.length >= 1 ? (
            <Select
              onChange={(val) => hanleChange(index, 'times', val)}
              value={field.times}
              style={{ flex: 1, marginLeft: 4, maxWidth: 70 }}
              options={unitList}
            />
          ) : null}

          <MinusCircleOutlined
            style={{
              lineHeight: '32px',
              paddingLeft: 3,
              width: 14,
              visibility: index >= 1 ? 'initial' : 'hidden',
            }}
            onClick={() => remove(index)}
          />
        </div>
      ))}
      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
        添加条件
      </Button>
    </>
  );
};

export default memo(NumberPlus);
