import { TabLayoutContext } from '@/components/thfund-front-component/src';
import rafSchd from 'raf-schd';
import React, { useContext, useEffect, useState } from 'react';
import styles from './index.less';

type AnchorPropItem = {
  title: string;
  id: string;
};

let flag = true;
let timer: any = null;

const Anchor: React.FC<any> = ({ data }: { data: AnchorPropItem[] }) => {
  const { currentRef } = useContext(TabLayoutContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);

  const onAnchor = (itemId: string, index: number) => {
    document?.getElementById(itemId)?.scrollIntoView();
    setCurrentIndex(index);
    flag = false;
  };
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 2000);

    const schedule = rafSchd(() => {
      if (!flag) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          flag = true;
        }, 500);
        return;
      }

      for (let i = 0; i < data.length; i++) {
        const { id } = data[i] || {};
        const { top }: any = document.getElementById(id)?.getBoundingClientRect();

        if (top <= 85) {
          setCurrentIndex(i);
        }
      }
    });

    const onScroll = () => {
      schedule();
    };

    currentRef?.current?.addEventListener('scroll', onScroll, true);

    return () => {
      currentRef?.current?.removeEventListener('scroll', onScroll);
      schedule.cancel();
    };
  }, []);

  return (
    <div className={show ? styles['show-container'] : styles['container']}>
      <div className={styles['area']}>
        <div className={styles['icon']} />
        <div className={styles['item']}>
          {(data || []).map(({ title, id }: AnchorPropItem, index: number) => {
            if (!id) {
              return null;
            }

            return (
              <div
                key={id}
                title={title || ''}
                className={index === currentIndex ? styles['label-active'] : styles['label']}
                onClick={() => onAnchor(id, index)}
              >
                {title || ''}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Anchor;
