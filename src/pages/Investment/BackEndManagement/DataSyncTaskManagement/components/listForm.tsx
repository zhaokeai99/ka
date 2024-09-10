import { Space, Input, List, Button, Avatar } from 'antd';
import { memo, useEffect, useImperativeHandle, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { EsDataSyncTaskFacadeQueryDataSyncTaskSimple } from './../service';
import { PlusOutlined } from '@ant-design/icons';
import './../index.css';
import Icons from './icons';

const { Search } = Input;

interface ModalProps {
  onCheck: (id: number, currStatus: number) => void;
  onAdd: () => void;
  cRef: any;
}

const getTitle = (item: any) => {
  const title = [];
  if (item.publishStatus === 1) {
    title.push(<span style={{ color: '#5e93fd' }}>[已发布]</span>);
    if (item.taskStatus === 0) {
      title.push(<span style={{ color: '#52c41a' }}>[已修改]</span>);
    }
  } else {
    if (item.taskStatus === 2) {
      title.push(<span style={{ color: '#ff4d4f' }}>[已作废]</span>);
    } else {
      title.push(<span style={{ color: '#ff4d4f' }}>[未发布]</span>);
    }
  }
  title.push(item.taskName);
  return <>{[...title]} </>;
};

const IndexInfo = (props: ModalProps) => {
  const { onCheck, onAdd, cRef } = props;
  const [dataList, setDataList] = useState<any>([]);
  const [itemCheckId, setItemCheckId] = useState<any>(undefined);
  const [keyword, setKeyword] = useState<string | undefined>(undefined);

  const loadDate = async (key: string | undefined) => {
    const params = { keyword: '' };
    if (key !== undefined && key !== '') {
      params.keyword = key;
    }
    const data = await EsDataSyncTaskFacadeQueryDataSyncTaskSimple(params);
    if (data.success) {
      setDataList(data.data);
      if (data.data?.length > 0) {
        const id = data.data[0].id;
        setItemCheckId(id);
        onCheck(id, data.data[0].taskStatus);
      } else {
        onAdd();
      }
    }
  };

  useEffect(() => {
    loadDate(undefined);
  }, []);

  const onSearch = async (key: string) => {
    setKeyword(key);
    loadDate(key);
  };

  const refreshList = async () => {
    loadDate(keyword);
  };

  const itemClick = (item: any) => {
    setItemCheckId(item.id);
    onCheck(item.id, item.taskStatus);
  };
  const taskAdd = () => {
    onAdd();
    setItemCheckId(undefined);
  };

  useImperativeHandle(cRef, () => ({
    refresh: () => {
      refreshList();
    },
  }));

  return (
    <>
      <ProCard title={'任务列表'}>
        <List
          header={
            <>
              <Space>
                <Search
                  placeholder="请输入您需要搜索的任务名称或描述"
                  allowClear
                  onSearch={onSearch}
                  style={{ width: '100%' }}
                />
                <Button shape="circle" icon={<PlusOutlined />} onClick={taskAdd}></Button>
              </Space>
            </>
          }
          dataSource={dataList}
          pagination={{
            pageSize: 10,
          }}
          renderItem={(item: any) => (
            <List.Item
              onClick={() => itemClick(item)}
              className={'task-item ' + (itemCheckId === item.id ? 'task-item-check' : '')}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    shape="square"
                    size={'large'}
                    className={'datatypeIcon'}
                    src={item.sourceType === 'MYSQL' ? Icons.IconMysql : Icons.IconOracle}
                  />
                }
                title={getTitle(item)}
                description={item.taskDesc}
              />
            </List.Item>
          )}
        />
      </ProCard>
    </>
  );
};
export default memo(IndexInfo);
