import { List, Space, Spin, Typography } from 'antd';
import React, { memo, useCallback, useState } from 'react';
import DwType1Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form1';
import DwType3Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form3';
import DwType49_57Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_57';
import DwType49_6Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_6';
import DwType49_5Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_5';
import DwType49_19Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_19';
import moment from 'moment';
import AbbrMornListForm from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/abbrMornListForm';
import Icon from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/icons';
import { irReportFacadeQueryByPage } from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/service';

interface ModalProps {
  itemData: any; //数据
  onHistoryViewShow?: (data: any) => void; //查询历史记录
  listParams?: any; //查询条件
  rowno?: number; //行号，用于标签颜色
  showHistory: boolean;
  currId?: number;
  fullScreen?: boolean;
}

const { Text } = Typography;

const ListItemForm = (props: ModalProps) => {
  const { itemData, onHistoryViewShow, listParams, rowno, showHistory, fullScreen, currId } = props;

  const [btnShowMore, setBtnShowMore] = useState<boolean>(itemData?.cts > 1 ? true : false);
  const [btnShowClose, setBtnShowClose] = useState<boolean>(false);
  const [listShow, setListShow] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataList, setDataList] = useState<any>([]);
  const [showDataCts, setShowDataCts] = useState<number>(itemData?.cts - 1);
  const [pageCurrent, setPageCurrent] = useState<number>(1);

  //加载更多
  const loadMore = useCallback(async () => {
    setLoading(true);
    const p = {
      receiveDate: itemData.receiveDate,
      excludeId: itemData.id,
      wechatGroupId: itemData.wechatGroupId,
      stockCodes: listParams?.stockCodes,
      current: pageCurrent,
      pageSize: 10,
      sortField: 'id',
      sortOrder: 'asc',
      dataType: listParams?.dataType,
      investLevel: listParams?.investLevel,
      // userAccount: listParams?.userAccount,
    };

    const resultData = await irReportFacadeQueryByPage(p);
    const { data } = resultData;

    const allData = [...dataList, ...data];
    setDataList(allData);
    setShowDataCts(itemData.cts - allData.length - 1);
    if (allData?.length > 0) {
      setBtnShowClose(true);
    }
    if (allData?.length >= itemData.cts - 1) {
      setBtnShowMore(false);
    }
    setLoading(false);
    setPageCurrent(pageCurrent + 1);
  }, [dataList, listParams, pageCurrent, itemData]);

  //更新点击
  const moreClick = useCallback(async () => {
    if (!listShow && dataList?.length > 0) {
      setListShow(true);
      setBtnShowClose(true);
      if (dataList?.length >= itemData.cts - 1) {
        setBtnShowMore(false);
      }
    } else {
      loadMore();
    }
  }, [listShow, dataList, itemData]);

  //关闭点击
  const closeClick = useCallback(async () => {
    setListShow(false);
    setBtnShowClose(false);
    setBtnShowMore(true);
    setShowDataCts(itemData.cts - 1);
  }, [itemData]);

  //信息item
  const getForm = (d: any) => {
    if (d.dwType === 1) {
      return <DwType1Form key={d.id} itemData={d} abbr={true} />;
    } else if (d.dwType === 3) {
      return <DwType3Form key={d.id} itemData={d} />;
    } else if (d.dwType === 49 && d.subType === 57) {
      return <DwType49_57Form key={d.id} itemData={d} abbr={true} />;
    } else if (d.dwType === 49 && d.subType === 6) {
      return <DwType49_6Form key={d.id} itemData={d} />;
    } else if (d.dwType === 49 && (d.subType === 5 || d.subType === 36)) {
      return <DwType49_5Form key={d.id} itemData={d} abbr={true} />;
    } else if (d.dwType === 49 && d.subType === 19) {
      return <DwType49_19Form key={d.id} itemData={d} />;
    } else {
      return (
        <>
          <Text key={d.id}>{d.reportContent ? d.reportContent : ''}</Text>{' '}
        </>
      );
    }
  };

  const getBottom = (data: any) => {
    const btns = [];

    if (!fullScreen && showHistory) {
      btns.push(
        <a onClick={() => onHistoryViewShow(itemData)}>
          <div className={'item-bottom-button-icon'}>
            <span className={'item-icon-span'}>{Icon.IconHistory}</span>
          </div>
        </a>,
      );
    }
    if (btnShowMore) {
      btns.push(
        <div className={'research-item-more-btn item-bottom-button-icon'} onClick={moreClick}>
          <span className={'item-icon-span'}>{Icon.IconExpend}</span>
          <span>{showDataCts}</span>
        </div>,
      );
    }
    if (btnShowClose) {
      btns.push(
        <div className={'research-item-more-btn item-bottom-button-icon'} onClick={closeClick}>
          <span className={'item-icon-span'}>{Icon.IconExpend}</span>
        </div>,
      );
    }
    if (itemData?.attachment && (itemData.subType === undefined || itemData.subType !== 6)) {
      btns.push(
        <div>
          <a href={data.attachment} target={'_blank'} rel="noreferrer">
            <div className={'item-bottom-button-icon'}>
              <span className={'item-icon-span'}>{Icon.IconJump}</span>
            </div>
          </a>
        </div>,
      );
    }
    if (btns.length > 0) {
      return (
        <div className={'item-bottom-button'}>
          <Space size={'middle'}>{btns}</Space>
        </div>
      );
    }
    return undefined;
  };

  const getUserName = (str: string) => {
    if (str) {
      if (str.length > 2) {
        return str;
      }
      return str[0] + '　' + str[1];
    }
    return '';
  };
  return (
    <>
      <List.Item
        className={
          (itemData.classType ? itemData.classType + ' ' : '') +
          (currId && currId === itemData.id ? 'research_trends_time_line_current' : '')
        }
      >
        <div style={{ display: 'flex', verticalAlign: 'top' }}>
          <div style={{ width: 165, display: 'inline-block' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.45)' }}>
              <span>{moment(itemData.receiveTime).format('YY-MM-DD HH:mm')}</span>
              &nbsp;&nbsp;
              <span>{getUserName(itemData.userAccountName)}</span>
            </div>
          </div>
          <div style={{ display: 'inline-block', width: 'calc( 100% - 205px - 20px - 100px)' }}>
            {getForm(itemData)}
          </div>
          <div style={{ display: 'inline-block', width: '100px', marginLeft: '10px' }}>
            {getBottom(itemData)}
          </div>
        </div>
        <div>
          {listShow && dataList.length > 0 ? (
            <>
              <Spin spinning={loading}>
                <AbbrMornListForm
                  dataList={dataList}
                  rowno={rowno}
                  onHistoryViewShow={onHistoryViewShow}
                />
                <div className={'item-bottom-button'}>
                  <Space size={'small'}>
                    {btnShowMore ? (
                      <div
                        className={'research-item-more-btn item-bottom-button-icon'}
                        onClick={moreClick}
                      >
                        <span className={'item-icon-span'}>{Icon.IconMore}</span>
                        <span>查看更多({showDataCts})</span>
                      </div>
                    ) : undefined}
                    {btnShowClose ? (
                      <div
                        className={'research-item-more-btn item-bottom-button-icon'}
                        onClick={closeClick}
                      >
                        <span className={'item-icon-span'}>{Icon.IconExpend}</span>
                        <span>收起评论</span>
                      </div>
                    ) : undefined}
                  </Space>
                </div>
              </Spin>
            </>
          ) : undefined}
        </div>
      </List.Item>
    </>
  );
};

export default memo(ListItemForm);
