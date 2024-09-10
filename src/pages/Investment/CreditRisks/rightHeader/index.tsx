import { DatePicker, Form, message } from 'antd';
import React from 'react';
import { FileMarkdownOutlined, SearchOutlined } from '@ant-design/icons';
import './index.less';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import moment from 'moment';

interface HeadProps {
  handleHold?: any;
  visible: boolean;
  getVisible: any;
  field?: any[];
  queryScreen: any;
  onDateChange: any;
  date: string;
  modelProcessorMode?: string;
}

const RightHeader = ({
  handleHold,
  visible,
  getVisible,
  field = [],
  queryScreen,
  onDateChange,
  date,
  modelProcessorMode = 'DYNAMIC',
}: HeadProps) => {
  return (
    <div className={modelProcessorMode === 'FIX' ? 'head' : 'DYNAMIChead head'}>
      <div className="head_time">
        <Form.Item style={{ marginBottom: '0' }} required rules={[{ required: true }]} label="日期">
          <DatePicker
            defaultValue={moment(date, 'YYYY-MM-DD')}
            format="YYYY-MM-DD"
            onChange={onDateChange}
          />
        </Form.Item>
      </div>
      <div className="head_btn">
        <span>
          <SearchOutlined />
          <span
            className="head_title"
            onClick={() => {
              queryScreen();
            }}
          >
            查询
          </span>
        </span>
        {modelProcessorMode !== 'FIX' ? (
          <span>
            <FileMarkdownOutlined />
            <span
              onClick={() => {
                if (field.length) {
                  getVisible(true);
                } else {
                  message.warn('请先添加字段再保存模板');
                }
              }}
              className="head_title"
            >
              保存模板
            </span>
          </span>
        ) : (
          ''
        )}
      </div>
      <ModalForm
        title="模板保存"
        visible={visible}
        modalProps={{
          onCancel: () => getVisible(false),
          centered: true,
          destroyOnClose: true,
        }}
        onFinish={({ name }) => handleHold(name)}
      >
        <ProFormText
          name="name"
          label="模板名称"
          rules={[
            {
              required: true,
              message: '请填写模板名称',
            },
          ]}
          fieldProps={{
            maxLength: 60,
            showCount: true,
          }}
        />
      </ModalForm>
    </div>
  );
};

export default RightHeader;
