import React, { useState, useCallback, memo } from 'react';
import type { MutableRefObject } from 'react';
import type { FormInstance } from 'antd';
import { message, Upload, Button } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { ProFormText } from '@ant-design/pro-form';
import { getOssConfig, uploadOss } from './service';

interface ItemProps {
  required?: boolean;
  accept?: string;
  name: string;
  label: string;
  placeholder?: string;
  formRef: MutableRefObject<FormInstance<any> | undefined> | undefined;
  setUrl?: (val: any) => void;
}

// Form 上传Item
const UploadItem = (props: ItemProps) => {
  const {
    required = false,
    accept = '*',
    formRef,
    name,
    label,
    placeholder = `请输入${label}`,
    setUrl,
  } = props;
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadCfg, setUploadCfg] = useState<any>({});

  const handleBeforeUpload = useCallback(async () => {
    const { success, data, errorMsg } = await getOssConfig();
    if (!success || !data.host) {
      message.error(errorMsg || '获取');
      return false;
    }
    setUploadCfg(data);
  }, []);

  const handleFileChange = useCallback(
    async ({ file }) => {
      setUploadLoading(true);
      const { data, success } = await uploadOss({
        urlPath: `${uploadCfg.host}/upload/oss/uploadOss`,
        file,
        accessKey: uploadCfg.accessKey,
        secretKey: uploadCfg.secretKey,
        accountType: uploadCfg.accountType,
        bucket: uploadCfg.bucket,
        filePath: uploadCfg.filePath,
      });
      setUploadLoading(false);
      if (success) {
        formRef?.current?.setFieldsValue({ [name]: data.suffixPath });
        if (setUrl) setUrl(data.url);
      } else {
        message.error('上传失败');
      }
    },
    [uploadCfg, formRef, name],
  );

  return (
    <ProFormText
      disabled
      allowClear
      name={name}
      label={label}
      placeholder={placeholder}
      rules={[{ required: required }]}
      fieldProps={{
        suffix: <DeleteOutlined onClick={() => formRef?.current?.setFieldsValue({ [name]: '' })} />,
      }}
      addonAfter={
        <Upload
          accept={accept}
          name="file"
          maxCount={1}
          showUploadList={false}
          beforeUpload={handleBeforeUpload}
          customRequest={handleFileChange}
        >
          <Button icon={<UploadOutlined />} loading={uploadLoading}>
            上传
          </Button>
        </Upload>
      }
    />
  );
};

export default memo(UploadItem);
