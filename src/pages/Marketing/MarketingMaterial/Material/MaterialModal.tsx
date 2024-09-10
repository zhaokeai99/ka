import React, { useEffect, useRef, useState } from 'react';
import {
  ModalForm,
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import moment from 'moment';
import { message } from 'antd';
import {
  catQueryAll,
  getOssConfig,
  labelQueryAll,
  materialAdd,
  materialUpdate,
  queryFundManagers,
  queryFunds,
} from '../service';
import { transOptions } from '@/utils/utils';

const category = ['contentClassify', 'materialType', 'materialStatus'];

type PropsType = {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
};

const MaterialModal = (props: PropsType) => {
  const { visible, modalType, onClose, initValues } = props;
  const formRef = useRef<ProFormInstance>();
  const [uploadCfg, setUploadCfg] = useState<any>({});
  const [usageOpt, setUsageOpt] = useState<any[]>([]);
  const [classOpt, setClassOpt] = useState<any[]>([]);
  const [statusOpt, setStatusOpt] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [fundOptions, setFundOptions] = useState<any[]>([]);

  // 类别相关下拉数据
  const queryCategory = async () => {
    const [uData, cData, sData] = await Promise.all(
      category.map((catModule) => catQueryAll({ catModule })),
    );
    setUsageOpt(uData);
    setClassOpt(cData);
    setStatusOpt(sData);
  };

  // 数据回显处理
  const handleEchoValues = (values: any) => {
    const {
      materialFiles: mf,
      validStartTime: startTime,
      validEndTime: endTime,
      labels,
      fundVOS,
      fundManagers,
      ...others
    } = values;

    const materialFiles =
      mf?.map((i: any) => ({
        ...i,
        uid: i.fileId,
        url: `${i.domainUrl}${i.fileUrl}`,
        name: i.fileName,
        status: 'done',
      })) || [];
    setFileList(materialFiles);

    return {
      ...others,
      materialFiles,
      validStartTime: [moment(startTime), moment(endTime)],
      limitType: moment(endTime).format('YYYY-MM-DD') === '9999-12-31',
      labels: transOptions(labels, 'labelName', 'labelId'),
      fundVOS: transOptions(fundVOS, 'fundAbbr', 'fundCode'),
      fundManagers: transOptions(fundManagers, 'name', 'account'),
    };
  };

  // 默认查询全部产品
  const queryFundsOpt = async () => {
    const fundOpt = await queryFunds({ managerAccounts: [] });
    setFundOptions(fundOpt);
  };

  useEffect(() => {
    if (visible) {
      queryCategory();
      queryFundsOpt();
      if (modalType === 'EDIT') {
        const echoValues = handleEchoValues(initValues);
        formRef.current?.setFieldsValue({ ...echoValues });
      }
    }
  }, [visible, modalType, initValues]);

  // 下拉参数处理
  const transValue = (data: any, label: any, value: any, other?: any) => {
    if (!Array.isArray(data)) {
      return [];
    }
    const trans = data?.map((i: any) => ({
      [label]: i[label],
      [value]: i[value],
      ...(other ? { [other]: i[other] } : {}),
    }));

    return trans || [];
  };

  // 处理传参
  const handleParams = (values: any) => {
    const {
      materialFiles: mf,
      validStartTime,
      labels,
      fundVOS,
      fundManagers,
      limitType: _,
      ...others
    } = values;

    const materialFiles: any = [];
    mf?.map((i: any) => {
      const { name, response } = i || {};
      const { data, success } = response || {};

      if (i?.fileUrl || success) {
        materialFiles.push({
          fileName: name || i.fileName,
          fileUrl: response ? data?.suffixPath : i?.fileUrl,
        });
      }

      return materialFiles;
    });

    return {
      ...others,
      materialFiles,
      labels: transValue(labels, 'labelName', 'labelId'),
      fundManagers: transValue(fundManagers, 'name', 'account'),
      fundVOS: transValue(fundVOS, 'fundAbbr', 'fundCode', 'fundName'),
      validStartTime: validStartTime[0],
      validEndTime: validStartTime[1],
    };
  };

  const close = (type: string) => {
    setFileList([]);
    formRef.current?.resetFields();
    onClose(type);
  };

  // 保存、修改
  const handleSubmit = async (values: any) => {
    const params = handleParams(values);
    let res: any = {};

    if (modalType === 'ADD') {
      res = await materialAdd({
        uploadModel: { ...params },
      });
    } else {
      res = await materialUpdate({
        updateModel: { ...params, materialId: initValues?.materialId },
      });
    }

    if (res?.success) {
      message.success(`${modalType === 'ADD' ? '添加' : '修改'}成功！`);
      close('RELOAD');
      onClose();
    }
  };

  // 获取 OSS 参数
  const handleBeforeUpload = async (file: any) => {
    const size = file.size / 1024 / 1024;

    if (size > 500) {
      message.error('上传限制最大为500M');
      return false;
    }

    const { success, data, errorMsg } = await getOssConfig({ ossScene: 'material' });

    if (!success || !data.host) {
      message.error(errorMsg || '获取');
      return false;
    }
    setUploadCfg(data);
  };

  // 上传状态处理
  const handleFileList = ({ fileList: fl }: any) => {
    const newFile = fl?.filter((file: any) => {
      if (file.status) {
        if (file?.response) {
          const { success } = file.response;
          file.status = success ? 'done' : 'error';
        }

        return file;
      }
    });

    setFileList([...newFile]);
  };

  return (
    <ModalForm
      visible={visible}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      layout="horizontal"
      title={modalType === 'ADD' ? '新增' : '编辑'}
      formRef={formRef}
      modalProps={{
        onCancel: () => close('CANCEL'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <ProFormText label="素材名称" name="materialName" rules={[{ required: true }]} />
      <ProFormSelect
        label="内容分类"
        name="contentClassify"
        rules={[{ required: true }]}
        options={usageOpt}
      />
      <ProFormSelect
        label="素材类型"
        name="materialType"
        rules={[{ required: true }]}
        options={classOpt}
      />
      <ProFormRadio.Group
        label="素材状态"
        name="materialStatus"
        rules={[{ required: true }]}
        options={statusOpt}
        fieldProps={{
          optionType: 'button',
        }}
      />
      <ProFormSwitch
        label="永久有效"
        name="limitType"
        checkedChildren="是"
        unCheckedChildren="否"
        fieldProps={{
          onChange: (val: any) => {
            if (val) {
              formRef?.current?.setFieldsValue({
                validStartTime: [moment(), moment('9999-12-31')],
              });
            } else {
              formRef?.current?.setFieldsValue({ validStartTime: [] });
            }
          },
        }}
      />
      <ProFormDependency name={['limitType']}>
        {({ limitType }) => {
          return (
            <ProFormDateRangePicker
              label="有效期"
              name="validStartTime"
              rules={[{ required: true }]}
              disabled={limitType}
            />
          );
        }}
      </ProFormDependency>
      <ProFormUploadButton
        label="素材文件"
        name="materialFiles"
        fieldProps={{
          accept: '*',
          multiple: true,
          name: 'file',
          beforeUpload: handleBeforeUpload,
          action: `${uploadCfg.host}/upload/oss/uploadOss`,
          data: {
            accessKey: uploadCfg.accessKey,
            secretKey: uploadCfg.secretKey,
            accountType: uploadCfg.accountType,
            bucket: uploadCfg.bucket,
            filePath: uploadCfg.filePath,
          },
        }}
        fileList={fileList}
        onChange={handleFileList}
      />
      <ProFormTextArea label="素材描述" name="description" />
      <ProFormSelect
        label="关联产品经理"
        name="fundManagers"
        request={async () => await queryFundManagers()}
        fieldProps={{
          labelInValue: true,
          mode: 'multiple',
          onChange: async (val: any) => {
            const managerAccounts = val?.map((i: any) => i.account) || [];
            const fundOpt = await queryFunds({ managerAccounts });
            formRef.current?.setFieldValue('fundVOS', []);
            setFundOptions(fundOpt);
          },
        }}
      />
      <ProFormSelect
        label="关联产品"
        name="fundVOS"
        options={fundOptions}
        fieldProps={{
          labelInValue: true,
          mode: 'multiple',
        }}
      />
      <ProFormSelect
        label="关联标签"
        name="labels"
        request={async () => await labelQueryAll()}
        fieldProps={{
          labelInValue: true,
          mode: 'multiple',
        }}
      />
    </ModalForm>
  );
};

export default MaterialModal;
