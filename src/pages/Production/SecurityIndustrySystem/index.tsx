import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Button, message, Modal } from 'antd';
import { Link } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import {
  querySecuritiesIndustryList,
  delSecuritiesIndustry,
  copySecuritiesIndustry,
} from './service';
import AddSecuritiesIndustry from './components/addSecuritiesIndustry';
import CopySecurities from './components/copySecurities';
const { confirm } = Modal;
export type TableListItem = {
  id: number;
  name: string;
};
const SecurityIndustrySystem: React.FC = () => {
  const actionRef = useRef<ActionType | undefined>();
  const [visible, setVisible] = useState<boolean>(false);
  const [copyVisible, setCopyVisible] = useState<boolean>(false);
  const [copyId, setCopyId] = useState<string>('');
  const handleDelete = useCallback(async (id: any) => {
    const result: any = await delSecuritiesIndustry({ id });
    if (result.success) {
      message.success('删除成功');
      actionRef.current?.reload();
    }
  }, []);
  const handleDelClick = useCallback(
    (obj: any) => {
      confirm({
        title: `删除后不可恢复，确定删除吗？`,
        onOk: () => {
          handleDelete(obj.id);
        },
      });
    },
    [handleDelete],
  );
  const handleCopy = useCallback(
    async (obj: any) => {
      setCopyVisible(false);
      const res: any = await copySecuritiesIndustry({
        ...obj,
        id: copyId,
      });
      if (res.success) {
        message.success('添加成功');
        actionRef.current?.reload();
      } else {
        message.error(res.errorMsg);
      }
    },
    [copyId],
  );
  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '行业分类体系名称',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: '跟踪标准行业体系',
        key: 'standardIndustry',
        dataIndex: 'standardIndustry',
      },
      {
        title: '证券类别',
        key: 'typeName',
        dataIndex: 'typeName',
      },
      {
        title: '未分类证券数量',
        key: 'unclassifiedNum',
        dataIndex: 'unclassifiedNum',
      },
      {
        title: '维护人',
        key: 'creator',
        dataIndex: 'creator',
      },
      {
        title: '更新时间',
        key: 'updateTime',
        dataIndex: 'updateTime',
      },
      {
        title: '操作',
        key: 'option',
        render: (record: any) => (
          <>
            <a
              style={{ marginRight: 8 }}
              onClick={() => {
                setCopyVisible(true);
                setCopyId(record.id);
              }}
              key="copy"
            >
              复制
            </a>
            {record.canEdit ? (
              <>
                <Link
                  style={{ marginRight: 8 }}
                  to={`/production/securityIndustrySystem/detail/${record.id}/${record.name}/${record.isCustom}`}
                >
                  {' '}
                  配置
                </Link>
                <a
                  style={{ visibility: record.isCustom ? 'visible' : 'hidden' }}
                  onClick={() => {
                    handleDelClick(record);
                  }}
                >
                  删除
                </a>
              </>
            ) : null}
          </>
        ),
      },
    ];
  }, [handleDelClick]);

  return (
    <ProCard ghost style={{ padding: '12px 12px' }}>
      <ProTable<any>
        actionRef={actionRef}
        // headerTitle="行业证券体系"
        rowKey="id"
        size="middle"
        options={{
          density: false,
        }}
        request={(params) => querySecuritiesIndustryList(params)}
        columns={columns}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            新增
          </Button>,
        ]}
        search={false}
        scroll={{ x: 'max-content' }}
      />
      <AddSecuritiesIndustry
        visible={visible}
        onClose={(type) => {
          setVisible(false);
          if (type === 'reload') {
            actionRef.current?.reload();
          }
        }}
      />
      <CopySecurities
        visible={copyVisible}
        handleOk={(values: any) => {
          handleCopy(values);
        }}
        handleCancel={() => {
          setCopyVisible(false);
        }}
      />
    </ProCard>
  );
};

export default SecurityIndustrySystem;
