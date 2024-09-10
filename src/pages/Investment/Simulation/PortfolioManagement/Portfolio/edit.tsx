import React, { memo, useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import { Col, DatePicker, Form, Input, InputNumber, Radio, Row, Select, TreeSelect } from 'antd';
import type { PortfolioInfo } from '../service';
import SelectHandle from '@/pages/Investment/util/SelectHandle';
import lodash from 'lodash';
import moment from 'moment';
import { MpDomainPoolFacadeQueryDomainPoolTree, POOL_TYPE, SECURITY_TYPE } from '../service';

const { Option } = Select;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const { SHOW_CHILD } = TreeSelect;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 },
};

interface ModalProps {
  form: FormInstance;
  formValue?: PortfolioInfo;
  dicMap: { domain: []; benchmark: [] };
  newHoldItemDataInfo: any;
}

// 弹窗
const BmEditModal = (props: ModalProps) => {
  const { dicMap, form, formValue, newHoldItemDataInfo } = props;
  const [bmList, setBmList] = useState<any[]>([]);

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

  useEffect(() => {
    const list = lodash.filter(dicMap.benchmark, { domain: formValue?.domain });
    setBmList(list);

    if (formValue?.stkType === '1') {
      queryDomainPoolTree({
        domain: formValue?.domain,
        securityType: SECURITY_TYPE[formValue?.stkType],
        poolType: POOL_TYPE['INVEST/白名单/投资池'],
      });
    }
  }, [formValue?.id]);

  const initFv: any = {
    startMoney: 0,
    ...formValue,
  };
  if (formValue?.beginDate !== undefined && formValue?.beginDate !== null) {
    initFv.beginDate = moment(formValue?.beginDate, 'YYYYMMDD');
  } else {
    initFv.beginDate = undefined;
  }
  if (formValue?.endDate !== undefined && formValue?.endDate !== null) {
    initFv.endDate = moment(formValue?.endDate, 'YYYYMMDD');
  } else {
    initFv.endDate = undefined;
  }
  if (formValue?.investPool) {
    initFv.investPool = formValue?.investPool?.split(',');
  } else {
    initFv.investPool = undefined;
  }
  initFv.startMoney = Number.parseFloat((initFv.startMoney / 10000).toFixed(4));

  return (
    <Form {...layout} form={form} key={initFv.id} preserve={false} labelWrap={true}>
      <Form.Item name="id" hidden={true} initialValue={initFv?.id}>
        <Input hidden={true} />
      </Form.Item>
      <Row>
        <Col span={12}>
          <FormItem
            initialValue={initFv?.domain}
            name="domain"
            label={'业务域'}
            rules={[{ required: true, message: '请选择业务域!' }]}
          >
            <Select
              style={{ width: '100%' }}
              disabled={true}
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
        <Col span={12}>
          <FormItem
            initialValue={initFv?.userId}
            name="userId"
            label={'归属人'}
            rules={[{ required: true, message: '请填写归属人!' }]}
          >
            <Input maxLength={30} placeholder={'请填写域账号'} style={{ width: '100%' }} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem
            initialValue={initFv?.mpCode}
            name="mpCode"
            label={'组合代码'}
            rules={[
              {
                type: 'string',
                required: true,
                min: 0,
                max: 50,
                message: '请填写组合代码，最多不可超过50个字符',
              },
            ]}
          >
            <Input disabled={true} style={{ width: '100%' }} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            initialValue={initFv?.mpName}
            name="mpName"
            label={'组合名称'}
            rules={[{ required: true, message: '请填写组合名称!' }]}
          >
            <Input style={{ width: '100%' }} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem
            initialValue={initFv?.mpType}
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
            initialValue={initFv?.orderType}
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
      <Row>
        <Col span={12}>
          <FormItem
            initialValue={initFv?.dealPriceDefault}
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
            initialValue={initFv?.startMoney}
            name="startMoney"
            label={'初始资金'}
            rules={[{ required: false, message: '请填写初始资金!' }]}
            extra={
              newHoldItemDataInfo.isNewDate && newHoldItemDataInfo.tradeDate >= formValue?.beginDate
                ? '组合最新持仓日期已超过有效开始日期，不可更改'
                : ''
            }
          >
            <InputNumber
              min={0}
              addonAfter={'万'}
              style={{ width: '100%' }}
              disabled={
                newHoldItemDataInfo.isNewDate &&
                newHoldItemDataInfo.tradeDate >= formValue?.beginDate
                  ? true
                  : false
              }
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem
            initialValue={initFv?.bmCode}
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
            initialValue={initFv?.stkType}
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
      <Row>
        <Col span={12}>
          <FormItem
            initialValue={initFv?.indCode}
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
            initialValue={initFv?.investPool}
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
      <Row>
        <Col span={12}>
          <FormItem
            initialValue={initFv?.noInvestPool}
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
            initialValue={initFv?.isPublic}
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
      <Row>
        <Col span={12}>
          <FormItem
            initialValue={initFv?.orderFee}
            name="orderFee"
            label={'交易费率(默认)'}
            rules={[{ required: false, message: '请填写交易费率(默认)!' }]}
          >
            <InputNumber max={100} min={0} addonAfter="%" style={{ width: '100%' }} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            initialValue={initFv?.commissionFee}
            name="commissionFee"
            label={'佣金(默认)'}
            rules={[{ required: false, message: '请填写佣金(默认)!' }]}
          >
            <InputNumber max={100} min={0} addonAfter={'%'} style={{ width: '100%' }} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem
            initialValue={initFv?.beginDate}
            name="beginDate"
            label={'有效开始日期'}
            rules={[{ required: true, message: '请选择有效开始日期!' }]}
            extra={
              newHoldItemDataInfo.isNewDate && newHoldItemDataInfo.tradeDate >= formValue?.beginDate
                ? '组合最新持仓日期已超过有效开始日期，不可更改'
                : ''
            }
          >
            <DatePicker
              style={{ width: '100%' }}
              disabled={
                newHoldItemDataInfo.isNewDate &&
                newHoldItemDataInfo.tradeDate >= formValue?.beginDate
                  ? true
                  : false
              }
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            initialValue={initFv?.endDate}
            name="endDate"
            label={'有效结束日期'}
            rules={[{ required: false, message: '请选择有效结束日期!' }]}
            extra={
              newHoldItemDataInfo.isNewDate &&
              formValue?.endDate &&
              newHoldItemDataInfo.tradeDate > formValue?.endDate
                ? '组合最新持仓日期已超过有效结束日期，不可更改'
                : ''
            }
          >
            <DatePicker
              style={{ width: '100%' }}
              disabled={
                newHoldItemDataInfo.isNewDate &&
                formValue?.endDate &&
                newHoldItemDataInfo.tradeDate > formValue?.endDate
                  ? true
                  : false
              }
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            initialValue={initFv?.strategy}
            name="strategy"
            label={'策略描述'}
            rules={[{ required: false, message: '请填写策略描述!' }]}
          >
            <TextArea style={{ minHeight: '100px', width: '98%' }} allowClear />
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(BmEditModal);
