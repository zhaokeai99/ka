import React, { useState, useEffect, useCallback } from 'react';
import { List, Tag, Divider } from 'antd';
import ProCard from '@ant-design/pro-card';
import styles from '../index.less';
import { IIndustySearchParams, filterParams, tagTypeMap } from '../data.d';
import { contentPadding } from '@/themes';
import { history } from 'umi';
import { queryIndustryNewsLimit, IIndustryNewsLimitData } from '../service';
interface IListCard {
  params: IIndustySearchParams;
  total: number;
  changeTotal: (value: any) => void;
}

interface IPaginationType {
  pageNum: number;
  pageSize: number;
}

const ListCard: React.FC<IListCard> & { isProCard: boolean } = ({ params, total, changeTotal }) => {
  const [listData, setListData] = useState<IIndustryNewsLimitData[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<IPaginationType>({ pageNum: 1, pageSize: 10 });

  const getIndustryNewsLimit = useCallback(
    async (pageOption: IPaginationType) => {
      setLoading(true);
      const newParams = filterParams(params);
      if (!(Reflect.has(newParams, 'industryId') && Reflect.has(newParams, 'industryName'))) {
        setLoading(false);
        return;
      }
      const { data, success } = await queryIndustryNewsLimit({ ...newParams, ...pageOption });
      if (success) {
        setListData(data?.data ?? []);
        changeTotal(data?.total);
        setPagination({
          pageNum: data?.pageNum,
          pageSize: data?.pageSize,
        });
      } else {
        changeTotal(0);
        setListData([]);
      }
      setLoading(false);
    },
    [params, pagination],
  );

  useEffect(() => {
    getIndustryNewsLimit({
      pageNum: 1,
      pageSize: 10,
    });
  }, [params]);

  const onListItemClick = (id: string | undefined) => {
    history.push(`/information/publicOpinion/publicOpinionDetail/${id}`);
  };

  const onPaginationChange = useCallback(
    (page, size) => {
      getIndustryNewsLimit({
        pageNum: page,
        pageSize: size,
      });
    },
    [pagination],
  );

  return (
    <ProCard ghost size="small" style={{ padding: `${contentPadding} 24px` }} layout="center">
      <List
        itemLayout={'vertical'}
        loading={loading}
        pagination={{
          total,
          hideOnSinglePage: true,
          showSizeChanger: true,
          pageSize: pagination?.pageSize,
          current: pagination?.pageNum,
          showTotal: (num) => `共 ${num} 条`,
          onChange: onPaginationChange,
        }}
        dataSource={listData || []}
        className={styles['list-card-box']}
        renderItem={(item, index) => {
          return (
            <List.Item
              key={index}
              className={styles['list-card-item']}
              actions={[
                <div className={styles['list-footer']}>
                  {item?.clusterEventDate && (
                    <div className={styles['list-footer-date']}>
                      <span>{item?.clusterEventDate}</span>
                      <Divider type="vertical" className={styles['list-footer-divider']} />
                    </div>
                  )}
                  {item?.fromSource && (
                    <div className={styles['list-footer-from']}>
                      <span>{item?.fromSource}</span>
                    </div>
                  )}
                  {item?.author && (
                    <>
                      <div className={styles['list-footer-author']}>
                        <Divider type="vertical" className={styles['list-footer-divider']} />
                        <span>{item?.author}</span>
                      </div>
                    </>
                  )}
                  <div className={styles['list-footer-tag']}>
                    {item?.publicSentiment && (
                      <Tag
                        style={{
                          color: tagTypeMap[item?.publicSentiment]?.color,
                          backgroundColor: tagTypeMap[item?.publicSentiment]?.backgroundCol,
                          border: 'none',
                        }}
                      >
                        {item?.publicSentiment}
                      </Tag>
                    )}
                    {item?.industryName && (
                      <Tag
                        style={{
                          color: '#F27C49',
                          backgroundColor: '#FFF2EB',
                          border: 'none',
                        }}
                      >
                        {item?.industryName}
                      </Tag>
                    )}
                    {item?.labelList &&
                      item?.labelList?.length > 0 &&
                      item.labelList?.map((v: any) => {
                        return (
                          <Tag
                            key={v}
                            style={{
                              color: '#4568F5',
                              backgroundColor: '#F0F5FF',
                              border: 'none',
                            }}
                          >
                            {v}
                          </Tag>
                        );
                      })}
                  </div>
                </div>,
              ]}
              onClick={() => onListItemClick(item?.documentId)}
            >
              {item?.eventTitle && (
                <div className={styles['list-title']}>
                  <span className={styles['list-title-child']}>{item?.eventTitle}</span>
                </div>
              )}
              {item?.newsContent && (
                <div className={styles['list-desc']} title={item?.newsContent}>
                  <span>{item?.newsContent}</span>
                </div>
              )}
            </List.Item>
          );
        }}
      />
    </ProCard>
  );
};

ListCard.isProCard = true;

export default ListCard;
