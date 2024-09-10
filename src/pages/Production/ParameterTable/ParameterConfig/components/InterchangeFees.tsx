import { FEE_MAX, FEE_MIN } from '@/utils/utils';
import ProCard from '@ant-design/pro-card';
import { Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

// 交易费率
// 和后端约定的返回的数组顺序也是一样的
const fundParamTradeRateObj = {
  sub: {
    limitItem: '认购',
    firstLabel: '认购金额分段',
    secondLabel: '认购费率',
    minLabel: '认购金额≥',
    maxLabel: '认购金额<',
    strategyLabel: '类型',
    rateLabel: '费率',
    valueLabel: '金额',
    labelSuffix: '万',
  },
  pur: {
    limitItem: '申购',
    firstLabel: '申购金额分段',
    secondLabel: '申购费率',
    minLabel: '申购金额≥',
    maxLabel: '申购金额<',
    strategyLabel: '类型',
    rateLabel: '费率',
    valueLabel: '金额',
    labelSuffix: '万',
  },
  // redeem: {
  //   limitItem: '赎回',
  //   firstLabel: '持有期限',
  //   secondLabel: '赎回费率',
  //   minLabel: '持有期限≥',
  //   maxLabel: '持有期限<',
  //   strategyLabel: '类型',
  //   rateLabel: '费率',
  //   valueLabel: '金额',
  //   labelSuffix: '天',
  // },
  redeemIn: {
    limitItem: '场内赎回',
    firstLabel: '持有期限',
    secondLabel: '赎回费率',
    minLabel: '持有期限≥',
    maxLabel: '持有期限<',
    strategyLabel: '类型',
    rateLabel: '费率',
    valueLabel: '金额',
    labelSuffix: '天',
  },
  redeemOut: {
    limitItem: '场外赎回',
    firstLabel: '持有期限',
    secondLabel: '赎回费率',
    minLabel: '持有期限≥',
    maxLabel: '持有期限<',
    strategyLabel: '类型',
    rateLabel: '费率',
    valueLabel: '金额',
    labelSuffix: '天',
  },
  capitial: {
    limitItem: '归基金资产部分',
    firstLabel: '持有期限',
    secondLabel: '归基金资产部分',
    minLabel: '持有期限≥',
    maxLabel: '持有期限<',
    strategyLabel: '类型',
    rateLabel: '费率',
    valueLabel: '金额',
    labelSuffix: '天',
  },
};

const GroupItem = ({ field, disabled, form, index, keyName }: any) => {
  const result = Form.useWatch([keyName, `${index}`, 'rateStrategy'], form);
  const { valueLabel, strategyLabel, rateLabel } = fundParamTradeRateObj[keyName];
  const [type, setType] = useState(() => {
    return form.getFieldValue(`${keyName}`)[index].rateStrategy;
  });

  useEffect(() => {
    setType(form.getFieldValue(`${keyName}`)[index].rateStrategy);
  }, [result]);

  return (
    <>
      <Col span={3}>
        <Form.Item
          {...field}
          label={strategyLabel}
          name={[field.name, 'rateStrategy']}
          rules={[{ required: true }]}
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          initialValue={0}
        >
          <Select onChange={(value) => setType(value)} disabled={disabled}>
            <Option value={0}>费率</Option>
            <Option value={1}>金额</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={7}>
        <Form.Item
          {...field}
          label={type === 0 ? rateLabel : valueLabel}
          name={[field.name, 'rangeValue']}
          rules={[{ required: true }]}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Input disabled={disabled} suffix={type === 0 ? '%' : '￥'} />
        </Form.Item>
      </Col>
    </>
  );
};

const InterchangeFees = ({ form, disabled = false }) => {
  const registrationCode = Form.useWatch(['fundParamBasic', 'registrationCode'], form);
  const onChangeValue = (e: any, type: string) => {
    if (e.keyCode !== 13) return;
    const str = e.target.value;
    if (!str) {
      form.setFieldsValue({ [type]: [] });
      return;
    }
    // （1）分隔（2）过滤非数字（3）转换成浮点（4）排序（5）插入头尾（6）去重（7）生成数据结构（8）重置
    const arr = str
      .split(',')
      .filter((i: string) => i === '0' || !!parseFloat(i))
      .map((i: string) => parseFloat(i))
      .sort((i: number, j: number) => i - j);
    arr.unshift(FEE_MIN);
    arr.push(FEE_MAX);

    const result: any[] = Array.from(new Set(arr)).reduce((i: number, j: number) => {
      if (!Array.isArray(i)) {
        return [
          {
            minValue: i,
            maxValue: j,
          },
        ];
      }
      return [
        ...i,
        {
          minValue: i[i.length - 1].maxValue,
          maxValue: j,
        },
      ];
    });

    form.setFieldsValue({
      [type]: result.map((r, i) => {
        if ((type === 'sub' || type === 'pur') && result.length > 1) {
          if (i + 1 === result.length) {
            return {
              ...r,
              rateStrategy: 1,
            };
          }
        }

        return {
          ...r,
          rateStrategy: 0,
        };
      }),
    });
  };

  return (
    <ProCard title="交易费率">
      {Object.keys(fundParamTradeRateObj).map((keyName) => {
        // if (registrationCode === '98' && keyName === 'redeemIn') return null;
        if (registrationCode !== '98' && keyName === 'redeemIn') return null;

        const { limitItem, minLabel, labelSuffix, maxLabel } = fundParamTradeRateObj[keyName];

        return (
          <Card size="small" key={keyName} title={null} style={{ marginBottom: '8px' }}>
            <Form.Item
              label={limitItem}
              name={`${keyName}Str`}
              labelCol={{ span: 4, offset: 12 }}
              wrapperCol={{ span: 8 }}
            >
              <Input
                onKeyDown={(e) => onChangeValue(e, keyName)}
                disabled={disabled}
                placeholder="分段设置用逗号隔开；0表示全部"
                suffix={labelSuffix}
              />
            </Form.Item>
            <Row>
              <Form.List name={keyName}>
                {(fields) =>
                  fields.map((field, index) => (
                    <>
                      <Col span={7}>
                        <Form.Item
                          {...field}
                          label={minLabel}
                          name={[field.name, 'minValue']}
                          rules={[{ required: true }]}
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                        >
                          <Input disabled={true} suffix={labelSuffix} />
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          {...field}
                          label={maxLabel}
                          name={[field.name, 'maxValue']}
                          rules={[{ required: true }]}
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                        >
                          <Input disabled={true} suffix={labelSuffix} />
                        </Form.Item>
                      </Col>
                      <GroupItem
                        field={field}
                        form={form}
                        keyName={keyName}
                        index={index}
                        disabled={disabled}
                      />
                    </>
                  ))
                }
              </Form.List>
            </Row>
          </Card>
        );
      })}
    </ProCard>
  );
};

export { InterchangeFees, fundParamTradeRateObj };
