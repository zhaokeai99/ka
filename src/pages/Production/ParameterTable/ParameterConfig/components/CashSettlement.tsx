import ProCard from '@ant-design/pro-card';
import { Col, Form, Input, Row } from 'antd';
import { Fragment } from 'react';

const acctTypeMap = {
  '20': '认购',
  '22': '申购',
  '24': '赎回',
  '43': '分红',
};

//资金交收账户集合对象
// 和后端约定的返回的数组顺序也是一样的
const fundParamSettlementAcctList = [
  {
    acctType: '募集户', //账户类型  募集户  TA清算户
  },
  {
    acctType: 'TA清算户',
  },
];

//资金交收业务对象
// 和后端约定的返回的数组顺序也是一样的
const fundParamSettlementBusiList = [
  {
    busiType: '20', //业务类型 20 认购 22 申购 24赎回 43分红
  },
  {
    busiType: '22',
  },
  {
    busiType: '24',
  },
  {
    busiType: '43',
  },
];

const CashSettlement = ({ disabled = false }) => {
  return (
    <ProCard title="资金交收">
      <Row>
        <Col xl={{ span: 24 }} xxl={{ span: 24 }}>
          <Form.List name="fundParamSettlementAcctList">
            {() => (
              <>
                {(fundParamSettlementAcctList || []).map(({ acctType }, index) => (
                  <Row key={acctType}>
                    <Form.Item name={[index, 'acctType']} hidden={true} initialValue={acctType}>
                      <Input />
                    </Form.Item>
                    <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
                      <Form.Item
                        label={`户名(${acctType})`}
                        name={[index, 'acctName']}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="户名" disabled={disabled} />
                      </Form.Item>
                    </Col>
                    <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
                      <Form.Item
                        label={`账号(${acctType})`}
                        name={[index, 'acctNo']}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="账号" disabled={disabled} />
                      </Form.Item>
                    </Col>
                    <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
                      <Form.Item
                        label={`开户行(${acctType})`}
                        name={[index, 'acctBank']}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="开户行" disabled={disabled} />
                      </Form.Item>
                    </Col>
                    <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
                      <Form.Item
                        label={`支付系统行号(${acctType})`}
                        name={[index, 'payAcctBankNo']}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="支付系统行号" disabled={disabled} />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Form.List>
          <Form.List name="fundParamSettlementBusiList">
            {() => (
              <Row>
                {(fundParamSettlementBusiList || []).map(({ busiType }, index) => (
                  <Fragment key={busiType}>
                    <Form.Item name={[index, 'busiType']} hidden={true} initialValue={busiType}>
                      <Input />
                    </Form.Item>
                    <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
                      <Form.Item
                        label={`确认日(${acctTypeMap[busiType]})`}
                        name={[index, 'confirmDays']}
                        rules={[{ required: true }]}
                        initialValue={busiType === '43' ? 'R+' : 'T+'}
                      >
                        <Input placeholder="确认日（数据下发日）" disabled={disabled} />
                      </Form.Item>
                    </Col>
                  </Fragment>
                ))}

                {(fundParamSettlementBusiList || []).map(({ busiType }, index) => (
                  <Col xl={{ span: 11 }} xxl={{ span: 6 }} key={busiType}>
                    <Form.Item
                      label={`交收天数(${acctTypeMap[busiType]})`}
                      name={[index, 'settlementDays']}
                      rules={[{ required: true }]}
                      initialValue={busiType === '43' ? 'R+' : 'T+'}
                    >
                      <Input placeholder="交收天数" disabled={disabled} />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            )}
          </Form.List>
        </Col>
      </Row>
    </ProCard>
  );
};

export { fundParamSettlementBusiList, CashSettlement };
