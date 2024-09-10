import ProTableHandle from '@/pages/Investment/util/ProTableHandle';
import { cardGutter } from '@/themes';
import { PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TableListItem1 } from '../service';
import { MpBmMarketIndexDelete, MpBmMarketIndexQueryByPage } from '../service';
import SingleIndexModal from './SingleIndexModal';

interface PropsType {
  domainDic: any;
  sigleBenchmarkDic: any;
  refReshBenchmarkDic: () => void;
}

// 单市场基准
const SingleIndexBenchmark = (props: PropsType) => {
  const { domainDic, sigleBenchmarkDic } = props;
  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();

  const [isShowModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editValues, setEditValues] = useState({});

  useEffect(() => {}, [props]);

  const request = async (params?: any) => {
    const result = await MpBmMarketIndexQueryByPage({
      current: params.current,
      pageSize: params.pageSize,
      domain: params.domain,
      indexCode: params.indexName,
      bmType: 1,
    });

    const { data = [], current, pageSize, pages, total } = result || {};

    if (JSON.stringify(result) !== '{}') {
      return {
        data,
        current,
        pageSize,
        pages,
        total,
        success: true,
      };
    }

    return {
      data: [],
      success: true,
    };
  };

  const handleShowModal = useCallback((type, values) => {
    setEditValues(values);
    setModalType(type);
    setShowModal(true);
  }, []);

  const handleColse = useCallback((key) => {
    setShowModal(false);
    if (key === 'reload') {
      props.refReshBenchmarkDic(); // 重新拉取基准字典
      actionRef.current?.reload();
    }
  }, []);

  const remove = useCallback(async (record: any) => {
    const result = await MpBmMarketIndexDelete({
      id: record.id,
    });
    if (result.success) {
      props.refReshBenchmarkDic(); // 重新拉取基准字典
      actionRef?.current?.reload();
      return;
    }
    message.error(result.errorMsg || '接口请求失败');
  }, []);

  const columns: ProColumns<TableListItem1>[] = useMemo(() => {
    return [
      {
        title: '指数代码',
        ellipsis: true,
        dataIndex: 'indexCode',
        hideInSearch: true,
      },
      {
        title: '指数名称',
        ellipsis: true,
        dataIndex: 'indexName',
        valueType: 'select',
        valueEnum: ProTableHandle.toValueEnum(sigleBenchmarkDic, 'label', 'value'),
        fieldProps: { showSearch: true },
      },
      {
        title: '业务域',
        ellipsis: true,
        dataIndex: 'domain',
        valueType: 'select',
        valueEnum: ProTableHandle.toValueEnum(domainDic, 'label', 'value'),
        fieldProps: { showSearch: true },
        initialValue: domainDic[0]?.value,
      },
      {
        title: '指数发行公司',
        ellipsis: true,
        dataIndex: 'indexSysName',
        hideInSearch: true,
      },
      {
        title: '操作',
        valueType: 'option',
        ellipsis: true,
        render: (text, record) => [
          // <a onClick={() => {handleShowModal('edit', record);}}>编辑</a>,
          <a
            onClick={() => {
              remove(record);
            }}
          >
            删除
          </a>,
        ],
      },
    ];
  }, [domainDic, sigleBenchmarkDic]);

  return (
    <ProCard ghost direction="column" gutter={[0, cardGutter]}>
      {domainDic.length && domainDic[0].value ? (
        <ProTable<TableListItem1>
          headerTitle={'基准成分信息'}
          size="small"
          formRef={formRef}
          actionRef={actionRef}
          rowKey="id"
          columnEmptyText={false}
          search={{ labelWidth: 'auto' }}
          form={{ ignoreRules: false }}
          toolBarRender={() => [
            <Button
              key="add_button"
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => handleShowModal('add', {})}
            >
              创建基准
            </Button>,
          ]}
          request={request}
          columns={columns}
          pagination={{ current: 1, pageSize: 10 }}
          options={{ density: false }}
        />
      ) : (
        ''
      )}
      <SingleIndexModal
        visible={isShowModal}
        modalType={modalType}
        domain={formRef?.current?.getFieldValue('domain')}
        initValues={editValues}
        onClose={handleColse}
      />
    </ProCard>
  );
};

SingleIndexBenchmark.isProCard = true;

export default SingleIndexBenchmark;
