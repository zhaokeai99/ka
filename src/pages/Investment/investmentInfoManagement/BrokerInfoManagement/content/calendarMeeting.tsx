import { ContentWithEmoji } from '@/pages/Investment/components/WechatEmoji';
import { SelmRoadShowInfoFacadeQueryRoadShowSimple } from '@/pages/Investment/investmentInfoManagement/BrokerInfoManagement/service';
import ProCard from '@ant-design/pro-card';
import { Calendar, Empty, Spin, Timeline } from 'antd';
import moment from 'moment';
import { memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import '../index.css';

interface ModalProps {
  cRef: any;
  onShow: (id: number) => void;
  loading: boolean;
}

/**
 * 会议
 * @param props
 * @constructor
 */
const CalendarMeeting = (props: ModalProps) => {
  const { cRef, onShow, loading } = props;
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [listData, setListData] = useState<any>([]);
  const [tradeDate, setTradeDate] = useState<any>(moment().format('YYYYMMDD'));
  const [divHeight, setDivHeight] = useState<number>(600);

  const calRef = useRef(null);
  const calInfoRef = useRef(null);

  //动态位置
  const anchorToDivTop = (tDate: string) => {
    const today = moment().format('YYYYMMDD');
    if (today !== tDate) {
      return;
    }
    const nowTime = moment().format('HH');
    const idStr = 'tl_' + nowTime + '_0';
    const div = document.querySelector('#' + idStr);
    if (div != undefined) {
      const divRef = document.querySelector('#divFrame');
      if (divRef != undefined && divRef != null) {
        // @ts-ignore
        divRef.scrollTop = div?.offsetTop;
      }
    }
  };

  //查询记录
  const loadListData = useCallback(async (tDate: any) => {
    setListLoading(true);
    setTradeDate(tDate);
    const params = {
      sourceType: 'WX',
      tradeDate: tDate,
      showType: 1,
    };
    const result = await SelmRoadShowInfoFacadeQueryRoadShowSimple(params);
    const { success, data } = result;
    setListLoading(false);
    if (success) {
      setListData(data);
      if (data?.length > 0) {
        setDivHeight(document.body.offsetHeight - 76 - 80 - 68 - 27);
      } else {
        setDivHeight(200);
      }
      setTimeout(function () {
        anchorToDivTop(tDate);
      }, 200);
    }
  }, []);

  //日期选择
  const dateSelect = (date: any) => {
    loadListData(moment(date).format('YYYYMMDD'));
  };

  //位置移动
  const calMoveHandle = () => {
    // @ts-ignore
    const scrollTop =
      calRef?.current?.parentElement.parentElement.parentElement.parentElement.parentElement
        .scrollTop;

    if (scrollTop > 138 + 389) {
      // @ts-ignore
      calRef.current.style.position = 'absolute';
      // @ts-ignore
      calRef.current.style.top = scrollTop - 153 - 16 - 389 + 'px';
    } else {
      // @ts-ignore
      calRef.current.style.position = '';
    }
  };

  const onResize = () => {
    setDivHeight(document.body.offsetHeight - 76 - 80 - 68 - 27);
  };

  useEffect(() => {
    loadListData(tradeDate);
    // @ts-ignore
    const divScorll =
      calRef.current.parentElement.parentElement.parentElement.parentElement.parentElement;
    divScorll.addEventListener('scroll', calMoveHandle);
    window.addEventListener('resize', onResize);
    return () => {
      divScorll.removeEventListener('scroll', calMoveHandle);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  //更新
  useImperativeHandle(cRef, () => ({
    // 更新树
    onSearch: () => {
      loadListData(tradeDate);
    },
  }));

  //当前执行会议
  const getCurr = (item: any) => {
    const today = moment().format('YYYYMMDD');
    if (today !== tradeDate) {
      return {};
    }
    const showTime = moment(item.showTime).format('HH');
    const nowTime = moment().format('HH');
    if (showTime == nowTime) {
      return { fontWeight: 'bolder' };
    } else {
      return {};
    }
  };

  //当前执行会议颜色
  const getColor = (item: any) => {
    const today = moment().format('YYYYMMDD');
    if (today !== tradeDate) {
      return 'green';
    }
    const showTime = moment(item.showTime).format('HH');
    const nowTime = moment().format('HH');
    if (showTime < nowTime) {
      return 'green';
    } else if (showTime == nowTime) {
      return 'red';
    } else {
      return 'blue';
    }
  };

  //生成id
  const getTimelineId = (item: any) => {
    const hh = moment(item.showTime).format('HH');
    let i = 0;
    let idStr = '';
    for (const d of listData) {
      if (moment(d.showTime).format('HH') === hh) {
        if (d.id === item.id) {
          idStr = 'tl_' + hh + '_' + i;
          break;
        }
        i++;
      }
    }
    return idStr;
  };

  //会议查看
  const meetingClick = (item: any) => {
    onShow(item.id);
  };

  return (
    <div ref={calRef} style={{ padding: '16px 0 0 16px' }}>
      <ProCard style={{ padding: '16px 24px 16px 24px' }} bodyStyle={{ padding: 0 }}>
        <div className={'attention-card-title'}>会议日历</div>
        <Calendar
          fullscreen={false}
          onSelect={dateSelect}
          // dateFullCellRender={calDateRender}
        />
      </ProCard>

      <ProCard ref={calInfoRef} style={{ padding: '0 24px 16px 24px' }} bodyStyle={{ padding: 0 }}>
        <div className={'meeting-date-title'}>{moment(tradeDate).format('YYYY年MM月DD日')}</div>
        <div id="divFrame" style={{ height: divHeight, overflowY: 'auto', paddingTop: 10 }}>
          <Spin spinning={loading || listLoading}>
            {listData?.length > 0 ? (
              <Timeline>
                {listData.map((item: any) => {
                  return (
                    <div
                      id={getTimelineId(item)}
                      onClick={() => meetingClick(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Timeline.Item key={item.id} color={getColor(item)}>
                        <div>
                          <span className={'cal_meeting_time'}>
                            {moment(item.showTime).format('HH:mm')}
                          </span>
                          <span style={getCurr(item)} className={'cal_meeting_title'}>
                            <ContentWithEmoji
                              source="wechat-emoji.png"
                              emojiScale={0.3}
                              content={item.showTitle}
                            />
                          </span>
                        </div>
                      </Timeline.Item>
                    </div>
                  );
                })}
              </Timeline>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Spin>
        </div>
      </ProCard>
    </div>
  );
};

export default memo(CalendarMeeting);
