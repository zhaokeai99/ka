import React, { memo } from 'react';
import { ProFormUploadButton } from '@ant-design/pro-form';

/**
 * @param props;
 * name: Form name 必传。
 * label: Form label 必传。
 * fieldProps: Upload Props 非必传。
 * @returns
 */
const CommonUpload = (props: any) => {
  const { name = 'file', label = '附件上传', fieldProps = {}, ...arg } = props;
  return (
    <ProFormUploadButton
      name={name}
      label={label}
      action={'/object'}
      {...arg}
      fieldProps={{
        ...fieldProps,
        method: 'PUT',
        name: 'multipartFile',
      }}
    />
  );
};

export default memo(CommonUpload);
