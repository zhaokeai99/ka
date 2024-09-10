import React, { useEffect, useState } from 'react';
import { Table, Spin } from 'antd';
import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import { queryFundPolicyList, queryFundPolicyDetail } from './service';
import { contentPadding } from '@/themes/index';
import { GUTTER_SIZE } from '@/utils/utils';
import './index.less';

const columns = [
  {
    title: '产品大类',
    dataIndex: 'fundCategory',
    key: 'fundCategory',
  },
  {
    title: '细分类型',
    dataIndex: 'subdivideCategory',
    key: 'subdivideCategory',
    render: (text, record) => (
      <div title={record.subdivideCategory || '--'} className={'eclipse-text'}>
        {record.subdivideCategory || '--'}
      </div>
    ),
  },
  {
    title: '受理状态',
    dataIndex: 'dealStatus',
    key: 'dealStatus',
    render: (text, record) => (
      <div title={record.dealStatus || '--'} className={'eclipse-text1'}>
        {record.dealStatus || '--'}
      </div>
    ),
  },
];

const PdAuditPolicy = () => {
  const [listData, setListData] = useState([]);
  const [detail, setDetail] = useState<any>({});
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(true);
  const [selectId, setSelectId] = useState(null);

  const queryDetail = async (id: any) => {
    setDetailLoading(true);
    const { data } = await queryFundPolicyDetail({ id });
    setDetail(data);
    setDetailLoading(false);
  };

  const onRow = (record: any) => {
    return {
      onClick: () => {
        setSelectId(record.id || null);
      },
    };
  };

  const rowClassName = (record: any) => {
    return record.id === selectId ? 'pdAuditPolicyClickRow' : '';
  };

  useEffect(() => {
    (async () => {
      const { data } = await queryFundPolicyList();
      const { dataList } = data || {};
      setListData(dataList || []);
      setSelectId(Array.isArray(dataList) && dataList.length > 0 ? dataList[0].id : null);
      setListLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (selectId) {
      queryDetail(selectId);
    }
  }, [selectId]);

  return (
    <ProCard style={{ padding: contentPadding }} ghost gutter={GUTTER_SIZE} split="vertical">
      <ProCard
        colSpan={9}
        loading={listLoading && <Spin spinning />}
        ghost
        style={{ height: '100%', background: '#fff' }}
      >
        <Table
          onRow={onRow}
          rowClassName={rowClassName}
          pagination={false}
          columns={columns}
          size="small"
          scroll={{ x: 'max-content' }}
          dataSource={listData}
        />
      </ProCard>
      <ProCard
        colSpan={15}
        gutter={GUTTER_SIZE}
        loading={detailLoading && <Spin spinning />}
        ghost
        direction="column"
        style={{ padding: '12px', height: '100%', background: '#fff' }}
      >
        <ProCardPlus size="small" title="产品方面" layout="center">
          <div className={'list-container'}>
            {detail.policyAspect &&
              detail.policyAspect.map((item: any) => (
                <div className={'list-item'}>
                  <h4 className={'label'}>{item.name + ' : '}</h4>
                  <p className={'content'}>{item.value || '-'}</p>
                </div>
              ))}
          </div>
        </ProCardPlus>

        <ProCardPlus size="small" title="政策方面" layout="center">
          <div className={'list-container'}>
            {detail.productAspect &&
              detail.productAspect.map((item: any) => (
                <div className={'list-item'}>
                  <h4 className={'label'}>{item.name + ' : '}</h4>
                  <p className={'content'}>{item.value || '-'}</p>
                </div>
              ))}
          </div>
        </ProCardPlus>

        {/* <ProCardPlus
          size="small"
          title="政策方面"
          layout="center"
        >
          <div className={'list-container'}>
            {detail.productAspect &&
            detail.productAspect.map((item: any) => (
              <div className={'list-item'}>
                <h4 className={'label'}>{item.name + ' : '}</h4>
                <p className={'content'}>{item.value || '-'}</p>
              </div>
            ))}
            </div>
        </ProCardPlus> */}
      </ProCard>
    </ProCard>
  );
};

export default PdAuditPolicy;
