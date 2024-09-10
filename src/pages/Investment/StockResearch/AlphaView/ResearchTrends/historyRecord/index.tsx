import React, { memo, useCallback, useEffect, useState } from 'react';
import { IrReportFacadeQueryTargetRand } from '../service';
import { List } from 'antd';
import styles from './index.less';
import lodash from 'lodash';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import ListItemForm from '../form/listItemForm';
import AbbrItemForm from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/abbrItemForm';

interface ModalProps {
  data: any;
  fullMode?: boolean;
}

const HistoryView = (props: ModalProps) => {
  const { data, fullMode } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [dataList, setDataList] = useState<any>([]);
  const [divHeight, setDivHeight] = useState<number>(document.body.clientHeight - 300);
  const [prevRecordCts, setPrevRecordCts] = useState<number>(0);
  const [nextRecordCts, setNextRecordCts] = useState<number>(0);

  // 监听resize
  useEffect(() => {
    function onResize() {
      const h = document.body.clientHeight;
      setDivHeight(h - 300);
    }

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleData = useCallback((d: any[]) => {
    const tmp = lodash.sortBy(d, ['id']);
    return tmp;
  }, []);
  //数据加载
  const dataLoad = useCallback(async () => {
    setLoading(true);
    const prev = data.prev === undefined ? 2 : data.prev;
    const next = data.next === undefined ? 3 : data.next;
    const param = {
      id: data.id,
      prevPageNo: prev,
      nextPageNo: next,
      includeRecord: '1',
    };
    const resultData = await IrReportFacadeQueryTargetRand(param);
    const { prevCts, nextCts, recordList } = resultData;

    const tmpData = handleData([...recordList]);
    setDataList(tmpData);
    setPrevRecordCts(prevCts);
    setNextRecordCts(nextCts);
    setLoading(false);
  }, [data]);

  useEffect(() => {
    dataLoad();
  }, []);

  //向上查询
  const prevSearch = useCallback(async () => {
    if (dataList === undefined || dataList === null || dataList.length === 0) {
      return;
    }
    setLoading(true);
    const pid = dataList[0].id;
    const params = {
      id: pid,
      prevPageNo: 2,
      nextPageNo: 0,
      includeRecord: '0',
    };
    const resultData = await IrReportFacadeQueryTargetRand(params);
    const { prevCts, recordList } = resultData;
    const tmpData = handleData([...recordList, ...dataList]);

    setDataList([...tmpData]);
    setPrevRecordCts(prevCts);
    setLoading(false);
  }, [dataList]);

  //向下查询
  const nextSearch = useCallback(async () => {
    if (dataList === undefined || dataList === null || dataList.length === 0) {
      return;
    }
    setLoading(true);
    const pid = dataList[dataList.length - 1].id;
    const params = {
      id: pid,
      prevPageNo: 0,
      nextPageNo: 2,
      includeRecord: '0',
    };
    const resultData = await IrReportFacadeQueryTargetRand(params);
    const { nextCts, recordList } = resultData;
    const tmpData = handleData([...recordList, ...dataList]);

    setDataList([...tmpData]);
    setNextRecordCts(nextCts);
    setLoading(false);
  }, [dataList]);

  return (
    <>
      <div
        style={{ overflowY: 'auto', height: divHeight }}
        className={styles['research_trends_history']}
      >
        <div className={styles['page-style']}>
          {prevRecordCts > 0 ? (
            <a onClick={prevSearch}>
              向上翻页
              <UpOutlined />
            </a>
          ) : (
            <span>无记录</span>
          )}
        </div>
        <div className={'research_trends_time_line'}>
          <List
            loading={loading}
            bordered
            dataSource={dataList}
            itemLayout="vertical"
            renderItem={(item: any) => {
              return fullMode ? (
                <ListItemForm
                  currId={data.id}
                  key={item.id}
                  itemData={item}
                  rowno={item.rowno}
                  showHistory={false}
                />
              ) : (
                <AbbrItemForm
                  key={item.id}
                  itemData={item}
                  showHistory={false}
                  rowno={item.rowno}
                />
              );
            }}
          />
        </div>
        <div className={styles['page-style']}>
          {nextRecordCts > 0 ? (
            <a onClick={nextSearch}>
              向下翻页
              <DownOutlined />
            </a>
          ) : (
            <span>无记录</span>
          )}
        </div>
      </div>
    </>
  );
};
export default memo(HistoryView);
