import { LoadingOutlined } from '@ant-design/icons';
import { Button, List } from 'antd';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import React, { useState, useCallback, useMemo } from 'react';
import { cardGutter, contentPadding } from '@/themes';
import SearchForm from './SearchForm';
import DetailModal from '../../components/DetailModal';
import EventDetail from '../../components/EventDetail';
import type { ListItemDataType, detailType } from './service';
import styles from './index.less';
import { getList } from './service';

type PropsType = {
  colSpan: number;
};

// 狭义舆情
const Narrow = (props: PropsType) => {
  const [list, setDataList] = useState<ListItemDataType[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [isLastPage, setLastPage] = useState(false);
  const [formParams, setformParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isShowDetailModal, showDetailModal] = useState(false);
  const [detailInfo, setDetailInfo] = useState<detailType>({ id: 0, eventType: 0 });

  const getDataList = useCallback(
    async (params, isLast) => {
      if (isLast) {
        return;
      }
      setLoading(true);
      const result = await getList({ ...params, pageSize: 10 });
      setLoadingMore(false);
      setLoading(false);
      setDataList((pre) => {
        return params.pageNum === 1 ? result.data || [] : pre.concat(result.data || []);
      });
      setPageNum(result.pageNum || 1);
      setLastPage(!!result.isLastPage);
    },
    [isLastPage],
  );

  const handleFormChange = useCallback(
    (allValues) => {
      setformParams(allValues);
      getDataList({ pageNum: 1, ...allValues }, false);
    },
    [getDataList],
  );

  const hanldeOpenDetail = useCallback((info) => {
    setDetailInfo({ id: info.id, eventType: info.xyType });
    showDetailModal(true);
  }, []);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    setPageNum(pageNum + 1);
    getDataList({ pageNum: pageNum + 1, ...formParams }, isLastPage);
  }, [pageNum, formParams, getDataList]);

  const loadMoreDom = useMemo(() => {
    if (isLastPage) {
      return null;
    }
    return (
      list.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={loadMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {loadingMore ? (
              <span>
                <LoadingOutlined /> 加载中...
              </span>
            ) : (
              '加载更多'
            )}
          </Button>
        </div>
      )
    );
  }, [isLastPage, list, loadingMore]);

  return (
    <ProCard ghost direction="column" colSpan={props.colSpan} gutter={[0, cardGutter]}>
      <ProCard bordered={false} bodyStyle={{ padding: contentPadding, paddingBottom: '6px' }}>
        <SearchForm onChange={handleFormChange} />
      </ProCard>
      <ProCard
        bordered={false}
        bodyStyle={{ padding: '0 24px 20px', minHeight: '744px' }}
        layout="center"
      >
        <List<ListItemDataType>
          size="large"
          className={styles['list-wrap']}
          loading={loading}
          rowKey="id"
          itemLayout="vertical"
          loadMore={loadMoreDom}
          dataSource={list}
          renderItem={(item, index) => (
            <List.Item
              key={`${item.id}-${index}`}
              style={{ padding: 0 }}
              className={styles['text-ellipsis']}
            >
              <div className={styles['list-header']}>
                <div className={styles['header-title']}>{item.eventTitle}</div>
                <div className={styles['header-date']}>
                  {moment(item.tDate).format('YYYY/MM/DD')}
                </div>
                {item.holdStatus === 1 ? (
                  <img
                    className={styles['header-state']}
                    src="https://yuque.thfund.com.cn/api/filetransfer/images?url=https%3A%2F%2Fthfund-yuque-assets.thfund.com.cn%2Fassets%2Fyuque%2F0%2F2021%2Fpng%2F2831312%2F1637212663700-0cd6f6b6-7a12-41f7-86bb-65118f12ce9a.png"
                  />
                ) : null}
              </div>
              <EventDetail data={item} hanldeOpenDetail={hanldeOpenDetail} />
            </List.Item>
          )}
        />
      </ProCard>
      <DetailModal
        visible={isShowDetailModal}
        eventId={detailInfo.id}
        xyType={detailInfo.eventType}
        onClose={useCallback(() => showDetailModal(false), [])}
      />
    </ProCard>
  );
};

Narrow.isProCard = true;

export default Narrow;
