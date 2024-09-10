import React from 'react';
import { Button } from 'antd';
import styles from './index.less';

const Footer: React.FC<any> = (props: any) => {
  const { step, datas = [], handleChange, finishAction } = props || {};

  return (
    <div className={styles['footer-container']}>
      {step === 0 && (
        <Button
          className={styles['btn']}
          type="primary"
          onClick={() => {
            if (handleChange) {
              handleChange(1);
            }
          }}
        >
          开始探索
        </Button>
      )}
      {step > 0 && (
        <a
          className={styles['pre']}
          onClick={() => {
            if (handleChange) {
              handleChange(step - 1);
            }
          }}
        >
          上一步
        </a>
      )}
      {step > 0 && step < datas.length - 1 && (
        <Button
          className={styles['btn']}
          type="primary"
          onClick={() => {
            if (handleChange) {
              handleChange(step + 1);
            }
          }}
        >
          下一步
        </Button>
      )}
      {step === datas.length - 1 && (
        <Button
          className={styles['btn']}
          type="primary"
          onClick={() => {
            if (finishAction) {
              finishAction();
            }
            if (handleChange) {
              handleChange(0);
            }
          }}
        >
          我知道了
        </Button>
      )}
    </div>
  );
};

export default Footer;
