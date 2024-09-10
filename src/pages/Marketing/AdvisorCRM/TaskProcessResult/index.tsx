import ProCardPlus from '@/components/ProCardPlus';
import { Button, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  ProForm,
  ProFormCheckbox,
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { CheckOutlined } from '@ant-design/icons';
import { ProFormInstance } from '@ant-design/pro-form';
import {
  queryLastTaskHandleDetail,
  queryMotEventContactInfo,
  queryTaskStatus,
  submitProcessingResult,
} from './service';
import moment from 'moment';

const TaskProcessResult: React.FC<any> = (props) => {
  const [processTypeOptions, setProcessTypeOptions] = useState<[]>([]);
  const [taskStatusOptions, setTaskStatusOptions] = useState<[]>([]);
  const [otherDisable, setOtherDisable] = useState<boolean>(true);

  const formRef = useRef<ProFormInstance>();

  const { eventTaskId } = props;

  const submitClick = () => {
    formRef?.current
      ?.validateFields()
      .then(async () => {
        const isSuccess = await submitProcessingResult({
          eventTaskId: eventTaskId,
          processingDate: moment(formRef?.current?.getFieldValue('processingDate')).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
          processingType: formRef?.current?.getFieldValue('processingType'),
          other: formRef?.current?.getFieldValue('other'),
          processingResult: formRef?.current?.getFieldValue('processingResult'),
          status: formRef?.current?.getFieldValue('status'),
        });
        if (isSuccess) {
          formRef?.current?.resetFields();
          message.success('提交成功，请关闭进行查询！');
        } else {
          message.error('提交失败，请联系管理员！');
        }
      })
      .catch(() => {});
  };

  const loadConfig = () => {
    queryMotEventContactInfo().then((data) => {
      setProcessTypeOptions(data);
    });
    queryTaskStatus().then((data) => {
      setTaskStatusOptions(data);
    });
    queryLastTaskHandleDetail({
      eventTaskId: eventTaskId,
    }).then((taskInfo) => {
      let isHaveOther = false;
      taskInfo?.processingType?.forEach((data: string) => {
        if ('R' == data) {
          isHaveOther = true;
        }
      });
      setOtherDisable(!isHaveOther);
      formRef?.current?.setFieldsValue({
        processingDate: taskInfo?.processingDate,
        processingType: taskInfo?.processingType,
        other: isHaveOther ? taskInfo?.other : undefined,
        processingResult: taskInfo?.processingResult,
        status: taskInfo?.status,
      });
    });
  };

  useEffect(() => {
    loadConfig();
  }, []);
  return (
    <ProCardPlus ghost>
      <ProForm
        formRef={formRef}
        submitter={{
          render: () => {
            return [
              <Button type="primary" icon={<CheckOutlined />} onClick={submitClick}>
                提交结果
              </Button>,
            ];
          },
        }}
      >
        <ProFormDateTimePicker
          name="processingDate"
          label="触达时间"
          rules={[
            {
              required: true,
            },
          ]}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <ProFormCheckbox.Group
            name="processingType"
            label="触达方式"
            options={processTypeOptions}
            rules={[
              {
                required: true,
              },
            ]}
            fieldProps={{
              onChange: (checkedValue) => {
                let isHaveOther = false;
                checkedValue?.forEach((data: any) => {
                  if ('R' == data) {
                    isHaveOther = true;
                  }
                });
                setOtherDisable(!isHaveOther);
              },
            }}
          />
          <ProFormText name="other" label=" " disabled={otherDisable} width={248} />
        </div>
        <ProFormTextArea name="processingResult" label="触达结果" />
        <ProFormRadio.Group
          name="status"
          label="处理状态"
          radioType="button"
          options={taskStatusOptions}
          rules={[
            {
              required: true,
            },
          ]}
        />
      </ProForm>
    </ProCardPlus>
  );
};

export default TaskProcessResult;
