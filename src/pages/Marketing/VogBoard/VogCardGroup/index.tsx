import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { CheckCard } from '@ant-design/pro-card';
import styles from './index.less';
import { Avatar } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import MyProgress from '../MyProgress';

type PropsType = {
  data: any[];
  width?: string | number;
  selectable?: boolean;
  cardType?: string;
  progressWidth?: string;
  onCardChange?: (val?: any) => void;
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

// 卡片组件
const VogCardGroup = (props: PropsType, ref: any) => {
  const {
    width,
    data,
    selectable = true,
    cardType = 'WHOLE',
    onCardChange = () => {},
    progressWidth,
  } = props;
  const [curType, setCurType] = useState('');

  const reload = () => {
    setCurType('');
  };

  useImperativeHandle(ref, () => ({ reload }));

  // 标题布局
  const title = (item: any) => {
    const { type, name, fundCount } = item || {};
    return (
      <div className={styles['title']}>
        <Avatar
          src={cardType === 'WHOLE' ? wholeIcon[type] : rankIcon[type]}
          size={40}
          icon={<TeamOutlined />}
        />
        <div>
          <div className={styles['name']}>{name || '--'}</div>
          <div className={styles['num']}>产品数量：{fundCount || '--'}支</div>
        </div>
      </div>
    );
  };

  // 内容布局
  const description = (item: any) => {
    const { assetAmt, assetAdd, buyAmt, sellAmt, netBuyAmt, vogRatio, vogTarget } = item || {};
    return (
      <div className={styles['description']}>
        <MyProgress width={progressWidth} percent={Number(vogRatio)} hidden={!vogTarget} />
        {vogTarget && (
          <div className={styles['des-item']}>
            <label>年目标</label>
            <span>{vogTarget || '--'} 亿</span>
          </div>
        )}
        <div className={styles['des-item']}>
          <label>流入</label>
          <span>{buyAmt || '--'} 万</span>
        </div>
        <div className={styles['des-item']}>
          <label>流出</label>
          <span>{sellAmt || '--'} 万</span>
        </div>
        <div className={styles['des-item']}>
          <label>净流入</label>
          <span>{netBuyAmt || '--'} 万</span>
        </div>
        <div className={styles['des-item']}>
          <label>存量规模</label>
          <span>{assetAmt || '--'} 亿</span>
        </div>
        <div className={styles['des-item']}>
          <label>区间保有净增</label>
          <span>{assetAdd || '--'} 亿</span>
        </div>
      </div>
    );
  };

  // 可点击卡片
  const renderCheckedCard = () => {
    return data?.map((i: any) => (
      <div key={i.type} className={styles['card-item']}>
        <CheckCard
          value={i.type}
          style={{ width: '100%' }}
          className={styles['card-item-content']}
          title={title(i)}
          description={description(i)}
        />
      </div>
    ));
  };

  // 不可点击
  const renderUnCheckedCard = () => {
    return data?.map((i: any, k: number) => (
      <div key={k} className={styles['card-item']}>
        <div className={styles['card-item-content']}>
          {title(i)}
          {description(i)}
        </div>
      </div>
    ));
  };

  return (
    <CheckCard.Group
      value={curType}
      className={styles['card-container']}
      style={{ gridTemplateColumns: `repeat(auto-fill, ${width})` }}
      onChange={(val: any) => {
        setCurType(val);
        onCardChange(val);
      }}
    >
      {selectable ? renderCheckedCard() : renderUnCheckedCard()}
    </CheckCard.Group>
  );
};

export default forwardRef(VogCardGroup);
