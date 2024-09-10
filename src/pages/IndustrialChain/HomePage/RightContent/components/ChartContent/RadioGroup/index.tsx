import { Radio } from 'antd';
import { useState } from 'react';

interface RadioGroupProps {
  onChange: (value: any) => void;
  type?: string;
}

const RadioGroup = (props: RadioGroupProps) => {
  const [type, setType] = useState(props.type || '2');

  const typeChange = (e: any) => {
    const { value } = e?.target;

    setType(value);
    props.onChange(value);
  };

  return (
    <Radio.Group value={type} size="small" buttonStyle="solid" onChange={(e: any) => typeChange(e)}>
      {/* 0：本季度、1：上季度、2：近一周、3：近一月、4：近半年、5：近一年 */}
      <Radio.Button value="2">近一周</Radio.Button>
      <Radio.Button value="3">近一月</Radio.Button>
      <Radio.Button value="4">近半年</Radio.Button>
      <Radio.Button value="5">近一年</Radio.Button>
    </Radio.Group>
  );
};

export default RadioGroup;
