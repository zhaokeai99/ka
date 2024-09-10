import ProCardPlus from '@/components/ProCardPlus';
import LocationCustomerInfo from '@/pages/Marketing/AdvisorCRM/components/LocationCustomerInfo';
import DataContent from '@/pages/Marketing/AdvisorCRM/DataContent';
import { contentPadding } from '@/themes';
import { ProTable } from '@ant-design/pro-components';
import { Descriptions, message } from 'antd';
import React, { useState } from 'react';
import styles from './../index.less';
import { queryCustOwnershipInfo } from './service';

const ownerShipChangeHis: any[] = [
  {
    title: '变更时间',
    dataIndex: 'changeDate',
    width: '33%',
  },
  {
    title: '归属理财顾问姓名',
    dataIndex: 'financialAdvisor',
    width: '33%',
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    width: '33%',
  },
];

const CustomerBelongTo: React.FC<any> = () => {
  /*数据结果是否显示*/
  const [dataVisit, setDataVisit] = useState<boolean>(false);
  /*归属关系对象*/
  const [userInfo, setUserInfo] = useState<any>(undefined);
  const [customerOwnerShipInfo, setCustomerOwnerShipInfo] = useState<any>(undefined);

  const clearCustomerOwnerShipInfo = () => {
    setUserInfo(undefined);
    setCustomerOwnerShipInfo(undefined);
    setDataVisit(false);
  };

  const afterQueryCustomerInfo = async (_userInfo: any) => {
    /*如果查询到客户，显示客户信息*/
    if (_userInfo?.thUserId) {
      /*调用归属信息查询接口*/
      message.info('正在进行归属信息查询，请稍等。。。');
      const queryCustOwnerShipResult = await queryCustOwnershipInfo({
        thUserId: _userInfo?.thUserId,
      });
      if (!queryCustOwnerShipResult) {
        const alertMsg = '查询客户归属信息未返回正确结果！';
        message.warn(alertMsg);
        setDataVisit(false);
        return;
      }
      setUserInfo(_userInfo);
      setCustomerOwnerShipInfo(queryCustOwnerShipResult);
      setDataVisit(true);
    } else {
      clearCustomerOwnerShipInfo();
    }
  };
  return (
    <ProCardPlus
      sn={'_marketing_advisorCRM_customerBelongTo'}
      direction="column"
      style={{ padding: contentPadding }}
      ghost
      size="small"
      className={styles['crmSelfTable']}
    >
      <LocationCustomerInfo
        afterSelectedUser={afterQueryCustomerInfo}
        resetEvent={clearCustomerOwnerShipInfo}
        source={'customerBelongTo'}
      />
      <DataContent dataVisit={dataVisit} noDataDesc="暂无数据！">
        <Descriptions
          labelStyle={{ width: '120px', textAlign: 'right', fontWeight: 'bold' }}
          title="归属结果"
          bordered
          style={{ backgroundColor: '#FFF', padding: '24px 24px 0 24px', marginTop: '12px' }}
          size="small"
          column={1}
        >
          <Descriptions.Item label="姓名">{userInfo?.userName}</Descriptions.Item>
          <Descriptions.Item label="别名">
            {userInfo?.userAlias ? userInfo?.userAlias : '无'}
          </Descriptions.Item>
          <Descriptions.Item label="归属理财顾问">
            {customerOwnerShipInfo?.financialAdvisor
              ? customerOwnerShipInfo?.financialAdvisor
              : '无'}
          </Descriptions.Item>
        </Descriptions>
        <ProTable<any>
          headerTitle={'变更历史'}
          style={{ backgroundColor: '#FFF', padding: '24px 12px 24px 12px' }}
          bordered={true}
          columns={ownerShipChangeHis}
          size={'small'}
          dataSource={customerOwnerShipInfo?.ascriptionChangeHisList}
          rowKey={'changeDate'}
          options={false}
          pagination={{
            hideOnSinglePage: true,
          }}
          search={false}
        />
      </DataContent>
      {/*<Descriptions labelStyle={{width: "120px", textAlign: "right", fontWeight: "bold"}} title="批量变更客户归属"
                          column={1}
                          style={{backgroundColor: "#FFF", padding: "24px", marginTop: "12px"}}
                          size="small">
                <Descriptions.Item>下载模板</Descriptions.Item>
                <Descriptions.Item>上传客户归属信息变更文件</Descriptions.Item>
            </Descriptions>*/}
    </ProCardPlus>
  );
};

export default CustomerBelongTo;
