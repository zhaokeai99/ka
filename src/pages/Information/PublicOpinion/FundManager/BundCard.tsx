import ProCardPlus from '@/components/ProCardPlus';
import { DatePicker, Empty, Input, Table } from 'antd';
import moment from 'moment';
import styles from './index.less';

type BundProps = {
  date?: string;
  dataSource: any[];
  setDate?: (a: string) => void;
  searchTextChange?: (a: string) => void;
  changeBund?: (a: string) => void;
};
// 债券清单
const BundCard = (props: BundProps) => {
  const { date, setDate, searchTextChange, dataSource, changeBund } = props;
  const bondColumns = [
    {
      title: '债券代码',
      dataIndex: 'bondCode',
    },
    {
      title: '债券简称',
      dataIndex: 'bondName',
    },
    {
      title: '债券内部评级',
      dataIndex: 'innerRating',
    },
    {
      title: '债券外部评级',
      dataIndex: 'outerRating',
    },
    {
      title: '发行人',
      ellipsis: true,
      dataIndex: 'issuerName',
    },
  ];

  const onRow = (record: any) => {
    return {
      onClick: () => {
        if (changeBund) changeBund(record.bondCode);
      },
    };
  };

  return (
    <ProCardPlus
      title="债券清单"
      extra={[
        <DatePicker
          value={moment(date, 'YYYY-MM-DD')}
          onChange={(val) => {
            const tdate = moment(val).format('YYYY-MM-DD');
            if (setDate) setDate(tdate);
          }}
          allowClear={false}
          // style={{ marginRight: '10px' }}
        />,
        <Input.Search
          style={{ width: '50%', marginLeft: 8 }}
          placeholder="代码/名称模糊"
          onSearch={(val) => {
            if (searchTextChange) searchTextChange(val);
          }}
        />,
      ]}
      style={{ height: '300px' }}
      layout="center"
    >
      {dataSource.length <= 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Table
          className={styles['bund-wrap']}
          columns={bondColumns}
          onRow={onRow}
          size="small"
          scroll={{ y: 190 }}
          rowKey={(record, index) => `${record.bondCode}--${index}`}
          dataSource={dataSource}
          pagination={false}
        />
      )}
    </ProCardPlus>
  );
};

BundCard.isProCard = true;

export default BundCard;
