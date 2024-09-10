import React, { memo, useRef, useState } from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, InputNumber, Select, Tag } from 'antd';
import { SirmStockQuery, StkInfoListQuery } from '../service';
import { PortfolioInfo } from '../../service';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface ModalProps {
  form: FormInstance;
  portfolioInfo: PortfolioInfo;
}

// 弹窗
const MpHoldChgAddModal = (props: ModalProps) => {
  const { form, portfolioInfo } = props;

  const [state, setState] = useState<any>({ data: [], value: undefined });
  let timeout: any = useRef();
  let currentValue = useRef();

  const fetch = (value: any, callback: any) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    const fake = async () => {
      // 如果有投资池，查Sirm接口
      if (portfolioInfo?.investPool) {
        const result = await SirmStockQuery({
          scode: value,
          poolName: portfolioInfo?.investPoolName,
          current: 1,
          pageSize: 1000,
        });
        if (currentValue === value) {
          let { data } = result;

          // 去重
          const obj = {};
          data = data?.reduce((item: any, next: any) => {
            if (!obj[next.scode]) {
              item.push(next);
              obj[next.scode] = true;
            }
            return item;
          }, []);

          callback(data);
        }
      } else {
        // 如果没有投资池，查库接口
        const result = await StkInfoListQuery({ searchValue: value });

        if (currentValue === value) {
          const packageData = result?.map((cur: any) => ({
            scode: cur?.stkCode,
            sname: cur?.stkName,
            mktcode: cur?.mtkCode,
          }));
          callback(packageData);
        }
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
    <Form {...layout} form={form} preserve={false}>
      <Form.Item
        name="stkCode"
        label={'证券'}
        rules={[{ required: true, message: '请输入证券代码/名称' }]}
      >
        <Select
          style={{ width: '65%' }}
          showSearch
          allowClear
          value={state.value}
          placeholder="请输入证券代码/名称"
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={handleSearch}
          onChange={handleChange}
          notFoundContent={null}
        >
          {state?.data?.map((d: any) => (
            <>
              <Option key={d.scode} value={`${d.scode}/${d.sname}/${d.mktcode}`}>
                <Tag>{d.scode}</Tag>
                {d.sname}
              </Option>
            </>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="targetWeight"
        label={'目标比例'}
        rules={[{ required: true, message: '请输入目标比例' }]}
      >
        <InputNumber addonAfter="%" min={0} max={100} style={{ width: '65%' }} />
      </Form.Item>
      <Form.Item name="targetPrice" label={'成交价格'}>
        <Input style={{ width: '65%' }} />
      </Form.Item>
      <Form.Item name="comm" label={'调整理由'}>
        <Input style={{ width: '65%' }} />
      </Form.Item>
    </Form>
  );
};
export default memo(MpHoldChgAddModal);
