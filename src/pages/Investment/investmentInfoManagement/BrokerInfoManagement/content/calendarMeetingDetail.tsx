import { ContentWithEmoji } from '@/pages/Investment/components/WechatEmoji';
import { MSG_TYPE_DIC } from '@/pages/Investment/investmentInfoManagement/BrokerInfoManagement/service';
import { Divider, Image, Space, Tag } from 'antd';
import moment from 'moment';
import { memo, useCallback, useEffect, useState } from 'react';
import '../index.css';
import { IrReportFacadeGetOssUrl } from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/service';

interface ModalProps {
  data: any;
}

/**
 * 会议内容查看
 * @param props
 * @constructor
 */
const CalendarMeetingDetail = (props: ModalProps) => {
  const { data } = props;
  const [imgShow, setImgShow] = useState<boolean>(true);
  const [imgUrl, setImgUrl] = useState<any>('');

  const imgLoad = useCallback(async () => {
    if (!data.logoUrl) {
      return;
    }
    if (data.logoUrl.toLowerCase().indexOf('http') >= 0) {
      setImgUrl(data.logoUrl);
      return;
    }
    const params = {
      attachment: data.logoUrl,
    };
    const dataUrl = await IrReportFacadeGetOssUrl(params);
    if (dataUrl !== undefined && dataUrl !== null) {
      setImgUrl(dataUrl);
    }
  }, []);

  useEffect(() => {
    imgLoad();
  }, []);
  const bottomActions = (item: any) => {
    const result: any = [];
    // if (item?.showUrl) {
    //   result.push(
    //     <a href={item?.showUrl} rel={'noreferrer'} target="_blank">
    //       查看
    //     </a>,
    //   );
    // }
    if (item?.showTime) {
      result.push(<span>会议时间：{moment(item?.showTime).format('YYYY-MM-DD HH:mm')}</span>);
    }
    if (item?.phoneNumber) {
      result.push(<span>电话：{item?.phoneNumber}</span>);
    }
    // if (item?.wechatGroupName) {
    //   result.push(<span>微信群：{item?.wechatGroupName}</span>);
    // }
    if (item?.chgTime) {
      result.push(<span>更新时间：{moment(item?.receiveTime).format('YYYY-MM-DD HH:mm')}</span>);
    }
    return result;
  };

  // 去两端回车
  const removeLine = (str: string) => {
    if (str === undefined || str === null) {
      return '';
    }
    const newText = str.split('\n');
    while (newText[0] === '') {
      newText.shift();
    }
    while (newText.length !== 0 && newText[newText.length - 1] === '') {
      newText.pop();
    }
    return newText.join('\n');
  };
  const getDescription = (item: any) => {
    const dataItems = [];
    if (item?.industryName) {
      dataItems.push(
        <Tag className={'list-tag'} key={item?.industryName}>
          {item?.industryName}
        </Tag>,
      );
    }
    if (item?.brokerName) {
      dataItems.push(
        <Tag className={'list-tag'} key={item?.brokerName}>
          {item?.brokerName}
        </Tag>,
      );
    }
    if (item?.stockName) {
      dataItems.push(
        <Tag className={'list-tag'} key={item?.stockName}>
          {item?.stockName}
        </Tag>,
      );
    }
    if (item?.label) {
      item?.label?.map((n: any) => {
        if (n.labelType === 2) {
          dataItems.push(
            <Tag className={'list-tag2'} key={n.labelContent}>
              {n.labelContent}
            </Tag>,
          );
        }
      });
    }
    if (dataItems.length > 0) {
      return <Space>{dataItems}</Space>;
    }
    return undefined;
  };

  return (
    <>
      <div>{getDescription(data)}</div>
      <div style={{ marginTop: 10 }}>
        <div style={{ display: 'inline-block', width: 'calc(100% - 410px)', verticalAlign: 'top' }}>
          <ContentWithEmoji
            source="wechat-emoji.png"
            emojiScale={0.3}
            content={removeLine(data?.showContent)}
          />
        </div>
        <div style={{ display: 'inline-block', width: '400px', paddingLeft: '5px' }}>
          <div style={{ position: 'relative', width: '395px', height: '222px' }}>
            {imgUrl && imgShow ? (
              <Image
                width={395}
                height={222}
                src={imgUrl}
                onError={() => {
                  setImgShow(false);
                }}
              />
            ) : (
              ''
            )}

            <div className={'list-item-type-label'}>{MSG_TYPE_DIC[data?.showType]}</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, color: 'rgba(0, 0, 0, 0.45)' }}>
        <Space split={<Divider type="vertical" />}>{bottomActions(data)}</Space>
      </div>
    </>
  );
};

export default memo(CalendarMeetingDetail);
