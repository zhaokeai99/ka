import DebounceSelect from '@/components/DebounceSelect';
import { cardGutter, contentPadding } from '@/themes';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import type { FormInstance } from 'antd';
import { Descriptions } from 'antd';
import { Button, Input, message, Modal, Popconfirm, Select, Space, Switch, Table } from 'antd';
import { map as _map } from 'lodash';
import type { MutableRefObject } from 'react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import type { IndexRaisereportItem } from './data';
import useAuth from '@/components/Hooks/useAuth';
import FocusOn from './FocusOn';
import {
  batchExportByFundIds,
  batchExportByFundCodes,
  checkInvalidExportFunds,
  invalidFundParam,
  queryByKeyword,
  queryFundParamVersionList,
  queryPublicProductInfoList,
  queryExportFundParamInfo,
} from './service';
import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;
let timer: any = null;

const ParameterTable: React.FC = () => {
  const { listen, unListen } = useContext(TabLayoutContext);
  const tableFormRef: MutableRefObject<FormInstance | undefined> = useRef();
  const actionRef = useRef<ActionType>();
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>(['']);
  // const [searchValue, setSearchValue] = useState('');
  const [isFocus, setIsFocus] = useState<boolean>(false);
  // TODO 暂时注释掉批量导出功能
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [childTable, setChildTable] = useState([]);
  // const [exporting, setExporting] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [areaValue, setAreaValue] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [downloadByCodes, setDownloadByCodes] = useState(false);
  const isFundOperation = useAuth({ sn: '_production_parameter_table__operations' });
  const [exportFundParamInfoLoading, setExportFundParamInfoLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  //
  const exportSingle = async (
    batchFunc: (param: any) => Promise<any>,
    params: {
      fundIds?: string[];
      fundCodes?: string[];
    },
    setDownload?: (param: any) => void,
  ) => {
    if (timer) {
      return;
    }
    message.info('正在生成导出文件，请稍后...');
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setDownload && setDownload(true);

    // 异步操作检查是否有效
    checkInvalidExportFunds(params).then((data) => {
      if (data.length) {
        Modal.warning({
          title: '以下产品无生效的参数表，请知悉。',
          content: data.map((d: any) => <div key={d}>{d}</div>),
        });
      }
    });

    const fetchExportData = async () => {
      const result = await batchFunc(params);
      const { status, zipUrl } = result;
      if (status === 'success') {
        timer = null;
        clearTimeout(timer);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        setDownload && setDownload(false);
        if (zipUrl) {
          window.open(zipUrl);
        }
      } else if (status === 'wait') {
        timer = setTimeout(() => {
          fetchExportData();
        }, 3000);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        setDownload && setDownload(false);
        message.warn('导出异常!', 4);
        timer = null;
      }
    };
    fetchExportData();
  };

  // 根据fundCodes导出
  const handleOk = () => {
    exportSingle(batchExportByFundCodes, { fundCodes: areaValue }, setDownloadByCodes);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 新开编辑页
  const openConfigPage = (fundId: string, actionType: string, id?: string) => {
    history.push(
      `/production/setting/parameterConfig/${fundId}/${actionType}${id ? `/${id}` : ''}`,
    );
    return;
  };

  // table提交
  const handleChangeVal = () => tableFormRef?.current?.submit();

  // 获取子表单数据
  const getChildProductInfoList = async ({ id }: { id: string }) => {
    const { data } = await queryFundParamVersionList({
      fundId: id,
      pageSize: 500, // 二级table不做分页，所以暂时写死500
      pageNo: 1,
    });

    setChildTable(data || []);
  };

  // 点击查看参数表按钮
  const handleClick = async (id: any) => {
    // 如果是当前以打开的，则关闭。否则关闭其他打开当前
    if (expandedRowKeys?.includes(id)) {
      setExpandedRowKeys(['']);

      return;
    }

    setExpandedRowKeys([id]);

    // 请求二级table的内容，获取版本列表
    if (id) {
      await getChildProductInfoList({ id });
    }
  };

  // 失效
  const onRemove = async (id: string, fundId: string) => {
    const { success } = await invalidFundParam({ id });
    if (success) {
      message.success('删除成功');
      getChildProductInfoList({ id: fundId });
    }
  };

  // 我关注的
  const onChange = (checked: boolean) => {
    setIsFocus(checked);
    handleChangeVal();
  };

  // 多选导出
  const onSelectionChange = (values: any[]) => {
    setSelectedRowKeys(values);
  };

  // 列表数据
  const requestTableList = async (params: any) => {
    setLoading(true);
    setSelectedRowKeys([]);
    const result = await queryPublicProductInfoList({
      ...params,
      fundIds: _map(params?.fundIds, 'value'),
      myFocus: isFocus,
      pageNo: params?.current,
      pageSize: 0,
    });
    setLoading(false);
    setPagination({
      current: result.pageNum,
      pageSize: result.pageSize,
    });

    return result;
  };

  // 全量导出参数表数据
  const exportFundParamInfoClick = async () => {
    setExportFundParamInfoLoading(true);
    const { success, data } = await queryExportFundParamInfo();
    if (success) window.open(data);
    setExportFundParamInfoLoading(false);
  };

  useEffect(() => {
    listen('PARAMETERCONFIG', getChildProductInfoList);

    return () => {
      // timer = null;
      unListen('PARAMETERCONFIG', getChildProductInfoList);
    };
  }, []);

  // 一级table的表头
  const parentColumns: ProColumns<IndexRaisereportItem>[] = [
    {
      title: '产品代码',
      dataIndex: 'fundCode',
      key: 'fundCode',
      width: '80px',
      render: (text, item) => <a href={`#/production/index/detail/${item.id}`}>{text}</a>,
      hideInSearch: true,
    },
    {
      title: '基金名称',
      hideInTable: true,
      dataIndex: 'fundIds',
      key: 'fundIds',
      renderFormItem: () => (
        <DebounceSelect
          showSearch
          placeholder="名称、代码支持模糊搜索"
          fetchOptions={queryByKeyword}
          mode="multiple"
          allowClear
        />
      ),
    },
    {
      title: '参数状态',
      dataIndex: 'statusList',
      hideInTable: true,
      renderFormItem: (_, fieldConfig: any) => {
        if (fieldConfig.type === 'form') {
          return null;
        }

        return (
          <Select
            mode="multiple"
            showSearch={false}
            placeholder="请选择-支持多选"
            maxTagCount="responsive"
          >
            <Option value={0}>已提交</Option>
            <Option value={1}>已生效</Option>
            <Option value={2}>将生效</Option>
            <Option value={-2}>草稿</Option>
          </Select>
        );
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            updateTimeBegin: value[0],
            updateTimeEnd: value[1],
          };
        },
      },
    },
    {
      title: '生效日期',
      dataIndex: 'effectDate',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            effectDateBegin: value[0],
            updateDateEnd: value[1],
          };
        },
      },
    },
    {
      title: '产品名称',
      dataIndex: 'fundName',
      key: 'fundName',
      hideInSearch: true,
      render: (text, item) => <a href={`#/production/index/detail/${item.id}`}>{text}</a>,
    },
    {
      title: '产品状态',
      dataIndex: 'status',
      key: 'status',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      // sorter: true,
      hideInSearch: true,
    },
    {
      title: '产品经理',
      dataIndex: 'productManager',
      key: 'productManager',
      hideInSearch: true,
    },
    {
      title: '基金经理',
      hideInSearch: true,
      dataIndex: 'fundManager',
      key: 'fundManager',
    },
    {
      title: '公司业务线',
      hideInSearch: true,
      key: 'businessLine',
      dataIndex: 'businessLine',
    },
    {
      title: '加入关注',
      hideInSearch: true,
      dataIndex: 'focus	',
      key: 'focus	',
      align: 'center',
      render: (_: any, v: any) => (
        <FocusOn fundId={v.id} isFocus={v.focus} onRefresh={() => handleChangeVal()} />
      ),
    },
    {
      title: '操作',
      width: isFundOperation ? 120 : 70,
      hideInSearch: true,
      fixed: 'right',
      render: (_: any, record: { id: any; childList: any }) => (
        <Space size={20}>
          <a
            onClick={() => handleClick(record?.id)}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {expandedRowKeys[0] === record.id ? (
              <>
                收起
                <UpOutlined style={{ marginLeft: '5px' }} />
              </>
            ) : (
              <>
                展开
                <DownOutlined style={{ marginLeft: '5px' }} />
              </>
            )}
          </a>
          {isFundOperation && <a onClick={() => openConfigPage(record?.id, 'add')}>新增</a>}
        </Space>
      ),
    },
  ];

  // 二级table的表头
  const childColumn: any = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '生效日期',
      dataIndex: 'effectiveTime',
    },
    {
      title: '当前状态',
      dataIndex: 'status',
    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
    },
    {
      title: '操作',
      width: isFundOperation ? 150 : 60,
      hideInSearch: true,
      render: (_, { status, fundId, id }: any) => (
        <Space size={20}>
          <a onClick={() => openConfigPage(fundId, 'read', id)}>查看</a>
          {isFundOperation && status !== '已生效' && status !== '将生效' && (
            <a onClick={() => openConfigPage(fundId, 'edit', id)}>编辑</a>
          )}
          {isFundOperation && (status === '已生效' || status === '将生效') && (
            <a onClick={() => openConfigPage(fundId, 'copy', id)}>复制</a>
          )}
          {isFundOperation && (
            <Popconfirm
              title={`请您确认，是否删除该条记录?`}
              onConfirm={() => onRemove(id, fundId)}
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 二级表单
  const expandedRowRender = () => (
    <ProTable
      rowKey="id"
      headerTitle={false}
      search={false}
      options={false}
      pagination={false}
      columns={childColumn}
      dataSource={childTable}
    />
  );

  return (
    <ProCard style={{ padding: contentPadding }} ghost size="small" gutter={[0, cardGutter]}>
      <ProTable<IndexRaisereportItem>
        rowKey="id"
        size="small"
        actionRef={actionRef}
        formRef={tableFormRef}
        expandIconColumnIndex={-1} // 去除表格body里的+号
        expandable={{
          expandedRowRender, // 子表格dom部分
          expandedRowKeys, // 展开的行，控制属性State的变量
        }}
        headerTitle={
          <span className={styles.taparameterTableTitleSpan}>
            暂不适用以下销售商：天弘直销、招赢通、兴业钱大掌柜。如需相关参数表，请联系注册登记会计
          </span>
        }
        toolBarRender={() => [
          <Button
            key="textarea"
            style={{ borderRadius: '15px' }}
            onClick={showModal}
            loading={downloadByCodes}
          >
            输入代码 批量导出
          </Button>,
          <Modal
            key="modal"
            title="输入代码 批量导出"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Descriptions>
              <Descriptions.Item label="填写说明">
                仅填写基金代码即可。每个基金代码一行，无需符号分隔
              </Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item label="填写样例 ">
                420001
                <br />
                420002
                <br />
                420003
                <br />
                420004
                <br />
                420005
                <br />
                420006
                <br />
              </Descriptions.Item>
              <Descriptions.Item>
                <TextArea
                  rows={6}
                  onChange={(e) => {
                    setAreaValue(e.target.value.split(/[(\r\n)\r\n]+/));
                  }}
                />
              </Descriptions.Item>
            </Descriptions>
          </Modal>,
          <Switch
            key="focusSwitch"
            checkedChildren="我关注的"
            unCheckedChildren="我关注的"
            defaultChecked={false}
            checked={isFocus}
            onChange={onChange}
          />,
        ]}
        rowSelection={{
          selectedRowKeys,
          preserveSelectedRowKeys: true,
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
          onChange: onSelectionChange,
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a onClick={() => exportSingle(batchExportByFundIds, { fundIds: selectedRowKeys })}>
                批量导出
              </a>
            </Space>
          );
        }}
        request={requestTableList}
        columns={parentColumns}
        pagination={pagination}
        loading={loading}
        scroll={{ x: 'max-content' }}
        options={false}
      />
      <div
        style={{
          width: '100%',
          backgroundColor: '#fff',
          textAlign: 'right',
          padding: '0 10px 10px 0',
        }}
      >
        <Button
          type="primary"
          onClick={exportFundParamInfoClick}
          loading={exportFundParamInfoLoading}
        >
          全量导出参数表数据
        </Button>
      </div>
    </ProCard>
  );
};

export default ParameterTable;
