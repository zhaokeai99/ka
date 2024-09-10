import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Form,
  Input,
  Checkbox,
  InputNumber,
  message,
  Modal,
  Select,
  Spin,
  AutoComplete,
} from 'antd';
import {
  IrReportFacadeEditIrUserInfo,
  IrReportFacadeAddIrUserInfo,
  IrReportFacadeQueryIrUserInfo,
  IrReportFacadeQueryWxUserPart,
} from '../service';
import _ from 'lodash';

const { Option } = Select;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
  dic: { user: any; menu: any };
}

const CheckboxGroup = Checkbox.Group;

const groupId = '19702231307@chatroom';

// 弹窗
const BenchmarksModal = (props: ModalProps) => {
  const { visible, modalType, initValues, dic } = props;
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [accountUsers, setAccountUsers] = useState<any>([]);
  const [dicMenu, setDicMenu] = useState<any>([]);
  const [wxUsersOptions, setWxUsersOptions] = useState<any>([]);

  const [userForm] = Form.useForm();

  //加载表单数据
  const loadEditValue = async (info: any) => {
    setDataLoading(true);
    const result = await IrReportFacadeQueryIrUserInfo({ id: info.id });
    setDataLoading(false);
    if (result) {
      const accounts = _.find(dic.user, { username: result[0].accountName });
      if (accounts === undefined) {
        setAccountUsers([]);
      } else {
        setAccountUsers([accounts]);
      }
      userForm.setFieldsValue({
        id: result[0].id,
        userName: result[0].userName,
        accountName: result[0].accountName,
        wechatId: result[0].wechatId,
        tenantId: result[0]?.tenantId?.toString(),
        role: result[0].role,
        orderNo: result[0].orderNo,
        menus: result[0].menus,
      });
    } else {
      props.onClose('cancel');
      message.error('未找到相关记录');
    }
  };

  //加载微信用户
  const loadWxUserPart = async () => {
    const result = await IrReportFacadeQueryWxUserPart({ groupId: groupId });
    if (result) {
      const data = result.map((m: any) => {
        return { value: m.wechatId, label: m.wechatName + '(' + m.wechatId + ')' };
      });
      setWxUsersOptions(data);
      // wechatId: "li_constance"
      // wechatName: "黎婕"
    }
  };

  const loadMenu = () => {
    setDicMenu(dic.menu);
  };

  useEffect(() => {
    if (props.visible && props.modalType === 'edit') {
      // 如果是编辑操作,回显数据
      loadEditValue(initValues);
    }
    if (props.visible) {
      loadWxUserPart();
      loadMenu();
    }
    setAccountUsers([]);
  }, [props]);

  const handleOk = useCallback(async () => {
    const values = await userForm?.validateFields();

    const params = {
      id: values.id,
      userName: values.userName,
      accountName: values.accountName,
      wechatId: values.wechatId,
      tenantId: values?.tenantId,
      role: values.role,
      orderNo: values.orderNo,
      menus: values.menus,
    };
    let result: any = {};
    if (modalType === 'edit') {
      result = await IrReportFacadeEditIrUserInfo(params);
    } else {
      result = await IrReportFacadeAddIrUserInfo(params);
    }
    if (result && result > 0) {
      message.success('保存成功');
      props.onClose('reload');
      setConfirmLoading(false);
      return;
    }
    setConfirmLoading(false);
    message.error(result.errorMsg);
  }, [modalType]);

  const handleCancel = () => {
    props.onClose('cancel');
  };

  const onAccountChange = (value: string, option: any) => {
    if (option?.d?.personname) {
      userForm.setFieldsValue({ userName: option.d.personname });
    }
  };

  //域账号搜索
  const onAccountSearch = (value: string) => {
    const d: any[] = [];
    let i = 0;
    _.forEach(dic.user, (v) => {
      if (v.username !== null && v.username.indexOf(value) >= 0) {
        d.push(v);
        i++;
      }
      if (i >= 10) {
        return false;
      }
      return true;
    });
    setAccountUsers(d);
  };

  return (
    <Modal
      title={modalType === 'add' ? '创建用户' : '编辑用户'}
      width={'40%'}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
      destroyOnClose={true}
    >
      <Spin spinning={dataLoading}>
        <Form {...layout} form={userForm} preserve={false}>
          <Form.Item name="id" hidden={true}>
            <Input hidden={true} />
          </Form.Item>
          <Form.Item name="userName" hidden={true}>
            <Input hidden={true} />
          </Form.Item>
          <Form.Item
            name="accountName"
            label={'域账号'}
            rules={[{ required: true, message: '请选择域账号!' }]}
          >
            <Select
              placeholder="请选择域账号"
              showSearch
              optionFilterProp="children"
              onChange={onAccountChange}
              onSearch={onAccountSearch}
              filterOption={false}
              notFoundContent={null}
            >
              {accountUsers.map((u: any) => (
                <Option key={u.username} d={u}>
                  {u.divisionName + '-' + u.personname + '(' + u.username + ')'}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="wechatId"
            label={'微信id'}
            rules={[{ required: false, message: '请填写微信id!' }]}
          >
            <AutoComplete
              options={wxUsersOptions}
              placeholder="请填写微信id"
              filterOption={(inputValue, option) =>
                option?.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </Form.Item>
          <Form.Item
            name="tenantId"
            label={'租户'}
            rules={[{ required: true, message: '请选择业务域租户!' }]}
          >
            <Select placeholder="请选择租户" showSearch optionFilterProp="children">
              <Option value={'0'}>全部</Option>
              <Option value={'1'}>固收</Option>
              <Option value={'2'}>股票</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            label={'角色'}
            rules={[{ required: true, message: '请选择角色!' }]}
          >
            <Select placeholder="请选择角色" showSearch optionFilterProp="children">
              <Option value={'admin'}>管理员</Option>
              <Option value={'invest'}>投资</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="orderNo"
            label={'排序'}
            rules={[{ required: true, message: '请填写排序!' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name="menus" label={'菜单'}>
            <CheckboxGroup>
              {dicMenu?.map((menu: any) => (
                <Checkbox value={menu.code}>{menu.name}</Checkbox>
              ))}
            </CheckboxGroup>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default memo(BenchmarksModal);
