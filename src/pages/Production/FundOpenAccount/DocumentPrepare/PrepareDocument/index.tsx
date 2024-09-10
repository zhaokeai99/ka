import React, { memo, useCallback, useState } from 'react';
import { ModalForm } from '@ant-design/pro-components';
import { Button } from 'antd';
import DocumentManage from '../DocumentManage';

type ModulProps = {
  title: string;
  okText: string;
  onFinishProps: () => void;
  showDocument: boolean;
  onClose: (val?: string) => void;
  id: number;
  isSeat: boolean | undefined;
};

const PrepareDocument = (props: ModulProps) => {
  const { showDocument, onClose, id, title, okText, onFinishProps, isSeat } = props;
  const [loading, setLoading] = useState(false); // 是否加载中

  // 提交 保存
  const onFinish = useCallback(async () => {
    setLoading(true);
    await onFinishProps();
    setLoading(false);
    return;
  }, [id]);

  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title={title}
      visible={showDocument}
      onVisibleChange={(values) => {
        if (values == false) {
          onClose();
        }
      }}
      autoFocusFirstInput
      modalProps={{
        onCancel: () => onClose(),
        centered: true,
      }}
      layout={'horizontal'}
      submitTimeout={2000}
      width="80%"
      submitter={{
        render: (formProps) => {
          return [
            <Button key="cancel" onClick={() => onClose()}>
              关闭
            </Button>,
            <Button
              key="ok"
              loading={loading}
              type="primary"
              onClick={() => {
                formProps.submit();
              }}
            >
              {okText}
            </Button>,
          ];
        },
      }}
      onFinish={onFinish}
    >
      {/* 开户材料管理 浮窗 */}
      <DocumentManage id={id} isSeat={isSeat} />
    </ModalForm>
  );
};

export default memo(PrepareDocument);
