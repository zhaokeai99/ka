import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { contentPadding } from '@/themes';
import ProCardPlus from '@/components/ProCardPlus';
import { Button, message, Modal } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import {
  IrReportFacadeAuthUserManage,
  IrReportFacadeDeleteIrUserInfo,
  IrReportFacadeQueryIrUserInfoByPage,
  IrReportFacadeQuerySysAccount,
  irReportFacadeQuerySysConfigCode,
  TableListItem,
} from './service';
import EditForm from './edit';
import NoPermissionPage from '@/components/NoPermissionPage';
import lodash from 'lodash';

const { confirm } = Modal;

const IrUserManage = () => {
  const actionRef = useRef<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [pass, setPass] = useState<boolean | undefined>(undefined);
  const [initValue, setInitValue] = useState<any>({});
  const [modalType, setModalType] = useState<any>(undefined);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [dicUserInfo, setDicUserInfo] = useState<any>([]);
  const [userMenuDic, setUserMenuDic] = useState<any>([]);

  const request = async (params: any, sort?: any) => {
    const fmtParams = {
      accountNameLike: params.accountName,
      userNameLike: params.userName,
      wechatIdLike: params.wechatId,
      wechatNameLike: params.wechatName,
      role: params.role,
      tenantId: params.tenantId,
      sortField: 'accountName',
      sortOrder: 'asc',
      current: params.current,
      pageSize: params.pageSize,
      menu: params.searchMenu,
    };

    // 排序
    if (JSON.stringify(sort) != '{}') {
      const [[key, value]] = Object.entries(sort);
      fmtParams.sortField = key;
      if (value === 'descend') {
        fmtParams.sortOrder = 'desc';
      } else if (value === 'ascend') {
        fmtParams.sortOrder = 'asc';
      }
    }

    const result = await IrReportFacadeQueryIrUserInfoByPage(fmtParams);

    const { data = [], current, pageSize, pages, total } = result || {};

    if (JSON.stringify(result) !== '{}') {
      return {
        data,
        current,
        pageSize,
        pages,
        total,
        success: true,
      };
    }

    return {
      data: [],
      success: true,
    };
  };

  const dicLoad = async () => {
    const resultData = await irReportFacadeQuerySysConfigCode({ typeCode: 'IR_USER_MENU' });
    setUserMenuDic(resultData);
  };

  const authUser = async () => {
    setLoading(true);
    const data = await IrReportFacadeAuthUserManage({ roles: ['admin'] });
    setPass(data);
    setLoading(false);
  };

  const loadAccount = async () => {
    const data = await IrReportFacadeQuerySysAccount();
    if (data) {
      setDicUserInfo(data);
    }
  };

  const getAuthFail = () => {
    return <NoPermissionPage />;
  };

  useEffect(() => {
    dicLoad();
    authUser();
    loadAccount();
  }, []);

  const handleEdit = (row: any) => {
    setFormVisible(true);
    setModalType('edit');
    setInitValue(row);
  };

  const handleDelete = async (row: any) => {
    confirm({
      title: '删除',
      content: '确认删除该记录吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const params = { id: row.id };
        const data = await IrReportFacadeDeleteIrUserInfo(params);
        if (data && data > 0) {
          message.success('删除成功!');
          actionRef?.current?.reload();
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleShowModal = (type: string, values: any) => {
    setFormVisible(true);
    setModalType(type);
    setInitValue(values);
  };

  const getMenuSearch = (val: any) => {
    const obj = {};
    val.forEach((d: any) => {
      obj[d.code] = { text: d.name };
    });
    return obj;
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '域账号',
        ellipsis: true,
        dataIndex: 'accountName',
        fieldProps: { showSearch: true },
        width: 100,
        sorter: true,
      },
      {
        title: '域名称',
        ellipsis: true,
        dataIndex: 'userName',
        fieldProps: { showSearch: true },
        width: 100,
        sorter: true,
      },
      {
        title: '微信id',
        ellipsis: true,
        dataIndex: 'wechatId',
        fieldProps: { showSearch: true },
        width: 200,
      },
      {
        title: '业务类型',
        ellipsis: true,
        dataIndex: 'tenantId',
        fieldProps: { showSearch: true },
        valueEnum: { '0': { text: '全部' }, '1': { text: '固收' }, '2': { text: '股票' } },
        width: 100,
        sorter: true,
      },
      {
        title: '角色',
        ellipsis: true,
        dataIndex: 'role',
        valueEnum: { admin: { text: '管理员' }, invest: { text: '投资' } },
        width: 100,
        sorter: true,
      },
      {
        title: '排序',
        dataIndex: 'orderNo',
        width: 100,
        sorter: true,
      },
      {
        title: '菜单',
        dataIndex: 'menus',
        render: (text) => {
          if (text?.length > 0) {
            const result = text.map((m: any) => {
              const obj = lodash.find(userMenuDic, { code: m });
              return obj?.name;
            });
            return result?.join(',');
          }
          return '';
        },
        width: 200,
      },
      {
        title: '菜单',
        dataIndex: 'searchMenu',
        valueEnum: getMenuSearch(userMenuDic),
        hideInTable: true,
      },
      {
        title: '创建时间',
        ellipsis: true,
        dataIndex: 'createTime',
        valueType: 'dateTime',
        hideInSearch: true,
        width: 100,
      },
      {
        title: '操作',
        valueType: 'option',
        ellipsis: true,
        render: (text, record) => [
          <a
            key={'edit'}
            onClick={() => {
              handleEdit(record);
            }}
          >
            {' '}
            编辑{' '}
          </a>,
          <a
            key={'delete'}
            onClick={() => {
              handleDelete(record);
            }}
          >
            {' '}
            删除{' '}
          </a>,
        ],
        width: 100,
      },
    ];
  }, [userMenuDic]);

  const formClose = () => {
    setFormVisible(false);
    setInitValue({});
    actionRef.current.reload();
  };
  return (
    <>
      {pass !== undefined && pass === false ? (
        getAuthFail()
      ) : (
        <ProCardPlus
          ghost
          style={{ padding: contentPadding }}
          split={'horizontal'}
          size="small"
          loading={loading}
        >
          <ProTable
            headerTitle={'用户管理'}
            rowKey={'id'}
            size="small"
            actionRef={actionRef}
            search={{ labelWidth: 'auto' }}
            toolBarRender={() => [
              <Button
                key="add_button"
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => handleShowModal('add', {})}
              >
                创建用户
              </Button>,
            ]}
            request={request}
            columns={columns}
            pagination={{ current: 1, pageSize: 10 }}
            options={{ density: false }}
          />
        </ProCardPlus>
      )}
      <EditForm
        visible={formVisible}
        modalType={modalType}
        initValues={initValue}
        onClose={formClose}
        dic={{ user: dicUserInfo, menu: userMenuDic }}
      />
    </>
  );
};

export default memo(IrUserManage);
