import { Typography } from 'antd';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ContentWithEmoji } from '@/pages/Investment/components/WechatEmoji';

interface ModalProps {
  itemData: any;
  abbr?: boolean;
}

const { Text } = Typography;
/**
 * 聊天
 * dw_type = 1
 * @param props
 * @constructor
 */
const Form1Item = (props: ModalProps) => {
  const { itemData, abbr } = props;
  const [btnShow, setBtnShow] = useState<boolean>(false);
  const [btnExpand, setBtnExpand] = useState<boolean>(true);
  const [contentFormHeight, setContentFormHeight] = useState<string>('24px');
  const [tmpText, setTmpText] = useState<any>('');

  const contentRef = useRef<HTMLDivElement>(null);

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
    const height = contentRef?.current?.offsetHeight;
    if (height && height > 48) {
      setBtnShow(true);
      setBtnExpand(false);
      setContentFormHeight('24px');
      textHandle();
    } else {
      setContentFormHeight(height + 'px');
    }
  }, []);

  const txtHandle = () => {
    if (btnShow && !btnExpand) {
      return tmpText;
    }
    return '';
  };

  return (
    <>
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
          {btnShow ? <a onClick={() => onBtnExpand()}>{btnExpand ? '收起' : '展开'}</a> : ''}
        </Text>
      </div>
    </>
  );
};

export default memo(Form1Item);
