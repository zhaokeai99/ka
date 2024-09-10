import { emptyToUndefined, queryCustomerCondCheck } from '@/pages/Marketing/AdvisorCRM/util';
import {
  Key,
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProTable,
  QueryFilter,
} from '@ant-design/pro-components';
import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { advisorQueryUserInfoList, queryCertificateTypeList } from './service';
import { ProFormInstance } from '@ant-design/pro-form';
import { history } from '@@/core/history';

const selectCustomerColumns: any[] = [
  {
    title: '客户姓名',
    dataIndex: 'userName',
    width: '12%',
  },
  {
    title: '手机号码',
    dataIndex: 'mobileTelNo',
    width: '12%',
  },
  {
    title: '客户编号',
    dataIndex: 'thUserId',
    width: '30%',
  },
  {
    title: 'App-UserId',
    dataIndex: 'appUserId',
    width: '15%',
  },
  {
    title: '证件类型',
    dataIndex: 'certificateType',
    width: '10%',
  },
  {
    title: '证件号码',
    dataIndex: 'certificateNo',
    width: '15%',
  },
];

const LocationCustomerInfo: React.FC<any> = (props) => {
  /*modal显隐*/
  const [selectCustomerVisit, setSelectCustomerVisit] = useState<boolean>(false);
  /*多客户数据和处理*/
  const [selectCustomerList, setSelectCustomerList] = useState<any[]>([]);
  const [selectedCustomerThUserId, setSelectedCustomerThUserId] = useState<any>();
  const [lastThUserId, setLastThUserId] = useState<any>();
  /*身份证类型*/
  const [certTypeOptions, setCertTypeOptions] = useState<any[]>([]);

  const customerFormRef = useRef<ProFormInstance>();

  const _thUserId = history.location?.query?.thUserId;

  useEffect(() => {
    queryCertificateTypeList().then((data: any[]) => {
      const tempCertTypeOptions: any[] = [];
      data.forEach((item: any) => {
        tempCertTypeOptions.push({
          label: item.value,
          value: item.code,
        });
      });
      setCertTypeOptions(tempCertTypeOptions);
    });
  }, []);

  useEffect(() => {
    if (_thUserId && lastThUserId != _thUserId) {
      setLastThUserId(_thUserId);
      customerFormRef.current?.resetFields();
      customerFormRef.current?.setFieldsValue({
        thUserId: _thUserId,
      });
      customerFormRef.current?.submit();
    }
  }, [_thUserId]);
  return (
    <>
      <ModalForm
        title="选择客户"
        visible={selectCustomerVisit}
        onFinish={async () => {
          if (selectedCustomerThUserId) {
            message.info('正在进行选中客户查询，请稍后。。。');
            const userInfoListData = await advisorQueryUserInfoList({
              thUserId: emptyToUndefined(selectedCustomerThUserId),
              source: emptyToUndefined(props?.source),
            });
            props.afterSelectedUser(userInfoListData[0]);
          } else {
            message.info('您未选择客户！');
            props.afterSelectedUser();
          }
          return true;
        }}
        width={1000}
        onVisibleChange={setSelectCustomerVisit}
      >
        <ProTable<any>
          bordered={true}
          columns={selectCustomerColumns}
          size={'small'}
          dataSource={selectCustomerList}
          rowKey={'thUserId'}
          options={false}
          toolBarRender={false}
          search={false}
          rowSelection={{
            type: 'radio',
            columnWidth: '5%',
            onChange: (selectedRowKeys: Key[]) => {
              if (selectedRowKeys.length > 0) {
                setSelectedCustomerThUserId(selectedRowKeys[0]);
              }
            },
          }}
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: [10, 20, 50, 100],
            showSizeChanger: true,
          }}
          tableAlertOptionRender={false}
          tableAlertRender={false}
        />
      </ModalForm>
      <QueryFilter<any>
        title={'客户信息查询'}
        defaultCollapsed={false}
        formRef={customerFormRef}
        onReset={() => {
          props?.resetEvent();
        }}
        onFinish={async (values) => {
          if (!queryCustomerCondCheck(values)) {
            message.warn('请录入一项查询条件(且只录入一项)进行搜索');
            return;
          }
          /*调用客户定位接口*/
          message.info('正在进行客户信息查询，请稍后。。。');
          const userInfoListData = await advisorQueryUserInfoList({
            appUserId: emptyToUndefined(values.appUserId),
            thUserId: emptyToUndefined(values.thUserId),
            userPhone: emptyToUndefined(values.mobileNo),
            userName: emptyToUndefined(values.customerName),
            certificateType: emptyToUndefined(values.certType),
            certificateNo: emptyToUndefined(values.certNo),
            source: emptyToUndefined(props?.source),
          });
          if (userInfoListData.length == 0) {
            message.warn('未查询到客户信息(可能非直销用户)！');
            props.afterSelectedUser();
            return;
          }
          /*如果客户定位接口查到两条及以上，则弹出选择客户框供客户选择*/
          if (userInfoListData.length > 1) {
            setSelectCustomerList(userInfoListData);
            setSelectCustomerVisit(true);
            return;
          }
          /*如果是一个客户，则直接传入用户数据给下游*/
          props.afterSelectedUser(userInfoListData[0]);
        }}
        style={{ backgroundColor: '#FFF', padding: '24px 12px 0px 12px' }}
      >
        <ProFormText name="customerName" label="客户姓名" />
        <ProFormText name="mobileNo" label="手机号码" />
        <ProFormText name="thUserId" label="客户编号" />
        <ProFormText name="appUserId" label="App-UserID" />
        <ProFormSelect name="certType" label="证件类型" showSearch options={certTypeOptions} />
        <ProFormText name="certNo" label="证件号码" />
      </QueryFilter>
    </>
  );
};

export default LocationCustomerInfo;
