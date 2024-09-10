import React, { useRef, useState } from 'react';
import { Carousel } from 'antd';
import Panel from './Panel';
// import Dots from './Dots';
import Footer from './Footer';

import styles from './index.less';

const Panels: React.FC<any> = (props: any) => {
  const { datas = [], finishAction } = props || {};
  const refs = useRef(null);
  const [step, setStep] = useState(0);

  const handleChange = (steps) => {
    setStep(steps); // 置状态
    refs?.current?.goTo(steps); // 翻页
  };

  return (
    <div className={styles['panels-container']}>
      <Carousel dots={false} ref={refs}>
        {datas &&
          datas.map((item) => {
            return <Panel data={item} />;
          })}
      </Carousel>
      <img
        className={styles['close']}
        src="https://cdnprod.tianhongjijin.com.cn/thfile/关闭1657620232405.png"
        onClick={() => {
          if (finishAction) {
            finishAction();
          }
        }}
      />
      <Footer datas={datas} step={step} handleChange={handleChange} finishAction={finishAction} />
    </div>
  );
};

export default Panels;
