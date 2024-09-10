import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Cascader } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import DetailModal from './DetailModal';
import { queryBankRegionInfo, divideRuleEnum, getBankVogRegion } from './service';
import type { TableListItem } from './service';
import useAuth from '@/components/Hooks/useAuth';
import NoPermissionCard from '@/components/NoPermissionCard';

// 一级分行信息列表
const BankRegionInfo = () => {
  const actionRef = useRef<ActionType>();
  const auth = useAuth({ sn: '_marketing_dataConfig_bankRegion' });
  const [isShowModal, setShowModal] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [treeData, setTreeData] = useState([]);

  const dataFn = useCallback((data) => {
    return data?.map((item: any) => ({
      label: item?.dictValue,
      value: item?.dictKey,
      children: dataFn(item?.subDict || []),
    }));
  }, []);

  useEffect(() => {
    getBankVogRegion().then((res) => {
      const data = [...res?.data, { dictValue: '未配置', dictKey: '-', subDict: [] }];
      const obj = dataFn(data);
      setTreeData(obj);
    });
  }, []);

  const handleShowModal = useCallback((values) => {
    setEditValues(values);
    setShowModal(true);
  }, []);

  const handleColse = useCallback((key) => {
    setShowModal(false);
    if (key === 'reload') {
      actionRef.current?.reload();
    }
  }, []);

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '渠道编码',
        dataIndex: 'agencyCode',
      },
      {
        title: '渠道名称',
        dataIndex: 'agencyName',
      },
      {
        title: '一级分行编码',
        dataIndex: 'firstBranchCode',
      },
      {
        title: '一级分行名称',
        dataIndex: 'firstBranchName',
      },
      {
        title: '银行所属区域',
        dataIndex: 'region',
        hideInSearch: true,
      },
      {
        title: '考核区域划分规则',
        dataIndex: 'divideRule',
        valueEnum: divideRuleEnum,
      },
      {
        title: '考核区域编码',
        dataIndex: 'vogRegion',
        renderFormItem: (item, { type }) => {
          if (type === 'form') {
            return null;
          }
          return <Cascader options={treeData} placeholder="请选择考核区域" />;
        },
      },
      {
        title: '考核区域',
        dataIndex: 'vogRegionName',
        hideInSearch: true,
      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
        hideInSearch: true,
        sorter: (a: any, b: any) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      },
      {
        title: '结束时间',
        dataIndex: 'endDate',
        hideInSearch: true,
        sorter: (a: any, b: any) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
      },
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal(record)}>
                考核区域配置
              </Button>
            </>
          );
        },
      },
    ];
  }, [treeData]);

  return (
    <ProCardPlus style={{ paddingTop: '4px' }} ghost gutter={[0, 8]} size="small">
      {auth ? (
        <>
          <ProTable<TableListItem>
            scroll={{ x: 'max-content' }}
            search={{ labelWidth: 120 }}
            size="small"
            actionRef={actionRef}
            rowKey="fundCode"
            request={async (params) => {
              const { current, pageSize, vogRegion } = params;
              const obj: any = {
                ...params,
                pageNo: current,
                pageSize: pageSize,
              };
              if (vogRegion) obj.vogRegion = vogRegion[vogRegion?.length - 1] || '';
              const result = await queryBankRegionInfo(obj);
              return {
                data: result.data || [],
                total: result.total || 0,
              };
            }}
            columns={columns}
            pagination={{ pageSize: 10 }}
          />
          <DetailModal visible={isShowModal} initValues={editValues} onClose={handleColse} />
        </>
      ) : (
        <NoPermissionCard />
      )}
    </ProCardPlus>
  );
};

export default BankRegionInfo;
