import type { ProFormLayoutType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import moment from 'moment';
import { memo, useCallback, useEffect, useState } from 'react';
import { dispatchPass } from './service';
export interface SchemaFormPlusProps {
  layoutType: ProFormLayoutType; // 使用的表单布局模式
  visible?: boolean; // 可见性
  columnsData: any; // 数据源
  onClose?: (val?: string) => void; // 关闭操作
  onFinish?: (val?: any) => void; // 完成操作
  cancelText?: string; // layoutTyp为ModalForm时 取消按钮文案
  confimText?: string; // layoutTyp为ModalForm时 确定按钮文案
  valuesChange?: (val?: any) => void; // 值改变 抛出给父组件
}

// 远程数据格式
type RemoteDataItem = {
  fieldName: string;
  fieldKey: string;
  required: boolean;
  readOnly: boolean;
  fieldType: string;
  interfaceUrl: string;
  dependent: string;
  maxNum: number;
  defaultValue: object;
  format: string;
  hidden: boolean;
  col: number;
};
type RemoteDataType = RemoteDataItem[];

type DataItem = {
  name: string;
  state: string;
};

type ListType = {
  key: string;
  list: string[];
}[];

const watchList: ListType = []; // 监听联动列表

// 动态表单组件
const SchemaFormPlus = (props: SchemaFormPlusProps) => {
  const [formReqData, setFormReqData] = useState<any>({});
  const [columnsResult, setColumnsResult] = useState<any>([]);
  const [saveLoading, setSaveLoading] = useState(false); // 是否加载中 确认按钮
  const {
    visible,
    onClose = () => {},
    onFinish = () => {},
    columnsData,
    layoutType,
    cancelText = '关闭',
    confimText = '确定保存',
    valuesChange = () => {},
  } = props;

  const [form] = Form.useForm();
  // const result = Form.useWatch(['contactName', 'basicFormItem'], form);

  // 处理联动 添加到依赖列表
  const dealWachList = (item: any) => {
    const findWatch = watchList.find((watchItem: any) => watchItem.key == item.dependent); // 判断watchList是否已有
    if (item.dependent && !findWatch) {
      // 有dependent 且依赖列表里没有 需添加
      watchList.push({ key: item.dependent, list: [item.fieldKey] });
    }
    if (item.dependent && findWatch) {
      // 有dependent 且依赖列表里有 需追加list
      findWatch.list = [...findWatch.list, item.fieldKey];
    }
  };

  const convertValueFun = (item: any, value: any) => {
    if (item.fieldType == 'date' && value) {
      // 日期格式转换
      return moment(value, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
    }
    return value;
  };

  const transformFun = (item: any, value: any, namePath: any) => {
    if (item.fieldType == 'date' && value && item.format) {
      // 日期类型转换
      return { [namePath]: moment(value, 'YYYY-MM-DD HH:mm:ss').format(item.format) };
    }
    return { [namePath]: value };
  };

  // 传给渲染的组件的 props 处理函数
  const fieldPropsFun = (item: any) => {
    return {
      ...(item.fieldType == 'select' ? { mode: item.multiple ? 'multiple' : '' } : {}),
      disabled: item.disabled,
      options: item.options,
      style: {
        borderColor: item.highLight ? 'red' : '', // 高亮（红色）
      },
    };
  };

  // 处理接口返回数据 统一格式
  const dealFun = (formData: RemoteDataType) => {
    const deal: any = (dealData: RemoteDataType) => {
      return dealData.map((item: any) => {
        // 处理分组 递归
        if (item.valueType == 'group') {
          const columns = deal(item.columns);
          return {
            ...item,
            columns,
          };
        }
        // 处理联动 添加到依赖列表
        dealWachList(item);
        let rules: any = [{ required: item.required }];
        if (item.fieldType == 'input') {
          rules = [...rules, { max: item.maxNum }];
        }
        const transformData: any = {
          title: item.fieldName, // 标题的内容，即form 中的 label
          dataIndex: item.fieldKey, // 与实体映射的 key 表单key值
          // dataIndex: [item.fieldKey, 'basicFormItem'], // useWatch方案
          valueType: item.fieldType, // 数据的渲渲染方式 即表单类型
          initialValue: item.defaultValue, // 默认值
          readonly: item.readOnly, // 是否只读
          // valueEnum: item.valueEnum, // options， 多选选项，相比于 options 支持更加丰富的定
          colProps: {
            span: item.col, // 在一行占据多少
          },
          // hideInForm: item.hidden, // 是否隐藏（不会收集和校验字段）不渲染该项
          formItemProps: {
            // 传递给 Form.Item 的配置
            rules,
            hidden: item.hidden, // 是否隐藏（依然会收集和校验字段）visibility
          },
          convertValue: (value: any) => {
            // 获取时转化值，一般用于将数据格式化为组件接收的格式
            return convertValueFun(item, value);
          },
          transform: (value: any, namePath: string) => {
            // 提交时转化值，一般用于将值转化为提交的数据
            return transformFun(item, value, namePath);
          },
          dependencies: [item.dependent], // 所依赖的表单项
          // 传给渲染的组件的 props，自定义的时候也会传递
          fieldProps: fieldPropsFun(item),
        };
        form.setFieldsValue({ [item.fieldKey]: item.defaultValue }); // 解决表单值initialValue 修改 不更新问题
        if (item.interfaceUrl) {
          // 数据来源于接口，请求接口
          transformData.request = async () => {
            const { data } = await dispatchPass(item.interfaceUrl, {});
            // 把接口数据保存在formReqData里
            setFormReqData((oldVal: any) => {
              return { ...oldVal, [item.fieldKey]: data };
            });
            return data;
          };
        }
        return transformData;
      });
    };
    const result = deal(formData);
    setColumnsResult(result);
  };

  useEffect(() => {
    dealFun(columnsData);
  }, [columnsData]);

  // 监听值改变
  const onValuesChange = (curVal: any) => {
    valuesChange(curVal); // 抛出给父组件
    const curKey = Object.keys(curVal)[0]; // 当前变化key
    const findWatchItem = watchList.find((item: any) => {
      return item.key == curKey;
    });
    // 找到对应监听项
    if (findWatchItem) {
      findWatchItem.list.forEach((item: any) => {
        const res = formReqData[curKey].find((dataItem: any) => dataItem.value === curVal[curKey]);
        form.setFieldsValue({ [item]: res.object[item] || '' });
      });
    }
  };

  // 提交 保存
  const finish = useCallback(async (values) => {
    // 参数 values 会过滤null值
    // const submitData = form.getFieldsValue(); // 包括空值 values过滤空值
    setSaveLoading(true);
    await onFinish(values);
    setSaveLoading(false);
    return true;
  }, []);

  // 弹窗表单 底部按钮设置
  const submitterRender = useCallback(
    (subProps: any) => {
      if (layoutType === 'Form') return false;
      return [
        <Button key="cancel" onClick={() => onClose()}>
          {cancelText}
        </Button>,
        <Button
          key="ok"
          loading={saveLoading}
          type="primary"
          onClick={() => {
            subProps.form?.submit?.();
          }}
        >
          {confimText}
        </Button>,
      ];
    },
    [saveLoading],
  );

  return (
    <BetaSchemaForm<DataItem>
      form={form}
      layoutType={layoutType}
      width="70%"
      visible={visible}
      rowProps={{
        gutter: [16, 16],
      }}
      grid={true}
      onFinish={finish}
      onValuesChange={onValuesChange}
      onVisibleChange={(values) => {
        if (values == false) {
          onClose();
        }
      }}
      submitter={{
        render: (subProps: any) => submitterRender(subProps),
      }}
      columns={columnsResult}
    />
  );
};

export default memo(SchemaFormPlus);
