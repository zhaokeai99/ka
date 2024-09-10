import React, { memo, useCallback, useEffect, useState } from 'react';
import { Modal, Button, Select, Form } from 'antd';
import { queryTrackComposeList } from '../service';
const { Option } = Select;
interface PropsType {
  visible: boolean;
  handleOk: any;
  handleCancel: any;
  records: any;
}
const TrackAdd: React.FC<PropsType> = (props) => {
  const { visible, handleOk, handleCancel, records } = props;
  const [form] = Form.useForm();
  const [selectList, setSelectList] = useState<any[]>([]);
  const getData = useCallback(async () => {
    const res: any = await queryTrackComposeList({
      fundId: records.fundId,
      fundCode: records.fundCode,
    });
    if (res.success) {
      setSelectList(res.data);
    }
  }, []);
  useEffect(() => {
    getData();
  }, []);
  const handleFinish = useCallback(
    (values: any) => {
      handleOk(values);
      form.resetFields();
    },
    [handleOk],
  );
  const onCancel = useCallback(() => {
    handleCancel();
    form.resetFields();
  }, [handleCancel]);

  return (
    <Modal
      title="关联赛道"
      visible={visible}
      onCancel={onCancel}
      centered
      width={500}
      footer={false}
    >
      <Form
        name="basic"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onFinish={handleFinish}
      >
        <Form.Item
          label="赛道名称"
          name="trackId"
          rules={[{ required: true, message: '请选择组合名称!' }]}
        >
          <Select>
            {selectList.map((item) => {
              return <Option value={item.trackId}>{item.trackName}</Option>;
            })}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
          <Button style={{ width: 100 }} type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(TrackAdd);
