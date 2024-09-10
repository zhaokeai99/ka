import React from 'react';
import { Input, Select, Switch } from 'antd';
import JsonFormat from 'json-format';

const { Option } = Select;
export interface EditItemProps {
  callBack: (value: any) => any;
  // itemkey: string;
  label: string;
  inputType: string;
  defaultValue: string;
  placeholder: string;
}

const PropItem: React.FC<EditItemProps> = ({
  callBack = () => {},
  // itemkey = '',
  label = '',
  inputType = 'text',
  defaultValue = '',
  placeholder = '',
}) => {
  console.log('EditItem defaultValue ', defaultValue);
  const generateItem = (type) => {
    console.log('generateItem ', inputType, defaultValue);
    switch (type) {
      case 'text': // 多行文本, 一般用不到
        return (
          <Input.TextArea
            autoSize={{ minRows: 5 }}
            value={defaultValue}
            onChange={(e) => callBack(e && e.target.value)}
            placeholder={placeholder}
          ></Input.TextArea>
        );
      case 'number': // 数字，如宽度
        return (
          <Input
            value={defaultValue}
            onChange={(e) => callBack(parseInt(e && e.target.value, 10))}
          ></Input>
        );
      case 'numberSelectWidth': // 占宽
        return (
          <Select
            showSearch
            style={{ width: 210 }}
            placeholder={placeholder}
            optionFilterProp="children"
            defaultValue={12}
            value={defaultValue}
            onChange={(data) => callBack(data)}
          >
            <Option value={6}>6</Option>
            <Option value={8}>8</Option>
            <Option value={12}>12</Option>
            <Option value={24}>24</Option>
          </Select>
        );
      case 'bool': // 布尔，如禁用
        // return (
        //   <Select
        //     showSearch
        //     style={{ width: 210 }}
        //     placeholder={placeholder}
        //     optionFilterProp="children"
        //     defaultValue={'false'}
        //     value={defaultValue ? 'true' : 'false'}
        //     onChange={(data) => callBack(data !== 'false')}
        //   >
        //     <Option value="true">是</Option>
        //     <Option value="false">否</Option>
        //   </Select>
        // );
        return (
          <Switch
            // style={{ width: 210 }}
            value={defaultValue}
            onChange={(data) => callBack(data)}
          />
        );
      case 'singleText': // 单行描述，如label
        return (
          <Input
            value={defaultValue}
            onChange={(e) => callBack(e && e.target.value)}
            placeholder={placeholder}
          ></Input>
        );
      case 'array': // 数组，如枚举
      case 'object': // 对象，如props
        return (
          <Input.TextArea
            autoSize={{ minRows: 5 }}
            placeholder={placeholder}
            value={
              defaultValue && typeof defaultValue === 'object'
                ? JsonFormat(defaultValue)
                : defaultValue
            }
            onChange={(e) => {
              console.log('Edit object ', e.target.value);
              let returnValue = e && e.target.value;
              if (returnValue) {
                try {
                  returnValue = JSON.parse(returnValue);
                } catch (err) {
                  console.log(e);
                }
              }
              callBack(returnValue);
            }}
          ></Input.TextArea>
        );
      default:
        return <Input value={defaultValue} onChange={(e) => callBack(e && e.target.value)}></Input>;
    }
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        padding: 5,
        alignItems: 'center',
      }}
    >
      <div style={{ width: 100, height: 30, padding: 5, fontWeight: 600, textAlign: 'right' }}>
        {label ? `${label}：` : ''}
        {/* {label ? `${label}(${itemkey})：` : ''} */}
      </div>
      <div style={{ flex: 1 }}>{generateItem(inputType)}</div>
    </div>
  );
};

export default PropItem;
