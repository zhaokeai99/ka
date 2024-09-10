import React, { memo, useCallback, useEffect, useState } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import { IndexDataInfoFacadeAddMasterInfo } from '../service';

const { TextArea } = Input;

interface ModalProps {
  visible?: boolean;
  onClose?: (val: string) => void;
  dic?: any;
  indexData: any;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

// 弹窗
const AddView = (props: ModalProps) => {
  const { visible, onClose, indexData } = props;
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [frequencyDic, setFrequencyDic] = useState<any>([]);
  const [funcType, setFuncType] = useState<any>(undefined);

  const getFrequencyName = (value: any) => {
    if (value === 'D') {
      return '日';
    } else if (value === 'W') {
      return '周';
    } else if (value === 'M') {
      return '月';
    } else if (value === 'Q') {
      return '季度';
    } else if (value === 'Y') {
      return '年';
    }
    return '';
  };

  const handleOk = useCallback(async () => {
    const values = await form?.validateFields();
    setConfirmLoading(true);
    const params: any = {};

    params.originalIndexCode = indexData.indexCode;
    params.indexHierTag = indexData.indexHierTag;
    params.industryId = indexData.industryId;
    params.industryName = indexData.industryName;
    params.measureName = indexData.measureName;
    params.indexScope = indexData.indexScope;
    params.indexCurrency = indexData.indexCurrency;
    params.indexUnit = indexData.indexUnit;
    params.indexType = '1';
    params.regionCode = indexData.regionCode;
    params.regionName = indexData.regionName;
    params.productCode = indexData.productCode;
    params.productName = indexData.productName;
    params.stockCode = indexData.stockCode;
    params.stockName = indexData.stockName;
    params.vendor = indexData.vendor;
    params.dataType = indexData.dataType;
    params.frequency = indexData.frequency;
    params.indexScope = indexData.indexScope;
    params.isUsed = 0;
    params.auditStatus = '';

    params.indexName = values.indexName;
    params.func = values.func;
    params.indexUnit = values.indexUnit;
    if (values.func === 'resample') {
      params.frequency = getFrequencyName(values.frequency);
      params.funcParams = JSON.stringify({
        decimalDigit: values.decimalDigit,
        calcType: values.calcType,
        frequency: values.frequency,
        indexScope: values.frequency,
      });
    } else if (values.func === 'pct_change') {
      params.funcParams = JSON.stringify({
        decimalDigit: values.decimalDigit,
        period: values.period,
      });
    } else if (values.func === 'fill') {
      params.funcParams = JSON.stringify({
        decimalDigit: values.decimalDigit,
        calcType: values.calcType,
      });
    }

    params.remark = values.remark;
    if (!params?.remark) {
      params.remark = '';
    }

    const result = await IndexDataInfoFacadeAddMasterInfo(params);

    if (result.success && result.data > 0) {
      onClose?.('saved');
      setConfirmLoading(false);
      message.success('新增成功');
      return;
    }
    message.error(result.errorMsg || '接口请求失败');

    setConfirmLoading(false);
  }, [props]);

  const handleCancel = () => {
    onClose?.('cancel');
  };

  const setFrequencyDicInfo = (value: string) => {
    const result = [];
    let fin = false;
    if (value === '日') {
      result.push({ value: 'W', label: '周' });
      fin = true;
    }
    if (value === '周' || fin) {
      result.push({ value: 'M', label: '月' });
      fin = true;
    }
    if (value === '月' || fin) {
      result.push({ value: 'Q', label: '季度' });
      fin = true;
    }
    if (value === '季度' || fin) {
      result.push({ value: 'Y', label: '年' });
      fin = true;
    }
    setFrequencyDic(result);
  };

  useEffect(() => {
    if (visible) {
      setFrequencyDicInfo(indexData.frequency);
      // form.setFieldsValue({
      //   'orgIndexCode': indexData.indexName,
      //   'orgIndexUnit': indexData.indexUnit,
      //   'orgFrequency': indexData.frequency,
      // });
    }
  }, [visible]);

  const genTempName = () => {
    let result = '';
    //函数
    const func = form.getFieldValue('func');
    const orgName = indexData?.measureName;
    if (func === 'resample') {
      const frequency = form.getFieldValue('frequency');
      const calcType = form.getFieldValue('calcType');
      const indexUnit = form.getFieldValue('indexUnit');
      result = '变频';
      if (calcType && calcType === 'sum') {
        result += '_合计值';
      } else if (calcType && calcType === 'mean') {
        result += '_平均值';
      } else if (calcType && calcType === 'max') {
        result += '_最大值';
      } else if (calcType && calcType === 'min') {
        result += '_最小值';
      } else if (calcType && calcType === 'median') {
        result += '_中位数';
      }
      result += '_' + orgName;
      if (indexUnit) {
        result += ':' + indexUnit;
      }
      if (frequency && frequency === 'D') {
        result += ':日';
      } else if (frequency && frequency === 'W') {
        result += ':周';
      } else if (frequency && frequency === 'M') {
        result += ':月';
      } else if (frequency && frequency === 'Q') {
        result += ':季度';
      } else if (frequency && frequency === 'Y') {
        result += ':年';
      }
      form.setFieldValue('indexName', result);
      return;
    }
    if (func === 'pct_change') {
      const period = form.getFieldValue('period');
      const indexUnit = form.getFieldValue('indexUnit');
      result = '百分比计算';
      if (period && period === '12') {
        result += '_同比';
      } else if (period && period === '0') {
        result += '_环比';
      }
      result += '_' + orgName;
      if (indexUnit) {
        result += ':' + indexUnit;
      }
      form.setFieldValue('indexName', result);
      return;
    }
    if (func === 'fill') {
      const calcType = form.getFieldValue('calcType');
      const indexUnit = form.getFieldValue('indexUnit');
      result = '插值';
      if (calcType && calcType === 'zfill') {
        result += '_补零';
      } else if (calcType && calcType === 'ffill') {
        result += '_向前插值';
      } else if (calcType && calcType === 'bfill') {
        result += '_向后插值';
      }
      result += '_' + orgName;
      if (indexUnit) {
        result += ':' + indexUnit;
      }
      form.setFieldValue('indexName', result);
      return;
    }
  };

  //公式
  const funcChange = (value: { value: string; label: React.ReactNode }) => {
    setFuncType(value);
    genTempName();
  };

  return (
    <>
      <Modal
        title={'指标计算'}
        visible={visible}
        maskClosable={false}
        width={800}
        destroyOnClose={true}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form {...formLayout} form={form} preserve={false}>
          <Form.Item label={'原始指标'}>
            <span className="ant-form-text">{indexData?.indexName}</span>
          </Form.Item>
          <Form.Item label={'单位'}>
            <span className="ant-form-text">{indexData?.indexUnit}</span>
          </Form.Item>
          <Form.Item label={'频度'}>
            <span className="ant-form-text">{indexData?.frequency}</span>
          </Form.Item>
          <Form.Item
            name="func"
            label={'计算方式'}
            rules={[{ required: true, message: '计算公式为必填项' }]}
          >
            <Select onChange={funcChange}>
              <Select.Option value={'resample'}>变频</Select.Option>
              <Select.Option value={'pct_change'}>百分比计算</Select.Option>
              <Select.Option value={'fill'}>插值</Select.Option>
            </Select>
          </Form.Item>
          {funcType === 'resample' ? (
            <>
              <Form.Item
                name="frequency"
                label={'频度'}
                rules={[{ required: true, message: '频度为必填项' }]}
              >
                <Select options={frequencyDic} onChange={genTempName} />
              </Form.Item>
              <Form.Item
                name="calcType"
                label={'频纸频率'}
                rules={[{ required: true, message: '频纸频率为必填项' }]}
              >
                <Select onChange={genTempName}>
                  <Select.Option value={'sum'}>合计值</Select.Option>
                  <Select.Option value={'mean'}>平均值</Select.Option>
                  <Select.Option value={'max'}>最大值</Select.Option>
                  <Select.Option value={'min'}>最小值</Select.Option>
                  <Select.Option value={'median'}>中位数</Select.Option>
                </Select>
              </Form.Item>
            </>
          ) : (
            ''
          )}
          {funcType === 'pct_change' ? (
            <>
              <Form.Item
                name="period"
                label={'计算方式'}
                rules={[{ required: true, message: '计算方式为必填项' }]}
              >
                <Select onChange={genTempName}>
                  <Select.Option value={'12'}>同比</Select.Option>
                  <Select.Option value={'0'}>环比</Select.Option>
                </Select>
              </Form.Item>
            </>
          ) : (
            ''
          )}
          {funcType === 'fill' ? (
            <>
              <Form.Item
                name="calcType"
                label={'计算方式'}
                rules={[{ required: true, message: '计算方式为必填项' }]}
              >
                <Select onChange={genTempName}>
                  <Select.Option value={'zfill'}>补零</Select.Option>
                  <Select.Option value={'ffill'}>向前插值</Select.Option>
                  <Select.Option value={'bfill'}>向后插值</Select.Option>
                </Select>
              </Form.Item>
            </>
          ) : (
            ''
          )}

          <Form.Item
            name="indexName"
            label={'指标名称'}
            rules={[{ required: true, message: '指标名称为必填项' }]}
          >
            <Input placeholder={'请输入模板名称'} maxLength={50} />
          </Form.Item>
          <Form.Item
            name="indexUnit"
            label={'单位'}
            rules={[{ required: true, message: '单位为必填项' }]}
          >
            <Input placeholder={'请输入单位'} maxLength={50} onChange={genTempName} />
          </Form.Item>
          <Form.Item
            name="decimalDigit"
            label={'小数位数'}
            rules={[{ required: true, message: '小数位数为必填项' }]}
          >
            <Input placeholder={'请输入小数位数'} maxLength={50} />
          </Form.Item>
          <Form.Item name="remark" label={'描述'}>
            <TextArea rows={4} maxLength={2000} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(AddView);
