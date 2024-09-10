import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { SearchFormProps } from '../service';

const SearchForm = (props: SearchFormProps) => {
  const [form] = Form.useForm();

  const submit = () => {
    // 在此请求接口，返回两个图表的数据
    props.getChartData(form?.getFieldValue('keyword'));
  };

  return (
    <Form form={form} layout="inline" wrapperCol={{ span: 24 }} onFinish={submit}>
      <Form.Item name="keyword">
        <Input
          style={{ width: '300px', marginBottom: '20px' }}
          placeholder="请输入关键字"
          prefix={<SearchOutlined />}
          allowClear={true}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
          查询
        </Button>
        <Button
          onClick={() => {
            form.resetFields();
          }}
        >
          重置
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SearchForm;
