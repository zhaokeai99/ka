import React, { useRef, useState, useMemo, useCallback } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import { Link } from 'umi';
import { cardGutter, contentPadding } from '@/themes';
import type { IndexAnnouncementItem } from './data';
import { queryComposePageList } from './service';
import Allocation from './Allocation';
import MyTreeSelect from './utils/MyTreeSelect';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<any>({});
  const handleUpdate = useCallback(() => {
    actionRef.current?.reload();
  }, [actionRef]);
  const columns: ProColumns<IndexAnnouncementItem>[] = useMemo(() => {
    return [
      {
        title: '',
        dataIndex: 'id',
        hideInTable: true,
        search: false,
      },
      {
        title: '产品代码',
        dataIndex: 'fundCode',
        // search: false,
      },
      {
        title: '产品名称',
        dataIndex: 'fundName',
        render: (text, v: any) => <Link to={`/production/index/detail/${v.fundId}`}>{text}</Link>,
      },
      {
        title: '一级分类',
        dataIndex: 'oneLevel',
        search: false,
      },
      {
        title: '二级分类',
        dataIndex: 'twoLevel',
        search: false,
      },
      {
        title: '三级分类',
        dataIndex: 'threeLevel',
        search: false,
      },
      {
        title: '基金经理',
        dataIndex: 'fundManagerName',
        search: false,
      },
      {
        title: '股票',
        dataIndex: 'shares',
        search: false,
      },
      {
        title: '可转债',
        dataIndex: 'convertible',
        search: false,
      },
      {
        title: '纯债',
        dataIndex: 'pureDebt',
        search: false,
      },
      {
        title: '存款及其他',
        dataIndex: 'deposits',
        search: false,
      },
      {
        title: '产品分类',
        dataIndex: 'treeId',
        hideInTable: true,
        renderFormItem: ({ type, ...rest }) => {
          if (type === 'form') {
            return null;
          }
          // 1.使用renderFormItem必须进行这一步判断，否则自定义渲染不出来
          // 2.自定义组件必须赋值value和onChange，否则form拿不到值
          return <MyTreeSelect {...rest} />;
        },
      },
      {
        title: '操作',
        valueType: 'option',
        render: (_, item) => [
          <a
            key="editable"
            onClick={() => {
              setVisible(true);
              setRecord(item);
            }}
          >
            配置
          </a>,
        ],
      },
    ];
  }, []);
  return (
    <ProCard style={{ padding: contentPadding }} ghost gutter={[0, cardGutter]} size="small">
      <ProTable<IndexAnnouncementItem>
        size="small"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={(params) => queryComposePageList(params)}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        options={{
          density: false,
        }}
      />
      {visible && (
        <Allocation
          visible={visible}
          onClose={() => {
            setVisible(false);
            handleUpdate();
          }}
          record={record}
        />
      )}
    </ProCard>
  );
};

export default TableList;
