import React, { useState } from 'react';

import styles from './index.less';

const Dots: React.FC<any> = (props: any) => {
  const { handleChange, datas = [] } = props || {};
  const [current, setCurrent] = useState(0);
  console.log('Dots', datas);
  return (
    <div className={styles['dots-container']}>
      {datas.map((item, index) => (
        <div
          onClick={() => {
            setCurrent(index);
            if (handleChange) {
              handleChange(index);
            }
          }}
          className={styles[current === index ? 'dots-select' : 'dots']}
        ></div>
      ))}
    </div>
  );
};

export default Dots;
