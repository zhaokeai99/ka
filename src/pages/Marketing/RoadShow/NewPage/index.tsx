import React, { useState, useCallback, useRef, useContext } from 'react';
import moment from 'moment';
import { useModel } from 'umi';
import { Form, Input, Upload, Button, Row, Col, DatePicker, Radio, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import { getOssConfig, uploadOss, newRoadShow } from '../service';
import PeopleSelect from '../components/PeopleSelect';
import { STYLE, PUBLIC, PARTICIPANT_TYPE } from '../constant';

const { RangePicker } = DatePicker;
import styles from './index.less';
import Modal from 'antd/lib/modal/Modal';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

// 将组件产生的人物数据转换成，后端接口入参格式
const getPeople = (list) => {
  const result = [];
  if (list) {
    list.forEach((element) => {
      if (element) {
        result.push({
          name: element.participantAccount,
          realName: element.participantName,
          type: element.participantType,
        });
      }
    });
  }
  return result;
};

// 将组件产生的人物数据转换成，后端接口入参格式
const getParticipantPeople = (list) => {
  const result = [];
  if (list) {
    list.forEach((element) => {
      if (element) {
        result.push({
          name: element.participantAccount,
          realName: element.participantName,
          participantType: element.participantType,
          groupName: element.participantName,
          roadShowParticipants: getPeople(element.roadShowParticipants),
        });
      }
    });
  }
  return result;
};

// 将组件产生的人物数据转换成，后端接口入参格式
const getPresenterPeople = (list) => {
  const result = [];
  if (list) {
    list.forEach((element) => {
      if (element) {
        result.push({
          name: element.participantAccount,
          realName: element.participantName,
          presenterType: '0', // '0' 内部，'1' 外部
        });
      }
    });
  }
  return result;
};

// 格式化成后端入参
const getSeverFormat = (datas) => {
  const newDatas = {
    ...datas,
    publicToAll: datas.publicToAll === 'yes',
    roadShowStartTime: datas.times[0] && datas.times[0].format('YYYY-MM-DD HH:ss:mm'),
    roadShowEndTime: datas.times[1] && datas.times[1].format('YYYY-MM-DD HH:ss:mm'),
    roadShowOrganizerVO:
      (datas.roadShowOrganizerVO && getPeople(datas.roadShowOrganizerVO)[0]) || {},
    participants: datas.participants && getParticipantPeople(datas.participants),
    presenters: datas.presenters && getPresenterPeople(datas.presenters),
  };
  return newDatas;
};

// 组织数据，符合后端数据结构要求
const getSaveFiles = (files, urls) => {
  const newFiles = [];
  if (files && files.length > 0 && urls && urls.length > 0) {
    files.forEach((element) => {
      if (element && element.name) {
        for (let i = 0; i < urls.length; i++) {
          const item = urls[i];
          if (item.indexOf(element.name.split('.')[0]) > -1) {
            newFiles.push({
              fileName: element.name,
              fileUrl: item,
              fileType: element.type,
            });
            break;
          }
        }
      }
    });
  }
  return newFiles;
};

const EditRoadShow: React.FC<any> = () => {
  const { initialState } = useModel('@@initialState');
  const initCreator = {
    participantName: initialState.realName || '',
    participantAccount: initialState.userNo || '',
    participantType: PARTICIPANT_TYPE.PEOPLE,
  };
  const nowDate = moment();
  const formRef = useRef<any>();
  const { key: tabKey, removeTab } = useContext(TabLayoutContext);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadCfg, setUploadCfg] = useState<any>({});
  const [uploadFiles, setUploadFiles] = useState<any>([]);
  const [saveDlgShow, setSaveDlgShow] = useState(false);

  const handleBeforeUpload = useCallback(async () => {
    const { success, data, errorMsg } = await getOssConfig();
    if (!success || !data.host) {
      message.error(errorMsg || '获取');
      return false;
    }

    setUploadCfg(data);
  }, []);

  const handleFileChange = useCallback(
    async ({ file, onSuccess }) => {
      setUploadLoading(true);
      const { data, success } = await uploadOss({
        urlPath: `${uploadCfg.host}/upload/oss/uploadOss`,
        file,
        accessKey: uploadCfg.accessKey,
        secretKey: uploadCfg.secretKey,
        accountType: uploadCfg.accountType,
        bucket: uploadCfg.bucket,
        filePath: uploadCfg.filePath,
      });

      setUploadLoading(false);
      if (success) {
        uploadFiles.push(data.url + '/' + data.suffixPath);
        setUploadFiles(uploadFiles); // 存储所有上传过的文件url
      } else {
        message.error('上传失败');
      }

      if (onSuccess) {
        onSuccess({ success: true }, file);
      }
    },
    [uploadCfg, formRef, uploadFiles],
  );

  const onFinish = useCallback(
    async (values: any) => {
      setSaveDlgShow(true);
      const files = values?.roadShowAttachments?.fileList;
      const newFiles = getSaveFiles(files, uploadFiles);
      const saveValues = { ...values, roadShowAttachments: newFiles };
      // 转换成服务端格式
      const formatValues = getSeverFormat(saveValues);

      const { success } = await newRoadShow(formatValues);
      if (success) {
        message.success('新增成功！');
      } else {
        message.error('新增失败！');
      }
      setSaveDlgShow(false);

      return true;
    },
    [uploadFiles],
  );

  return (
    <div
      className={styles['main-container']}
      // onClick={() => {
      //   setTabTitle(tabKey, 'test');}}
    >
      <h2 className={styles['title']}>新建路演</h2>
      <Form {...layout} name="roadshow" ref={formRef} onFinish={onFinish}>
        <Row>
          <Col span={16}>
            <Form.Item
              name="meetingSubject"
              label="主题"
              rules={[{ required: true }]}
              labelCol={{ span: 3, offset: 0 }}
            >
              <Input placeholder="请输入路演主题" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <Form.Item name="customerName" label="外部访客" labelCol={{ span: 3, offset: 0 }}>
              <Input placeholder="请填写外部访客" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={1}></Col>
          <Col span={4}>
            <Form.Item
              name="meetingForm"
              label="形式"
              rules={[{ required: true }]}
              labelCol={{ span: 6, offset: 0 }}
            >
              {/* <Select>
                  <Option value={STYLE.ONLINE}>线上视频</Option>
                  <Option value={STYLE.OFFLINE}>线下</Option>
                </Select> */}
              <Radio.Group>
                <Radio value={STYLE.ONLINE}>线上</Radio>
                <Radio value={STYLE.OFFLINE}>线下</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="publicToAll"
              label="公开"
              rules={[{ required: true }]}
              labelCol={{ span: 6, offset: 0 }}
            >
              <Radio.Group>
                <Radio value={PUBLIC.YES}>是</Radio>
                <Radio value={PUBLIC.NO}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item
              name="times"
              label="路演时间"
              rules={[{ required: true }]}
              labelCol={{ span: 6, offset: 0 }}
            >
              <RangePicker
                disabledDate={(date) => {
                  return date.isBefore(nowDate);
                }}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item
              name="room"
              label="会议室"
              rules={[{ required: true }]}
              labelCol={{ offset: 2 }}
            >
              <Input placeholder="请填写路演会议室" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item name="roadShowAddress" label="地点">
              <Input placeholder="请填写路演地点" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name="roadShowOrganizerVO" label="组织者" rules={[{ required: true }]}>
              <PeopleSelect
                placeholder="请选择路演组织者"
                supportGroup={false}
                defaultSelect={[initCreator]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name="presenters" label="主讲人" rules={[{ required: true }]}>
              <PeopleSelect placeholder="请选择路演主讲人" supportGroup={false} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name="participants" label="参与人员" rules={[{ required: true }]}>
              <PeopleSelect placeholder="请选择路演参与人员" supportGroup />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name="digest" label="摘要">
              <Input.TextArea placeholder="请填写路演摘要" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name="roadShowAttachments"
              label="上传附件"
              // valuePropName="fileList"
              // getValueFromEvent={normFile}
              extra="请不要传文件名带‘+’号的文件"
            >
              <Upload
                multiple
                name="file"
                accept="*"
                beforeUpload={handleBeforeUpload}
                customRequest={handleFileChange}
              >
                <Button icon={<UploadOutlined />} loading={uploadLoading}>
                  点击上传
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Row>
            <Col span={10}></Col>
            <Col span={14}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button style={{ marginLeft: '48px' }} onClick={() => removeTab && removeTab(tabKey)}>
                关闭
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
      <Modal visible={saveDlgShow} closable={false} footer={null}>
        <span>存储中...</span>
      </Modal>
    </div>
  );
};

export default EditRoadShow;
