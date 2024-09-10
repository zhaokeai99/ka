import ProCardPlus from '@/components/ProCardPlus';
import styles from '@/pages/Marketing/AdvisorCRM/index.less';
import { emptyToUndefined } from '@/pages/Marketing/AdvisorCRM/util';
import { contentPadding } from '@/themes';
import { ProTable } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import React from 'react';
import { queryUserOperationLog } from './service';

const logColumns: ProColumns<any>[] = [
  {
    title: '筛选日期',
    dataIndex: 'queryDateRange',
    valueType: 'dateRange',
    hideInTable: true,
    initialValue: [moment().add(-30, 'day'), moment()],
  },
  {
    title: '时间',
    dataIndex: 'operationDate',
    width: '33%',
    search: false,
  },
  {
    title: '操作人',
    dataIndex: 'adviserName',
    width: '33%',
    search: false,
  },
  {
    title: '行为',
    dataIndex: 'operateContent',
    width: '33%',
    search: false,
  },
];

const AdvsiorLog: React.FC<any> = () => {
  return (
    <ProCardPlus
      sn={'_marketing_advisorCRM_accessLog_customerQueryLog'}
      direction="column"
      style={{ padding: contentPadding }}
      ghost
      size="small"
      className={styles['crmSelfTable']}
    >
      <ProTable<any>
        headerTitle={'访问日志查询'}
        style={{ backgroundColor: '#FFF', padding: '0 12px 24px 12px' }}
        bordered={true}
        columns={logColumns}
        size={'small'}
        pagination={{
          defaultPageSize: 30,
          pageSizeOptions: [30, 50, 75, 100],
          showSizeChanger: true,
        }}
        manualRequest={true}
        request={async (params: any) => {
          const queryDateRange = params?.queryDateRange;
          const param = {
            startDate: queryDateRange
              ? emptyToUndefined(moment(queryDateRange[0]).format('YYYYMMDD'))
              : undefined,
            endDate: queryDateRange
              ? emptyToUndefined(moment(queryDateRange[1]).format('YYYYMMDD'))
              : undefined,
            pageNum: emptyToUndefined(params?.current),
            pageSize: emptyToUndefined(params?.pageSize),
          };
          const logResult = await queryUserOperationLog(param);
          return {
            data: logResult.data,
            total: logResult.total,
            success: true,
          };
        }}
        rowKey={'key'}
        options={false}
        revalidateOnFocus={false}
      />
    </ProCardPlus>
  );
};

export default AdvsiorLog;
