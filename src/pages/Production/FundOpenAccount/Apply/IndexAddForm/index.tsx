import React, { memo, useEffect, useCallback, useState, useMemo } from 'react';
import {
  ModalForm,
  ProFormTextArea,
  ProFormRadio,
  ProFormUploadButton,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, message, Form } from 'antd';
import { saveOpenAccountFlow, queryAccountStatusByFundId, queryProductInfo } from '../service';

type ModulProps = {
  showAdd: boolean;
  info: {
    fundId: string;
    fundCode: string;
    fundName: string;
    remark: string;
    acctType: { label: string; value: string };
  };
  acctTypeOptions: { label: string; value: string }[];
  onClose: (val?: string) => void;
};

const IndexAddForm = (props: ModulProps) => {
  const [fundList, setFundList] = useState<any>([]);
  const [templateArr, setTemplateArr] = useState<any>([]); // 模版数组 每个开户类别对应的模版不同
  const [templateList, setTemplateList] = useState<any>([]); // 当前模版
  const [loading, setLoading] = useState(false); // 是否加载中 test
  const [form] = Form.useForm();
  const fundCodeWatch = Form.useWatch(['fundCode'], form); // 监听fundcode表单值 改变fundname
  const fundNameWatch = Form.useWatch(['fundName'], form);
  const acctTypeWatch = Form.useWatch(['acctType'], form);
  const [id, setId] = useState(0); // 当前选中基金列表的id
  const { showAdd, onClose, info, acctTypeOptions } = props;

  const getStatus = async (currentObj: any) => {
    // 重置上传文件
    (templateList || []).forEach((item: any, i: any) => {
      form?.resetFields([`file${i}`]);
    });
    const result = await queryAccountStatusByFundId({ fundId: currentObj?.id || info.fundId });
    if (result) form.setFieldsValue({ approvalNo: result[0].approvalNo });
    setTemplateArr(result);
  };

  useEffect(() => {
    if (fundCodeWatch) {
      const currentObj = fundList.find((item: any) => item.fundCode === fundCodeWatch);
      setId(currentObj?.id);
      if (!info.fundName) {
        // 不是查看时 设置
        form.setFieldsValue({ fundName: currentObj?.fundName });
      }
    }
  }, [fundCodeWatch]);

  useEffect(() => {
    if (fundNameWatch) {
      const currentObj = fundList.find((item: any) => item.fundName == fundNameWatch);
      setId(currentObj?.id);
      if (!info.fundName) {
        // 不是查看时 设置
        form.setFieldsValue({ fundCode: currentObj?.fundCode || '' });
      }
      // 获取状态
      getStatus(currentObj);
    }
  }, [fundNameWatch]);

  // 申请
  const handleSubmit = useCallback(
    async (value) => {
      setLoading(true);
      const list = templateList.map((item: any, i: number) => {
        const url = value[`file${i}`][0]?.response?.data || '';
        delete value[`file${i}`];
        return {
          templateId: item.templateId,
          treeId: item.treeId,
          fileUrl: url,
          fileName: item.fileName,
        };
      });
      // 提交参数
      const submitParam = {
        ...value,
        templateList: list,
        fundId: id || '',
      };
      const result = await saveOpenAccountFlow(submitParam);
      setLoading(false);
      if (result) {
        form?.resetFields();
        props.onClose('reload');
        return;
      }
      message.error('申请失败');
    },
    [templateList],
  );

  useEffect(() => {
    // 查看详情
    if (showAdd && info.fundId) {
      // 设置form的值
      form.setFieldsValue({ fundCode: info.fundCode });
      form.setFieldsValue({ fundName: info.fundName });
      form.setFieldsValue({ remark: info.remark });
      form.setFieldsValue({ acctType: info.acctType.value });
    }
  }, [info, showAdd]);

  useEffect(() => {
    const currentTemplate = templateArr.find((item: any) => item.acctType === acctTypeWatch);
    if (currentTemplate) setTemplateList(currentTemplate.templateList);
  }, [acctTypeWatch, templateArr]);

  const uploadList = useMemo(() => {
    if (info.fundId) return;
    return (templateList || []).map((item: any, index: number) => {
      return (
        <div key={item.treeId}>
          <ProFormUploadButton
            name={`file${index}`}
            fieldProps={{
              method: 'PUT',
              name: 'multipartFile',
            }}
            label={item.nodeName}
            extra={
              item.templateUrl ? (
                <span>
                  模版：
                  <a href={item.templateUrl} target="_blank" rel="noreferrer">
                    {item.templateName}
                  </a>
                </span>
              ) : (
                <span>模版：无</span>
              )
            }
            max={1}
            action="/object"
            rules={[{ required: true, message: '请上传' }]}
            onChange={({ file }) => {
              item.fileName = file?.name;
            }}
          />
        </div>
      );
    });
  }, [templateList]);

  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="开户申请"
      visible={showAdd}
      disabled={!!info.fundId}
      form={form}
      autoFocusFirstInput
      modalProps={{
        onCancel: () => {
          onClose();
          form?.resetFields();
        },
      }}
      layout={'horizontal'}
      labelCol={{ span: 5 }}
      width="60%"
      submitTimeout={2000}
      submitter={{
        render: (formProps) => {
          return [
            <Button
              key="cancel"
              onClick={() => {
                onClose();
                form?.resetFields();
              }}
            >
              关闭
            </Button>,
            <Button
              key="ok"
              type="primary"
              loading={loading}
              onClick={() => {
                formProps.submit();
              }}
            >
              发起申请
            </Button>,
          ];
        },
      }}
      onFinish={handleSubmit}
    >
      <ProFormSelect
        name="fundCode"
        label="基金代码"
        width="md"
        showSearch
        debounceTime={300}
        request={async ({ keyWords }) => {
          if (!keyWords) return;
          const result = await queryProductInfo({ keyword: keyWords });
          setFundList(result);
          return (result || []).map((item: any) => {
            return {
              value: item.fundCode,
              label: item.fundCode + item.fundShortName,
            };
          });
        }}
        fieldProps={{
          optionLabelProp: 'value',
        }}
        placeholder="请输入基金代码"
      />
      <ProFormSelect
        width="md"
        name="fundName"
        label="基金名称"
        showSearch
        debounceTime={300}
        request={async ({ keyWords }) => {
          if (!keyWords) return;
          const result = await queryProductInfo({ keyword: keyWords });
          setFundList(result);
          return (result || []).map((item: any) => {
            return {
              value: item.fundName,
              label: item.fundName,
            };
          });
        }}
        fieldProps={{
          optionLabelProp: 'value',
        }}
        placeholder="请输入基金名称"
        rules={[{ required: true }]}
      />
      <ProFormRadio.Group
        name="acctType"
        layout="vertical"
        label="开户类别"
        options={acctTypeOptions}
        rules={[{ required: true }]}
      />
      {/* 详情不展示 */}
      {!info.fundId && uploadList}
      {!info.fundId && (
        <ProFormText
          width="md"
          name="approvalNo"
          label="产品批复文号"
          placeholder="请输入产品批复（报备）文号"
          rules={[{ required: true }]}
        />
      )}
      <ProFormTextArea name="remark" label="备注说明" placeholder="请输入备注说明" />
    </ModalForm>
  );
};

export default memo(IndexAddForm);
