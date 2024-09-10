import { useCallback, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import { Link } from 'umi';
import { getFollowProduct } from './service';

import styles from './index.less';

const DateTypes = {
  YEAR: 'year',
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
};

const getTypeData = (type, record) => {
  switch (type) {
    case DateTypes.YEAR:
      return record.return1YearView || '--';
    case DateTypes.MONTH:
      return record.returnMonthView || '--';
    case DateTypes.WEEK:
      return record.returnWeekView || '--';
    case DateTypes.DAY:
      return record.returnTodayView || '--';
    default:
      return record.returnTodayView || '--';
  }
};

export default function () {
  const [selectDate, setSelectDate] = useState(DateTypes.DAY);
  const columns: ProColumns<any>[] = [
    {
      title: '产品代码',
      dataIndex: 'fundCode',
      width: 80,
      search: false,
    },
    {
      title: '产品名称',
      dataIndex: 'fundName',
      width: 280,
      search: false,
      render: (_, v) => (
        <Link to={`/production/index/detail/${v.fundId}`}>
          <div className={styles['eclipse-text']} title={v.fundName || '--'}>
            {v.fundName || '--'}
          </div>
        </Link>
      ),
    },
    {
      title: '单位净值',
      dataIndex: 'unitNav',
      width: 160,
      search: false,
    },
    {
      title: '累计单位净值',
      dataIndex: 'totalNav',
      search: false,
    },
    {
      title: '涨跌幅',
      dataIndex: 'publisher',
      search: false,
      render: (text, item) => <div>{getTypeData(selectDate, item)}</div>,
    },
    {
      title: '估值日期',
      dataIndex: 'date',
      search: false,
      valueType: 'date',
    },
  ];
  // const [dateRange, setDateRange] = useState([]);
  // const [timeStemp, setTimeStemp] = useState(new Date().getMilliseconds());
  const updateDate = useCallback((date) => {
    setSelectDate(date);
    // setDateRange([]);
    // setTimeStemp(new Date().getMilliseconds());
  }, []);

  // async function getTableData(reqParams: any) {
  //   console.log('getTableData ', reqParams);
  //   // const {
  //   //   id,
  //   //   groups,
  //   //   current,
  //   //   pageSize: reqPageSize,
  //   //   params
  //   // } = reqParams;

  //   // const { payload, success } = await getDataToApiUsingPOST({
  //   //  id,
  //   //  orgId: 1,
  //   //  groups,
  //   //  pageNo: current,
  //   //  pageSize: reqPageSize,
  //   //  params,
  //   // });
  //   // const {
  //   //   resultList,
  //   //   pageNo,
  //   //   pageSize,
  //   //   totalCount,
  //   // } = payload || {};
  //   // if (success) {
  //   return {
  //     data: data,
  //     success: true,
  //     current: 1,
  //     pageSize: 10,
  //     total: 20,
  //   };
  //   // }
  //   // return {
  //   //   data: [],
  //   //   success: false,
  //   // }
  // }

  const content = (
    <div className={styles['extra']}>
      <div className={styles['item-fly']}></div>
      <div className={styles['item-go']}></div>
    </div>
  );
  return (
    <ProCardPlus
      gutter={[8, 8]}
      style={{ background: 'white' }}
      title="我关注的产品"
      extra={content}
    >
      <div className={styles['container']}>
        <div className={styles['search-area']}>
          {/* <RangePicker
            value={dateRange}
            style={{ height: 28 }}
            onOpenChange={() => {
              setSelectDate('');
            }}
            onChange={(value) => {
              setDateRange(value);
              setTimeStemp(new Date().getMilliseconds());
            }}
          /> */}
          <span
            className={styles[`item${selectDate === DateTypes.YEAR ? '-select' : ''}`]}
            onClick={() => updateDate(DateTypes.YEAR)}
          >
            近一年
          </span>
          <span
            className={styles[`item${selectDate === DateTypes.MONTH ? '-select' : ''}`]}
            onClick={() => updateDate(DateTypes.MONTH)}
          >
            近一月
          </span>
          <span
            className={styles[`item${selectDate === DateTypes.WEEK ? '-select' : ''}`]}
            onClick={() => updateDate(DateTypes.WEEK)}
          >
            近一周
          </span>
          <span
            className={styles[`item${selectDate === DateTypes.DAY ? '-select' : ''}`]}
            onClick={() => updateDate(DateTypes.DAY)}
          >
            近一日
          </span>
        </div>
        <ProTable<any>
          bordered
          columns={columns}
          style={{ width: '100%', height: '100%' }}
          tableStyle={{ height: 274 }}
          // pagination={{ ...pagination, pageSizeOptions: ['10', '20', '30', '40'] }}
          rowKey="id"
          options={{ reload: false }}
          size="small"
          // request={queryTableList}
          search={false}
          options={false}
          // dataSource={data}
          request={getFollowProduct}
          pagination={{
            showSizeChanger: false,
            pageSize: 5,
          }}
          // params={{ timeStemp, /* dateRange, */selectDate }}
        />
      </div>
    </ProCardPlus>
  );
}
