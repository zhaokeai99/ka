import React, { memo, useState } from 'react';
import type { FormInstance } from 'antd';
import { Col, DatePicker, Form, Input, InputNumber, Radio, Row, Select, TreeSelect } from 'antd';
import type { PortfolioInfo } from '../service';
import { MpDomainPoolFacadeQueryDomainPoolTree, POOL_TYPE, SECURITY_TYPE } from '../service';
import SelectHandle from '@/pages/Investment/util/SelectHandle';
import lodash from 'lodash';
import '../index.less';

const { SHOW_CHILD } = TreeSelect;

const { Option } = Select;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 },
};

interface ModalProps {
  form: FormInstance;
  formValue?: PortfolioInfo;
  dicMap: { domain: []; benchmark: [] };
}

// 弹窗
const BmAddModal = (props: ModalProps) => {
  const [bmList, setBmList] = useState<any[]>([]);
  const { dicMap, form } = props;

  const [investPoolData, setInvestPoolData] = useState<any>([]);

  const packageTreeData = (data: any) => {
    return data?.map((cur: any) => {
      if (cur.children) {
        return {
          title: cur.poolName,
          value: cur.poolId,
          key: cur.poolId,
          children: packageTreeData(cur.children),
        };
      }
      return {
        title: cur.poolName,
        value: cur.poolId,
        key: cur.poolId,
      };
    });
  };
  const queryDomainPoolTree = async (value: any) => {
    const resultData = await MpDomainPoolFacadeQueryDomainPoolTree(value);
    const pagTreeData = packageTreeData(resultData);

    if (pagTreeData?.length && value?.poolType === POOL_TYPE['INVEST/白名单/投资池']) {
      setInvestPoolData(pagTreeData);
    } else {
      form.setFieldsValue({ investPool: undefined });
      setInvestPoolData([]);
    }
  };

  const domainChange = (e: any) => {
    const list = lodash.filter(dicMap.benchmark, { domain: e });
    setBmList(list);
    const stkType = form?.getFieldValue('stkType');
    if (stkType === '1') {
      queryDomainPoolTree({
        domain: e,
        securityType: SECURITY_TYPE[stkType],
        poolType: POOL_TYPE['INVEST/白名单/投资池'],
      });
    }
    form.setFieldsValue({ bmCode: undefined });
  };

  return (
    <Form
      {...layout}
      form={form}
      preserve={false}
      initialValues={{ orderFee: 0, commissionFee: 0, stkType: '1' }}
      labelWrap={true}
    >
      <Row gutter={8}>
        <Col span={12}>
          <FormItem
            name="domain"
            label={'业务域'}
            rules={[{ required: true, message: '请选择业务域!' }]}
          >
            <Select
              style={{ width: '100%' }}
              onChange={domainChange}
              placeholder="请选择业务域"
              showSearch
              optionFilterProp="children"
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            >
              {SelectHandle.toOptionsDic(dicMap.domain)}
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem
            name="mpCode"
            label={'组合代码'}
            rules={[
              {
                type: 'string',
                required: true,
                min: 0,
                max: 50,
                pattern: new RegExp(/^[A-Za-z]+$/),
                message: '请填写英文组合代码，最多不可超过50个字符',
              },
            ]}
          >
            <Input style={{ width: '100%' }} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            name="mpName"
            label={'组合名称'}
            rules={[{ required: true, message: '请填写组合名称!' }]}
          >
            <Input style={{ width: '100%' }} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem
            name="mpType"
            label={'组合类型'}
            rules={[{ required: true, message: '请选择组合类型!' }]}
          >
            <Select
              style={{ width: '100%' }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            >
              <Option key={'1'}>自由股票组合</Option>
              <Option key={'2'}>行业组合</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            name="orderType"
            label={'下单方式'}
            rules={[{ required: true, message: '请选择下单方式!' }]}
          >
            <Select
              style={{ width: '100%' }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            >
              <Option key={'1'}>资产比例下单</Option>
              {/*<Option key={'2'}>现金股数下单</Option>*/}
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem
            name="dealPriceDefault"
            label={'默认成交价格'}
            rules={[{ required: true, message: '请选择默认成交价格!' }]}
          >
            <RadioGroup style={{ width: '100%' }}>
              <Radio value={'1'}>前收</Radio>
              <Radio value={'2'}>最新</Radio>
              <Radio value={'3'}>均价</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            name="startMoney"
            label={'初始资金'}
            initialValue={100}
            rules={[{ required: false, message: '请填写初始资金!' }]}
          >
            <InputNumber addonAfter={'w'} style={{ width: '100%' }} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem
            name="bmCode"
            label={'基准'}
            rules={[{ required: true, message: '请选择基准!' }]}
          >
            <Select
              style={{ width: '100%' }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            >
              {SelectHandle.toOptionsDic(bmList)}
            </Select>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            name="stkType"
            label={'投资类型'}
            rules={[{ required: false, message: '请选择投资类型!' }]}
          >
            <Select
              disabled={true}
              style={{ width: '100%' }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            >
              <Option value={'1'}>股票</Option>
              <Option value={'2'}>基金</Option>
              <Option value={'3'}>混合</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem
            name="indCode"
            label={'所属行业'}
            rules={[{ required: false, message: '请选择所属行业!' }]}
          >
            <Select
              disabled={true}
              style={{ width: '100%' }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            ></Select>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            name="investPool"
            label={'投资池'}
            rules={[{ required: false, message: '请选择投资池!' }]}
          >
            <TreeSelect
              style={{ width: '100%' }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              allowClear
              treeData={investPoolData}
              treeCheckable={true}
              showCheckedStrategy={SHOW_CHILD}
              maxTagCount="responsive"
              treeDefaultExpandAll={true}
              listHeight={200}
            ></TreeSelect>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem
            name="noInvestPool"
            label={'禁投池'}
            rules={[{ required: false, message: '请选择禁投池!' }]}
          >
            <Select
              disabled={true}
              style={{ width: '100%' }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            ></Select>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            name="isPublic"
            label={'是否公开'}
            rules={[{ required: false, message: '请填写组合名称!' }]}
          >
            <RadioGroup style={{ width: '100%' }}>
              <Radio value={'1'}>公开</Radio>
              <Radio value={'2'}>不公开</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem
            name="orderFee"
            label={'交易费率(默认)'}
            rules={[{ required: false, message: '请填写交易费率(默认)!' }]}
          >
            <InputNumber max={100} min={0} addonAfter={'%'} style={{ width: '100%' }} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            name="commissionFee"
            label={'佣金(默认)'}
            rules={[{ required: false, message: '请填写佣金(默认)!' }]}
          >
            <InputNumber max={100} min={0} addonAfter={'%'} style={{ width: '100%' }} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem
            name="beginDate"
            label={'有效开始日期'}
            rules={[{ required: true, message: '请选择有效开始日期!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            name="endDate"
            label={'有效结束日期'}
            rules={[{ required: false, message: '请选择有效结束日期!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            name="strategy"
            label={'策略描述'}
            rules={[{ required: false, message: '请填写策略描述!' }]}
          >
            <TextArea allowClear style={{ minHeight: '100px', width: '98%' }} />
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(BmAddModal);
