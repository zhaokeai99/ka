import React, { useRef, useState, useCallback, memo, useEffect, useMemo } from 'react';
import { Button, message, Tag, Popconfirm } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  saveNewTrackName,
  queryTrackComposeList,
  deleteTrack,
  deleteComposeTrackConfig,
} from '../service';
import TrackAdd from './trackAdd';
import TrackConfig from './trackConfig';
export type TableListItem = {
  trackId: number;
  trackName: string;
  userComposeList: any[];
};
interface PropsType {
  records: any;
  drag: any;
  changeDrag: any;
}
const TrackTable: React.FC<PropsType> = (props) => {
  const { drag, changeDrag, records } = props;
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalConfig, setIsModalConfig] = useState<boolean>(false);
  const [editObj, setEditObj] = useState<any>({});
  const actionRef = useRef<ActionType | undefined>();
  useEffect(() => {
    if (drag !== 0) {
      actionRef.current?.reload();
    }
  }, [drag]);
  const handleAdd = useCallback(async (values: any) => {
    setIsModalVisible(false);
    const res: any = await saveNewTrackName({
      ...values,
    });
    if (res.success) {
      message.success('添加成功');
      actionRef.current?.reload();
    } else {
      message.error(res.errorMsg);
    }
  }, []);
  const handleConfig = useCallback(
    async (values: any) => {
      setIsModalConfig(false);
      const res: any = await deleteComposeTrackConfig({
        ...values,
        trackId: editObj.trackId,
        fundCode: records.fundCode,
        fundId: records.fundId,
      });
      if (res.success) {
        message.success('删除成功');
        actionRef.current?.reload();
        changeDrag();
      } else {
        message.error(res.errorMsg);
      }
    },
    [editObj, changeDrag, records],
  );
  const handleDelete = useCallback(
    async (trackId) => {
      const res: any = await deleteTrack({
        trackId,
      });
      if (res.success) {
        message.success('删除成功');
        actionRef.current?.reload();
        changeDrag();
      } else {
        message.error(res.errorMsg);
      }
    },
    [changeDrag],
  );
  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '',
        dataIndex: 'trackId',
        hideInTable: true,
        search: false,
      },
      {
        title: '赛道名称',
        width: '20%',
        dataIndex: 'trackName',
      },
      {
        title: '组合名称',
        width: '60%',
        dataIndex: 'userComposeList',
        render: (list: any) => {
          if (list.length === 0) {
            return '--';
          }
          return list.map((item: any) => {
            return (
              <Tag key={item.composeId} color="blue">
                {item.composeName}
              </Tag>
            );
          });
        },
      },
      {
        title: '操作',
        key: 'option',
        width: '20%',
        render: (record: any) => [
          record.userComposeList && record.userComposeList.length > 0 ? (
            <Button
              size="small"
              type="primary"
              style={{ marginRight: 10 }}
              onClick={() => {
                setEditObj(record);
                setIsModalConfig(true);
              }}
            >
              删除组合
            </Button>
          ) : null,
          <Popconfirm
            placement="topLeft"
            title={'删除后不可恢复，您确定要删除吗?'}
            onConfirm={() => {
              handleDelete(record.trackId);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button size="small" type="primary" style={{ marginRight: 10 }}>
              删除赛道
            </Button>
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
        scroll={{ y: 250 }}
        pagination={false}
        request={() => {
          return queryTrackComposeList({
            fundId: records.fundId,
            fundCode: records.fundCode,
          });
        }}
        options={{
          density: false,
        }}
        search={false}
        rowKey="trackId"
        toolBarRender={() => [
          <Button
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            新增
          </Button>,
        ]}
      />
      <TrackAdd
        visible={isModalVisible}
        handleOk={handleAdd}
        handleCancel={() => {
          setIsModalVisible(false);
        }}
      />
      <TrackConfig
        visible={isModalConfig}
        handleOk={handleConfig}
        handleCancel={() => {
          setIsModalConfig(false);
        }}
        editObj={editObj}
      />
    </>
  );
};

export default memo(TrackTable);
