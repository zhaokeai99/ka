import { ContentWithEmoji } from '@/pages/Investment/components/WechatEmoji';
import { MSG_TYPE_DIC } from '@/pages/Investment/investmentInfoManagement/BrokerInfoManagement/service';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Image, List, Space, Tag } from 'antd';
import moment from 'moment';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import '../../index.css';
import { IrReportFacadeGetOssUrl } from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/service';

interface ModalProps {
  itemData: any;
}

const ConferenceItem = (props: ModalProps) => {
  const { itemData } = props;
  const [contentMode, setContentMode] = useState<boolean>(false);
  const [btnShow, setBtnShow] = useState<boolean>(false);
  const [contentFormHeight, setContentFormHeight] = useState<string>('0px');
  const [imgUrl, setImgUrl] = useState<any>('');
  const [showFile, setShowFile] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const imgLoad = useCallback(async () => {
    if (!itemData.logoUrl) {
      return;
    }
    if (itemData.otherType === 2) {
      setShowFile(true);
    } else {
      if (itemData.logoUrl.toLowerCase().indexOf('http') >= 0) {
        setImgUrl(itemData.logoUrl);
        return;
      }
      const params = {
        attachment: itemData.logoUrl,
      };
      const data = await IrReportFacadeGetOssUrl(params);
      if (data !== undefined && data !== null) {
        setImgUrl(data);
      }
    }
  }, []);

  useEffect(() => {
    if (itemData?.showContent) {
      setBtnShow(true);
    }
    imgLoad();
  }, []);

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

  // 按钮
  const btnExpand = useCallback(() => {
    if (!contentMode) {
      // @ts-ignore
      const h = contentRef?.current?.offsetHeight;
      setContentMode(true);
      setContentFormHeight(h + 'px');
    } else {
      setContentMode(false);
      setContentFormHeight('0px');
    }
  }, [contentMode]);

  const bottomActions = useCallback(
    (item: any) => {
      const result: any = [];
      if (btnShow) {
        result.push(
          <div
            className={'btn_expend'}
            onClick={btnExpand}
            style={{ background: '#fff', color: '#5e93fd' }}
          >
            {contentMode ? (
              <>
                收起
                <CaretUpOutlined />
              </>
            ) : (
              <>
                展开
                <CaretDownOutlined />
              </>
            )}
          </div>,
        );
      }

      if (item?.showTime) {
        result.push(<span>会议时间：{moment(item?.showTime).format('YYYY-MM-DD HH:mm')}</span>);
      }
      if (item?.phoneNumber) {
        result.push(<span>电话：{item?.phoneNumber}</span>);
      }
      if (item?.chgTime) {
        result.push(<span>发布时间：{moment(item?.receiveTime).format('YYYY-MM-DD HH:mm')}</span>);
      }
      return result;
    },
    [btnShow, contentMode],
  );

  //标签
  const getDescription = (item: any) => {
    const data = [];
    if (item?.industryName) {
      data.push(
        <Tag className={'list-tag'} key={item?.industryName}>
          {item?.industryName}
        </Tag>,
      );
    }
    if (item?.brokerName) {
      data.push(
        <Tag className={'list-tag'} key={item?.brokerName}>
          {item?.brokerName}
        </Tag>,
      );
    }
    if (item?.stockName) {
      data.push(
        <Tag className={'list-tag'} key={item?.stockName}>
          {item?.stockName}
        </Tag>,
      );
    }
    if (item?.label) {
      if (item?.label?.org) {
        item?.label?.org?.map((n: any) => {
          data.push(
            <Tag className={'list-tag2'} key={n}>
              {n}
            </Tag>,
          );
        });
      }
    }
    if (data.length > 0) {
      return <Space>{data}</Space>;
    }
    return undefined;
  };

  //文件下载
  const fileDown = async (url: any) => {
    const params = {
      attachment: url,
    };
    const data = await IrReportFacadeGetOssUrl(params);
    if (data !== undefined && data !== null) {
      window.open(data);
    }
  };

  //标题
  const handleTitle = (item: any) => {
    if (showFile) {
      return (
        <a
          onClick={() => fileDown(item?.logoUrl)}
          className={'broker-title-a-style'}
          rel={'noreferrer'}
          target="_blank"
        >
          <ContentWithEmoji source="wechat-emoji.png" emojiScale={0.3} content={item?.showTitle} />
        </a>
      );
    }
    if (item?.showUrl) {
      return (
        <a
          href={item?.showUrl}
          className={'broker-title-a-style'}
          rel={'noreferrer'}
          target="_blank"
        >
          <ContentWithEmoji source="wechat-emoji.png" emojiScale={0.3} content={item?.showTitle} />
        </a>
      );
    }
    return (
      <ContentWithEmoji source="wechat-emoji.png" emojiScale={0.3} content={item?.showTitle} />
    );
  };

  return (
    <List.Item
      key={itemData.id}
      actions={bottomActions(itemData)}
      extra={
        <div className={'extra-pic-div'}>
          {imgUrl ? <Image width={147} height={92} src={imgUrl} /> : ''}
          <div className={'list-item-type-label'}>{MSG_TYPE_DIC[itemData?.showType]}</div>
        </div>
      }
    >
      <List.Item.Meta
        className={'list-title'}
        title={handleTitle(itemData)}
        description={getDescription(itemData)}
      />
      <div className={'list-item-content'} style={{ height: contentFormHeight }}>
        <div ref={contentRef}>
          <ContentWithEmoji
            source="wechat-emoji.png"
            emojiScale={0.3}
            content={removeLine(itemData?.showContent)}
          />
        </div>
      </div>
    </List.Item>
  );
};

export default memo(ConferenceItem);
