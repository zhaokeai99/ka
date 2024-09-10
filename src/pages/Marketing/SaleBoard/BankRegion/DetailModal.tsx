import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message, Form, Cascader, Select } from 'antd';
import { ProFormInstance, ProFormDateRangePicker } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { setBankRegion, getBankVogRegion } from './service';
import moment from 'moment';
interface ModalProps {
  visible: boolean;
  initValues?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible } = props;
  const [initStates] = useState({
    agencyName: '',
    firstBranchCode: '',
    firstBranchName: '',
    divideRule: '',
    vogRegion: [],
  });
  const [treeData, setTreeData] = useState([]);
  const { Option } = Select;

  const dataFn = useCallback((data) => {
    return data?.map((item: any) => {
      return {
        label: item?.dictValue,
        value: item?.dictKey,
        children: dataFn(item?.subDict || []),
      };
    });
  }, []);

  useEffect(() => {
    if (props.visible) {
      if (Object.keys(props.initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          formValues[key] = props.initValues[key] || '';
        });
        formValues['dateRange'] = [props.initValues['startDate'], props.initValues['endDate']];
        formValues['vogRegion'] = [
          props.initValues['parentVogRegion'],
          props.initValues['vogRegion'],
        ];
        formRef.current?.setFieldsValue(formValues);
      } else {
        formRef.current?.setFieldsValue(initStates);
      }
    }
    getBankVogRegion().then((res) => {
      const obj = dataFn(res?.data);
      setTreeData(obj);
    });
  }, [props]);

  const handleSubmit = useCallback(
    async (value) => {
      const { vogRegion, divideRule, dateRange } = value;
      const { success, errorMsg } = await setBankRegion({
        firstBranchCode: props.initValues.firstBranchCode,
        vogRegion: vogRegion[vogRegion?.length - 1],
        divideRule: divideRule,
        startDate: moment(dateRange[0]).format('YYYYMMDD'),
        endDate: moment(dateRange[1]).format('YYYYMMDD'),
      });

      if (success) {
        props.onClose('reload');
        return;
      }
      message.error(errorMsg || '接口请求失败');
    },
    [props],
  );

  return (
    <ModalForm
      title="考核区域配置"
      visible={visible}
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => props.onClose('cancel'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <ProFormText name="agencyName" label="渠道名称" rules={[{ required: true }]} disabled />
      <ProFormText
        name="firstBranchCode"
        label="一级分行编码"
        rules={[{ required: true }]}
        disabled
      />
      <ProFormText
        name="firstBranchName"
        label="一级分行名称"
        rules={[{ required: true }]}
        disabled
      />
      <Form.Item name="divideRule" label="考核区域划分规则" rules={[{ required: true }]}>
        <Select defaultValue="1" style={{ width: 80 }}>
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>
      </Form.Item>
      <Form.Item name="vogRegion" label="考核区域" rules={[{ required: true }]}>
        <Cascader options={treeData} placeholder="请选择考核区域" />
      </Form.Item>
      <ProFormDateRangePicker name="dateRange" label="考核日期区间" required />
    </ModalForm>
  );
};

export default memo(DetailModal);
