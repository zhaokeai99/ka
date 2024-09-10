import React, { memo, useCallback, useEffect, useState } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import { MpBmMarketIndexAdd, MpBmMarketIndexEdit, MpBmMarketIndexQuery } from '../service';

const { Option } = Select;

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  domain?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const SingleIndexModal = (props: ModalProps) => {
  const { visible, modalType, domain } = props;
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const [benchmarksForm] = Form.useForm();

  const [state, setState] = useState<any>({ data: [], value: undefined });

  useEffect(() => {
    if (props.visible && props.modalType === 'edit') {
      // 如果是编辑操作,回显数据
      benchmarksForm.setFieldsValue(props.initValues);
    }
  }, [props]);

  const handleOk = useCallback(async () => {
    await benchmarksForm?.validateFields().then((values: any) => {
      const spl = values.indexName.split('/');
      const p = {
        id: values?.id,
        domain: domain,
        indexClassPath: spl[0],
        indexSysName: spl[1],
        indexCode: spl[2],
        indexName: spl[3],
      };
      setConfirmLoading(true);
      setTimeout(async () => {
        let result: any;
        if (props.modalType === 'add') {
          result = await MpBmMarketIndexAdd(p);
        } else {
          result = await MpBmMarketIndexEdit(p);
        }

        if (result.success) {
          props.onClose('reload');
          setConfirmLoading(false);
          return;
        }
        message.error(result.errorMsg || '接口请求失败');

        setConfirmLoading(false);
      }, 2000);
    });
  }, [props]);

  const handleCancel = () => {
    props.onClose('cancel');
  };

  let timeout: any;
  let currentValue: any;
  const fetch = (value: any, callback: any) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    const fake = async () => {
      const result = await MpBmMarketIndexQuery({ securitiesCode: value });
      if (currentValue === value) {
        const data: any[] = [];
        result.forEach((r: any) => {
          data.push({
            indexClassPath: r.indexClassPath,
            indexSysName: r.indexSysName,
            securitiesCode: r.securitiesCode,
            securitiesName: r.securitiesName,
          });
        });
        callback(data);
      }
    };
    timeout = setTimeout(fake, 300);
  };
  const handleSearch = (value: any) => {
    if (value) {
      fetch(value, (data: any) => setState({ data }));
    } else {
      setState({ data: [] });
    }
  };
  const handleChange = (value: any) => {
    setState({ data: state.data, value });
  };

  return (
    <Modal
      title={modalType === 'add' ? '创建基准' : '编辑基准'}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
      destroyOnClose={true}
    >
      <Form form={benchmarksForm} preserve={false}>
        <Form.Item hidden={true} name="id" label={'ID'}>
          <Input />
        </Form.Item>
        <Form.Item
          name="indexName"
          label={'指数名称'}
          rules={[{ required: true, message: '指数代码为必填项' }]}
        >
          <Select
            showSearch
            value={state.value}
            placeholder="请输入指数代码"
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={null}
          >
            {state?.data.map((d: any) => (
              <Option
                key={`${d.indexClassPath}/${d.indexSysName}/${d.securitiesCode}/${d.securitiesName}`}
              >
                {d.securitiesName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(SingleIndexModal);
