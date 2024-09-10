/* eslint-disable react/no-array-index-key */
import type { MutableRefObject } from 'react';
import { memo } from 'react';
import type { FormInstance } from 'antd';
import { Row, Col } from 'antd';
import { ProFormDependency, ProFormList } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import AutoFormItem from '../AutoFormItem';
import { FEE_MIN, FEE_MAX_LABEL } from '@/utils/utils';

export interface FormItemProps {
  name: string;
  operateType: 'create' | 'update';
  uiSchema: any;
  colSpan?: number;
  dependency?: Record<string, any>;
  data: any[];
  formRef?: MutableRefObject<FormInstance<any> | undefined> | undefined;
}

// dependency的formList，转为TA，一个逗号分隔形式输入框，影响list服务
const DependencyFormList: React.FC<FormItemProps> = memo(
  ({ name, dependency, data, formRef, operateType }) => {
    return (
      <Col span={24}>
        <ProFormDependency name={dependency?.name}>
          {(dependencyValue) => {
            const str = dependencyValue[dependency?.name[0]] || '';
            const labelFlag = dependencyValue[dependency?.name[1]] || '';
            const showFlag = dependencyValue[dependency?.name[2]] || [];

            if (Array.isArray(dependency?.value) && !dependency?.value.includes(showFlag)) {
              return null;
            }
            if (!str) {
              return null;
            }
            // （1）分隔（2）过滤非数字（3）转换成浮点（4）排序（5）插入头尾（6）去重（7）生成数据结构（8）重置
            const arr = str
              .split(',')
              .filter((i: string) => i === '0' || !!parseFloat(i))
              .map((i: string) => parseFloat(i))
              .sort((i: number, j: number) => i - j);
            arr.unshift(FEE_MIN);
            arr.push(FEE_MAX_LABEL);
            const result = Array.from(new Set(arr)).reduce((i, j) => {
              if (!Array.isArray(i)) {
                return [
                  {
                    [dependency?.minValue]: i,
                    [dependency?.maxValue]: j,
                  },
                ];
              }
              return [
                ...i,
                {
                  [dependency?.minValue]: i[i.length - 1][dependency?.maxValue],
                  [dependency?.maxValue]: j,
                },
              ];
            });
            const currentFieldValues = formRef?.current?.getFieldValue(name);
            formRef?.current?.setFieldsValue({
              [name]:
                Array.isArray(result) &&
                result.map((i, j) => ({
                  ...(currentFieldValues && currentFieldValues[j]),
                  ...i,
                })),
            });

            return (
              <ProCard bordered>
                <ProFormList
                  name={name}
                  creatorButtonProps={false}
                  copyIconProps={false}
                  deleteIconProps={false}
                >
                  <Row gutter={[12, 0]}>
                    {Array.isArray(data) &&
                      data.map((props, index) => {
                        const label =
                          (dependency?.label &&
                            dependency?.label[labelFlag] &&
                            dependency?.label[labelFlag][index]) ||
                          props?.label;

                        return (
                          <AutoFormItem
                            operateType={operateType}
                            {...props}
                            label={label}
                            formRef={formRef}
                          />
                        );
                      })}
                  </Row>
                </ProFormList>
              </ProCard>
            );
          }}
        </ProFormDependency>
      </Col>
    );
  },
);

export default DependencyFormList;
