import { RightOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Button, Col, Form, Input, InputNumber, Row, Tooltip } from 'antd';
import { Fragment } from 'react';
import '../index.less';

// 交易参数限制
// 和后端约定的返回的数组顺序也是一样的
const fundParamLimitList = [
  {
    limitItem: '认/申购首次投资最低金额',
    labelName: '认/申购首次投资最低金额(元)',
  },
  {
    limitItem: '认/申购追加投资最低金额',
    labelName: '认/申购追加投资最低金额(元)',
  },
  {
    limitItem: '定期定额申购最低金额',
    labelName: '定期定额申购最低金额(元)',
  },
  {
    limitItem: '最低转换份额',
    labelName: '最低转换份额(份)',
  },
  {
    limitItem: '最低赎回份额',
    labelName: '最低赎回份额(份)',
  },
  {
    limitItem: '最低持有份额',
    labelName: '最低持有份额(份)',
  },
];

const TradingParameters = ({ form, disabled = false }: any) => {
  const copyLtR = (leftFieldName: string, rightFieldName: string) => {
    const { fundParamLimitList: list } = form.getFieldsValue(['fundParamLimitList']);
    form.setFieldsValue({
      fundParamLimitList: list.map((param) => ({
        ...param,
        [rightFieldName]: param[leftFieldName],
      })),
    });
  };

  return (
    <ProCard title="交易参数限制">
      <Row>
        <Col span={6} />
        <Col className="ta-parameter-trading-parameter-title" span={6}>
          个人
          <Tooltip title="拷贝个人到机构">
            <Button
              disabled={disabled}
              className="ta-parameter-trading-parameter-icon"
              shape="circle"
              size="small"
              icon={<RightOutlined />}
              onClick={() => copyLtR('personal', 'org')}
            />
          </Tooltip>
        </Col>
        <Col className="ta-parameter-trading-parameter-title" span={6}>
          机构
          <Tooltip title="拷贝机构到产品">
            <Button
              disabled={disabled}
              className="ta-parameter-trading-parameter-icon"
              shape="circle"
              size="small"
              icon={<RightOutlined />}
              onClick={() => copyLtR('org', 'pro')}
            />
          </Tooltip>
        </Col>
        <Col className="ta-parameter-trading-parameter-title" span={6}>
          产品
        </Col>
      </Row>
      <Row>
        <Col xl={{ span: 24 }} xxl={{ span: 24 }}>
          <Form.List name="fundParamLimitList">
            {() => (
              <Row>
                {(fundParamLimitList || []).map(({ limitItem, labelName }, index) => (
                  <Fragment key={limitItem}>
                    <Form.Item name={[index, 'limitItem']} hidden={true} initialValue={limitItem}>
                      <Input />
                    </Form.Item>
                    <Col className="ta-parameter-trading-parameter-label" span={6}>
                      {labelName}
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 22 }}
                        name={[index, 'personal']}
                        rules={[{ required: true, message: '必填' }]}
                      >
                        <InputNumber
                          min="0"
                          max="9999999999"
                          step="0.01"
                          placeholder="个人"
                          disabled={disabled}
                          formatter={(v: any) => (v ? Number(Number(v).toFixed(2)) : v)}
                          stringMode
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 22 }}
                        name={[index, 'org']}
                        rules={[{ required: true, message: '必填' }]}
                      >
                        <InputNumber
                          min="0"
                          max="9999999999"
                          step="0.01"
                          placeholder="机构"
                          disabled={disabled}
                          formatter={(v: any) => (v ? Number(Number(v).toFixed(2)) : v)}
                          stringMode
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 22 }}
                        name={[index, 'pro']}
                        rules={[{ required: true, message: '必填' }]}
                      >
                        <InputNumber
                          min="0"
                          max="9999999999"
                          formatter={(v: any) => (v ? Number(Number(v).toFixed(2)) : v)}
                          step="0.01"
                          placeholder="产品"
                          disabled={disabled}
                          stringMode
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Fragment>
                ))}
              </Row>
            )}
          </Form.List>
        </Col>
      </Row>
    </ProCard>
  );
};

export default TradingParameters;
