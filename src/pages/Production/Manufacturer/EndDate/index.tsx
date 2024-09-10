import React, { useMemo, useRef, useState, useCallback } from 'react';
import { useModel } from 'umi';
import type { FormInstance } from 'antd';
import { message, Space, Switch, Dropdown, Menu } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { DownOutlined, ExportOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDatePicker, ProFormTextArea } from '@ant-design/pro-form';
import ProCardPlus from '@/components/ProCardPlus';
import useAuth from '@/components/Hooks/useAuth';
import type { EndDataItem } from './data';
import { dailyReportList, reminderNotification, expirationDate } from './service';
import moment from 'moment';

const EndDate: React.FC<{ history: any; location: any }> = () => {
  const { initialState } = useModel('@@initialState');
  const actionRef = useRef<any>();
  const formRef = useRef<FormInstance>();
  const modalFormRef = useRef<FormInstance>();
  const operateShow = useAuth({ sn: '_production_endDate__singleTable___operateButtons' });
  const [showModal, setShowModal] = useState(false);
  const [operateOptions, setOperateOptions] = useState({
    title: '',
    showEarlyStopDate: false,
    requiredActionRemark: false,
    operationEnum: '',
    id: '',
    actionRemark: '',
  });

  const operate = useCallback((params) => {
    setShowModal(true);
    modalFormRef?.current?.setFieldsValue({
      actionRemark: params.actionRemark,
      earlyStopDate: params.earlyStopDate,
    });
    setOperateOptions({
      ...params,
    });
  }, []);

  const columns: ProColumns<EndDataItem>[] = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'id',
        hideInTable: true,
        search: false,
      },
      {
        title: '产品名称',
        dataIndex: 'fundName',
        fixed: 'left',
        width: 200,
      },
      {
        title: '终止日期',
        dataIndex: 'endDate',
        search: false,
      },

      {
        title: '业务日期',
        dataIndex: 'bizDate',
        valueType: 'date',
        fieldProps: {
          disabledDate: (current: any) => current && current >= moment().endOf('day'),
        },
      },
      {
        title: '资产净值',
        dataIndex: 'assetsNav',
        search: false,
      },
      {
        title: '资产总值',
        dataIndex: 'assetsTotal',
        search: false,
      },
      {
        title: '杠杆率',
        dataIndex: 'leverRate',
        search: false,
      },
      {
        title: '单位净值',
        dataIndex: 'unitNav',
        search: false,
      },
      {
        title: '非现金资产',
        dataIndex: 'noCashAssets',
        search: false,
      },
      {
        title: '账户后续跟进',
        dataIndex: 'actionText',
        search: false,
        render: (text, record) =>
          record.earlyStopDate ? (
            <a target="_blank" href={record.skipUrl} rel="noopener noreferrer">
              {text}
              <ExportOutlined style={{ marginLeft: '5px' }} />
            </a>
          ) : (
            text
          ),
      },
      {
        title: '项目经理/经办人',
        dataIndex: '',
        search: false,
        render: (text, record) => `${record.projectManager} / ${record.projectOperator}`,
      },
      {
        title: '剩余期限不足',
        dataIndex: 'remainingPeriod',
        hideInTable: true,
        valueType: 'select',
        valueEnum: {
          '180': { text: '6个月' },
          '270': { text: '9个月' },
          '360': { text: '12个月' },
        },
      },
      {
        title: '终止日期',
        dataIndex: 'endDateInfo',
        hideInTable: true,
        valueType: 'dateRange',
        transform: (values: any) => ({
          startDate: values[0],
          endDate: values[1],
        }),
      },
      {
        fixed: 'right',
        width: 180,
        title: '操作',
        dataIndex: '',
        hideInTable: !operateShow,
        search: false,
        render: (text, record: any) => (
          <Space>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div>
                <div>
                  <Switch
                    disabled={!record.buttonState}
                    checkedChildren="个人通知"
                    unCheckedChildren="关闭"
                    checked={!!record.isNotify}
                    onClick={async () => {
                      if (!record.actionText) {
                        message.error('账户后续跟进为空，不能关闭通知！');
                      } else {
                        const result = await reminderNotification(record.id, 'DAILY');
                        if (result) {
                          actionRef.current.reload();
                        }
                      }
                    }}
                  />
                </div>
                <div style={{ marginTop: '5px' }}>
                  <Switch
                    disabled={!record.buttonState}
                    checkedChildren="群发通知"
                    unCheckedChildren="关闭"
                    checked={!!record.weeklyNotification}
                    onClick={async () => {
                      if (!record.actionText) {
                        message.error('账户后续跟进为空，不能关闭通知！');
                      } else {
                        const result = await reminderNotification(record.id, 'WEEKLY');
                        if (result) {
                          actionRef.current.reload();
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div style={{ marginLeft: '12px' }}>
                <Dropdown
                  disabled={!record.buttonState}
                  trigger={['click']}
                  overlay={
                    <Menu>
                      <Menu.Item key="success">
                        <a
                          onClick={() =>
                            operate({
                              title: '正常到期',
                              showEarlyStopDate: false,
                              requiredActionRemark: false,
                              operationEnum: 'Normal',
                              id: record.id,
                              actionRemark: record.actionRemark,
                            })
                          }
                        >
                          正常到期
                        </a>
                      </Menu.Item>
                      <Menu.Item key="forward">
                        <a
                          onClick={() =>
                            operate({
                              title: '提前终止',
                              showEarlyStopDate: true,
                              requiredActionRemark: false,
                              operationEnum: 'Early',
                              id: record.id,
                              actionRemark: record.actionRemark,
                              earlyStopDate: record.earlyStopDate,
                            })
                          }
                        >
                          提前终止
                        </a>
                      </Menu.Item>
                      <Menu.Item key="schedule">
                        <a
                          onClick={() =>
                            operate({
                              title: '计划展期',
                              showEarlyStopDate: false,
                              requiredActionRemark: false,
                              operationEnum: 'Delay',
                              id: record.id,
                              actionRemark: record.actionRemark,
                            })
                          }
                        >
                          计划展期
                        </a>
                      </Menu.Item>
                      <Menu.Item key="others">
                        <a
                          onClick={() =>
                            operate({
                              title: '其他说明',
                              showEarlyStopDate: false,
                              requiredActionRemark: false,
                              operationEnum: 'Other',
                              id: record.id,
                              actionRemark: record.actionRemark,
                            })
                          }
                        >
                          其他说明
                        </a>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <a className="ant-dropdown-link">
                    更多配置
                    <DownOutlined />
                  </a>
                </Dropdown>
              </div>
            </div>
          </Space>
        ),
      },
    ],
    [],
  );

  return (
    <ProCardPlus ghost style={{ padding: '12px' }} sn="_production_endDate__singleTable">
      <ProTable<EndDataItem>
        size="small"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={(params) => dailyReportList({ ...params, userName: initialState?.userName || '' })}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 'max-content' }}
        options={{
          density: false,
        }}
      />

      {/** 操作弹窗  */}
      <ModalForm
        formRef={modalFormRef}
        modalProps={{
          onCancel: () => {
            setShowModal(false);
            modalFormRef?.current?.resetFields();
          },
        }}
        labelCol={{ span: 4 }}
        layout={'horizontal'}
        visible={showModal}
        title={operateOptions.title}
        onFinish={async (values) => {
          const result = await expirationDate({
            ...values,
            operationEnum: operateOptions.operationEnum,
            id: operateOptions.id,
          });
          if (result) {
            message.info('设置成功');
            setShowModal(false);
            modalFormRef?.current?.resetFields();
            actionRef?.current?.reload();
          } else {
            message.error('设置失败！');
          }
        }}
      >
        {operateOptions.showEarlyStopDate ? (
          <ProFormDatePicker name="earlyStopDate" label="提前终止日期" />
        ) : null}
        <ProFormTextArea
          name="actionRemark"
          label="备注说明"
          placeholder="请输入备注说明"
          required={operateOptions.requiredActionRemark}
        />
      </ModalForm>
    </ProCardPlus>
  );
};

export default EndDate;
