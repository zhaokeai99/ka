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
            { declareDate, officeName, emotion, labelName, policyId, policyAbstract, title }: any,
            index: number,
          ) => (
            <List.Item
              key={index}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                history.push(`/industrialChain/policyDetail/${policyId}`);
              }}
              actions={[
                <div className={styles['list-item-date']}>
                  <span>{declareDate}&nbsp;&nbsp;</span>

                  {officeName ? <span>|&nbsp;&nbsp;{officeName}&nbsp;&nbsp;</span> : null}

                  <Tag
                    color={tagTypeMap[emotion]?.color}
                    backgroundColor={tagTypeMap[emotion]?.backgroundCol}
                  >
                    {emotion}
                  </Tag>

                  <Tag color="#4568F5" backgroundColor="#F0F5FF">
                    {labelName}
                  </Tag>
                </div>,
              ]}
            >
              <div className={styles['list-item-title']}>{title}</div>
              <div className={styles['list-item-desc']}>{policyAbstract}</div>
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
