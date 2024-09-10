import { Typography } from 'antd';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

interface ModalProps {
  itemData: any;
  abbr?: boolean;
}

const { Text } = Typography;
/**
 * 其它　－　链接
 * dw_type = 49 - 6
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

  const getContent = () => {
    let text = itemData?.reportTitle;

    if (itemData?.reportContent) {
      text += '\n' + itemData?.reportContent;
    }
    return text;
  };

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
      getContent()
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
            <div ref={contentRef}>{getContent()}</div>
          </div>
          {btnShow ? <a onClick={() => onBtnExpand()}>{btnExpand ? '收起' : '展开'}</a> : ''}
        </Text>
      </div>
    </>
  );
};

export default memo(Form1Item);
