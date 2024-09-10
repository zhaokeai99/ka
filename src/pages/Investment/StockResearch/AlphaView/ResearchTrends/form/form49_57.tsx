import { Image, Popover, Space, Typography } from 'antd';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ContentWithEmoji } from '@/pages/Investment/components/WechatEmoji';
import { IrReportFacadeGetOssUrl } from '../service';
import { InfoCircleOutlined } from '@ant-design/icons';

interface ModalProps {
  itemData: any;
  abbr?: boolean;
}

const { Text } = Typography;
/**
 * 其它　－　聊天引用
 * dw_type = 49 - 57
 * @param props
 * @constructor
 */
const Form1Item = (props: ModalProps) => {
  const { itemData, abbr = false } = props;
  const [btnExpand, setBtnExpand] = useState<boolean>(true); //展开，收起
  const [contentFormHeight, setContentFormHeight] = useState<string>('24px');
  const [tmpText, setTmpText] = useState<any>('');
  const [imgUrl, setImgUrl] = useState<any>('');
  const [visible, setVisible] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  //图片
  const imgLoad = useCallback(async () => {
    const refer = itemData.refermsg ? JSON.parse(itemData.refermsg) : {};
    if (refer.picUrl === undefined) {
      return;
    }
    const params = {
      attachment: refer.picUrl,
    };
    const data = await IrReportFacadeGetOssUrl(params);
    if (data !== undefined && data !== null) {
      setImgUrl(data);
    }
  }, [itemData]);

  //展开按钮
  const onBtnExpand = useCallback(() => {
    const r = !btnExpand;
    if (!btnExpand) {
      setContentFormHeight('auto');
    } else {
      setContentFormHeight('24px');
    }
    setBtnExpand(r);
  }, [btnExpand]);

  const textHandle = () => {
    // @ts-ignore
    const wordLength =
      contentRef?.current?.parentElement.parentElement.parentElement.offsetWidth / 15 - 4;
    const text =
      itemData?.reportContent
        .replace('\n', '')
        .replace(' ', '')
        .replace('　', '')
        .substring(0, wordLength - 5) + '... ';
    setTmpText(text);
  };

  useEffect(() => {
    setContentFormHeight('24px');
    textHandle();
    setBtnExpand(false);
    imgLoad();
  }, []);

  const txtHandle = () => {
    if (!btnExpand) {
      return tmpText;
    }
    return '';
  };

  const referShow = useCallback(
    (dataItem: any) => {
      const refer = itemData.refermsg ? JSON.parse(itemData.refermsg) : {};
      if (dataItem.refermsgType === 1 || dataItem.refermsgType === 49) {
        if (!btnExpand) {
          return (
            <>
              <div>
                引用：{refer.displayname}
                <span style={{ marginLeft: 5 }}>
                  <Popover
                    content={
                      <div style={{ maxWidth: 800 }}>
                        <ContentWithEmoji
                          source="wechat-emoji.png"
                          emojiScale={0.3}
                          content={refer.content}
                        />
                      </div>
                    }
                  >
                    <InfoCircleOutlined />
                  </Popover>
                </span>
              </div>
            </>
          );
        } else {
          return (
            <>
              <div>引用：{refer.displayname}</div>
              <div>
                <Space>
                  <ContentWithEmoji
                    source="wechat-emoji.png"
                    emojiScale={0.3}
                    content={refer.content ? refer.content : ''}
                  />
                </Space>
              </div>
            </>
          );
        }
      } else if (dataItem.refermsgType === 3) {
        if (refer.picUrl === undefined || refer.picUrl === null || refer.picUrl === '') {
          return (
            <>
              <div>引用：{refer.displayname}</div>
              <div>[图片]</div>
            </>
          );
        } else {
          if (!btnExpand) {
            return (
              <>
                <div>引用：{refer.displayname}</div>
                <div>
                  <a
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    [图片]
                  </a>
                  <Image
                    style={{ display: 'none' }}
                    preview={{
                      visible,
                      src: imgUrl,
                      onVisibleChange: (value) => {
                        setVisible(value);
                      },
                    }}
                  />
                </div>
              </>
            );
          } else {
            return (
              <>
                <div>引用：{refer.displayname}</div>
                <Image src={imgUrl} className={'wx-msg-pic'} />
              </>
            );
          }
        }
      }
      return JSON.stringify(refer);
    },
    [itemData, btnExpand, imgUrl, visible],
  );

  return (
    <>
      <Text className={'irWxReferContent'}>{referShow(itemData)}</Text>

      <div style={{ height: contentFormHeight, overflowY: 'hidden', display: 'flex' }}>
        <Text
          className={'irWxContent'}
          style={btnExpand ? {} : { whiteSpace: 'inherit', wordBreak: 'inherit' }}
        >
          {abbr && itemData.logicType === 1 ? <span style={{ color: 'red' }}>[长逻辑]</span> : ''}
          {txtHandle()}
          <div style={btnExpand ? {} : { display: 'none' }}>
            <div ref={contentRef}>
              <ContentWithEmoji
                source="wechat-emoji.png"
                emojiScale={0.3}
                content={itemData?.reportContent ? itemData.reportContent : ''}
              />
            </div>
          </div>
          {<a onClick={() => onBtnExpand()}>{btnExpand ? '收起' : '展开'}</a>}
        </Text>
      </div>
    </>
  );
};

export default memo(Form1Item);
