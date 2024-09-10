import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { ProFormInstance } from '@ant-design/pro-form';
import { Button, Popconfirm, message, Typography, Tabs } from 'antd';
import { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import DetailModal from './DetailModal';
import {
  queryPageIcons,
  deleteIcons,
  queryPageIconTypeDesc,
  queryPageIconSkipTypeDesc,
  updatePageIconOrder,
} from './service';
import type { TableListItem } from './service';
import useAuth from '@/components/Hooks/useAuth';
import NoPermissionCard from '@/components/NoPermissionCard';

const { Link } = Typography;
const { TabPane } = Tabs;

// 基金经理信息列表
const StrategyMeeting = () => {
  const actionRef = useRef<ActionType>();
  const auth = useAuth({ sn: '_marketing_staticResource' });
  const [isShowModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editValues, setEditValues] = useState({});
  const [currentData, setCurrentData] = useState<any>({});
  const [tabType, setTabType] = useState('0');
  const [dataSource, setDataSource] = useState([]);
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    actionRef.current?.reload();
  }, [tabType]);

  const handleShowModal = useCallback((type, values) => {
    setEditValues(values);
    setModalType(type);
    setShowModal(true);
  }, []);

  const handleColse = useCallback(
    (key, picType) => {
      setShowModal(false);
      if (key === 'reload') {
        if (tabType != picType) {
          setTabType(picType + '');
        } else {
          actionRef.current?.reload();
        }
      }
    },
    [tabType],
  );

  const handleDelete = useCallback(async ({ id, pictureType, pictureOrder }) => {
    const { success, errorMsg } = await deleteIcons({ id, pictureType, pictureOrder });
    if (success) {
      message.success('删除成功');
      actionRef.current?.reload();
    } else {
      message.error(errorMsg || '删除失败');
    }
  }, []);
  //调换顺序
  const changeOrderFn = useCallback(
    async (value) => {
      const params = {
        updateId: currentData?.id,
        targetId: value.order,
      };
      const result = await updatePageIconOrder(params);
      if (result.success) {
        setVisible(false);
        formRef.current?.resetFields();
        actionRef.current?.reload();
        message.success('排序成功');
      } else {
        message.error(result.errorMsg || '接口请求失败');
      }
    },
    [currentData],
  );

  const changeVisible = useCallback((record: any) => {
    setVisible(true);
    setCurrentData(record);
  }, []);

  const swipperColumns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '图片名称',
        width: 50,
        ellipsis: true,
        dataIndex: 'pictureDesc',
        hideInSearch: true,
      },
      {
        title: '图片',
        width: 30,
        dataIndex: 'pageStaticPath',
        hideInSearch: true,
        valueType: 'image',
      },
      {
        title: '图片类型',
        width: 30,
        dataIndex: 'pictureType',
        hideInSearch: true,
        valueType: 'select',
        request: async () => {
          return await queryPageIconTypeDesc();
        },
      },
      {
        title: '图片跳转地址',
        width: 50,
        dataIndex: 'skipUrl',
        render: (text, record) => {
          if (!record.skipUrl) {
            return '--';
          }
          return (
            <Link href={record.skipUrl} target="_blank" copyable={{ text: record.skipUrl }}>
              查看
            </Link>
          );
        },
      },
      {
        title: '图片跳转类型',
        width: 50,
        ellipsis: true,
        dataIndex: 'skipUrlType',
        valueType: 'select',
        request: async () => {
          return await queryPageIconSkipTypeDesc();
        },
        hideInSearch: true,
      },
      {
        title: '创建时间',
        width: 50,
        ellipsis: true,
        dataIndex: 'gmtCreate',
        hideInSearch: true,
      },
      {
        title: '修改时间',
        width: 50,
        ellipsis: true,
        dataIndex: 'gmtModified',
        hideInSearch: true,
      },
      {
        title: '操作',
        width: 80,
        key: 'option',
        valueType: 'option',
        render: (text: any, record: any) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal('edit', record)}>
                编辑
              </Button>
              <Button type="link" onClick={() => changeVisible(record)}>
                调换顺序
              </Button>
              <Popconfirm
                placement="topLeft"
                title={'删除后不可恢复，您确定要删除吗?'}
                onConfirm={() => {
                  handleDelete(record);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button type="text" danger>
                  删除{' '}
                </Button>
              </Popconfirm>
            </>
          );
        },
      },
    ];
  }, []);
  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '图片名称',
        width: 50,
        ellipsis: true,
        dataIndex: 'pictureDesc',
        hideInSearch: true,
      },
      {
        title: '图片',
        width: 30,
        dataIndex: 'pageStaticPath',
        hideInSearch: true,
        valueType: 'image',
      },
      {
        title: '图片类型',
        width: 30,
        dataIndex: 'pictureType',
        hideInSearch: true,
        valueType: 'select',
        request: async () => {
          return await queryPageIconTypeDesc();
        },
      },
      {
        title: '图片跳转地址',
        width: 50,
        dataIndex: 'skipUrl',
        render: (text, record) => {
          if (!record.skipUrl) {
            return '--';
          }
          return (
            <Link href={record.skipUrl} target="_blank" copyable={{ text: record.skipUrl }}>
              查看
            </Link>
          );
        },
      },
      {
        title: '是否热点',
        width: 30,
        ellipsis: true,
        render: (text, record) => {
          return record.hot ? '是' : '否';
        },
        hideInSearch: true,
      },
      {
        title: '图片跳转类型',
        width: 50,
        ellipsis: true,
        dataIndex: 'skipUrlType',
        valueType: 'select',
        request: async () => {
          return await queryPageIconSkipTypeDesc();
        },
        hideInSearch: true,
      },
      {
        title: '创建时间',
        width: 50,
        ellipsis: true,
        dataIndex: 'gmtCreate',
        hideInSearch: true,
        sorter: (a: any, b: any) =>
          new Date(a.gmtCreate).getTime() - new Date(b.gmtCreate).getTime(),
      },
      {
        title: '修改时间',
        width: 50,
        ellipsis: true,
        dataIndex: 'gmtModified',
        hideInSearch: true,
        sorter: (a: any, b: any) =>
          new Date(a.gmtModified).getTime() - new Date(b.gmtModified).getTime(),
      },
      {
        title: '操作',
        width: 80,
        key: 'option',
        valueType: 'option',
        render: (text: any, record: any) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal('edit', record)}>
                编辑
              </Button>
              <Button type="link" onClick={() => changeVisible(record)}>
                调换顺序
              </Button>
              <Popconfirm
                placement="topLeft"
                title={'删除后不可恢复，您确定要删除吗?'}
                onConfirm={() => {
                  handleDelete(record);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button type="text" danger>
                  删除{' '}
                </Button>
              </Popconfirm>
            </>
          );
        },
      },
    ];
  }, []);

  return (
    <ProCardPlus
      style={{ paddingTop: '4px', backgroundColor: '#FFF' }}
      ghost
      gutter={[0, 8]}
      size="small"
    >
      {auth ? (
        <>
          <Tabs
            size="small"
            activeKey={tabType}
            onChange={(key) => setTabType(key)}
            tabBarStyle={{ background: '#fff' }}
          >
            <TabPane key="0" tab="静态资源图标(金刚区)" />
            <TabPane key="1" tab="静态资源图标(轮播图)" />
          </Tabs>
          <ProTable<TableListItem>
            search={false}
            size="small"
            actionRef={actionRef}
            rowKey="id"
            request={async (params) => {
              const result = await queryPageIcons({
                currentPage: params.current,
                pageSize: params.pageSize,
              });
              const arr: any = [];
              result.forEach((item: any) => {
                arr.push(item?.pageStaticResourceBgVOList);
              });
              const data = tabType === '0' ? arr[0] : arr[1];
              setDataSource(data);
              return {
                data,
              };
            }}
            toolBarRender={() => [
              <Button
                key="add_button"
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => handleShowModal('add', {})}
              >
                新增
              </Button>,
            ]}
            columns={tabType === '1' ? swipperColumns : columns}
            pagination={{ pageSize: 10 }}
          />
          <DetailModal
            visible={isShowModal}
            modalType={modalType}
            initValues={editValues}
            onClose={handleColse}
          />
          <ModalForm
            visible={visible}
            width="450px"
            labelCol={{ span: 4 }}
            layout={'horizontal'}
            title="调换顺序"
            formRef={formRef}
            modalProps={{
              onCancel: () => {
                setVisible(false);
                formRef.current?.resetFields();
              },
            }}
            onFinish={changeOrderFn}
          >
            <ProFormSelect
              name="order"
              label="序号"
              options={dataSource.map((item: any) => {
                return { label: item.pictureOrder, value: item.id };
              })}
              placeholder="请选择序号"
              rules={[{ required: true }]}
            />
          </ModalForm>
        </>
      ) : (
        <NoPermissionCard />
      )}
    </ProCardPlus>
  );
};

export default StrategyMeeting;
