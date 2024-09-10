import type { FC, MutableRefObject } from 'react';
import type { ProFormProps, FormItemProps } from '@ant-design/pro-form';
import React, { memo, useCallback, useRef } from 'react';
import { Tabs, Badge } from 'antd';
import type { FormInstance } from 'antd';
import ProForm from '@ant-design/pro-form';
import AutoFormItems from './components/AutoFormItems';
import './index.less';

interface ProFormPlusTabDataType {
  key: number;
  title: string;
  stepName: string;
  uiSchema: any[];
  modelName: string | { key: string; suffix: 'Org' | 'Person' }[];
  formComponent?: FC<FormItemProps> | any;
}

interface ProFormPlusProps {
  formRef?: MutableRefObject<FormInstance<any> | undefined> | undefined;
  tabData?: ProFormPlusTabDataType[] | undefined;
  uiSchema?: Record<string, any>[] | undefined;
  initialValues?: Record<string, any>[] | undefined;
  needBadge?: boolean | undefined;
  tabsBadge?: boolean[] | undefined;
  customForm?: any;
  operateType?: 'create' | 'update';
  title?: string;
  effects?: Record<string, any> | undefined;
}

const { TabPane } = Tabs;

const ProFormPlus: FC<ProFormPlusProps & ProFormProps> = memo(
  ({
    layout = 'horizontal',
    labelCol = { span: 8 },
    wrapperCol,
    params = {},
    submitter = {},
    needBadge = true,
    tabsBadge = [],
    operateType = 'update',
    initialValues,
    request,
    onFinish,
    tabData,
    uiSchema,
    customForm,
    formRef,
    effects,
    style,
  }) => {
    const ref = useRef(null);
    const tabRender = useCallback(
      (tab) =>
        tab.formComponent ? (
          <tab.formComponent
            operateType={operateType}
            uiSchema={tab.uiSchema}
            formRef={formRef || ref}
            effects={effects}
          />
        ) : (
          <AutoFormItems
            operateType={operateType}
            uiSchema={tab.uiSchema}
            formRef={(formRef || ref) as any}
            effects={effects}
          />
        ),
      [operateType, formRef, effects],
    );

    const formRender = useCallback(
      () =>
        customForm ? (
          <>
            {/* @ts-ignore */}
            <customForm
              operateType={operateType}
              uiSchema={uiSchema}
              formRef={formRef || ref}
              effects={effects}
            />
          </>
        ) : (
          <AutoFormItems
            operateType={operateType}
            uiSchema={uiSchema}
            formRef={(formRef || ref) as any}
            effects={effects}
          />
        ),
      [uiSchema, customForm, operateType, formRef, effects],
    );

    return (
      <ProForm
        className="thfund-pro-form"
        formRef={(formRef || ref) as any}
        onFinish={onFinish}
        request={request}
        layout={layout}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        params={params}
        submitter={submitter}
        initialValues={initialValues}
        style={style}
      >
        {tabData ? (
          <Tabs defaultActiveKey="0" type="card">
            {tabData.map((tab) => (
              <TabPane
                tab={
                  needBadge ? (
                    <Badge dot={tabsBadge[tab.key]} size="small" offset={[0, -4]}>
                      {tab.title}
                    </Badge>
                  ) : (
                    tab.title
                  )
                }
                key={tab.key}
              >
                {tabRender(tab)}
              </TabPane>
            ))}
          </Tabs>
        ) : null}
        {uiSchema ? formRender() : null}
      </ProForm>
    );
  },
);

export default ProFormPlus;
export type { ProFormPlusProps, ProFormPlusTabDataType };
