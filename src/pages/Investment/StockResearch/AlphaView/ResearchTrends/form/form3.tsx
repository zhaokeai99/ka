import { Image } from 'antd';
import React, { memo } from 'react';
import styles from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/index.less';

interface ModalProps {
  itemData: any;
}

/**
 * 图片
 * dw_type = 3
 * @param props
 * @constructor
 */
const Form3Item = (props: ModalProps) => {
  const { itemData } = props;

  return (
    <>
      <Image src={itemData.attachment} className={['wx-msg-pic', styles['wx-msg-pic']].join(' ')} />
    </>
  );
};

export default memo(Form3Item);
