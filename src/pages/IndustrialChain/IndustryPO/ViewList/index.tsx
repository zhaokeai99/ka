import ProCard from '@ant-design/pro-card';
import { List, Empty } from 'antd';
import { tagTypeMap } from '@/pages/IndustrialChain/data.d';
import Tag from '@/pages/IndustrialChain/components/Tag';
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
      style={{ padding: '0 88px 12px' }}
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
              clusterEventDate,
              author,
              fromSource,
              publicSentiment,
              chainName,
              labelList,
              newsContent,
              documentId,
              eventTitle,
            }: any,
            index: number,
          ) => (
            <List.Item
              key={index}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                history.push(`/industrialChain/publicOpinionDetail/${documentId}`);
              }}
              actions={[
                <div className={styles['list-item-date']}>
                  <span>{clusterEventDate}</span>

                  {fromSource ? (
                    <span>&nbsp;&nbsp;|&nbsp;&nbsp;{fromSource}&nbsp;&nbsp;</span>
                  ) : null}

                  {author ? <span>|&nbsp;&nbsp;{author}&nbsp;&nbsp;</span> : null}

                  <Tag
                    color={tagTypeMap[publicSentiment]?.color}
                    backgroundColor={tagTypeMap[publicSentiment]?.backgroundCol}
                  >
                    {publicSentiment}
                  </Tag>

                  <Tag color="#F27C49" backgroundColor="#FFF2EB">
                    {chainName}
                  </Tag>

                  {labelList?.map((item: string) => (
                    <Tag key={item} color="#4568F5" backgroundColor="#F0F5FF">
                      {item}
                    </Tag>
                  ))}
                </div>,
              ]}
            >
              <div className={styles['list-item-title']}>{eventTitle}</div>
              <div className={styles['list-item-desc']}>{newsContent}</div>
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
