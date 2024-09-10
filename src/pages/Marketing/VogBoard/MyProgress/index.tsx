import { Progress } from 'antd';
import React from 'react';
import { progressIconUrl } from '../service';
import styles from './index.less';

type PropsType = {
  percent: number;
  showIcon?: boolean;
  showLabel?: boolean;
  width?: string | number;
  hidden?: boolean;
};

const redColor = '#E64552';
const greenColor = '#40B333';
const lightRed = '#FFEBEB';
const lightGreen = '#E6FAE6';

const MyProgress = (props: PropsType) => {
  const { showIcon = true, showLabel = true, percent, width, hidden = false } = props;
  return (
    <div className={styles['progress']} style={{ visibility: hidden ? 'hidden' : 'visible' }}>
      {showIcon && <img alt="" src={progressIconUrl} />}
      {showLabel && <span>年完成率</span>}
      <Progress
        showInfo={false}
        strokeColor={percent > 0 ? redColor : greenColor}
        trailColor={percent > 0 ? lightRed : lightGreen}
        className={styles['component']}
        style={{ width: width || '48%' }}
        percent={percent}
        size="small"
      />
      <span style={{ color: percent > 0 ? redColor : greenColor }} className={styles['percent']}>
        {percent}%
      </span>
    </div>
  );
};

export default MyProgress;
