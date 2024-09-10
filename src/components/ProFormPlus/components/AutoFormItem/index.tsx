import type { MutableRefObject } from 'react';
import React from 'react';
import type { FormInstance } from 'antd';
import { TimePicker, Col } from 'antd';
import { Input, DatePicker, Select, InputNumber, Divider, Button, Radio } from 'antd';
import {
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormDigit,
  ProFormDatePicker,
  ProFormDependency,
  ProFormRadio,
  ProFormTimePicker,
} from '@ant-design/pro-form';
import { DiffOutlined, SyncOutlined } from '@ant-design/icons';
import './index.less';
import { taDataFormatter } from '@/utils/utils';

const { TextArea } = Input;

export interface FormItemProps {
  name: string;
  hasFeedback: boolean;
  operateType: 'update' | 'create';
  type?:
    | 'text'
    | 'textarea'
    | 'select'
    | 'digit'
    | 'datePicker'
    | 'percent'
    | 'money'
    | 'multiSelect'
    | 'timePicker'
    | 'radioGroup';
  width?: number | 'sm' | 'md' | 'xl' | 'xs' | 'lg' | undefined;
  colSpan?: number;
  disabled?: boolean;
  hidden?: boolean;
  originalDiff?: boolean;
  operateDiff?: boolean;
  label?: string;
  originalDiffValue?: any;
  placeholder?: string;
  required?: boolean;
  valueEnum?: any;
  fieldProps?: any;
  min?: number;
  max?: number;
  request?: (params: any) => any;
  dependency?: any;
  rules?: any;
  canEdit?: boolean;
  canAll?: boolean;
  formRef?: MutableRefObject<FormInstance<any> | undefined> | undefined;
  initialValue?: any;
  effect?: string;
  effects?: Record<string, any> | undefined;
  absoluteComponent?: any;
}

const AutoFormItem: React.FC<FormItemProps> = ({
  type = 'text', // 组件类型
  width = 'xl', // 大点好看
  disabled = true, // 是否不可用
  hidden = false, // 是否隐藏
  canEdit = true, // 是否可以编辑
  canAll = false, // 仅当type=multiSelect时生效
  originalDiff = false, // 跟自己比
  operateDiff = false, // 跟别人比
  label = '', // 展示的label名称
  placeholder = '', // 提示
  required = true, // 是否必填
  hasFeedback = true,
  min = 0, // 最小值,
  max, // 最大值,
  initialValue,
  colSpan,
  valueEnum, // 如果是select的
  name, // key
  originalDiffValue, // 跟自己比的老数据
  fieldProps, // 扩充字段
  children,
  dependency,
  rules,
  operateType,
  formRef, // 外层form,方便操作表单数据
  effect,
  effects,
  absoluteComponent,
}) => {
  const types = {
    text: ProFormText,
    textarea: ProFormTextArea,
    select: ProFormSelect,
    digit: ProFormDigit,
    datePicker: ProFormDatePicker,
    percent: ProFormDigit,
    money: ProFormDigit,
    multiSelect: ProFormSelect,
    radioGroup: ProFormRadio.Group,
    timePicker: ProFormTimePicker,
  };

  const originTypes = {
    text: Input,
    textarea: TextArea,
    select: Select,
    digit: InputNumber,
    datePicker: DatePicker,
    percent: InputNumber,
    money: InputNumber,
    multiSelect: Select,
    radioGroup: Radio.Group,
    timePicker: TimePicker,
  };

  // 先拼接参数
  // 基础参数
  const baseProps = {
    width: colSpan === 24 ? '100%' : width,
    labelCol: { span: colSpan === 24 ? '4' : '8' },
    wrapperCol: { span: colSpan === 24 ? '20' : '16' },
    initialValue,
    hidden,
    name,
    fieldProps: {
      ...fieldProps,
      // 单独处理副作用
      onChange: async () => {
        if (effect && effects && effects[effect]) {
          const result = await effects[effect](formRef?.current);
          formRef?.current?.setFieldsValue(result);
        }
      },
    },
    hasFeedback,
    disabled: disabled || (operateType === 'update' && !canEdit), // 不可编辑的字段要考虑进来
    placeholder:
      placeholder ||
      (type === 'text' || type === 'digit' ? `请填写${label}` : `请选择${label}`) ||
      '',
    tooltip: operateDiff
      ? {
          title: `${label} - 双经办不一致`,
          icon: <SyncOutlined spin style={{ fontSize: '18px', color: '#eb2f96' }} />,
        }
      : null,
    label:
      (label && (
        <div className={`auto-form-item ${label.length > 14 ? 'xs-fs' : ''}`}>{label}</div>
      )) ||
      label,
    // validateStatus: operateDiff ? 'warning' : null,
    rules: rules || [{ required, message: placeholder }],
  };

  // 扩充配置
  const otherProps = {
    selectProps: {
      valueEnum,
      // request,
    },
    digitProps: {
      min,
      max,
    },
    textProps: {},
    datePickerProps: {
      fieldProps: {
        format: 'YYYY-MM-DD',
      },
    },
    moneyProps: {
      min,
      fieldProps: {
        formatter: (value: any) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      },
    },
    percentProps: {
      min,
      max: 100,
      fieldProps: {
        formatter: (value: number) => `${value}%`,
      },
    },
    timePickerProps: {
      fieldProps: {
        format: 'HH:mm:ss',
      },
      defaultValue: initialValue,
    },
    multiSelectProps: {
      valueEnum,
      fieldProps: {
        mode: 'multiple',
        dropdownRender: (menu: any) => {
          if (canAll && !disabled) {
            return (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <Button
                  type="link"
                  style={{ width: '100%', textAlign: 'left' }}
                  onClick={() => {
                    formRef?.current?.setFieldsValue({
                      [name]: Object.keys(valueEnum),
                    });
                  }}
                >
                  全选
                </Button>
              </div>
            );
          }

          return menu;
        },
      },
    },
    radioGroupProps: {
      options:
        (valueEnum &&
          Object.keys(valueEnum).map((key: string) => ({
            label: valueEnum[key],
            value: key,
          }))) ||
        [],
    },
  };

  // 不存在新增的隐藏列，防止提交无用列
  // if (operateType === 'create' && hidden) return null;

  const extraComponent = React.createElement(
    originTypes[type] as any,
    {
      ...baseProps?.fieldProps,
      ...otherProps[`${type}Props`]?.fieldProps,
      disabled: true,
      defaultValue: taDataFormatter(originalDiffValue, type),
      style: { marginTop: '5px' },
    },
    (() => {
      if (type === 'select' || type === 'multiSelect') {
        return (
          <>
            {valueEnum &&
              Object.keys(valueEnum).map((key) => (
                <Select.Option key={key} value={`${key}`}>
                  {valueEnum[key]}
                </Select.Option>
              ))}
          </>
        );
      }

      if (type === 'radioGroup') {
        return (
          <>
            {valueEnum &&
              Object.keys(valueEnum).map((key) => (
                <Radio key={key} value={`${key}`}>
                  {valueEnum[key]}
                </Radio>
              ))}
          </>
        );
      }

      return null;
    })(),
  );

  // 增加一个来自uiSchema的可动态联动属性组
  const createItem = (dependencyProps = {}, extraProps = {}) => {
    if (hidden) {
      return React.createElement(
        types[type] as any,
        {
          ...baseProps,
          ...otherProps[`${type}Props`],
          ...dependencyProps,
          extra: originalDiff ? (
            <span>
              <DiffOutlined /> {extraComponent}
            </span>
          ) : (
            ''
          ),
          fieldProps: {
            ...baseProps?.fieldProps,
            ...otherProps[`${type}Props`]?.fieldProps,
            ...fieldProps,
          },
          ...extraProps,
        },
        children,
      );
    }
    return (
      <Col span={colSpan || 12} key={name}>
        {absoluteComponent}
        {React.createElement(
          types[type] as any,
          {
            ...baseProps,
            ...otherProps[`${type}Props`],
            ...dependencyProps,
            extra: originalDiff ? (
              <span>
                <DiffOutlined /> {extraComponent}
              </span>
            ) : (
              ''
            ),
            fieldProps: {
              ...baseProps?.fieldProps,
              ...otherProps[`${type}Props`]?.fieldProps,
              ...fieldProps,
            },
            ...extraProps,
          },
          children,
        )}
      </Col>
    );
  };

  if (dependency) {
    return (
      <ProFormDependency {...dependency}>
        {(dependencyValue) => {
          if (!dependencyValue || !dependency.name) return null;
          const value = dependencyValue[dependency.name];

          // 情况一：存在value表示展示与否
          if (dependency?.value) {
            const depValue = dependency?.value;

            // 数组形式，不包含不展示
            if (Array.isArray(depValue)) {
              if (!depValue.includes(value)) return null;
              // 单个元素形式，不相等不展示
            } else if (depValue !== value) {
              return null;
            }
          }

          // 清除形式
          if (dependency.cases) {
            const cases = dependency?.cases;

            // 依赖项发生变化时，valueEnum不含当前值时， 重置值为 resetVal 或者 ''
            const curr = formRef?.current?.getFieldValue([name]);
            /**
             * 重置条件
             * 1、value不存在
             * 2、(type === 'select' || type === 'multiSelect') 且 cases[value]存在
             *  1）cases[value]?.valueEnum不存在，且valueEnum[curr]不存在
             *  2）cases[value]?.valueEnum存在，cases[value].valueEnum[curr] 不存在
             */
            if (
              !value ||
              ((type === 'select' || type === 'multiSelect') &&
                cases[value] &&
                !(cases[value]?.valueEnum || valueEnum[curr])) ||
              (cases[value] && cases[value]?.valueEnum && !cases[value]?.valueEnum[curr])
            ) {
              formRef?.current?.setFieldsValue({ [name]: dependency.resetVal || '' });
            }
            // 如果有配置cases字段，多状态下就会匹配对应的value去适配该状态的props值，该组件所有的已定义prop都可以
            // 为了兼容老的逻辑，把cases的优先级提高到隐藏item属性之前了，所以配置时假如同时配置两个属性，cases优先了
            if (cases) {
              const props = dependency.cases[value] || {};
              return createItem(props);
            }
          }

          // 替换label
          if (dependency.label) {
            return createItem(
              {},
              {
                label: dependency?.label[value] || '',
              },
            );
          }

          return createItem({});
        }}
      </ProFormDependency>
    );
  }

  return createItem({});
};

export default AutoFormItem;
