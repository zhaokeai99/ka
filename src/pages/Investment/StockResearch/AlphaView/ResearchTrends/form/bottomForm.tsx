import { Divider, Space, Spin } from 'antd';
import React, { memo, useCallback, useState } from 'react';
import { irReportFacadeQueryByPage } from '../service';

import Icon from './icons';
import MornListForm from './mornListForm';
import AbbrMornListForm from './abbrMornListForm';

interface ModalProps {
  itemData: any;
  viewUrl?: string;
  onHistoryViewShow?: (val: any) => void;
  listParams?: any;
  showHistory?: boolean;
  rowno?: number;
  showLabel?: boolean;
}

/**
 * 更多查看
 * @param props
 * @constructor
 */
const BottomForm = (props: ModalProps) => {
  const { itemData, viewUrl, onHistoryViewShow, listParams, showHistory, rowno, showLabel } = props;
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

  //查看历史
  const historyViewShow = (d: any) => {
    onHistoryViewShow?.(d);
  };

  //#标签处理
  const getLabel = (data: any) => {
    const labelReturn: any[] = [];
    //标签
    if (
      data?.labelModelList !== undefined &&
      data.labelModelList !== null &&
      data.labelModelList !== '' &&
      data.labelModelList.length > 0
    ) {
      let i = 0,
        tmp = 0;
      if (rowno) {
        i = rowno % 3;
      }
      data?.labelModelList.map((label: any) => {
        if (label.labelContent1 && label.labelType === 4) {
          let colorI = i;
          if (data.labelNo > 0) {
            colorI = i + tmp;
            colorI = colorI % 3;
          }
          if ('#' === label.labelContent1.substring(0, 1)) {
            labelReturn.push(
              <>
                <div className={'research-label-type research-label-type-color-' + colorI}>
                  <span className={'research-label-type-left'}>#</span>
                  <span className={'research-label-type-content'}>
                    {label.labelContent1.substring(1)}
                  </span>
                </div>
              </>,
            );
            tmp++;
          }
        }
      });
    }
    return labelReturn;
  };

  const getBottom = (data: any) => {
    const btns = [];
    if (showLabel === undefined || showLabel) {
      //label
      const label = getLabel(data);
      if (label) {
        btns.push(<Space size={10}>{label}</Space>);
        btns.push(<Divider type={'vertical'} style={{ margin: 0 }} />);
      }
    } else {
      btns.push(<div style={{ width: 184 }}></div>);
    }
    if (showHistory === undefined || showHistory) {
      btns.push(
        <a onClick={() => historyViewShow(data)}>
          <div className={'item-bottom-button-icon'}>
            <span className={'item-icon-span'}>{Icon.IconHistory}</span>
            <span>查看记录</span>
          </div>
        </a>,
      );
    }
    if (btnShowMore) {
      btns.push(
        <div className={'research-item-more-btn item-bottom-button-icon'} onClick={moreClick}>
          <span className={'item-icon-span'}>{Icon.IconExpend}</span>
          <span>更多评论({showDataCts})</span>
        </div>,
      );
    }
    if (btnShowClose) {
      btns.push(
        <div className={'research-item-more-btn item-bottom-button-icon'} onClick={closeClick}>
          <span className={'item-icon-span'}>{Icon.IconExpend}</span>
          <span>收起评论</span>
        </div>,
      );
    }
    if (viewUrl && (itemData.subType === undefined || itemData.subType !== 6)) {
      btns.push(
        <div>
          <a href={data.attachment} target={'_blank'} rel="noreferrer">
            <div className={'item-bottom-button-icon'}>
              <span className={'item-icon-span'}>{Icon.IconJump}</span>
              <span>跳转链接</span>
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

  return (
    <>
      {getBottom(itemData)}
      {listShow && dataList.length > 0 ? (
        <>
          <Spin spinning={loading}>
            {showLabel ? (
              <MornListForm
                dataList={dataList}
                rowno={rowno}
                onHistoryViewShow={onHistoryViewShow}
              />
            ) : (
              <AbbrMornListForm
                dataList={dataList}
                rowno={rowno}
                onHistoryViewShow={onHistoryViewShow}
              />
            )}
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
    </>
  );
};
export default memo(BottomForm);
