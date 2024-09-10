import ProCardPlus from '@/components/ProCardPlus';
import DataContent from '@/pages/Marketing/AdvisorCRM/DataContent';
import { contentPadding } from '@/themes';
import {
  ModalForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Descriptions, List, message, Modal, Space, Table } from 'antd';
import React, { useRef, useState } from 'react';
import styles from './../index.less';

import LocationCustomerInfo from '@/pages/Marketing/AdvisorCRM/components/LocationCustomerInfo';
import { emptyToUndefined, getDateWithPoint } from '@/pages/Marketing/AdvisorCRM/util';
import { qfw } from '@/utils/utils';
import { ProFormInstance } from '@ant-design/pro-form';
import moment from 'moment';
import {
  advisorQueryUserAssetsDetails,
  advisorQueryUserTransactionRecord,
  updateUserInformation,
  createPhoneTask,
  queryCustomerIsNoDisturb,
} from './service';
import { ExclamationCircleOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons';
import SmsTask from '@/pages/Marketing/AdvisorCRM/SmsTask';

const assetSummaryColumns: any[] = [
  {
    title: '资产市值',
    dataIndex: 'assetsMarketValue',
    width: '50%',
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },

  {
    title: '登记渠道',
    dataIndex: 'accountOpeningChannel',
    width: '50%',
  },
];
const assetDetailColumns: any[] = [
  {
    title: '基金代码',
    dataIndex: 'fundCode',
    width: '5%',
    search: false,
  },
  {
    title: '基金名称',
    dataIndex: 'fundName',
    width: '25%',
  },
  {
    title: '销售机构',
    dataIndex: 'agencyName',
    width: '10%',
  },
  {
    title: '持有金额',
    dataIndex: 'holdingAmount',
    width: '6%',
    search: false,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: '持有份额',
    dataIndex: 'holdingShare',
    width: '6%',
    search: false,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: '基金净值',
    dataIndex: 'fundNav',
    width: '10%',
    search: false,
    renderText: (text: any, record: any) => {
      return text + ' (' + getDateWithPoint(record?.navDate) + ')';
    },
  },
  {
    title: '最新收益',
    dataIndex: 'latestIncome',
    width: '10%',
    search: false,
    render: (text: any, record: any) => {
      if (!emptyToUndefined(record?.latestIncome)) {
        return <span>{'-'}</span>;
      }
      const color =
        record?.latestIncome == 0 ? '' : record?.latestIncome > 0 ? 'colorRed' : 'colorGreen';
      return (
        <>
          <span className={styles[color]}>{record?.latestIncome}</span>
          <span>{' (' + getDateWithPoint(record?.navDate) + ')'}</span>
        </>
      );
    },
  },
  {
    title: '持有收益',
    dataIndex: 'holdIncome',
    width: '10%',
    search: false,
    render: (text: any, record: any) => {
      if (!emptyToUndefined(record?.holdIncome)) {
        return <span>{'-'}</span>;
      }
      const color =
        record?.holdIncome == 0 ? '' : record?.holdIncome > 0 ? 'colorRed' : 'colorGreen';
      return (
        <>
          <span className={styles[color]}>{qfw(record?.holdIncome, '')}</span>
        </>
      );
    },
  },
  {
    title: '持有收益率',
    dataIndex: 'holdIncomeRate',
    width: '10%',
    search: false,
    render: (text: any, record: any) => {
      if (!emptyToUndefined(record?.holdIncomeRate)) {
        return <span>{'-'}</span>;
      }
      if (isNaN(parseFloat(record?.holdIncomeRate))) {
        return <span>{record?.holdIncomeRate}</span>;
      }
      const holdInComeRateNum = parseFloat(record?.holdIncomeRate);
      const color = holdInComeRateNum == 0 ? '' : holdInComeRateNum > 0 ? 'colorRed' : 'colorGreen';
      return (
        <>
          <span className={styles[color]}>{record?.holdIncomeRate}</span>
        </>
      );
    },
  },
  {
    title: '分红方式',
    dataIndex: 'dividendMethod',
    width: '8%',
    search: false,
  },
];

const tradeOrderColumns: any[] = [
  {
    title: '基金账号',
    dataIndex: 'taAccountId',
    width: '8%',
    search: false,
  },
  {
    title: '申请日期',
    dataIndex: 'applyDate',
    width: '5%',
    search: false,
  },
  {
    title: '确认日期',
    dataIndex: 'confirmDate',
    width: '5%',
    search: false,
  },
  {
    title: '确认日期',
    dataIndex: 'confirmDateRange',
    valueType: 'dateRange',
    hideInTable: true,
    initialValue: [moment().add(-30, 'day'), moment()],
  },
  {
    title: '基金代码',
    dataIndex: 'fundCode',
    width: '5%',
    search: false,
  },
  {
    title: '基金名称',
    dataIndex: 'fundName',
    width: '20%',
  },
  {
    title: '销售机构',
    dataIndex: 'agencyName',
    width: '10%',
  },
  {
    title: '业务',
    dataIndex: 'businessType',
    width: '10%',
    search: false,
  },
  {
    title: '确认金额',
    dataIndex: 'confirmAmount',
    width: '10%',
    search: false,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: '确认份额',
    dataIndex: 'confirmShare',
    width: '10%',
    search: false,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: '基金净值',
    dataIndex: 'fundNav',
    width: '5%',
    search: false,
  },
  {
    title: '交易账号',
    dataIndex: 'transactionAccountId',
    width: '12%',
    search: false,
  },
];

const CustomerQuery: React.FC<any> = () => {
  /*modal的显隐*/
  const [editUserAliasVisit, setEditUserAliasVisit] = useState<boolean>(false);
  const [editRemarksVisit, setEditRemarksVisit] = useState<boolean>(false);
  /*主要面板处理*/
  const [dataVisit, setDataVisit] = useState<boolean>(false);
  const [msgVisit, setMsgVisit] = useState<boolean>(false);
  /*客户信息*/
  const [customerInfo, setCustomerInfo] = useState<any>(undefined);
  const [remarks, setRemarks] = useState<any>([]);
  const [noDisturb, setNoDisturb] = useState<any>(false);
  const [noDisturbSMS, setNoDisturbSMS] = useState<any>(false);
  const [userAlias, setUserAlias] = useState<any>(undefined);
  /*资产明细累计最新收益率和持有收益率*/
  const [assetTotalLatestIncome, setAssetTotalLatestIncome] = useState<any>(undefined);
  const [assetTotalHoldIncome, setAssetTotalHoldIncome] = useState<any>(undefined);
  /*ref*/
  const editUserAliasFormRef = useRef<ProFormInstance>();
  const editRemarksFormRef = useRef<ProFormInstance>();

  const clearCustomerInfo = () => {
    setCustomerInfo(undefined);
    setRemarks([]);
    setNoDisturb(false);
    setNoDisturbSMS(false);
    setUserAlias(undefined);
    setDataVisit(false);
  };

  const afterQueryCustomerInfo = (_userInfo: any) => {
    /*如果查询到客户，显示客户信息*/
    if (_userInfo?.thUserId) {
      setCustomerInfo(_userInfo);
      setRemarks(_userInfo?.remarks ? _userInfo.remarks : []);
      setNoDisturb(_userInfo?.noDisturb === '0');
      setNoDisturbSMS(_userInfo?.noDisturbSMS === '0');
      setUserAlias(_userInfo?.userAlias);
      setDataVisit(true);
    } else {
      clearCustomerInfo();
    }
  };

  const editUserAliasShow = () => {
    setEditUserAliasVisit(true);
  };

  const editRemarksShow = () => {
    setEditRemarksVisit(true);
  };

  const createWhTask = () => {
    createPhoneTask({
      thUserId: [customerInfo?.thUserId],
      type: '2',
    }).then((isOk) => {
      if (isOk) {
        message.success('外呼任务创建成功！');
      } else {
        message.error('外呼任务创建失败，请联系管理员！');
      }
    });
  };

  const sendCallTask = () => {
    queryCustomerIsNoDisturb({
      thUserIds: [customerInfo?.thUserId],
    }).then((data) => {
      let phoneDisturb = false;
      if (data && data[0]?.isNoPhoneDisturb === '0') {
        phoneDisturb = true;
      }
      Modal.confirm({
        title: '提醒',
        content: '确定在外呼系统生成面向该客户的外呼任务?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          if (phoneDisturb) {
            Modal.confirm({
              title: '提醒',
              content: '该客户已被标记为“禁止电话”，是否确定创建外呼任务？',
              icon: <ExclamationCircleOutlined />,
              onOk() {
                createWhTask();
              },
            });
          } else {
            createWhTask();
          }
        },
      });
    });
  };

  return (
    <ProCardPlus
      sn={'_marketing_advisorCRM_customerQuery'}
      direction="column"
      style={{ padding: contentPadding }}
      ghost
      size="small"
      className={styles['crmSelfTable']}
    >
      <ModalForm
        title="别名变更"
        visible={editUserAliasVisit}
        formRef={editUserAliasFormRef}
        onFinish={async () => {
          const _fieldValues = editUserAliasFormRef.current?.getFieldsValue();
          const _userInfo = await updateUserInformation({
            userAlias: emptyToUndefined(_fieldValues?.userAlias),
            thUserId: emptyToUndefined(customerInfo?.thUserId),
          });
          setUserAlias(_userInfo?.userAlias);
          return true;
        }}
        onVisibleChange={setEditUserAliasVisit}
      >
        <ProFormText name="userAlias" initialValue={userAlias} label="别名：" />
      </ModalForm>
      <ModalForm
        title="备注信息"
        visible={editRemarksVisit}
        formRef={editRemarksFormRef}
        onFinish={async () => {
          const _fieldValues = editRemarksFormRef.current?.getFieldsValue();
          const _userInfo = await updateUserInformation({
            recordContent: emptyToUndefined(_fieldValues?.recordContent),
            noDisturb: emptyToUndefined(_fieldValues?.noDisturb),
            noDisturbSMS: emptyToUndefined(_fieldValues?.noDisturbSMS),
            thUserId: emptyToUndefined(customerInfo?.thUserId),
          });
          setRemarks(_userInfo?.remarks ? _userInfo.remarks : []);
          setNoDisturb(_userInfo?.noDisturb === '0');
          setNoDisturbSMS(_userInfo?.noDisturbSMS === '0');
          return true;
        }}
        onVisibleChange={setEditRemarksVisit}
      >
        <ProFormTextArea colProps={{ span: 24 }} name="recordContent" label="备注：" />
        <ProFormRadio.Group
          name="noDisturb"
          label="手机号码处<禁止电话>标识："
          radioType="radio"
          options={[
            {
              label: '打标识',
              value: '0',
            },
            {
              label: '取消标识',
              value: '1',
            },
          ]}
        />
        <ProFormRadio.Group
          name="noDisturbSMS"
          label="手机号码处<禁止短信>标识："
          radioType="radio"
          options={[
            {
              label: '打标识',
              value: '0',
            },
            {
              label: '取消标识',
              value: '1',
            },
          ]}
        />
        <List
          header={<div>已备注内容</div>}
          dataSource={remarks}
          renderItem={(item: any) => {
            return (
              <List.Item>
                {item?.createTime} {item?.recordContent}
              </List.Item>
            );
          }}
        />
      </ModalForm>
      <ModalForm
        title="短信触达"
        width={'1100px'}
        submitter={false}
        visible={msgVisit}
        onVisibleChange={setMsgVisit}
        modalProps={{
          centered: true,
          destroyOnClose: true,
        }}
      >
        <SmsTask thUserId={customerInfo?.thUserId} source={'2'} />
      </ModalForm>
      <LocationCustomerInfo
        afterSelectedUser={afterQueryCustomerInfo}
        resetEvent={clearCustomerInfo}
        source={'customerQuery'}
      />
      <DataContent dataVisit={dataVisit} noDataDesc="暂无数据！">
        <Descriptions
          labelStyle={{ width: '135px', textAlign: 'right', fontWeight: 'bold' }}
          contentStyle={{ width: '425px', textAlign: 'left' }}
          title="基本信息"
          bordered
          style={{ backgroundColor: '#FFF', padding: '24px', marginTop: '12px' }}
          size="small"
          extra={
            <Space>
              <Button type="primary" icon={<PhoneOutlined />} onClick={sendCallTask}>
                打电话
              </Button>
              <Button
                type="primary"
                icon={<MessageOutlined />}
                onClick={() => {
                  setMsgVisit(true);
                }}
              >
                发短信
              </Button>
            </Space>
          }
        >
          <Descriptions.Item label="姓名">
            {customerInfo?.customerNetWorthType === '0' ? (
              <>
                <span
                  className={styles['displayFlex']}
                  style={{
                    position: 'absolute',
                    marginTop: '-9px',
                  }}
                >
                  <a
                    style={{
                      color: 'rgb(96, 30, 34)',
                      fontSize: '30px',
                    }}
                  ></a>
                  <span className={styles['gjzFontStyle']}>高净值</span>
                </span>
                <span
                  style={{
                    fontWeight: 'bold',
                    marginLeft: '92px',
                  }}
                >
                  {customerInfo?.userName}
                </span>
              </>
            ) : (
              <span
                style={{
                  fontWeight: 'bold',
                }}
              >
                {customerInfo?.userName}
              </span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="别名">
            {userAlias ? userAlias : '无'}
            <Button
              style={{ marginLeft: '10px' }}
              size={'small'}
              type="primary"
              onClick={() => editUserAliasShow()}
            >
              别名变更
            </Button>
          </Descriptions.Item>
          <Descriptions.Item label="归属理财顾问">
            {customerInfo?.financialAdvisor ? customerInfo?.financialAdvisor : '无'}
          </Descriptions.Item>
          <Descriptions.Item label="客户编号" span={2}>
            {customerInfo?.thUserId}
          </Descriptions.Item>
          <Descriptions.Item label="appUserId">{customerInfo?.appUserId}</Descriptions.Item>
          <Descriptions.Item label="性别">{customerInfo?.sex}</Descriptions.Item>
          <Descriptions.Item label="生日">
            {getDateWithPoint(customerInfo?.birthday)}
          </Descriptions.Item>
          <Descriptions.Item label="手机号码">
            {
              /*{noDisturb ? (
              <>
                <StopOutlined
                  style={{
                    color: '#FF4D4F',
                    fontSize: '24px',
                    position: 'absolute',
                    marginTop: '-1px',
                    zIndex: 2,
                  }}
                />
                <PhoneOutlined
                    style={{
                      color: '#FF4D4F',
                      fontSize: '24px',
                      position: 'absolute',
                      marginTop: '-1px',
                      zIndex: 1
                    }}
                />
                <span
                  style={{
                    marginLeft: '32px',
                  }}
                >
                  {customerInfo?.mobileTelNo}
                </span>
              </>
            ) : (
              <span></span>
            )}*/
              customerInfo?.mobileTelNo +
                (noDisturb ? '(禁止电话)' : '') +
                (noDisturbSMS ? '(禁止短信)' : '')
            }
          </Descriptions.Item>
          <Descriptions.Item label="证件类型">{customerInfo?.certificateType}</Descriptions.Item>
          <Descriptions.Item label="证件号码">{customerInfo?.certificateNo}</Descriptions.Item>
          <Descriptions.Item label="电子邮箱">{customerInfo?.emailAddress}</Descriptions.Item>
          <Descriptions.Item label="客户类型">{customerInfo?.investorType}</Descriptions.Item>
          <Descriptions.Item label="客户等级">{customerInfo?.investorGrade}</Descriptions.Item>
          <Descriptions.Item label="邮编">{customerInfo?.postCode}</Descriptions.Item>
          <Descriptions.Item label="常用登录地">
            {customerInfo?.commonLoginAddress}
          </Descriptions.Item>
          <Descriptions.Item label="地址" span={3}>
            {customerInfo?.address}
          </Descriptions.Item>
          <Descriptions.Item label="备注" span={3}>
            <Button size={'small'} type="primary" onClick={() => editRemarksShow()}>
              备注
            </Button>
            <List
              dataSource={remarks}
              renderItem={(item: any) => {
                return (
                  <List.Item>
                    {item?.createTime} {item?.recordContent}
                  </List.Item>
                );
              }}
            />
          </Descriptions.Item>
        </Descriptions>
        <ProTable<any>
          headerTitle={'资产概览'}
          style={{
            backgroundColor: '#FFF',
            padding: '12px',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          }}
          bordered={true}
          columns={assetSummaryColumns}
          size={'small'}
          dataSource={customerInfo?.userAssetOverviewInfoList}
          rowKey={'accountOpeningChannel'}
          options={false}
          pagination={{
            hideOnSinglePage: true,
          }}
          search={false}
        />
        <ProTable<any>
          headerTitle={'资产明细'}
          style={{
            backgroundColor: '#FFF',
            padding: '0px 12px 12px 12px',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          }}
          bordered={true}
          columns={assetDetailColumns}
          size={'small'}
          params={{
            thUserId: customerInfo?.thUserId,
          }}
          request={async (params) => {
            const assetDetailResult = await advisorQueryUserAssetsDetails({
              fundName: emptyToUndefined(params?.fundName),
              agencyName: emptyToUndefined(params?.agencyName),
              thUserId: emptyToUndefined(params?.thUserId),
              pageNum: emptyToUndefined(params?.current),
              pageSize: emptyToUndefined(params?.pageSize),
            });
            setAssetTotalLatestIncome(assetDetailResult?.totalLatestIncome);
            setAssetTotalHoldIncome(assetDetailResult?.totalHoldIncome);
            return {
              data: assetDetailResult.userAssetDetailsList,
              total: assetDetailResult.total,
              success: true,
            };
          }}
          rowKey={'key'}
          options={false}
          revalidateOnFocus={false}
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: [10, 20, 50, 100],
            showSizeChanger: true,
          }}
          search={{
            filterType: 'light',
          }}
          summary={() => {
            return (
              <Table.Summary>
                <Table.Summary.Row>
                  {assetDetailColumns.map((c, i) => {
                    if (i == 6) {
                      if (!emptyToUndefined(assetTotalLatestIncome)) {
                        return (
                          <Table.Summary.Cell index={i}>
                            <span>{'累计：-'}</span>
                          </Table.Summary.Cell>
                        );
                      }
                      const color1 =
                        assetTotalLatestIncome == 0
                          ? ''
                          : assetTotalLatestIncome > 0
                          ? 'colorRed'
                          : 'colorGreen';
                      return (
                        <Table.Summary.Cell index={i}>
                          <span>{'累计：'}</span>
                          <span className={styles[color1]}>{assetTotalLatestIncome}</span>
                        </Table.Summary.Cell>
                      );
                    }
                    if (i == 7) {
                      if (!emptyToUndefined(assetTotalHoldIncome)) {
                        return (
                          <Table.Summary.Cell index={i}>
                            <span>{'累计：-'}</span>
                          </Table.Summary.Cell>
                        );
                      }
                      const color2 =
                        assetTotalHoldIncome == 0
                          ? ''
                          : assetTotalHoldIncome > 0
                          ? 'colorRed'
                          : 'colorGreen';
                      return (
                        <Table.Summary.Cell index={i}>
                          <span>{'累计：'}</span>
                          <span className={styles[color2]}>{assetTotalHoldIncome}</span>
                        </Table.Summary.Cell>
                      );
                    }
                    return <Table.Summary.Cell index={i}></Table.Summary.Cell>;
                  })}
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
        <ProTable<any>
          headerTitle={'交易记录'}
          style={{
            backgroundColor: '#FFF',
            padding: '0px 12px 12px 12px',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          }}
          bordered={true}
          columns={tradeOrderColumns}
          size={'small'}
          params={{
            thUserId: customerInfo?.thUserId,
          }}
          request={async (params: any) => {
            const confirmDateRange = params?.confirmDateRange;
            if (confirmDateRange) {
              const startDateTime = moment(confirmDateRange[0]).valueOf();
              const endDateTime = moment(confirmDateRange[1]).valueOf();
              if (endDateTime - startDateTime > 15552000000) {
                message.warn('确认日期的开始与结束日期差不能超过180天');
                return {
                  success: false,
                };
              }
            } else {
              message.warn('确认日期的开始与结束日期不能为空');
              return {
                success: false,
              };
            }
            const tradeOrderResult = await advisorQueryUserTransactionRecord({
              confirmDateStart: emptyToUndefined(moment(confirmDateRange[0]).format('YYYYMMDD')),
              confirmDateEnd: emptyToUndefined(moment(confirmDateRange[1]).format('YYYYMMDD')),
              fundName: emptyToUndefined(params?.fundName),
              agencyName: emptyToUndefined(params?.agencyName),
              thUserId: emptyToUndefined(params?.thUserId),
              pageNum: emptyToUndefined(params?.current),
              pageSize: emptyToUndefined(params?.pageSize),
            });
            return {
              data: tradeOrderResult.data,
              total: tradeOrderResult.total,
              success: true,
            };
          }}
          rowKey={'key'}
          options={false}
          revalidateOnFocus={false}
          pagination={{
            defaultPageSize: 30,
            pageSizeOptions: [30, 50, 75, 100],
            showSizeChanger: true,
          }}
          search={{
            filterType: 'light',
          }}
        />
      </DataContent>
    </ProCardPlus>
  );
};

export default CustomerQuery;
