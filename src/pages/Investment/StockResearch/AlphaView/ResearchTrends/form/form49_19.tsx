import { Image, Typography } from 'antd';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import styles from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/index.less';
import { IrReportFacadeGetOssUrl } from '../service';
import { ContentWithEmoji } from '@/pages/Investment/components/WechatEmoji';

interface ModalProps {
  itemData: any;
}

const { Text } = Typography;
/**
 * 其它　－　多条聊天记录
 * dw_type = 49 - 19
 * @param props
 * @constructor
 */
const Form1Item = (props: ModalProps) => {
  const { itemData } = props;
  const [btnExpand, setBtnExpand] = useState<boolean>(true);
  const [contentFormHeight, setContentFormHeight] = useState<string>('48px');
  const [imgUrl, setImgUrl] = useState<any>('');

  const contentRef = useRef<HTMLDivElement>(null);

  //展开按钮
  const onBtnExpand = useCallback(() => {
    const r = !btnExpand;
    if (!btnExpand) {
      setContentFormHeight('auto');
    } else {
      setContentFormHeight('48px');
    }
    setBtnExpand(r);
  }, [btnExpand]);

  const imgLoad = useCallback(async () => {
    if (itemData.attachment === undefined) {
      return;
    }
    const params = {
      attachment: itemData.attachment,
    };
    const data = await IrReportFacadeGetOssUrl(params);
    if (data !== undefined && data !== null) {
      setImgUrl(data);
    }
  }, [itemData]);

  useEffect(() => {
    const height = contentRef?.current?.offsetHeight;
    if (height && height > 48) {
      setBtnExpand(false);
      setContentFormHeight('48px');
    }

    imgLoad();
  }, []);

  const referShow = useCallback(
    (dataItem: any) => {
      const arr: any = [];
      const refer = itemData.refermsg ? JSON.parse(itemData.refermsg) : {};
      arr.push(
        <div>
          转发:{dataItem.reportTitle}
          {!btnExpand ? (
            <>
              ...<a onClick={() => onBtnExpand()}>展开</a>
            </>
          ) : (
            ''
          )}
        </div>,
      );
      if (btnExpand) {
        refer?.dataList?.map((item: any) => {
          if (item.datatype === '1') {
            //图片
            arr.push(
              <>
                <div style={{ fontWeight: 'bold' }}>
                  {item.sourcename} {item.sourcetime}
                </div>
                <div>
                  <ContentWithEmoji
                    source="wechat-emoji.png"
                    emojiScale={0.3}
                    content={item.datadesc}
                  />
                </div>
              </>,
            );
          } else if (item.datatype === '2') {
            //文本
            if (
              item.attachment !== undefined &&
              item.attachment !== null &&
              item.attachment !== ''
            ) {
              arr.push(
                <>
                  <div style={{ fontWeight: 'bold' }}>
                    {item.sourcename} {item.sourcetime}
                  </div>
                  <Image src={imgUrl}></Image>
                </>,
              );
            } else {
              arr.push(
                <>
                  <div style={{ fontWeight: 'bold' }}>
                    {item.sourcename} {item.sourcetime}
                  </div>
                  <div>[图片]</div>
                </>,
              );
            }
          }
        });
        arr.push(<a onClick={() => onBtnExpand()}>收起</a>);
      }
      return arr;
    },
    [itemData, btnExpand],
  );

  return (
    <>
      <div style={{ height: contentFormHeight, overflowY: 'hidden' }}>
        <Text className={['irWxReferContent', styles['referContent']].join(' ')}>
          <div ref={contentRef}>{referShow(itemData)}</div>
        </Text>
      </div>
    </>
  );
};

export default memo(Form1Item);
