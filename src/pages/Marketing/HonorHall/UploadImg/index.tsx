import React, { useState } from 'react';
import type { MutableRefObject } from 'react';
import type { FormInstance } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Form, message, Spin, Upload } from 'antd';
import { getOssConfig, uploadOss } from '../../RoadShow/service';

type PropsType = {
  required?: boolean;
  tipMessage?: string;
  accept?: string;
  name: string;
  label: string;
  placeholder?: string;
  formRef: MutableRefObject<FormInstance<any> | undefined> | undefined;
  echoImgUrl?: string;
  setFileList: (val: any) => void;
  fileList: any[];
};

const UploadImg = (props: PropsType) => {
  const { required, accept = '*', name, label, formRef, tipMessage, fileList, setFileList } = props;
  const [uploadCfg, setUploadCfg] = useState<any>({});
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleBeforeUpload = async () => {
    const { success, data, errorMsg } = await getOssConfig();
    if (!success || !data.host) {
      message.error(errorMsg || '获取');
      return false;
    }
    setUploadCfg(data);
  };

  const handleFileChange = async ({ file }: any) => {
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
      setFileList([{ uid: 1, url: `${data.url}/${data.suffixPath}` }]);
      formRef?.current?.setFieldsValue({ [name]: `${data.suffixPath}` });
    } else {
      message.error('上传失败');
    }
  };

  return (
    <Form.Item
      label={label}
      name={name}
      required={required}
      rules={[
        required
          ? () => ({
              validator(_, value) {
                if (typeof value === 'string') {
                  return !!value ? Promise.resolve() : Promise.reject(new Error(tipMessage));
                } else {
                  const { fileList: fl } = value || {};
                  if (!fl || fl.length === 0) {
                    return Promise.reject(new Error(tipMessage));
                  }
                  return Promise.resolve();
                }
              },
            })
          : { required: false },
      ]}
    >
      <Upload
        accept={accept}
        listType="picture-card"
        fileList={fileList}
        beforeUpload={handleBeforeUpload}
        customRequest={handleFileChange}
        onRemove={() => {
          setFileList([]);
        }}
        maxCount={1}
      >
        <div>
          {uploadLoading ? <Spin spinning /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload>
    </Form.Item>
  );
};

export default UploadImg;
