import { useRef, useState } from 'react';
import { Button, Dropdown, message, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import { PlusOutlined } from '@ant-design/icons';
import ModalForm from './form';
import TestForm from './testForm';
import {
  getIndexNodeManageList, // 查看指标节点管理列表
  addIndexCalculationNodeInfo, // 新增指标指标节点
  changeIndexCalculationNodeInfo, // 修改指标节点
  deleteIndexNodeInfo, // 删除指标节点
  changeIndexNodePublishStatus, // 修改指标节点发布状态
  // addIndexGroupInfo, // 新增指标指标分组
  // calIndexNode, // 测试指标节点
  getIndexNodeInfoByType, // 查看指标节点信息
  // getPublishIndexNodeList, // 查看发布的指标节点列表
  // getIndexNodeResultList, // 查看指标节点结果列表
} from './service';

// 指标管理
const RiskIndexManagement = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [testShow, setTestShow] = useState(false);
  const [selectShow, setSelectShow] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const actionRef = useRef<any>();
  const formRef = useRef();

  const deletes = async (originCalculationId: string) => {
    const { success } = await deleteIndexNodeInfo({ originCalculationId });
    if (success) {
      message.success('删除成功');
      actionRef?.current?.reload();
    }
  };

  // 编辑
  const edits = async (originCalculationId: string) => {
    const { success, data } = await getIndexNodeInfoByType({
      originCalculationId,
      queryType: 'EDIT',
    });
    setShowEdit(true);
    if (success) {
      const result: any = [];
      const dimension: any = [];
      data?.calculationDataIndexList?.forEach((item: any) => {
        if (item.paramType === 'result') {
          result.push(item);
        } else {
          dimension.push(item);
        }
      });
      setEditData({
        ...data,
        result,
        dimension,
      });
    }
  };

  // 查看
  const inspects = async (originCalculationId: string) => {
    const { data } = await getIndexNodeInfoByType({ originCalculationId, queryType: 'SELECT' });
    if (data) {
      setEditData(data);
      setSelectShow(true);
    } else {
      message.warning('无发布的指标信息');
    }
  };

  // 发布
  const publishsStatus = async (originCalculationId: string, publishStatus: string) => {
    const res = await changeIndexNodePublishStatus({
      originCalculationId,
      publishStatus,
    });
    if (res.success) {
      message.success(publishStatus === 'OFFLINE' ? '下线成功' : '发布成功');
      actionRef?.current?.reload();
    } else {
      message.error(res.message);
    }
  };

  const tests = () => {
    setTestShow(true);
  };

  // 复制
  const handleCopy = async (originCalculationId: string) => {
    const { success, data } = await getIndexNodeInfoByType({
      originCalculationId,
      queryType: 'EDIT',
    });
    setShowCopy(true);
    if (success) {
      const result: any = [];
      const dimension: any = [];
      data?.calculationDataIndexList?.forEach((item: any) => {
        if (item.paramType === 'result') {
          result.push(item);
        } else {
          dimension.push(item);
        }
      });
      setEditData({
        ...data,
        result,
        dimension,
      });
    }
  };

  // 添加
  const addIndexManagement = async (value: any) => {
    const calculationDataIndexList: any = [];
    if (value.calculationType === 'source') {
      value?.result?.forEach((v: any) => {
        calculationDataIndexList.push({ ...v, paramType: 'result' });
      });
      value?.dimension?.forEach((v: any) => {
        calculationDataIndexList.push({ ...v, paramType: 'dimension' });
      });
      await addIndexCalculationNodeInfo({
        ...value,
        dataViewId: value.dataViewId.value[0],
        calculationDataIndexList,
        calculationDataResource: value?.dataViewId?.value[1],
      });
    } else {
      const indexCalculationFormulaReq = {
        ...value?.indexCalculationFormulaReq[0],
      };
      await addIndexCalculationNodeInfo({ ...value, indexCalculationFormulaReq });
    }
    actionRef?.current?.reload();
  };

  const columns: any = [
    {
      title: '',
      dataIndex: 'id',
      hideInTable: true,
      search: false,
    },
    {
      title: '指标名称',
      dataIndex: 'calculationName',
    },
    {
      title: '指标类型',
      dataIndex: 'calculationType',
      render: (item: string) => {
        return <span>{item === 'source' ? '取值' : '复合'}</span>;
      },
    },
    {
      title: '指标分组',
      dataIndex: 'calculationGroupName',
      search: false,
    },
    {
      title: '发布状态',
      dataIndex: 'publishStatus',
      render: (text: string) => <>{text === 'PUBLISH' ? '已发布' : '未发布'}</>,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      search: false,
    },
    {
      title: '修改人',
      dataIndex: '',
      search: false,
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      width: 400,
      search: false,
      render: (text: any, record: any) => (
        <div>
          <Popconfirm
            title="您确定要删除吗？"
            onConfirm={() => {
              deletes(record.originCalculationId);
            }}
            onCancel={() => {
              message.success('取消删除');
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
          <Button type="link" onClick={() => edits(record.originCalculationId)}>
            编辑
          </Button>
          <Button type="link" onClick={() => inspects(record.originCalculationId)}>
            查看
          </Button>
          <Button type="link" onClick={() => handleCopy(record.originCalculationId)}>
            复制
          </Button>
          <Popconfirm
            title="您确定要发布吗？"
            onConfirm={() => {
              publishsStatus(record.originCalculationId, 'PUBLISH');
            }}
            onCancel={() => {
              message.success('取消发布');
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link">发布</Button>
          </Popconfirm>
          <Dropdown
            menu={{
              items: [
                {
                  key: 1,
                  label: (
                    <Button type="link" onClick={() => tests()}>
                      测试
                    </Button>
                  ),
                },
                {
                  key: 2,
                  label: <Button type="link">创建任务</Button>,
                },
                {
                  key: 3,
                  label: <Button type="link">查看任务</Button>,
                },
                {
                  key: 4,
                  label: (
                    <Popconfirm
                      title="您确定要下线吗？"
                      onConfirm={() => {
                        publishsStatus(record.originCalculationId, 'OFFLINE');
                      }}
                      onCancel={() => {
                        message.success('取消下线');
                      }}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button type="link">下线</Button>
                    </Popconfirm>
                  ),
                },
                {
                  key: 5,
                  label: <Button type="link">查看依赖</Button>,
                },
              ],
            }}
          >
            <Button type="primary">更多...</Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <ProCardPlus ghost style={{ padding: '12px' }}>
      <ProTable
        size="small"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async (params: any) => await getIndexNodeManageList(params)}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 'max-content' }}
        options={{
          density: false,
        }}
        toolBarRender={() => [
          <Button key="new" type="primary" icon={<PlusOutlined />} onClick={() => setShowAdd(true)}>
            新建
          </Button>,
        ]}
      />

      {/** 新建表单 */}
      <ModalForm
        title="新增"
        type="add"
        visible={showAdd}
        onFinish={(value: any) => {
          addIndexManagement(value);
          setShowAdd(false);
        }}
        onVisibleChange={setShowAdd}
      />

      {/** 编辑表单 */}
      <ModalForm
        title="编辑"
        type="edit"
        visible={showEdit}
        initialValues={editData}
        onFinish={async (value: any) => {
          const calculationDataIndexList: any = [];
          if (value.calculationType === 'source') {
            if (value?.result?.length) {
              value?.result?.forEach((v: any) => {
                calculationDataIndexList.push({ ...v, paramType: 'result' });
              });
            }
            if (value?.dimension?.length) {
              value?.dimension?.forEach((v: any) => {
                calculationDataIndexList.push({ ...v, paramType: 'dimension' });
              });
            }

            const params = {
              ...value,
              dataViewId: value.dataViewId.value[0],
              calculationDataIndexList,
              calculationDataResource: value?.dataViewId?.value[1],
            };
            delete params.result;
            delete params.dimension;

            await changeIndexCalculationNodeInfo(params);
          } else {
            const params = {
              ...value,
              calculationId: editData?.calculationId,
              originCalculationId: editData?.originCalculationId,
              indexCalculationFormulaReq: {
                ...value?.indexCalculationFormulaReq[0],
              },
            };
            await changeIndexCalculationNodeInfo(params);
          }
          actionRef?.current?.reload();
          setShowEdit(false);
        }}
        onVisibleChange={setShowEdit}
      />

      {/* 查看禁止修改 */}
      <ModalForm
        title="查看"
        type="select"
        visible={selectShow}
        initialValues={editData}
        onFinish={() => {
          setShowEdit(false);
        }}
        onVisibleChange={setSelectShow}
      />

      {/** 复制表单 */}
      <ModalForm
        title="复制"
        type="copy"
        visible={showCopy}
        initialValues={editData}
        onFinish={(value: any) => {
          addIndexManagement(value);
          setShowCopy(false);
        }}
        onVisibleChange={setShowCopy}
      />

      {/* 测试表单 */}
      <TestForm visible={testShow} initialValues={{}} onVisibleChange={setTestShow} />
    </ProCardPlus>
  );
};

export default RiskIndexManagement;
