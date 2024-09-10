import React, { useEffect, useRef, useState } from 'react';
import { ModalForm, ProFormInstance, ProFormSelect } from '@ant-design/pro-form';
import { addHonorNominateDpt, queryAddNominateDptList, updateHonorNominateDpt } from '../service';
import UploadImg from '../UploadImg';
import { message } from 'antd';

type PropsType = {
  type: string;
  visible: boolean;
  initValues?: any;
  onClose: (val?: string) => void;
};

const ProptModal = (props: PropsType) => {
  const { type, visible, onClose, initValues } = props;
  const [initStatus] = useState({
    deptId: '',
    deptPhoto: '',
  });
  const [fileList, setFileList] = useState<any[]>([]);
  const formRef = useRef<ProFormInstance>();
  const [proptOpt, setProptOpt] = useState<any[]>([]);

  // 回显
  useEffect(() => {
    if (visible) {
      (async () => {
        const res = await queryAddNominateDptList();
        const opt = res?.map((i: any) => ({ label: i?.deptName, value: i?.deptId }));
        setProptOpt(opt || []);
      })();
    }
    if (type === 'EDIT') {
      formRef.current?.setFieldsValue({ ...initValues });
      setFileList([{ uid: 1, url: initValues?.deptPhoto }]);
    } else {
      formRef.current?.setFieldsValue({ ...initStatus });
    }
  }, [visible, type, initValues]);

  // 提交
  const handleSubmit = async (values: any) => {
    const { deptId: deptOpt } = values;
    let res: any = {};
    if (type === 'ADD') {
      res = await addHonorNominateDpt({
        ...values,
        deptName: deptOpt?.deptName,
        deptId: deptOpt?.deptId,
        parentId: deptOpt?.parentId,
      });
    } else {
      res = await updateHonorNominateDpt({ ...values, deptId: initValues?.deptId });
    }

    if (res?.success) {
      message.success('部门配置成功！');
      onClose('RELOAD');
    }
  };

  return (
    <ModalForm
      formRef={formRef}
      title={type === 'ADD' ? '新增' : '编辑'}
      visible={visible}
      initialValues={initStatus}
      labelCol={{ span: 4 }}
      layout="horizontal"
      modalProps={{
        onCancel: () => onClose('CLOSE'),
        afterClose: () => {
          setFileList([]);
        },
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <ProFormSelect
        label="部门名称"
        name="deptId"
        rules={[{ required: true }]}
        placeholder="请选择"
        fieldProps={{
          labelInValue: true,
          fieldNames: { label: 'deptName', value: 'deptId' },
          disabled: type === 'EDIT',
        }}
        options={proptOpt}
        request={async () => await queryAddNominateDptList()}
      />
      <UploadImg
        required
        label="部门头像"
        name="deptPhoto"
        formRef={formRef}
        tipMessage="请上传部门头像"
        fileList={fileList}
        setFileList={setFileList}
      />
    </ModalForm>
  );
};

export default ProptModal;
