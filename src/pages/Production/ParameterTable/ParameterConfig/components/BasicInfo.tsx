import ProCard from '@ant-design/pro-card';
import { Col, DatePicker, Form, Input, Row, Select } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const registrations = [
  {
    key: '42',
    name: '天弘基金管理有限公司',
  },
  {
    key: 'H0',
    name: '天弘基金(云上)',
  },
  {
    key: '98',
    name: '中国证券登记结算有限责任公司',
  },
];

// 基本信息
const BasicInfo = ({ disabled = false, form }: any) => {
  const registration = Form.useWatch(['fundParamBasic', 'registration'], form);

  form.setFieldsValue({
    fundParamBasic: {
      registrationCode: registrations.find(({ name }) => name === registration)?.key,
    },
  });

  return (
    <ProCard title="基本信息">
      <Row>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="基金全称"
            name={['fundParamBasic', 'fundName']}
            rules={[{ required: true }]}
          >
            <Input placeholder="基金全称" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="基金简称"
            name={['fundParamBasic', 'fundShortName']}
            rules={[{ required: true }]}
          >
            <Input placeholder="基金简称" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="基金代码"
            name={['fundParamBasic', 'fundCode']}
            rules={[{ required: true }]}
          >
            <Input placeholder="基金代码" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="收费模式"
            name={['fundParamBasic', 'chargeMode']}
            rules={[{ required: true }]}
          >
            <Input placeholder="收费模式" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="管理费率"
            name={['fundParamBasic', 'manageRate']}
            rules={[{ required: true }]}
          >
            <Input placeholder="管理费率" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="托管费率"
            name={['fundParamBasic', 'escrowRate']}
            rules={[{ required: true }]}
          >
            <Input placeholder="托管费率" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="销售服务费率"
            name={['fundParamBasic', 'salesRate']}
            rules={[{ required: true }]}
          >
            <Input placeholder="如无数据请填入一个横杠-" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item label="募集起始日" name={['fundParamBasic', 'raiseStartDate']}>
            <DatePicker
              format="YYYY/MM/DD"
              placeholder="募集起始日"
              style={{ width: '100%' }}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item label="募集结束日" name={['fundParamBasic', 'raiseEndDate']}>
            <DatePicker
              format="YYYY/MM/DD"
              placeholder="募集结束日"
              style={{ width: '100%' }}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="基金管理人"
            name={['fundParamBasic', 'fundManager']}
            rules={[{ required: true }]}
          >
            <Input placeholder="基金管理人" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="管理人代码"
            name={['fundParamBasic', 'fundManagerCode']}
            rules={[{ required: true }]}
          >
            <Input placeholder="管理人代码" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="基金托管人"
            name={['fundParamBasic', 'fundTrustee']}
            rules={[{ required: true }]}
          >
            <Input placeholder="基金托管人" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="托管人代码"
            name={['fundParamBasic', 'fundTrusteeCode']}
            rules={[{ required: true }]}
          >
            <Input placeholder="托管人代码" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="注册登记机构"
            name={['fundParamBasic', 'registration']}
            rules={[{ required: true }]}
            initialValue="天弘基金管理有限公司"
          >
            <Select placeholder="注册登记机构" disabled={disabled}>
              {registrations.map(({ name, key }) => (
                <Option value={name} key={key}>
                  {name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="注册登记机构代码"
            name={['fundParamBasic', 'registrationCode']}
            rules={[{ required: true }]}
            initialValue="42"
          >
            <Select disabled={true} placeholder="注册登记机构代码">
              {registrations.map(({ key }) => (
                <Option value={key} key={key}>
                  {key}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="默认分红方式"
            name={['fundParamBasic', 'defaultDivideMethod']}
            rules={[{ required: true }]}
            initialValue="现金分红"
          >
            <Select disabled={disabled} placeholder="默认分红方式">
              <Option value="现金分红">现金分红</Option>
              <Option value="红利再投">红利再投</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item
            label="允许修改分红方式"
            name={['fundParamBasic', 'updateDivideMethod']}
            rules={[{ required: true }]}
            initialValue={true}
          >
            <Select disabled={disabled}>
              <Option value={true}>是</Option>
              <Option value={false}>否</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 6 }}>
          <Form.Item label="备注" name={['fundParamBasic', 'remark']}>
            <TextArea placeholder="备注" rows={2} disabled={disabled} />
          </Form.Item>
        </Col>
      </Row>
    </ProCard>
  );
};

export default BasicInfo;
