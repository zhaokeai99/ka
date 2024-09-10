import React from 'react';
import debounce from 'lodash/debounce';
import { CloseOutlined } from '@ant-design/icons';
import { useEffect, useState, useCallback } from 'react';

import styles from './index.less';

const PageGuide: React.FC = (props: any) => {
  const [current, setCurrent] = useState(0);
  const [rect, setRect] = useState({});
  const [leftMode, setLeftMode] = useState(true);
  const { datas = [], menuCollapsed, visible, setVisible } = props || {};

  const findToFirstDisplay = useCallback(
    (interval) => {
      const id = datas[current] && datas[current].id;
      if (id) {
        const item = document.getElementById(id);
        if (item) {
          const rectIn = item.getBoundingClientRect();
          if (rectIn) {
            if (rectIn.right + 230 > document.body.clientWidth) {
              setLeftMode(false);
            } else {
              setLeftMode(true);
            }
            setRect(rectIn);
            setVisible(true);
            if (interval) {
              clearInterval(interval);
            }
          }
        }
      }
    },
    [datas, current],
  );

  // 滚动时直接隐藏，问题太多
  const scrollCallBack = debounce(
    useCallback(() => {
      if (visible) {
        setVisible(false); // 滚动 就收起
        setCurrent(0);
      }
    }, [visible]),
    100,
  );

  // 初始化展示，页面渲染完毕，试了几个监听都不好使，只能循环检查了
  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => findToFirstDisplay(interval), 1000);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      const id = datas[current] && datas[current].id;
      if (id) {
        const item = document.getElementById(id);
        if (item) {
          const rectIn = item.getBoundingClientRect();
          if (rectIn) {
            if (rectIn.right + 230 > document.body.clientWidth) {
              setLeftMode(false);
            } else {
              setLeftMode(true);
            }
            setRect(rectIn);
            setVisible(true);
          }
        }
      }
      window.addEventListener('scroll', scrollCallBack, true);
    } else {
      window.removeEventListener('scroll', scrollCallBack, true);
    }
  }, [visible]);

  // 菜单收起 联动一下
  useEffect(() => {
    setTimeout(() => {
      const id = datas[current] && datas[current].id;

      if (id && visible) {
        const item = document.getElementById(id);

        if (item) {
          const rectIn = item.getBoundingClientRect();
          if (rectIn) {
            if (rectIn.right + 230 > document.body.clientWidth) {
              setLeftMode(false);
            } else {
              setLeftMode(true);
            }
            setRect(rectIn);
            setVisible(true);
          }
        }
      }
    }, 200);
  }, [menuCollapsed, visible]);

  // 下一步，数据变化刷新位置
  useEffect(() => {
    const id = datas[current] && datas[current].id;

    if (id) {
      const item = document.getElementById(id);

      if (item) {
        const rectIn = item.getBoundingClientRect();

        if (rectIn) {
          if (rectIn.right + 230 > document.body.clientWidth) {
            setLeftMode(false);
          } else {
            setLeftMode(true);
          }
          setRect(rectIn);
        }
      }
    }
  }, [current, datas]);

  const posStyle = !leftMode
    ? { left: rect.left - 230, top: rect.top }
    : { left: rect.right + 10, top: rect.top };

  return (
    <>
      {visible && (
        <div
          className={styles[leftMode ? 'page-guide-container' : 'page-guide-container-right']}
          style={posStyle}
        >
          <CloseOutlined
            className={styles['close']}
            onClick={() => {
              if (setVisible) {
                setVisible(false);
                setCurrent(0);
              }
            }}
          />
          <div className={styles['text']}>{(datas[current] && datas[current].content) || '--'}</div>
          <div className={styles['btn-container']}>
            <span className={styles['step']}>{current + 1 + '/' + datas.length}</span>
            <span
              className={styles['btn']}
              onClick={() => {
                if (current === datas.length - 1) {
                  setVisible(false);
                  setCurrent(0);
                } else {
                  setCurrent(current + 1);
                }
              }}
            >
              {current === datas.length - 1 ? '学会了' : '下一步'}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default PageGuide;
