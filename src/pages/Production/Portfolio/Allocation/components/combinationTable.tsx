import React, { useRef, useState, useCallback, memo, useEffect, useMemo } from 'react';
import { Button, message, Space, Table, Popconfirm, Select } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { transOptions } from '@/utils/utils';
import ProTable from '@ant-design/pro-table';
import {
  saveUserManagerCompose,
  queryFundSelfDetails,
  resetTrackComposes,
  deleteUserManagerCompose,
  updateUserManagerCompose,
  saveTrackComposes,
  queryAssetUnitDropDownList,
} from '../service';
import CombinationAdd from './combinationAdd';
import CombinationConfig from './combinationConfig';
export type TableListItem = {
  composeId: string;
  composeName: string;
  fundManager: string;
  isSelect: number;
  unitId: number;
  unitName: string;
};
interface PropsType {
  records: any;
  drag: any;
  changeDrag: any;
}
const { Option } = Select;
const CombinationTable: React.FC<PropsType> = (props) => {
  const { records, drag, changeDrag } = props;
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalConfig, setIsModalConfig] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editObj, setEditObj] = useState<any>({});
  const actionRef = useRef<ActionType | undefined>();
  const [composeIds, setComposeIds] = useState<any[]>([]);
  const [optionList, setOptionList] = useState<any[]>([]);
  const [assetUnit, setAssetUnit] = useState<string>('');
  useEffect(() => {
    if (drag !== 0) {
      actionRef.current?.reload();
    }
  }, [drag]);
  const getOption = useCallback(async () => {
    const res: any = await queryAssetUnitDropDownList();
    if (res.success) {
      const optionData: any[] = transOptions(res.data || [], 'columnValue', 'columnCode');
      const assetUnitArr: any[] = res.data.filter((item: any) => item.isDefault === 1);
      setAssetUnit(assetUnitArr[0]?.columnCode || '');
      setOptionList(optionData);
    }
  }, []);
  useEffect(() => {
    getOption();
  }, []);
  const handleDelete = useCallback(async (composeId) => {
    setIsModalVisible(false);
    const res: any = await deleteUserManagerCompose({
      composeId,
    });
    if (res.success) {
      message.success('删除成功');
      actionRef.current?.reload();
      changeDrag();
    } else {
      message.error(res.errorMsg);
    }
  }, []);

  const handleAdd = useCallback(
    async (values: any) => {
      const { fundId, fundName, fundCode } = records;
      setIsModalVisible(false);
      const res: any = await saveUserManagerCompose({
        ...values,
        fundCode,
        fundId,
        fundName,
      });

      if (res.success) {
        message.success('添加成功');
        actionRef.current?.reload();
      } else {
        message.error(res.errorMsg);
      }
    },
    [records],
  );
  const handleEdit = useCallback(
    async (values: any) => {
      setIsModalVisible(false);
      setIsEdit(false);
      const res: any = await updateUserManagerCompose({
        ...values,
        composeId: editObj.composeId,
      });
      if (res.success) {
        message.success('修改成功');
        actionRef.current?.reload();
        changeDrag();
      } else {
        message.error(res.errorMsg);
      }
    },
    [editObj],
  );
  const handleReset = useCallback(async () => {
    const { fundId } = records;
    setIsModalVisible(false);
    const res: any = await resetTrackComposes({
      fundId,
    });
    if (res.success) {
      message.success('重置成功');
      actionRef.current?.reload();
      changeDrag();
    } else {
      message.error(res.errorMsg);
    }
  }, [records]);
  const handleConfig = useCallback(
    async (values: any) => {
      setIsModalConfig(false);
      const res: any = await saveTrackComposes({
        trackComposeList: [
          {
            ...values,
            composeIds: composeIds,
          },
        ],
        fundCode: records.fundCode,
        fundId: records.fundId,
      });
      if (res.success) {
        message.success('关联成功');
        actionRef.current?.reload();
        changeDrag();
      } else {
        message.error(res.errorMsg);
      }

      setComposeIds([]);
    },
    [composeIds, records],
  );
  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '组合代码',
        width: '20%',
        dataIndex: 'composeId',
      },
      {
        title: '组合名称',
        width: '20%',
        dataIndex: 'composeName',
      },
      {
        title: '组合经理',
        width: '20%',
        dataIndex: 'fundManager',
      },
      {
        title: '所属资产单元',
        width: '20%',
        dataIndex: 'unitName',
      },
      {
        title: '操作',
        key: 'option',
        width: '20%',
        render: (record: any) => [
          record.isSelect === 0 ? (
            <a
              style={{ marginRight: 8 }}
              onClick={() => {
                setIsModalConfig(true);
                setComposeIds([record.composeId]);
              }}
              key="config"
            >
              配置
            </a>
          ) : null,
          <a
            style={{ marginRight: 8 }}
            onClick={() => {
              setIsEdit(true);
              setEditObj(record);
              setIsModalVisible(true);
            }}
            key="edit"
          >
            编辑
          </a>,
          <Popconfirm
            placement="topLeft"
            title={'删除后不可恢复，您确定要删除吗?'}
            onConfirm={() => {
              handleDelete(record.composeId);
            }}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ marginRight: 8 }} key="delete">
              删除
            </a>
          </Popconfirm>,
        ],
      },
    ];
  }, [handleDelete]);

  return (
    <>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          getCheckboxProps: (record: any) => ({
            disabled: record.isSelect === 1,
          }),
          selectedRowKeys: composeIds,
          onChange: (selectedRowKeys: any[]) => {
            setComposeIds(selectedRowKeys);
          },
        }}
        tableAlertRender={({ selectedRowKeys }) => <span>已选 {selectedRowKeys.length} 项</span>}
        headerTitle={
          <Select
            value={assetUnit}
            onChange={(value: any) => {
              setAssetUnit(value);
            }}
            style={{ width: 150 }}
          >
            {optionList.map((item: any) => {
              return <Option value={item.value}>{item.label}</Option>;
            })}
          </Select>
        }
        tableAlertOptionRender={({ onCleanSelected }) => {
          return (
            <Space size={16}>
              <span>
                <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
                <a
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    setIsModalConfig(true);
                  }}
                >
                  批量配置
                </a>
              </span>
            </Space>
          );
        }}
        scroll={{ y: 250 }}
        pagination={{
          pageSize: 10,
        }}
        request={(params) => {
          const { fundId, fundCode } = records;
          return queryFundSelfDetails({ ...params, fundId, fundCode });
        }}
        options={{
          density: false,
        }}
        search={false}
        rowKey="composeId"
        toolBarRender={() => [
          <Button
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            新增
          </Button>,
          <Popconfirm
            placement="topLeft"
            title={'重置后不可恢复，您确定要重置吗?'}
            onConfirm={handleReset}
            okText="确定"
            cancelText="取消"
          >
            <Button>重置</Button>
          </Popconfirm>,
        ]}
      />
      <CombinationAdd
        visible={isModalVisible}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleCancel={() => {
          setIsModalVisible(false);
          setIsEdit(false);
          setEditObj({});
        }}
        editObj={editObj}
        isEdit={isEdit}
      />
      {isModalConfig && (
        <CombinationConfig
          visible={true}
          handleOk={handleConfig}
          handleCancel={() => {
            setIsModalConfig(false);
            setComposeIds([]);
          }}
          records={records}
        />
      )}
    </>
  );
};

export default memo(CombinationTable);
