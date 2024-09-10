import { Avatar } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import MyProgress from '../MyProgress';
import './index.less';

type PropsType = {
  data: any[];
  wrapEachWidth?: string | number;
  selectable?: boolean;
  cardType?: string;
  progressWidth?: string;
  onCardChange?: (val?: any) => void;
  wrap?: boolean;
};

const wholeIcon = {
  '1': 'https://cdnprod.tianhongjijin.com.cn/thfile/non_public_offering1652763542195.png', // 非货公募
  '2': 'https://cdnprod.tianhongjijin.com.cn/thfile/security_products1652763542171.png', // 养老保障产品
  '3': 'https://cdnprod.tianhongjijin.com.cn/thfile/special_account1652763542437.png', // 专户产品
  '4': 'https://cdnprod.tianhongjijin.com.cn/thfile/columbus_project1652763538184.png', // 哥伦布项目
};

const rankIcon = {
  '0': 'https://cdnprod.tianhongjijin.com.cn/thfile/fixed_income_plus1652763542195.png', // 固收+
  '2': 'https://cdnprod.tianhongjijin.com.cn/thfile/fixed_debt1652763538184.png', // FOF
  '3': 'https://cdnprod.tianhongjijin.com.cn/thfile/non_public_offering1652763542195.png', // 主动权益
  '4': 'https://cdnprod.tianhongjijin.com.cn/thfile/fixed_income_plus1652763542195.png', // 固收
  '6': 'https://cdnprod.tianhongjijin.com.cn/thfile/equity1652763542171.png', // 指数基金
};

const defaultIcon = 'https://cdnprod.tianhongjijin.com.cn/thfile/default-icon1660818089258.png'; // 默认图标

const VogCard = (props: PropsType, ref: any) => {
  const {
    data,
    wrapEachWidth,
    selectable = true,
    cardType = 'WHOLE',
    progressWidth,
    onCardChange = () => {},
    wrap = true,
  } = props;
  const [curType, setCurType] = useState('');

  const reload = () => {
    setCurType('');
  };

  useImperativeHandle(ref, () => ({ reload }));

  const cardClick = (type: any) => {
    setCurType(selectable && curType !== type ? type : '');
    onCardChange(selectable && curType !== type ? type : '');
  };

  // 卡片标题
  const title = (item: any) => {
    const { type, name, fundCount } = item || {};

    return (
      <div className="vog-card-title">
        <Avatar
          src={cardType === 'WHOLE' ? wholeIcon[type] : rankIcon[type]}
          size={40}
          icon={<img src={defaultIcon} style={{ width: '100%', height: '100%' }} />}
        />
        <div>
          <div className="name">{name || '--'}</div>
          <div className="num">产品数量：{fundCount || '--'}支</div>
        </div>
      </div>
    );
  };

  // 卡片条目
  const description = (item: any) => {
    const { vogRatio, vogTarget, buyAmt, sellAmt, netBuyAmt, assetAmt, assetAdd } = item || {};

    return (
      <div className="vog-card-description">
        {cardType !== 'Second' && (
          <MyProgress width={progressWidth} percent={Number(vogRatio)} hidden={!vogTarget} />
        )}
        {vogTarget && (
          <div className="des-item">
            <label>年目标</label>
            <span>{vogTarget || '--'} 亿</span>
          </div>
        )}
        <div className="des-item">
          <label>流入</label>
          <span>{buyAmt || '--'} 万</span>
        </div>
        <div className="des-item">
          <label>流出</label>
          <span>{sellAmt || '--'} 万</span>
        </div>
        <div className="des-item">
          <label>净流入</label>
          <span>{netBuyAmt || '--'} 万</span>
        </div>
        <div className="des-item">
          <label>存量规模</label>
          <span>{assetAmt || '--'} 亿</span>
        </div>
        <div className="des-item">
          <label>区间保有净增</label>
          <span>{assetAdd || '--'} 亿</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${wrap ? 'vog-card-container-wrap' : 'vog-card-container'}`}
      style={{
        ...(wrap ? { gridTemplateColumns: `repeat(auto-fill, ${wrapEachWidth || '24%'})` } : {}),
      }}
    >
      {data?.map((item: any) => {
        const { type } = item || {};
        return (
          <div
            key={type}
            className="vog-card-item-container"
            style={{ transform: cardType === 'Second' ? 'scale(0.9)' : 'scale(1)' }}
          >
            <div
              className={`${selectable ? 'vog-card-item-selectable' : 'vog-card-item'} ${
                type === curType ? 'vog-card-item-checked' : ''
              }`}
              onClick={() => cardClick(type)}
            >
              {title(item)}
              {description(item)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default forwardRef(VogCard);
