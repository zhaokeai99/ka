import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, message, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import { queryProductInfoListForManage, updateProductInfo } from '../service';
import DetailModal from './DetailModal';

const New = () => {
  const [modalType, setModalType] = useState('');
  const actionRef = useRef<ActionType>();
  const [formVisible, setFormVisible] = useState(false);
  const [values, setValues] = useState<any>({});
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNo: 1,
    total: 0,
    showQuickJumper: true,
  });

  // 关闭
  const handleColse = (key?: string) => {
    setFormVisible(false);

    if (key === 'reload') {
      actionRef.current?.reload();
    }
  };

  // 修改
  const onChange = async (change: any, item: any) => {
    const { data } = await updateProductInfo({
      ...item,
      status: change,
    });
    if (data) {
      message.success('修改成功');
      handleColse('reload');
    } else {
      message.error('修改失败');
    }
  };

  const columns: any = [
    {
      title: '产品名称',
      dataIndex: 'fundName',
      ellipsis: true,
      key: 'fundName',
    },
    {
      title: '公司业务线',
      dataIndex: 'companyBusinessLine',
      key: 'companyBusinessLine',
      search: false,
    },
    {
      title: '产品类型',
      dataIndex: 'fundTypeLevel2',
      search: false,
      key: 'fundTypeLevel2',
    },
    {
      title: '基金经理',
      dataIndex: 'fundManager',
      search: false,
      key: 'fundManager',
    },
    {
      title: '产品经理',
      dataIndex: 'productManager',
      search: false,
      key: 'productManager',
    },
    {
      title: '托管行',
      dataIndex: 'trusteeBank',
      search: false,
      key: 'trusteeBank',
    },
    {
      title: '发起部门',
      dataIndex: 'launchDepartment',
      search: false,
      key: 'launchDepartment',
    },
    {
      title: '发起背景',
      dataIndex: 'launchBackground',
      search: false,
      key: 'launchBackground',
    },
    {
      title: '方案评估',
      dataIndex: 'programmeEvaluate',
      search: false,
      key: 'programmeEvaluate',
    },
    {
      title: '评估结果',
      search: false,
      dataIndex: 'evaluateResult',
      key: 'evaluateResult',
    },
    {
      title: '准备待报',
      dataIndex: 'planReport',
      search: false,
      key: 'planReport',
    },
    {
      title: '上报受理',
      search: false,
      dataIndex: 'reportDeal',
      key: 'reportDeal',
    },
    {
      title: '产品评审会',
      dataIndex: 'productEvaluateMeet',
      search: false,
      key: 'productEvaluateMeet',
    },
    {
      title: '一次反馈',
      dataIndex: 'feedback',
      search: false,
      key: 'feedback',
    },
    {
      title: '定稿待批',
      search: false,
      dataIndex: 'finalizeApprove',
      key: 'finalizeApprove',
    },
    {
      title: '批复待发',
      search: false,
      dataIndex: 'approveRelease',
      key: 'approveRelease',
    },
    {
      title: '发起档期',
      search: false,
      dataIndex: 'releaseSchedule',
      key: 'releaseSchedule',
    },
    {
      title: '操作',
      search: false,
      fixed: 'right',
      width: '60',
      align: 'center',
      render: (_v: any, item: any) => {
        return (
          <Button
            type="link"
            size="small"
            onClick={() => {
              setModalType('edit');
              setFormVisible(true);
              setValues(item);
            }}
          >
            修改
          </Button>
        );
      },
    },
    {
      title: '显示操作',
      dataIndex: 'status',
      key: 'status',
      fixed: 'right',
      align: 'center',
      width: '80',
      valueEnum: {
        1: { text: '显示' },
        0: { text: '不显示' },
      },
      render: (_v: any, item: any) => {
        return <Switch defaultChecked={item.status} onChange={(value) => onChange(value, item)} />;
      },
    },
  ];

  // 查询列表
  const queryProductInfo = async (params: any) => {
    const { data, success } = await queryProductInfoListForManage({
      fundName: params?.fundName,
      fundState: 'NEW',
      pageSize: params?.pageSize,
      pageNo: params?.current,
      status: params?.status,
    });
    const { dataList, total, pageNum } = data || {};
    if (success) {
      setPagination((pageParams) => ({
        ...pageParams,
        total,
        pageNo: pageNum,
      }));
    }
    return {
      data: dataList || [],
      success: true,
    };
  };
  return (
    <>
      <ProTable
        columns={columns}
        request={queryProductInfo}
        scroll={{ x: 'max-content' }}
        rowKey={'id'}
        actionRef={actionRef}
        options={false}
        search={{
          labelWidth: 'auto',
          optionRender: (searchConfig, formProps, dom) => [
            dom[1],
            <Button
              key="new"
              type="primary"
              onClick={() => {
                setFormVisible(true);
                setModalType('add');
              }}
            >
              新增
            </Button>,
            <Button type="primary">导入</Button>,
          ],
        }}
        pagination={pagination}
        form={{
          ignoreRules: false,
        }}
      />
      <DetailModal
        values={values}
        modalType={modalType}
        formVisible={formVisible}
        onClose={handleColse}
      />
    </>
  );
};

export default New;
