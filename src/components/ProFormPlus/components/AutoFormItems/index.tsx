/* eslint-disable react/no-array-index-key */
import type { MutableRefObject } from 'react';
import { memo } from 'react';
import type { FormInstance } from 'antd';
import { Row } from 'antd';
import ProForm from '@ant-design/pro-form';
import DependencyFormList from '../DependencyFormList';
import AutoFormItem from '../AutoFormItem';

export interface FormItemProps {
  operateType: 'create' | 'update';
  uiSchema: any;
  colSpan?: number;
  formRef?: MutableRefObject<FormInstance<any> | undefined> | undefined;
  effects?: Record<string, any> | undefined;
}

const AutoFormItems: React.FC<FormItemProps> = memo(
  ({ operateType, uiSchema = [], formRef, effects }) => (
    <>
      {Array.isArray(uiSchema) &&
        uiSchema.map(({ groupTitle, data }) => (
          <ProForm.Group title={groupTitle} key={groupTitle}>
            <Row gutter={[12, 0]}>
              {Array.isArray(data) &&
                data.map((props) => {
                  if (props.type === 'dependencyList') {
                    return (
                      <DependencyFormList
                        operateType={operateType}
                        {...props}
                        formRef={formRef}
                        effects={effects}
                      />
                    );
                  }

                  return (
                    <AutoFormItem
                      operateType={operateType}
                      {...props}
                      formRef={formRef}
                      effects={effects}
                    />
                  );
                })}
            </Row>
          </ProForm.Group>
        ))}
    </>
  ),
);

export default AutoFormItems;
