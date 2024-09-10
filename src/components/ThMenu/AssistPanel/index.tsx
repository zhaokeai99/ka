import React, { useState, useCallback } from 'react';
import { message } from 'antd';
import { history } from 'umi';
import styles from './index.less';

export type AssistPanelProps = {
  data: [];
};

const AssistPanel: React.FC<AssistPanelProps> = (props) => {
  const {
    data, // 推荐菜单数据
  } = props;
  // 幌到了哪个左边栏菜单
  // const [positionTop, setNewTop] = useState(100);
  // const [positionRight, setNewRight] = useState(50);
  // const [startX, setStartX] = useState(0);
  // const [startY, setStartY] = useState(0);
  // const [moving, setMoving] = useState(false);
  const [displayAssist, setDisplayAssist] = useState(false);
  const clickMenu = useCallback((subItem) => {
    if (subItem) {
      // 检查权限控制跳不跳
      if (subItem.hasPriv) {
        if (subItem.isUrl) {
          // 外跳地址
          window.open(subItem.path); // 全地址 http://
        } else {
          history.push(subItem.path);
        }
      } else {
        message.warn('您暂时没有权限访问这个页面，请联系管理员！');
      }
    }
  }, []);

  // const mouseUp = useCallback((e) => {
  //   console.log('mouseUp', e);
  //   if (moving) {
  //     const newTop = positionTop + e.pageY - startY;
  //     const newRight = positionRight - e.pageX + startX;
  //     if (newTop < 0) {
  //       setNewTop(0);
  //     } else if (newTop < 700) {
  //       setNewTop(newTop);
  //     } else {
  //       setNewTop(700);
  //     }

  //     if (newRight < 0) {
  //       setNewRight(0);
  //     } else if (newRight < 1200) {
  //       setNewRight(newRight);
  //     } else {
  //       setNewRight(1200);
  //     }
  //   }
  //   setMoving(false);
  // }, [moving, positionTop, positionRight]);

  // const mouseDown = useCallback((e) => {
  //   console.log('mouseDown', e);
  //   setStartX(e.pageX);
  //   setStartY(e.pageY);
  //   setMoving(true);
  // }, []);

  // const mouseMove = useCallback((e) => {
  //   console.log('mouseMove', e);
  //   if (moving) {
  //     const newTop = positionTop + e.pageY - startY;
  //     const newRight = positionRight - e.pageX + startX;
  //     if (newTop < 0) {
  //       setNewTop(0);
  //     } else if (newTop < 700) {
  //       setNewTop(newTop);
  //     } else {
  //       setNewTop(700);
  //     }

  //     if (newRight < 0) {
  //       setNewRight(0);
  //     } else if (newRight < 1200) {
  //       setNewRight(newRight);
  //     } else {
  //       setNewRight(1200);
  //     }
  //   }
  // }, [moving, positionTop, positionRight]);
  // const mouseLeave = useCallback((e) => {
  //   console.log('mouseLeave', e);
  //   if (moving) {
  //     const newTop = positionTop + e.pageY - startY;
  //     const newRight = positionRight - e.pageX + startX;
  //     if (newTop < 0) {
  //       setNewTop(0);
  //     } else if (newTop < 700) {
  //       setNewTop(newTop);
  //     } else {
  //       setNewTop(700);
  //     }

  //     if (newRight < 0) {
  //       setNewRight(0);
  //     } else if (newRight < 1200) {
  //       setNewRight(newRight);
  //     } else {
  //       setNewRight(1200);
  //     }
  //   }
  //   setMoving(false);
  // }, [moving, positionTop, positionRight]);
  return (
    <div
      className={styles['container']}
      // style={{ top: `${positionTop}px`, right: `${positionRight}px` }}
      // onMouseUp={(e) => {mouseUp(e)}}
      // onMouseDown={(e) => {mouseDown(e)}}
      // onMouseMove={(e) => {mouseMove(e)}}
      // // onMouseEnter={() => {console.log('onMouseDown')}}
      // onMouseLeave={(e) => {mouseLeave(e)}}

      onMouseEnter={() => {
        setDisplayAssist(true);
      }}
      onMouseLeave={() => {
        setDisplayAssist(false);
      }}
    >
      <div className={styles['bar']}>
        <div className={styles['text-top']}>猜你</div>
        <div className={styles['text-down']}>想去</div>
      </div>
      {displayAssist && (
        <div className={styles['assist-panel']}>
          <div className={styles['item-out']}>
            {/* <div className={styles['item-null']}></div> */}
            <div
              className={styles['item']}
              onClick={() => clickMenu(data && data[0])}
              title={(data && data[0] && data[0].name) || '资讯'}
            >
              {(data && data[0] && data[0].name) || '资讯'}
            </div>
            {/* <div className={styles['item-null']}></div> */}
          </div>
          <div className={styles['item-out']}>
            <div
              className={styles['item']}
              onClick={() => clickMenu(data && data[1])}
              title={(data && data[1] && data[1].name) || '产品'}
            >
              {(data && data[1] && data[1].name) || '产品'}
            </div>
            <div className={styles['item-null']}></div>
            <div
              className={styles['item']}
              onClick={() => clickMenu(data && data[2])}
              title={(data && data[2] && data[2].name) || '销售'}
            >
              {(data && data[2] && data[2].name) || '销售'}
            </div>
          </div>
          <div className={styles['item-out']}>
            {/* <div className={styles['item-null']}></div> */}
            <div
              className={styles['item']}
              onClick={() => clickMenu(data && data[3])}
              title={(data && data[3] && data[3].name) || '交易'}
            >
              {(data && data[3] && data[3].name) || '交易'}
            </div>
            {/* <div className={styles['item-null']}></div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistPanel;
