import React, { memo, useCallback, useEffect, useState } from 'react';
import { Form, Input, Modal, Spin, message } from 'antd';
import {
  SelmLiveRoadShowInfoFacadeGetLiveRoadShowInfo,
  SelmLiveRoadShowInfoFacadeMailSend,
} from '../service';
import ReactQuill from 'react-quill'; // Typescript
import 'react-quill/dist/quill.snow.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { confirm } = Modal;
const toolbarTips = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ script: 'sub' }, { script: 'super' }],
      [{ align: [] }],
      [{ color: [] }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ direction: 'rtl' }],
      ['clean'],
    ],
    handlers: {},
  },
};

interface ModalProps {
  visible: boolean;
  onClose: (val?: string) => void;
  data: any;
  dic: any;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const getWeekName = (i: number) => {
  switch (i) {
    case 1:
      return '星期一';
    case 2:
      return '星期二';
    case 3:
      return '星期三';
    case 4:
      return '星期四';
    case 5:
      return '星期五';
    case 6:
      return '星期六';
    case 7:
      return '星期日';
    default:
      return '';
  }
};

// 弹窗
const Mail = (props: ModalProps) => {
  const { visible, data, dic } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<any>(true);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const getTheme = (item: any) => {
    const datas = [];
    if (item.broker !== undefined && item.broker !== null && item.broker !== '') {
      datas.push(item.broker);
    }
    if (item.industry !== undefined && item.industry !== null && item.industry !== '') {
      datas.push(item.industry);
    }
    if (item.analyst !== undefined && item.analyst !== null && item.analyst !== '') {
      datas.push(item.analyst);
    }
    if (item.theme !== undefined && item.theme !== null && item.theme !== '') {
      datas.push(item.theme);
    }
    if (item.contact !== undefined && item.contact !== null && item.contact !== '') {
      datas.push(item.contact);
    }
    return datas.join('*');
  };

  const getTimeStr = (item: any) => {
    const showTime = moment(item.showTime, 'YYYY-MM-DD HH:mm');
    let result =
      showTime.format('YYYY年MM月DD日') +
      getWeekName(showTime.isoWeekday()) +
      ' ' +
      showTime.format('HH:mm');
    if (showTime.format('HH:mm') === '11:30') {
      result = result + ' - 13:00';
    } else {
      result = result + ' - ' + showTime.add(1, 'hours').format('HH:mm');
    }
    return result;
  };

  const getInfo = async () => {
    setLoading(true);
    const params = { id: data };
    const result = await SelmLiveRoadShowInfoFacadeGetLiveRoadShowInfo(params);
    const theme = getTheme(result);
    let text = '';
    text = text + '主 题：' + theme + '<br/>';
    if (result.showTime) {
      text = text + '时 间：' + getTimeStr(result) + '<br/>';
    }
    if (result.addr) {
      text = text + '地 点：' + result.addr + '<br/>';
    }

    form.setFieldsValue({ content: text, title: theme });

    setLoading(false);
  };

  const setToCc = () => {
    let to = '',
      cc = '';
    if (dic.to && dic.to !== null) {
      to = dic.to;
    }
    form.setFieldValue('mailTo', to);
    if (dic.cc && dic.cc !== null) {
      cc = dic.cc;
    }
    form.setFieldValue('mailCc', cc);
  };

  useEffect(() => {
    if (data) {
      getInfo();
      setToCc();
    }
  }, [data]);

  const handleOk = useCallback(async () => {
    const values = await form?.validateFields();
    confirm({
      title: '发送邮件',
      content: '确认发送邮件吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        setConfirmLoading(true);
        const params = values;
        const result = await SelmLiveRoadShowInfoFacadeMailSend(params);

        if (result.success && result.data > 0) {
          props.onClose('reload');
          setConfirmLoading(false);
          message.success('发送成功');
          return;
        }
        message.error(result.errorMsg || '保存失败');

        setConfirmLoading(false);
      },
    });
  }, [props]);

  const handleCancel = () => {
    props.onClose('cancel');
  };

  return (
    <>
      <Modal
        title={'邮件编辑'}
        visible={visible}
        maskClosable={false}
        width={1000}
        destroyOnClose={true}
        onOk={handleOk}
        okText={'发送'}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Spin spinning={loading}>
          <Form {...formLayout} form={form} preserve={false}>
            <Form.Item
              name="mailTo"
              label={'收件人'}
              rules={[{ required: true, message: '收件人为必填项' }]}
            >
              <Input placeholder={'请输入收件人'} maxLength={200} />
            </Form.Item>
            <Form.Item
              name="mailCc"
              label={'抄送人'}
              rules={[{ required: false, message: '抄送人为必填项' }]}
            >
              <Input placeholder={'请输入抄送人'} maxLength={200} />
            </Form.Item>
            <Form.Item
              name="title"
              label={'主题'}
              rules={[{ required: true, message: '主题为必填项' }]}
            >
              <Input placeholder={'请输入主题'} maxLength={90} />
            </Form.Item>
            <Form.Item name="content" label={'内容'}>
              <ReactQuill theme="snow" style={{ height: 200 }} modules={toolbarTips} />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
export default memo(Mail);
