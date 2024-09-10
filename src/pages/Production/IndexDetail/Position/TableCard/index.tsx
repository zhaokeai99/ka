import { useState, useEffect } from 'react';
import { DatePicker, Table } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import { tableEmptyCellRender } from '@/utils/utils';
import moment from 'moment';

function TableCard({
  colSpan = 12,
  style = { height: '320px' },
  bodyStyle = { paddingTop: 0 },
  layout,
  bordered = true,
  baseDate,
  column,
  params,
  fetch,
}: any) {
  const [date, setDate] = useState(baseDate);
  const [data, setData] = useState({ data: [], totalRatio: '-' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date) {
      (async () => {
        setLoading(true);
        const result = await fetch({
          ...params,
          date,
        });

        setData(result);
        setLoading(false);
      })();
    }
  }, [date]);

  return (
    <ProCardPlus
      colSpan={colSpan}
      title={`${params.title}(${data.totalRatioView || '-'})`}
      style={style}
      bodyStyle={bodyStyle}
      layout={layout}
      extra={
        <DatePicker
          value={moment(date)}
          onChange={(e) => {
            setDate(e?.format('YYYY-MM-DD'));
          }}
          disabledDate={(current) => current && current > moment(baseDate).endOf('day')}
        />
      }
      bordered={bordered}
    >
      <Table
        size="small"
        columns={tableEmptyCellRender(column)}
        dataSource={data?.data || []}
        style={{ width: '100%', marginTop: '20px' }}
        scroll={{ y: 190 }}
        pagination={false}
        loading={loading}
      />
    </ProCardPlus>
  );
}

TableCard.isProCard = true;

export default TableCard;
