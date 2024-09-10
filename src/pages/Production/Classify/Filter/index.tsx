import { memo, useState, useCallback } from 'react';
import { Drawer, Form, Row, Col, TreeSelect, Space, Button, Radio } from 'antd';
import { ClearOutlined } from '@ant-design/icons';

const options = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
];

function Filter({
  treeDataOrigin = [],
  tagData = [],
  visible = false,
  onFilterSearch = () => {},
  onClose = () => {},
}: any) {
  const [treeData, setTreeData] = useState([]);
  const [form] = Form.useForm();

  const onChangeTreeData = useCallback((value: any) => {
    setTreeData(value);
  }, []);

  const onSearch = useCallback(() => {
    onFilterSearch(form.getFieldsValue());
    onClose();
  }, [onFilterSearch, treeData]);

  return (
    <Drawer
      title="筛选基金"
      width="35%"
      closable={false}
      onClose={() => onClose()}
      visible={visible}
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={() => onClose()}>返回</Button>
          {/* <Button
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button> */}
          <Button type="primary" onClick={onSearch}>
            保存
          </Button>
        </Space>
      }
    >
      <Form
        hideRequiredMark
        form={form}
        wrapperCol={{ span: 14, offset: 1 }}
        labelCol={{ span: 10 }}
        size="small"
      >
        <Form.Item name="categories" label="分类树映射">
          <TreeSelect
            treeData={treeDataOrigin}
            onChange={onChangeTreeData}
            placeholder="请选择分类"
            value={treeData}
            treeCheckable={true}
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
          />
        </Form.Item>
        {tagData.map((tag: any) => (
          <Row>
            <Col span={20}>
              <Form.Item
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 8, offset: 1 }}
                name={tag.labelCode}
                label={tag.labelName}
              >
                <Radio.Group size="small" options={options} value={tag.isSelect} />
              </Form.Item>
            </Col>
            <Col>
              <ClearOutlined
                style={{
                  marginTop: '8px',
                  marginLeft: '-60px',
                }}
                onClick={() => {
                  form.setFieldsValue({
                    [tag.labelCode]: null,
                  });
                }}
              />
            </Col>
          </Row>
        ))}
      </Form>
    </Drawer>
  );
}

export default memo(Filter);
