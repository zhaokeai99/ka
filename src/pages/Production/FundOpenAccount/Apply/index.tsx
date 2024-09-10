import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import IndexAddForm from './IndexAddForm';
import DebounceSelect from '@/components/DebounceSelect';
import {
  queryApplyList,
  cancelOpenAccountFlow,
  queryManagerByKeyword,
  queryAccountTypeEnumList,
} from './service';

const { confirm } = Modal;

type TableListItem = {
  id: string;
  fundId: string;
  fundCode: string;
  fundName: string;
  status: string;
  manager: string;
  productType: string;
  acctType: string;
  recordType: string;
};

// const accountType = {
//   BANK_ACCOUNT: '银行间户',
//   STOCK_ACCOUNT: '股东户',
// };

const FundOpenAccount: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [showAdd, setShowAdd] = useState(false); // 是否显示 新建浮窗
  const [info, setInfo] = useState<any>({}); // 浮窗详情 信息
  const [acctTypeOptions, setAcctTypeOptions] = useState<any>(); // 开户类型 枚举

  // 撤销申请
  const cancelApply = async (id: string) => {
    confirm({
      title: '确认要撤销该申请吗?',
      onOk: async () => {
        const result = await cancelOpenAccountFlow({ id });
        if (result) {
          message.success('撤销成功');
          actionRef.current?.reload();
          return;
        }
        message.error('撤销失败');
      },
    });
  };

  const handleColse = useCallback((key) => {
    setShowAdd(false);
    if (key === 'reload') {
      actionRef.current?.reload();
    }
  }, []);

  // 请求开户类型接口
  useEffect(() => {
    (async () => {
      const options = await queryAccountTypeEnumList();
      const optionsResult = (options || []).map((item: any) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
      setAcctTypeOptions(optionsResult);
    })();
  }, []);

  async function fetchList(keyword: string): Promise<any[]> {
    return queryManagerByKeyword({ keyword }).then((result: any) =>
      result.map((r: any) => ({
        value: r['manager'],
        label: r['manager'],
      })),
    );
  }

  const accountType = useCallback(
    (param: string) => {
      return (acctTypeOptions || []).find((item: any) => item.value === param)?.label || '--';
    },
    [acctTypeOptions],
  );

  const columns: ProColumns<TableListItem>[] = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'id',
        hideInTable: true,
        search: false,
      },
      {
        title: '基金代码',
        dataIndex: 'fundCode',
        fixed: 'left',
        width: 130,
        search: false,
        render: (text, item) => <a href={`#/production/index/detail/${item.fundId}`}>{text}</a>,
      },
      {
        title: '基金名称',
        dataIndex: 'fundName',
        fixed: 'left',
        width: 200,
        render: (text, item) => <a href={`#/production/index/detail/${item.fundId}`}>{text}</a>,
      },
      {
        title: '产品状态',
        dataIndex: 'fundState',
        valueType: 'select',
        valueEnum: {
          '0': { text: '待成立' },
          '1': { text: '募集期' },
          '2': { text: '存续中' },
        },
      },
      {
        title: '产品经理/项目经理',
        dataIndex: 'manager',
        valueType: 'select',
        renderFormItem: () => (
          <DebounceSelect
            showSearch
            placeholder="名称支持模糊搜索"
            fetchOptions={fetchList}
            allowClear
          />
        ),
      },
      {
        title: '产品类别',
        dataIndex: 'productType',
        search: false,
      },
      {
        title: '开户类别',
        dataIndex: 'acctType',
        search: false,
        render: (text: any) => <span>{accountType(text)}</span>,
      },
      {
        title: '开户状态',
        dataIndex: 'status',
        search: false,
      },
      {
        fixed: 'right',
        width: 180,
        title: '操作',
        dataIndex: '',
        valueType: 'option',
        render: (text: any, record: any) => {
          return [
            <a key="cancel" onClick={() => cancelApply(record?.id)}>
              撤销
            </a>,
            <a
              key="view"
              onClick={() => {
                setShowAdd(true);
                setInfo({
                  fundId: record?.fundId,
                  fundCode: record?.fundCode,
                  fundName: record?.fundName,
                  remark: record?.remark || '',
                  acctType: (acctTypeOptions || []).find(
                    (item: any) => item.value === record?.acctType,
                  ),
                });
              }}
            >
              查看
            </a>,
          ];
        },
      },
    ],
    [acctTypeOptions],
  );

  return (
    <ProCardPlus ghost style={{ padding: '12px' }}>
      {/* table列表 */}
      <ProTable<TableListItem>
        size="small"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 130,
        }}
        request={async (params) => {
          const { total, dataList } = await queryApplyList({
            ...params,
            manager: params?.manager?.value,
            keyword: params?.fundName,
            pageSize: params?.pageSize,
            pageNo: params?.current,
          });
          return {
            total,
            data: dataList,
          };
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 'max-content' }}
        options={{
          density: false,
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setShowAdd(true);
              setInfo({});
            }}
          >
            申请开户
          </Button>,
        ]}
      />
      {/* 新建表单浮窗 */}
      <IndexAddForm
        showAdd={showAdd}
        onClose={handleColse}
        info={info}
        acctTypeOptions={acctTypeOptions}
      />
    </ProCardPlus>
  );
};

export default FundOpenAccount;
