import ProCard from '@ant-design/pro-card';
import { List, Empty } from 'antd';
import { history } from 'umi';
import styles from './index.less';

// 列表
interface ViewListProps {
  handleSearch: (value: any) => void;
  total: number;
  pagination: any;
  data: any[];
}

const ViewList = (props: ViewListProps) => {
  const { pagination, data, total, handleSearch } = props;

  return (
    <ProCard
      size="small"
      gutter={[0, 8]}
      style={{ padding: '0 100px 12px' }}
      className={styles['view-list']}
    >
      {data?.length ? (
        <List
          size="large"
          itemLayout="vertical"
          dataSource={data}
          pagination={{
            total,
            hideOnSinglePage: true,
            showSizeChanger: true,
            ...pagination,
            showTotal: (num) => `共 ${num} 条`,
            onChange: (page, size) => {
              handleSearch({
                current: page,
                pageSize: size,
                isFormSearch: false,
              });
            },
          }}
          renderItem={(
            {
              ratingDt,
              ratingInstitute,
              ratingAnalyst,
              industryName,
              reportViewpoint,
              reportInd,
              reportType,
              ratingMemo,
              reportId,
            }: any,
            index,
          ) => (
            <List.Item
              key={index}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                history.push(`/industrialChain/reportDetail/${reportId}`);
              }}
              actions={[
                <div className={styles['list-item-date']}>
                  <span>{`${ratingDt}  |  ${ratingInstitute}  |  ${ratingAnalyst}`}</span>
                  <span
                    className={styles['list-item-tag']}
                    style={{ color: '#4568F5', background: '#F0F5FF', marginLeft: 18 }}
                  >
                    {reportViewpoint}
                  </span>
                  <span
                    className={styles['list-item-tag']}
                    style={{ color: '#F27C49', background: '#FFF2EB' }}
                  >
                    {industryName}
                  </span>
                  <span
                    className={styles['list-item-tag']}
                    style={{ color: '#545FC8', background: '#EBEBFF' }}
                  >
                    {reportType}
                  </span>
                  <span
                    className={styles['list-item-tag']}
                    style={{ color: '#E673C0', background: '#FFF0F6' }}
                  >
                    {reportInd}
                  </span>
                </div>,
              ]}
            >
              <div className={styles['list-item-desc']}>{ratingMemo}</div>
            </List.Item>
          )}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </ProCard>
  );
};

export default ViewList;
