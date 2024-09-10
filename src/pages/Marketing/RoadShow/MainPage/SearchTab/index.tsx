import React, { useCallback, useState, useEffect } from 'react';
import { Pagination, message } from 'antd';
import SearchHeader from './SearchHeader';
import ShowList from './ShowList';
import { queryRoadShow } from '../../service';
import { STATUS, MY, STYLE } from '../../constant';

import styles from './index.less';

const RoadShow: React.FC<any> = (props) => {
  const { onDetail, onEdit, onCancel } = props;

  const [total, setTotal] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataList, setDataList] = useState([]);
  const [condition, setCondition] = useState({
    status: STATUS.ALL,
    my: MY.ALL,
    style: STYLE.ALL, // 后端没支持
    dateRange: null,
    currentPage: 1,
  });

  const onSearchChange = useCallback((conditions) => {
    setCondition({ ...condition, ...conditions });
  }, []);

  // 变化后查询逻辑
  useEffect(() => {
    const params = {
      index: currentPage,
      size: 10,
      searchWord: condition.searchWord,
      queryRoadShowRangeType: condition.my, // 我创建的，我参加的，全部
      queryRoadShowStatusType: condition.status, // 路演状态，全部，未开始，完成
      // 日历组件，向前可能多展示6个，总共6行，所以向后可能多展示13个，需要时间拉长一些
      startDate: condition.dateRange && condition.dateRange[0].format('YYYY-MM-DD HH:ss:mm'),
      endDate: condition.dateRange && condition.dateRange[1].format('YYYY-MM-DD HH:ss:mm'),
    };

    queryRoadShow(params)
      .then((res) => {
        if (res && res.success && res.data) {
          setDataList(res.data && res.data.records);
          setTotal((res.data && res.data.total) || 0);
        } else {
          message.error('没有数据！');
        }
      })
      .catch((e) => console.log(e));
  }, [condition]);

  return (
    <div className={styles['main-container']}>
      <SearchHeader onSearchChange={onSearchChange} />
      <ShowList datas={dataList} onDetail={onDetail} onEdit={onEdit} onCancel={onCancel} />
      <div className={styles['pagination-container']}>
        <Pagination
          size="small"
          total={total}
          current={currentPage}
          pageSize={10}
          showSizeChanger={false}
          showQuickJumper
          onChange={(curr) => {
            setCurrentPage(curr);
            setCondition({ ...condition, currentPage: curr });
          }}
        />
      </div>
    </div>
  );
};

export default RoadShow;
