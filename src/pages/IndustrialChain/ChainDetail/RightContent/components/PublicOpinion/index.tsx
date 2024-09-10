import { tagTypeMap } from '@/pages/IndustrialChain/data.d';
import Tag from '@/pages/IndustrialChain/components/Tag';
import { List } from 'antd';
import { useCallback, useContext, useEffect, useState } from 'react';
import TitleContent from '../TitleContent';
import {
  queryChainNodeNewsInfoLimitList,
  SelectKeyProvider,
  TabProvider,
} from '@/pages/IndustrialChain/ChainDetail/service';
import styles from './index.less';

// 列表
interface paginationType {
  current: number;
  pageSize: number;
  total: number;
}

const PublicOpinion = () => {
  const { selectKey }: any = useContext(SelectKeyProvider);
  const { tab } = useContext(TabProvider);
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<paginationType>({
    pageSize: 10,
    current: 1,
    total: 0,
  });

  const getList = useCallback(
    async (num = 1, size = 10) => {
      let result: any = {};

      if (selectKey?.nodeId) {
        setLoading(true);

        result = await queryChainNodeNewsInfoLimitList({
          current: num,
          pageSize: size,
          nodeId: selectKey.nodeId,
        });

        const { current = 1, pageSize = 10, total, dataList = [] } = result || {};

        setList(dataList);
        setPagination({
          current,
          pageSize,
          total,
        });
        setLoading(false);
      }
    },
    [selectKey?.nodeId, tab],
  );

  useEffect(() => {
    // 当tree的选择节点改变的时候请求接口
    if (tab === 'publicOpinion') {
      const { current, pageSize } = pagination;

      getList(current, pageSize);
    }
  }, [selectKey, tab]);

  return (
    <div className={styles['public-opinion']}>
      <TitleContent
        data={[
          {
            title: selectKey?.nodeName,
            description: selectKey?.nodeDesc,
          },
        ]}
      />
      <List
        size="small"
        rowKey="eventTitle"
        itemLayout="vertical"
        dataSource={list}
        loading={loading}
        pagination={
          list?.length
            ? {
                ...pagination,
                showSizeChanger: true,
                showTotal: (num) => `共 ${num} 条`,
                onChange: (page, size) => {
                  getList(page, size);
                },
              }
            : false
        }
        renderItem={(
          {
            author, // 文章作者
            eventDate, // 新闻发生时间
            eventTitle, // 新闻标题
            fromSource, // 新闻来源
            newsUrl, // 新闻URL
            newsContent, //内容
            publicSentiment, // 新闻情绪
          }: any,
          index,
        ) => (
          <List.Item
            className={styles['list-item']}
            key={index}
            actions={[
              <div className={styles['list-item-date']}>
                <span>{eventDate}</span>
                {fromSource ? <span>|&nbsp;&nbsp;{fromSource}</span> : null}
                {author ? <span>|&nbsp;&nbsp;{author}</span> : null}
                <Tag
                  color={tagTypeMap[publicSentiment]?.color}
                  backgroundColor={tagTypeMap[publicSentiment]?.backgroundCol}
                >
                  {publicSentiment}
                </Tag>
              </div>,
            ]}
            onClick={() => {
              window.open(newsUrl);
            }}
          >
            <List.Item.Meta
              title={eventTitle}
              className={styles['list-item-desc']}
              description={newsContent}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default PublicOpinion;
